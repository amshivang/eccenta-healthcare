import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { users, roles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: roles.name,
        phone: users.phone,
        bloodGroup: users.bloodGroup,
        dateOfBirth: users.dateOfBirth,
        address: users.address,
        emergencyContact: users.emergencyContact,
      })
      .from(users)
      .innerJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch {
    try {
      const session = await getSession();
      if (session) {
        return NextResponse.json({
          user: {
            id: session.userId,
            email: session.email,
            name: session.name || "User",
            role: session.role,
            permissions: session.permissions || [],
          },
        });
      }
    } catch {}
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
