import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { healthRecords } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const result = await db.select().from(healthRecords).where(eq(healthRecords.patientId, session.userId)).orderBy(desc(healthRecords.recordDate));
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching health records:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    await db.insert(healthRecords).values({
      patientId: session.userId,
      recordType: body.recordType,
      title: body.title,
      description: body.description || null,
      doctorName: body.doctorName || null,
      hospitalName: body.hospitalName || null,
      recordDate: body.recordDate,
      fileUrl: body.fileUrl || null,
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating health record:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
