import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, roles, permissions, rolePermissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, createToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, role, phone } = await req.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email and password required" }, { status: 400 });
    }

    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Self-registration is strictly restricted to the PATIENT role to prevent privilege escalation
    const [dbRole] = await db.select().from(roles).where(eq(roles.name, "PATIENT")).limit(1);
    
    if (!dbRole) {
      return NextResponse.json({ error: "Patient role is not configured" }, { status: 500 });
    }

    const hashedPassword = await hashPassword(password);
    await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
      roleId: dbRole.id,
      phone: phone || null,
    });

    // Fetch the newly created user
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    const perms = await db
      .select({ name: permissions.name })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, dbRole.id));
      
    const permissionNames = perms.map((p) => p.name);

    const token = createToken({
      userId: user.id,
      email: user.email,
      role: dbRole.name,
      permissions: permissionNames,
      name: user.name,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: dbRole.name,
        permissions: permissionNames,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
