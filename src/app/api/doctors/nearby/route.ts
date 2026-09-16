import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { doctors, users, hospitals } from "@/db/schema";
import { eq, sql, and, asc } from "drizzle-orm";
import { searchNearbyDoctors } from "@/lib/google-maps";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const latStr = searchParams.get("lat");
    const lngStr = searchParams.get("lng");
    const radiusStr = searchParams.get("radius") || "10";
    const specialization = searchParams.get("specialization");
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    if (!latStr || !lngStr) {
      return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
    }

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    const radius = parseFloat(radiusStr);

    // 1. Query database using Haversine formula
    const distanceSql = sql`(6371 * acos(GREATEST(-1.0, LEAST(1.0, cos(radians(${lat})) * cos(radians(${doctors.latitude})) * cos(radians(${doctors.longitude}) - radians(${lng})) + sin(radians(${lat})) * sin(radians(${doctors.latitude}))))))`;
    
    const conditions = [sql`${distanceSql} <= ${radius}`];
    if (specialization) {
      conditions.push(eq(doctors.specialization, specialization));
    }

    const dbResults = await db
      .select({
        id: doctors.id,
        name: users.name,
        specialization: doctors.specialization,
        rating: doctors.rating,
        latitude: doctors.latitude,
        longitude: doctors.longitude,
        clinicAddress: doctors.clinicAddress,
        hospitalName: hospitals.name,
        distance: sql`${distanceSql} AS distance`,
      })
      .from(doctors)
      .innerJoin(users, eq(doctors.userId, users.id))
      .leftJoin(hospitals, eq(doctors.hospitalId, hospitals.id))
      .where(and(...conditions))
      .orderBy(asc(distanceSql))
      .limit(limit);

    const formattedDbResults = dbResults.map(doc => ({
      ...doc,
      source: 'database'
    }));

    // 2. Query Google Places API (wrap in try-catch)
    let googlePlacesResults: any[] = [];
    try {
      const keyword = specialization ? `${specialization} doctor` : 'doctor';
      const radiusMeters = radius * 1000;
      googlePlacesResults = await searchNearbyDoctors(lat, lng, radiusMeters, keyword);
      
      googlePlacesResults = googlePlacesResults.map(place => ({
        ...place,
        source: 'google_places'
      }));
    } catch (error) {
      console.warn("Google Places API call failed or missing key:", error);
    }

    // 3. Merge and sort
    const combined = [...formattedDbResults, ...googlePlacesResults];
    
    // Sort by distance ascending
    combined.sort((a, b) => {
      const distA = a.distance || 9999;
      const distB = b.distance || 9999;
      return distA - distB;
    });

    return NextResponse.json(combined.slice(0, limit));
  } catch (error) {
    console.error("Error fetching nearby doctors:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
