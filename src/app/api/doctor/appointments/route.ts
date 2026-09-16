import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { doctors, appointments, users } from "@/db/schema";
import { eq, sql, and, desc, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (session.role !== "DOCTOR" && session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [doctor] = await db
      .select()
      .from(doctors)
      .where(eq(doctors.userId, session.userId))
      .limit(1);

    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "all"; // all, today, upcoming, past
    const todayStr = new Date().toISOString().split("T")[0];

    const conditions = [eq(appointments.doctorId, doctor.id)];

    if (filter === "today") {
      conditions.push(sql`${appointments.appointmentDate} = ${todayStr}`);
    } else if (filter === "upcoming") {
      conditions.push(sql`${appointments.appointmentDate} > ${todayStr}`);
    } else if (filter === "past") {
      conditions.push(sql`${appointments.appointmentDate} < ${todayStr}`);
    }

    const results = await db
      .select({
        id: appointments.id,
        patientId: appointments.patientId,
        patientName: users.name,
        patientPhone: users.phone,
        patientBloodGroup: users.bloodGroup,
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
      .innerJoin(users, eq(appointments.patientId, users.id))
      .where(and(...conditions))
      .orderBy(asc(appointments.appointmentDate), asc(appointments.tokenNumber));

    return NextResponse.json(results);
  } catch (error) {
    console.error("Doctor appointments error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
