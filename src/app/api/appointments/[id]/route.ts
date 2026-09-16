import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { appointments, doctors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const apptId = parseInt(id, 10);
    if (isNaN(apptId)) {
      return NextResponse.json({ error: "Invalid appointment ID" }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, apptId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    let isDoctorOwner = false;
    if (session.role === "DOCTOR") {
      const [doc] = await db
        .select({ id: doctors.id })
        .from(doctors)
        .where(eq(doctors.userId, session.userId))
        .limit(1);
      if (doc && doc.id === existing.doctorId) {
        isDoctorOwner = true;
      }
    }

    const isOwner = existing.patientId === session.userId;
    const isPrivileged = session.role === "ADMIN" || session.role === "SUPER_ADMIN" || isDoctorOwner;
    if (!isOwner && !isPrivileged) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const allowedUpdates: Record<string, any> = {};

    if (body.status && ["scheduled", "in_queue", "in_progress", "completed", "cancelled"].includes(body.status)) {
      allowedUpdates.status = body.status;
    }
    if (body.notes !== undefined) {
      allowedUpdates.notes = body.notes;
    }
    if (isPrivileged) {
      if (body.queuePosition !== undefined) allowedUpdates.queuePosition = body.queuePosition;
      if (body.estimatedWaitMinutes !== undefined) allowedUpdates.estimatedWaitMinutes = body.estimatedWaitMinutes;
    }

    if (Object.keys(allowedUpdates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    await db
      .update(appointments)
      .set(allowedUpdates)
      .where(eq(appointments.id, apptId));

    const [updated] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, apptId))
      .limit(1);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const apptId = parseInt(id, 10);
    if (isNaN(apptId)) {
      return NextResponse.json({ error: "Invalid appointment ID" }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, apptId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    let isDoctorOwner = false;
    if (session.role === "DOCTOR") {
      const [doc] = await db
        .select({ id: doctors.id })
        .from(doctors)
        .where(eq(doctors.userId, session.userId))
        .limit(1);
      if (doc && doc.id === existing.doctorId) {
        isDoctorOwner = true;
      }
    }

    const isOwner = existing.patientId === session.userId;
    const isPrivileged = session.role === "ADMIN" || session.role === "SUPER_ADMIN" || isDoctorOwner;
    if (!isOwner && !isPrivileged) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db
      .update(appointments)
      .set({ status: "cancelled" })
      .where(eq(appointments.id, apptId));

    const [updated] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, apptId))
      .limit(1);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
