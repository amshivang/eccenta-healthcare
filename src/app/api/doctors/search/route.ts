import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { doctors, users, hospitals } from "@/db/schema";
import { eq, sql, or, like } from "drizzle-orm";
import { resolveSearchTerm } from "@/lib/smart-search";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!q) {
      return NextResponse.json({ error: "Search query 'q' is required" }, { status: 400 });
    }

    const { resolved, originalQuery, wasResolved } = resolveSearchTerm(q);

    let distanceSelect = sql`NULL AS distance`;
    let orderClause = [doctors.id];
    
    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      if (!isNaN(latNum) && !isNaN(lngNum)) {
        const distanceFormula = sql`(6371 * acos(GREATEST(-1.0, LEAST(1.0, cos(radians(${latNum})) * cos(radians(${doctors.latitude})) * cos(radians(${doctors.longitude}) - radians(${lngNum})) + sin(radians(${latNum})) * sin(radians(${doctors.latitude}))))))`;
        distanceSelect = sql`${distanceFormula} AS distance`;
        orderClause = [distanceFormula as any];
      }
    }

    // Build search term variants for comprehensive matching
    const searchTerms = new Set<string>();
    searchTerms.add(resolved);
    if (!wasResolved) {
      searchTerms.add(originalQuery);
    }
    const root = resolved.replace(/(ologist|ology|iatrist|iatry|ist|ics|ic|ian|y)$/i, "").trim();
    if (root.length >= 4) {
      searchTerms.add(root);
    }

    const matchConditions = [];
    if (wasResolved) {
      // When resolved from a symptom/synonym, match doctor specialization directly
      matchConditions.push(like(doctors.specialization, `%${resolved}%`));
      if (root.length >= 4) {
        matchConditions.push(like(doctors.specialization, `%${root}%`));
      }
    } else {
      // Freeform search: match across doctor name, specialization, hospital, clinic
      for (const term of searchTerms) {
        matchConditions.push(
          like(doctors.specialization, `%${term}%`),
          like(users.name, `%${term}%`),
          like(hospitals.name, `%${term}%`),
          like(doctors.clinicAddress, `%${term}%`)
        );
      }
    }

    const results = await db
      .select({
        id: doctors.id,
        name: users.name,
        specialization: doctors.specialization,
        clinicAddress: doctors.clinicAddress,
        hospitalName: hospitals.name,
        rating: doctors.rating,
        distance: distanceSelect,
      })
      .from(doctors)
      .innerJoin(users, eq(doctors.userId, users.id))
      .leftJoin(hospitals, eq(doctors.hospitalId, hospitals.id))
      .where(or(...matchConditions))
      .orderBy(...orderClause)
      .limit(50);

    return NextResponse.json({
      results,
      resolvedQuery: resolved,
      wasResolved,
      originalQuery
    });
  } catch (error) {
    console.error("Error in smart search:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
