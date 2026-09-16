import { NextRequest, NextResponse } from "next/server";
import { geocodeAddress } from "@/lib/google-maps";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json({ error: "address is required" }, { status: 400 });
    }

    if (!process.env.GOOGLE_MAPS_API_KEY) {
      return NextResponse.json({ error: "Maps API not configured" }, { status: 503 });
    }

    const result = await geocodeAddress(address);
    if (!result) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error geocoding address:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
