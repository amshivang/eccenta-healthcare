import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { medicineReminders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const result = await db.select().from(medicineReminders).where(eq(medicineReminders.patientId, session.userId)).orderBy(desc(medicineReminders.createdAt));
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    await db.insert(medicineReminders).values({
      patientId: session.userId, medicineName: body.medicineName, dosage: body.dosage,
      frequency: body.frequency, reminderTime: body.reminderTime, startDate: body.startDate,
      endDate: body.endDate || null, isActive: true,
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating reminder:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
