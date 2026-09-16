import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { medicineReminders } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const reminderId = parseInt(id, 10);
    if (isNaN(reminderId)) {
      return NextResponse.json({ error: "Invalid reminder ID" }, { status: 400 });
    }

    const [existing] = await db
      .select({ id: medicineReminders.id })
      .from(medicineReminders)
      .where(
        and(
          eq(medicineReminders.id, reminderId),
          eq(medicineReminders.patientId, session.userId)
        )
      )
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Reminder not found or unauthorized" }, { status: 404 });
    }

    const body = await req.json();
    const allowedUpdates: Record<string, any> = {};
    if (typeof body.medicineName === "string") allowedUpdates.medicineName = body.medicineName;
    if (typeof body.dosage === "string") allowedUpdates.dosage = body.dosage;
    if (typeof body.frequency === "string") allowedUpdates.frequency = body.frequency;
    if (typeof body.reminderTime === "string") allowedUpdates.reminderTime = body.reminderTime;
    if (typeof body.startDate === "string") allowedUpdates.startDate = body.startDate;
    if (body.endDate !== undefined) allowedUpdates.endDate = body.endDate;
    if (typeof body.isActive === "boolean") allowedUpdates.isActive = body.isActive;

    if (Object.keys(allowedUpdates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    await db
      .update(medicineReminders)
      .set(allowedUpdates)
      .where(
        and(
          eq(medicineReminders.id, reminderId),
          eq(medicineReminders.patientId, session.userId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating reminder:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const reminderId = parseInt(id, 10);
    if (isNaN(reminderId)) {
      return NextResponse.json({ error: "Invalid reminder ID" }, { status: 400 });
    }

    const [existing] = await db
      .select({ id: medicineReminders.id })
      .from(medicineReminders)
      .where(
        and(
          eq(medicineReminders.id, reminderId),
          eq(medicineReminders.patientId, session.userId)
        )
      )
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Reminder not found or unauthorized" }, { status: 404 });
    }

    await db
      .delete(medicineReminders)
      .where(
        and(
          eq(medicineReminders.id, reminderId),
          eq(medicineReminders.patientId, session.userId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
