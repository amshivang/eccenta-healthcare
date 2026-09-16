import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { hospitals, hospitalBeds } from "@/db/schema";
import { sql, asc, desc, inArray } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");
    
    const userLat = latParam ? parseFloat(latParam) : null;
    const userLng = lngParam ? parseFloat(lngParam) : null;

    let distanceField = sql<number | null>`NULL`;
    if (userLat !== null && userLng !== null && !isNaN(userLat) && !isNaN(userLng)) {
      distanceField = sql<number>`(6371 * acos(GREATEST(-1.0, LEAST(1.0, cos(radians(${userLat})) * cos(radians(${hospitals.latitude})) * cos(radians(${hospitals.longitude}) - radians(${userLng})) + sin(radians(${userLat})) * sin(radians(${hospitals.latitude}))))))`;
    }

    const allHospitals = await db
      .select({
        id: hospitals.id,
        name: hospitals.name,
        address: hospitals.address,
        phone: hospitals.phone,
        email: hospitals.email,
        latitude: hospitals.latitude,
        longitude: hospitals.longitude,
        rating: hospitals.rating,
        emergencyAvailable: hospitals.emergencyAvailable,
        imageUrl: hospitals.imageUrl,
        createdAt: hospitals.createdAt,
        distance: distanceField,
      })
      .from(hospitals)
      .orderBy(userLat !== null ? asc(distanceField) : desc(hospitals.rating))
      .limit(50);
      
    const hospitalIds = allHospitals.map((h) => h.id);
    const allBeds = hospitalIds.length > 0
      ? await db.select().from(hospitalBeds).where(inArray(hospitalBeds.hospitalId, hospitalIds))
      : [];
    const bedsByHospital = new Map<number, (typeof allBeds)[number][]>();
    for (const bed of allBeds) {
      const list = bedsByHospital.get(bed.hospitalId) || [];
      list.push(bed);
      bedsByHospital.set(bed.hospitalId, list);
    }

    const result = allHospitals.map((h) => ({
      ...h,
      beds: bedsByHospital.get(h.id) || [],
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    return NextResponse.json([], { status: 500 });
  }
}
