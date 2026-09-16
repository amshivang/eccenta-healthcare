import { NextRequest, NextResponse } from "next/server";
import { getDistanceMatrix, calculateHaversineDistance } from "@/lib/google-maps";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { originLat, originLng, destinations } = body;

    if (
      originLat === undefined || 
      originLng === undefined || 
      !Array.isArray(destinations) || 
      destinations.length === 0
    ) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (!process.env.GOOGLE_MAPS_API_KEY) {
      // Fall back to Haversine calculation
      const results = destinations.map((dest: { lat: number; lng: number }) => {
        const distanceKm = calculateHaversineDistance(originLat, originLng, dest.lat, dest.lng);
        return {
          distance: { text: `${distanceKm.toFixed(1)} km`, value: distanceKm * 1000 },
          duration: { text: "N/A", value: 0 } // Cannot easily estimate time without routing
        };
      });
      return NextResponse.json(results);
    }

    const results = await getDistanceMatrix(originLat, originLng, destinations);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error calculating distance matrix:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
