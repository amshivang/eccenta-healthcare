import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { laboratories, labTests } from "@/db/schema";
import { eq, sql, and, asc, desc, like, inArray } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius") || "50"; // default 50km
    
    let distanceSql = sql`NULL`;
    let distanceSelect = sql`NULL AS distance`;
    const conditions = [];

    if (lat && lng && radius) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      const radiusNum = parseFloat(radius);
      
      distanceSql = sql`(6371 * acos(GREATEST(-1.0, LEAST(1.0, cos(radians(${latNum})) * cos(radians(${laboratories.latitude})) * cos(radians(${laboratories.longitude}) - radians(${lngNum})) + sin(radians(${latNum})) * sin(radians(${laboratories.latitude}))))))`;
      distanceSelect = sql`${distanceSql} AS distance`;
      conditions.push(sql`${distanceSql} <= ${radiusNum}`);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    let orderByClause;
    
    if (lat && lng && radius) {
      orderByClause = asc(distanceSql);
    } else {
      orderByClause = desc(laboratories.rating);
    }

    // Get labs
    const labs = await db
      .select({
        id: laboratories.id,
        name: laboratories.name,
        address: laboratories.address,
        phone: laboratories.phone,
        latitude: laboratories.latitude,
        longitude: laboratories.longitude,
        homeCollection: laboratories.homeCollection,
        rating: laboratories.rating,
        distance: distanceSelect,
      })
      .from(laboratories)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(50);

    // Get tests for these labs
    let tests: any[] = [];
    if (labs.length > 0) {
      const labIds = labs.map((l) => l.id);
      tests = await db.select().from(labTests).where(inArray(labTests.labId, labIds));
    }

    // Group tests by lab with Map lookup (O(N+M))
    const testsByLab = new Map<number, any[]>();
    for (const test of tests) {
      const list = testsByLab.get(test.labId) || [];
      list.push(test);
      testsByLab.set(test.labId, list);
    }

    const labsWithTests = labs.map((lab) => ({
      ...lab,
      tests: testsByLab.get(lab.id) || []
    }));

    // If search is provided, filter labs that have matching tests or name
    let finalLabs = labsWithTests;
    if (search) {
      const searchLower = search.toLowerCase();
      finalLabs = labsWithTests.filter(lab => 
        lab.name.toLowerCase().includes(searchLower) ||
        lab.tests.some((t: any) => t.name.toLowerCase().includes(searchLower))
      );
    }

    return NextResponse.json(finalLabs);
  } catch (error) {
    console.error("Error fetching labs:", error);
    return NextResponse.json({ error: "Failed to fetch labs" }, { status: 500 });
  }
}
