import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { labBookings, labTests, laboratories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const result = await db
      .select({
        id: labBookings.id, patientId: labBookings.patientId, labTestId: labBookings.labTestId,
        testName: labTests.name, testPrice: labTests.price, labName: laboratories.name,
        bookingDate: labBookings.bookingDate, homeCollection: labBookings.homeCollection,
        status: labBookings.status, reportUrl: labBookings.reportUrl, createdAt: labBookings.createdAt,
      })
      .from(labBookings)
      .innerJoin(labTests, eq(labBookings.labTestId, labTests.id))
      .innerJoin(laboratories, eq(labTests.labId, laboratories.id))
      .where(eq(labBookings.patientId, session.userId))
      .orderBy(desc(labBookings.createdAt));
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching lab bookings:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    await db.insert(labBookings).values({
      patientId: session.userId, labTestId: body.labTestId,
      bookingDate: body.bookingDate, homeCollection: body.homeCollection || false, status: "booked",
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating lab booking:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
