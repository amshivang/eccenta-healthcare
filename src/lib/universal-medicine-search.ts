// src/lib/universal-medicine-search.ts
import { db } from "@/db";
import { medicines, pharmacies, pharmacyStock } from "@/db/schema";
import { eq, sql, or, like } from "drizzle-orm";
import { MEDICINE_MASTER_CATALOG, MasterMedicine } from "./medicine-master";

export interface UniversalMedicineMatch {
  id: number;
  name: string;
  genericName: string | null;
  manufacturer: string | null;
  category: string | null;
  description: string | null;
  price?: number;
}

/**
 * Searches the master catalog and ensures matches exist in the MySQL database.
 * If matches exist in master catalog but not in DB, it dynamically catalogs them
 * and provisions pharmacy stock across Lucknow pharmacies.
 */
export async function resolveUniversalMedicines(query: string): Promise<number[]> {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) return [];

  // 1. Check existing DB medicines
  const existingMatches = await db
    .select({ id: medicines.id, name: medicines.name, genericName: medicines.genericName })
    .from(medicines)
    .where(
      or(
        like(medicines.name, `%${cleanQ}%`),
        like(medicines.genericName, `%${cleanQ}%`),
        like(medicines.category, `%${cleanQ}%`),
        like(medicines.description, `%${cleanQ}%`)
      )
    )
    .limit(25);

  const matchedMedIds = new Set<number>(existingMatches.map(m => m.id));

  // 2. Search Master In-Memory Catalog for brand, salt, or symptom keywords
  const masterMatches = MEDICINE_MASTER_CATALOG.filter(med => {
    if (med.name.toLowerCase().includes(cleanQ)) return true;
    if (med.genericName.toLowerCase().includes(cleanQ)) return true;
    if (med.category.toLowerCase().includes(cleanQ)) return true;
    if (med.description.toLowerCase().includes(cleanQ)) return true;
    if (med.keywords.some(k => k.toLowerCase().includes(cleanQ) || cleanQ.includes(k.toLowerCase()))) return true;
    return false;
  });

  // 3. For any master match not in DB, auto-seed it and stock it at pharmacies
  for (const master of masterMatches) {
    const [foundInDb] = await db
      .select({ id: medicines.id })
      .from(medicines)
      .where(eq(medicines.name, master.name))
      .limit(1);

    let medId: number;
    if (foundInDb) {
      medId = foundInDb.id;
      matchedMedIds.add(medId);
    } else {
      const [insertRes] = await db.insert(medicines).values({
        name: master.name,
        genericName: master.genericName,
        manufacturer: master.manufacturer,
        category: master.category,
        description: master.description,
      });
      medId = (insertRes as any).insertId;
      matchedMedIds.add(medId);

      // Provision stock at top pharmacies
      await autoStockMedicineAtPharmacies(medId, master.defaultPrice);
    }
  }

  // 4. If no matches found in DB or Master Catalog, return empty array (do not fabricate stock)
  return Array.from(matchedMedIds);
}

/**
 * Ensures a medicine is stocked at Lucknow pharmacies with realistic quantities and competitive pricing.
 */
async function autoStockMedicineAtPharmacies(medId: number, basePrice: number) {
  try {
    // Get up to 35 pharmacies in Lucknow
    const pharmList = await db
      .select({ id: pharmacies.id })
      .from(pharmacies)
      .limit(35);

    if (pharmList.length === 0) return;

    for (let i = 0; i < pharmList.length; i++) {
      const p = pharmList[i];
      // Slight price variance (±8%) between pharmacies for realistic market price comparison
      const priceVariation = ((i % 5) - 2) * 0.03; 
      const pharmacyPrice = Math.max(5, Number((basePrice * (1 + priceVariation)).toFixed(2)));
      const quantity = 15 + ((i * 11 + medId * 7) % 65);

      await db
        .insert(pharmacyStock)
        .values({
          pharmacyId: p.id,
          medicineId: medId,
          price: String(pharmacyPrice),
          quantity,
        })
        .onDuplicateKeyUpdate({
          set: { quantity },
        });
    }
  } catch (err) {
    console.error(`Failed to auto-stock medicine id ${medId}:`, err);
  }
}

/**
 * Autocomplete suggestions for instant UI search dropdown
 */
export function getMedicineSuggestions(query: string): MasterMedicine[] {
  if (!query || query.trim().length < 2) return [];
  const cleanQ = query.trim().toLowerCase();

  const results: MasterMedicine[] = [];
  const seen = new Set<string>();

  // Exact startsWith matches first
  for (const med of MEDICINE_MASTER_CATALOG) {
    if (med.name.toLowerCase().startsWith(cleanQ) || med.genericName.toLowerCase().startsWith(cleanQ)) {
      if (!seen.has(med.name)) {
        seen.add(med.name);
        results.push(med);
      }
    }
  }

  // Then contains matches
  if (results.length < 8) {
    for (const med of MEDICINE_MASTER_CATALOG) {
      if (
        med.name.toLowerCase().includes(cleanQ) ||
        med.genericName.toLowerCase().includes(cleanQ) ||
        med.keywords.some(k => k.toLowerCase().includes(cleanQ))
      ) {
        if (!seen.has(med.name)) {
          seen.add(med.name);
          results.push(med);
        }
      }
      if (results.length >= 8) break;
    }
  }

  return results.slice(0, 8);
}
