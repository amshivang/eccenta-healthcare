import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { hospitals } from "@/db/schema";
import { eq, sql, and, asc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius") || "50"; // default 50km
    
    let distanceSql = sql`NULL`;
    let distanceSelect = sql`NULL AS distance`;
    const conditions = [
      eq(hospitals.emergencyAvailable, true)
    ];

    if (lat && lng && radius) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      const radiusNum = parseFloat(radius);
      
      distanceSql = sql`(6371 * acos(GREATEST(-1.0, LEAST(1.0, cos(radians(${latNum})) * cos(radians(${hospitals.latitude})) * cos(radians(${hospitals.longitude}) - radians(${lngNum})) + sin(radians(${latNum})) * sin(radians(${hospitals.latitude}))))))`;
      distanceSelect = sql`${distanceSql} AS distance`;
      conditions.push(sql`${distanceSql} <= ${radiusNum}`);
    }

    const whereClause = and(...conditions);
    
    const result = await db
      .select({
        id: hospitals.id,
        name: hospitals.name,
        address: hospitals.address,
        phone: hospitals.phone,
        latitude: hospitals.latitude,
        longitude: hospitals.longitude,
        rating: hospitals.rating,
        distance: distanceSelect,
      })
      .from(hospitals)
      .where(whereClause)
      .orderBy(asc(distanceSql))
      .limit(10); // Return top 10 emergency hospitals

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching emergency hospitals:", error);
    return NextResponse.json({ error: "Failed to fetch emergency hospitals" }, { status: 500 });
  }
}
