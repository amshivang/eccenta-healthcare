import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bloodBanks, bloodInventory } from "@/db/schema";
import { sql, asc, desc, inArray } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");
    
    const userLat = latParam ? parseFloat(latParam) : null;
    const userLng = lngParam ? parseFloat(lngParam) : null;

    let distanceField = sql<number | null>`NULL`;
    if (userLat !== null && userLng !== null && !isNaN(userLat) && !isNaN(userLng)) {
      distanceField = sql<number>`(6371 * acos(GREATEST(-1.0, LEAST(1.0, cos(radians(${userLat})) * cos(radians(${bloodBanks.latitude})) * cos(radians(${bloodBanks.longitude}) - radians(${userLng})) + sin(radians(${userLat})) * sin(radians(${bloodBanks.latitude}))))))`;
    }

    const banks = await db
      .select({
        id: bloodBanks.id,
        name: bloodBanks.name,
        address: bloodBanks.address,
        phone: bloodBanks.phone,
        latitude: bloodBanks.latitude,
        longitude: bloodBanks.longitude,
        createdAt: bloodBanks.createdAt,
        distance: distanceField,
      })
      .from(bloodBanks)
      .orderBy(userLat !== null ? asc(distanceField) : desc(bloodBanks.id))
      .limit(50);

    const bankIds = banks.map((b) => b.id);
    const inventory = bankIds.length > 0
      ? await db.select().from(bloodInventory).where(inArray(bloodInventory.bloodBankId, bankIds))
      : [];
    const inventoryByBank = new Map<number, (typeof inventory)[number][]>();
    for (const item of inventory) {
      const list = inventoryByBank.get(item.bloodBankId) || [];
      list.push(item);
      inventoryByBank.set(item.bloodBankId, list);
    }

    const result = banks.map((b) => ({
      ...b,
      inventory: inventoryByBank.get(b.id) || [],
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching blood banks:", error);
    return NextResponse.json([], { status: 500 });
  }
}
