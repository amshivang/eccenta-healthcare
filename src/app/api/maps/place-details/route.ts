import { NextRequest, NextResponse } from "next/server";
import { getPlaceDetails } from "@/lib/google-maps";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const placeId = searchParams.get("placeId");

    if (!placeId) {
      return NextResponse.json({ error: "placeId is required" }, { status: 400 });
    }

    if (!process.env.GOOGLE_MAPS_API_KEY) {
      return NextResponse.json({ error: "Maps API not configured" }, { status: 503 });
    }

    const result = await getPlaceDetails(placeId);
    if (!result) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching place details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
