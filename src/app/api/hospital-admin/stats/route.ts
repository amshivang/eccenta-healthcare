import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, hospitalBeds, doctors, ambulances } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (session.role !== "HOSPITAL_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
    if (!user || !user.hospitalId) {
      return NextResponse.json({ error: "No hospital assigned to this admin" }, { status: 400 });
    }

    const hospitalId = user.hospitalId;

    // Fetch beds
    const beds = await db.select().from(hospitalBeds).where(eq(hospitalBeds.hospitalId, hospitalId));
    
    // Fetch doctors count
    const [doctorsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(doctors)
      .where(eq(doctors.hospitalId, hospitalId));
      
    // Fetch active ambulances (dispatched or en_route)
    const [ambulancesResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(ambulances)
      .where(
        sql`${ambulances.hospitalId} = ${hospitalId} AND (${ambulances.status} = 'dispatched' OR ${ambulances.status} = 'en_route')`
      );

    const totalBeds = beds.reduce((acc, bed) => acc + bed.totalBeds, 0);
    const availableBeds = beds.reduce((acc, bed) => acc + bed.availableBeds, 0);

    return NextResponse.json({
      totalBeds,
      availableBeds,
      doctorsCount: doctorsResult.count,
      activeAmbulances: ambulancesResult.count,
      hospitalId,
    });
  } catch (error) {
    console.error("Error fetching hospital admin stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
