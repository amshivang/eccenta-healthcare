import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pharmacies, pharmacyStock, medicines } from "@/db/schema";
import { eq, sql, asc, desc, inArray } from "drizzle-orm";
import { resolveUniversalMedicines, getMedicineSuggestions } from "@/lib/universal-medicine-search";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const medicineName = searchParams.get("medicine") || searchParams.get("q");
    const isSuggest = searchParams.get("suggest") === "true";
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");

    // Fast Autocomplete Suggestions
    if (isSuggest && medicineName) {
      const suggestions = getMedicineSuggestions(medicineName);
      return NextResponse.json(suggestions);
    }
    
    const userLat = latParam ? parseFloat(latParam) : null;
    const userLng = lngParam ? parseFloat(lngParam) : null;

    // Haversine formula directly in SQL
    let distanceField = sql<number | null>`NULL`;
    if (userLat !== null && userLng !== null && !isNaN(userLat) && !isNaN(userLng)) {
      distanceField = sql<number>`(6371 * acos(GREATEST(-1.0, LEAST(1.0, cos(radians(${userLat})) * cos(radians(${pharmacies.latitude})) * cos(radians(${pharmacies.longitude}) - radians(${userLng})) + sin(radians(${userLat})) * sin(radians(${pharmacies.latitude}))))))`;
    }

    if (medicineName && medicineName.trim()) {
      // Resolve any medicine (catalog, brand, generic salt, symptom, or dynamic novel medication)
      const matchedMedIds = await resolveUniversalMedicines(medicineName.trim());

      const whereClause = matchedMedIds.length > 0 
        ? inArray(pharmacyStock.medicineId, matchedMedIds)
        : sql`${medicines.name} LIKE ${"%" + medicineName + "%"} OR ${medicines.genericName} LIKE ${"%" + medicineName + "%"}`;

      const results = await db
        .select({
          pharmacyId: pharmacies.id,
          pharmacyName: pharmacies.name,
          pharmacyAddress: pharmacies.address,
          pharmacyPhone: pharmacies.phone,
          isOpen: pharmacies.isOpen,
          openTime: pharmacies.openTime,
          closeTime: pharmacies.closeTime,
          rating: pharmacies.rating,
          medicineName: medicines.name,
          genericName: medicines.genericName,
          category: medicines.category,
          manufacturer: medicines.manufacturer,
          description: medicines.description,
          price: pharmacyStock.price,
          quantity: pharmacyStock.quantity,
          latitude: pharmacies.latitude,
          longitude: pharmacies.longitude,
          distance: distanceField,
        })
        .from(pharmacyStock)
        .innerJoin(pharmacies, eq(pharmacyStock.pharmacyId, pharmacies.id))
        .innerJoin(medicines, eq(pharmacyStock.medicineId, medicines.id))
        .where(whereClause)
        .orderBy(userLat !== null ? asc(distanceField) : asc(pharmacyStock.price))
        .limit(100);

      return NextResponse.json(results);
    }

    const allPharmacies = await db
      .select({
        id: pharmacies.id,
        name: pharmacies.name,
        address: pharmacies.address,
        phone: pharmacies.phone,
        latitude: pharmacies.latitude,
        longitude: pharmacies.longitude,
        openTime: pharmacies.openTime,
        closeTime: pharmacies.closeTime,
        isOpen: pharmacies.isOpen,
        rating: pharmacies.rating,
        distance: distanceField,
      })
      .from(pharmacies)
      .orderBy(userLat !== null ? asc(distanceField) : desc(pharmacies.rating));
      
    return NextResponse.json(allPharmacies);
  } catch (error) {
    console.error("Error fetching pharmacies:", error);
    return NextResponse.json([], { status: 500 });
  }
}
