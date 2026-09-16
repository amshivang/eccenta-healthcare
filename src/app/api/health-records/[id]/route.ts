import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { healthRecords } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const recordId = parseInt(id, 10);
    if (isNaN(recordId)) {
      return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
    }

    const [existing] = await db
      .select({ id: healthRecords.id })
      .from(healthRecords)
      .where(and(eq(healthRecords.id, recordId), eq(healthRecords.patientId, session.userId)))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Record not found or unauthorized" }, { status: 404 });
    }

    await db
      .delete(healthRecords)
      .where(and(eq(healthRecords.id, recordId), eq(healthRecords.patientId, session.userId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting health record:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
