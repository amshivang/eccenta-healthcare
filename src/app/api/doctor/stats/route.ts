import { NextResponse } from "next/server";
import { db } from "@/db";
import { doctors, appointments, users } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
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

    const todayStr = new Date().toISOString().split("T")[0];

    const [todayCountRes] = await db
      .select({ count: sql<number>`CAST(count(*) AS UNSIGNED)` })
      .from(appointments)
      .where(
        and(
          eq(appointments.doctorId, doctor.id),
          sql`${appointments.appointmentDate} = ${todayStr}`,
          sql`${appointments.status} != 'cancelled'`
        )
      );

    const [totalPatientsRes] = await db
      .select({ count: sql<number>`CAST(count(DISTINCT ${appointments.patientId}) AS UNSIGNED)` })
      .from(appointments)
      .where(eq(appointments.doctorId, doctor.id));

    const [totalAppointmentsRes] = await db
      .select({ count: sql<number>`CAST(count(*) AS UNSIGNED)` })
      .from(appointments)
      .where(eq(appointments.doctorId, doctor.id));

    return NextResponse.json({
      doctor: {
        id: doctor.id,
        specialization: doctor.specialization,
        rating: doctor.rating,
        totalReviews: doctor.totalReviews,
      },
      stats: {
        todayAppointments: Number(todayCountRes?.count || 0),
        totalPatients: Number(totalPatientsRes?.count || 0),
        totalAppointments: Number(totalAppointmentsRes?.count || 0),
      },
    });
  } catch (error) {
    console.error("Doctor stats error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
