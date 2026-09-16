import { NextRequest, NextResponse } from "next/server";
import { searchNearbyDoctors } from "@/lib/google-maps";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "");
    const lng = parseFloat(searchParams.get("lng") || "");
    const radius = parseFloat(searchParams.get("radius") || "5000");
    const keyword = searchParams.get("keyword") || "doctor";

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
    }

    if (!process.env.GOOGLE_MAPS_API_KEY) {
      console.warn("GOOGLE_MAPS_API_KEY not configured. Returning empty places.");
      return NextResponse.json([]);
    }

    const results = await searchNearbyDoctors(lat, lng, radius, keyword);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching places:", error);
    return NextResponse.json([], { status: 200 }); // Requirements say "Returns empty array if API key not configured (don't error)"
  }
}
