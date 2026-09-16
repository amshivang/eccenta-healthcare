import { NextResponse } from "next/server";
import { db } from "@/db";
import { appointments, medicineReminders, healthRecords, doctors, users, labBookings, labTests, laboratories } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const results = await Promise.all([
      db
        .select({
          id: appointments.id, doctorName: users.name, specialization: doctors.specialization,
          appointmentDate: appointments.appointmentDate, appointmentTime: appointments.appointmentTime,
          tokenNumber: appointments.tokenNumber, status: appointments.status,
          queuePosition: appointments.queuePosition, estimatedWaitMinutes: appointments.estimatedWaitMinutes,
        })
        .from(appointments)
        .innerJoin(doctors, eq(appointments.doctorId, doctors.id))
        .innerJoin(users, eq(doctors.userId, users.id))
        .where(and(
          eq(appointments.patientId, session.userId),
          sql`${appointments.status} != 'cancelled'`,
          sql`${appointments.status} != 'completed'`
        ))
        .orderBy(appointments.appointmentDate)
        .limit(5),

      db.select().from(medicineReminders)
        .where(and(eq(medicineReminders.patientId, session.userId), eq(medicineReminders.isActive, true)))
        .limit(5),

      db.select().from(healthRecords)
        .where(eq(healthRecords.patientId, session.userId))
        .orderBy(desc(healthRecords.recordDate))
        .limit(3),

      db
        .select({
          id: labBookings.id, testName: labTests.name, labName: laboratories.name,
          bookingDate: labBookings.bookingDate, status: labBookings.status,
        })
        .from(labBookings)
        .innerJoin(labTests, eq(labBookings.labTestId, labTests.id))
        .innerJoin(laboratories, eq(labTests.labId, laboratories.id))
        .where(and(
          eq(labBookings.patientId, session.userId),
          sql`${labBookings.status} != 'cancelled'`,
          sql`${labBookings.status} != 'completed'`
        ))
        .limit(3),

      db
        .select({ count: sql<number>`CAST(count(*) AS UNSIGNED)` })
        .from(appointments)
        .where(eq(appointments.patientId, session.userId)),

      db
        .select({ count: sql<number>`CAST(count(*) AS UNSIGNED)` })
        .from(healthRecords)
        .where(eq(healthRecords.patientId, session.userId)),

      db
        .select({ count: sql<number>`CAST(count(*) AS UNSIGNED)` })
        .from(medicineReminders)
        .where(and(eq(medicineReminders.patientId, session.userId), eq(medicineReminders.isActive, true))),
    ]);

    const [
      upcomingAppointments,
      activeReminders,
      recentRecords,
      activeLabBookings,
      totalAppointments,
      totalRecords,
      totalReminders
    ] = results;

    return NextResponse.json({
      upcomingAppointments, activeReminders, recentRecords, activeLabBookings,
      stats: {
        totalAppointments: Number(totalAppointments[0]?.count || 0),
        totalRecords: Number(totalRecords[0]?.count || 0),
        activeReminders: Number(totalReminders[0]?.count || 0),
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
