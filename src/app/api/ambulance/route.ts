import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { ambulances, ambulanceRequests, hospitals } from "@/db/schema";
import { eq, sql, and, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius") || "50"; // default 50km
    
    let distanceSql = sql`NULL`;
    let distanceSelect = sql`NULL AS distance`;
    const conditions = [
      eq(ambulances.status, "available") // only get available ambulances
    ];

    if (lat && lng && radius) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      const radiusNum = parseFloat(radius);
      
      distanceSql = sql`(6371 * acos(GREATEST(-1.0, LEAST(1.0, cos(radians(${latNum})) * cos(radians(${ambulances.latitude})) * cos(radians(${ambulances.longitude}) - radians(${lngNum})) + sin(radians(${latNum})) * sin(radians(${ambulances.latitude}))))))`;
      distanceSelect = sql`${distanceSql} AS distance`;
      conditions.push(sql`${distanceSql} <= ${radiusNum}`);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Get ambulances and their hospital names
    const result = await db
      .select({
        id: ambulances.id,
        providerName: ambulances.providerName,
        ambulanceType: ambulances.ambulanceType,
        baseFare: ambulances.baseFare,
        rating: ambulances.rating,
        vehicleNumber: ambulances.vehicleNumber,
        driverName: ambulances.driverName,
        driverPhone: ambulances.driverPhone,
        status: ambulances.status,
        latitude: ambulances.latitude,
        longitude: ambulances.longitude,
        hospitalId: ambulances.hospitalId,
        hospitalName: hospitals.name,
        distance: distanceSelect,
      })
      .from(ambulances)
      .leftJoin(hospitals, eq(ambulances.hospitalId, hospitals.id))
      .where(whereClause)
      .orderBy(asc(distanceSql)); // always sort by distance

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching ambulances:", error);
    return NextResponse.json({ error: "Failed to fetch ambulances" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { ambulanceId, pickupLatitude, pickupLongitude, pickupAddress, destinationHospitalId } = body;

    if (!ambulanceId || !pickupLatitude || !pickupLongitude || !pickupAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [result] = await db.insert(ambulanceRequests).values({
      ambulanceId: Number(ambulanceId),
      pickupLatitude: String(pickupLatitude),
      pickupLongitude: String(pickupLongitude),
      pickupAddress,
      destinationHospitalId: destinationHospitalId ? Number(destinationHospitalId) : null,
      patientId: session.userId,
      status: "Accepted",
      acceptedTime: new Date(),
    });

    // Mark ambulance as dispatched
    await db
      .update(ambulances)
      .set({ status: "dispatched" })
      .where(eq(ambulances.id, Number(ambulanceId)));

    return NextResponse.json({ success: true, requestId: (result as any).insertId });
  } catch (error) {
    console.error("Error creating ambulance request:", error);
    return NextResponse.json({ error: "Failed to create ambulance request" }, { status: 500 });
  }
}
