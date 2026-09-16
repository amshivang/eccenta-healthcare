import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { appointments, doctors, users } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db
      .select({
        id: appointments.id,
        patientId: appointments.patientId,
        doctorId: appointments.doctorId,
        doctorName: users.name,
        specialization: doctors.specialization,
        appointmentDate: appointments.appointmentDate,
        appointmentTime: appointments.appointmentTime,
        tokenNumber: appointments.tokenNumber,
        status: appointments.status,
        queuePosition: appointments.queuePosition,
        estimatedWaitMinutes: appointments.estimatedWaitMinutes,
        notes: appointments.notes,
        createdAt: appointments.createdAt,
      })
      .from(appointments)
      .innerJoin(doctors, eq(appointments.doctorId, doctors.id))
      .innerJoin(users, eq(doctors.userId, users.id))
      .where(eq(appointments.patientId, session.userId))
      .orderBy(desc(appointments.createdAt));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { doctorId, appointmentDate, appointmentTime, notes } = body;

    const [maxTokenRow] = await db
      .select({ maxToken: sql<number>`COALESCE(MAX(${appointments.tokenNumber}), 0)` })
      .from(appointments)
      .where(
        and(
          eq(appointments.doctorId, Number(doctorId)),
          eq(appointments.appointmentDate, appointmentDate)
        )
      );

    const tokenNumber = Number(maxTokenRow?.maxToken || 0) + 1;

    await db.insert(appointments).values({
      patientId: session.userId,
      doctorId,
      appointmentDate,
      appointmentTime,
      tokenNumber,
      status: "scheduled",
      queuePosition: tokenNumber,
      estimatedWaitMinutes: tokenNumber * 15,
      notes: notes || null,
    });

    return NextResponse.json({ success: true, tokenNumber }, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
