import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, hospitalBeds } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";

async function getAdminHospitalId() {
  try {
    const session = await getSession();
    if (!session || session.role !== "HOSPITAL_ADMIN") return null;

    const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
    return user?.hospitalId || null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const hospitalId = await getAdminHospitalId();
    if (!hospitalId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const beds = await db.select().from(hospitalBeds).where(eq(hospitalBeds.hospitalId, hospitalId));
    
    return NextResponse.json(beds);
  } catch (error) {
    console.error("Error fetching hospital beds:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const hospitalId = await getAdminHospitalId();
    if (!hospitalId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { bedType, availableBeds } = body;

    if (!bedType || availableBeds === undefined || typeof availableBeds !== "number" || availableBeds < 0) {
      return NextResponse.json({ error: "Valid bedType and non-negative availableBeds required" }, { status: 400 });
    }

    // Update the beds
    await db
      .update(hospitalBeds)
      .set({ 
        availableBeds,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(hospitalBeds.hospitalId, hospitalId),
          eq(hospitalBeds.bedType, bedType)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating hospital beds:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
