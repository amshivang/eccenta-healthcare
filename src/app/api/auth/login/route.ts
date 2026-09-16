import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, roles, rolePermissions, permissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, createToken } from "@/lib/auth";

// Demo accounts — work without any database connection
const DEMO_USERS: Record<string, { id: number; email: string; name: string; role: string; permissions: string[]; phone: string; bloodGroup: string | null; password: string }> = {
  "patient@eccenta.com": { id: 1, email: "patient@eccenta.com", name: "Arjun Sharma",    role: "PATIENT", permissions: ["VIEW_PATIENT", "CREATE_APPOINTMENT"],    phone: "+91 98765 43210", bloodGroup: "O+", password: "password123" },
  "dr.mehta@eccenta.com":{ id: 3, email: "dr.mehta@eccenta.com",name: "Dr. Rajesh Mehta",role: "DOCTOR",  permissions: ["VIEW_PATIENT", "CREATE_PRESCRIPTION"],   phone: "+91 99887 76655", bloodGroup: null, password: "password123" },
  "patient@demo.com":    { id: 1, email: "patient@demo.com",    name: "Arjun Sharma",    role: "PATIENT", permissions: ["VIEW_PATIENT", "CREATE_APPOINTMENT"],    phone: "+91 98765 43210", bloodGroup: "O+", password: "patient123"  },
  "doctor@demo.com":     { id: 3, email: "doctor@demo.com",     name: "Dr. Rajesh Mehta",role: "DOCTOR",  permissions: ["VIEW_PATIENT", "CREATE_PRESCRIPTION"],   phone: "+91 99887 76655", bloodGroup: null, password: "doctor123"  },
  "admin@demo.com":      { id: 2, email: "admin@demo.com",      name: "Admin User",      role: "ADMIN",   permissions: ["MANAGE_USERS", "VIEW_REPORTS"],          phone: "+91 98000 00001", bloodGroup: null, password: "admin123"   },
};

function demoLogin(email: string, password: string) {
  const u = DEMO_USERS[email.toLowerCase()];
  if (!u || u.password !== password) return null;
  const token = createToken({ userId: u.id, email: u.email, role: u.role, permissions: u.permissions, name: u.name });
  const response = NextResponse.json({ user: { id: u.id, email: u.email, name: u.name, role: u.role, permissions: u.permissions, phone: u.phone, bloodGroup: u.bloodGroup } });
  response.cookies.set("auth_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
  return response;
}

export async function POST(req: NextRequest) {
  let email: string | undefined;
  let password: string | undefined;
  try {
    const body = await req.json();
    email = body.email;
    password = body.password;
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Always try demo accounts first — no DB needed
    const demo = demoLogin(email, password);
    if (demo) return demo;

    const userWithRole = await db
      .select({ user: users, role: roles })
      .from(users)
      .innerJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.email, email))
      .limit(1);

    if (!userWithRole.length) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const { user, role } = userWithRole[0];

    if (user.status !== "active") {
      return NextResponse.json({ error: "Account is not active" }, { status: 403 });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const perms = await db
      .select({ name: permissions.name })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, role.id));
      
    const permissionNames = perms.map((p) => p.name);

    const token = createToken({
      userId: user.id,
      email: user.email,
      role: role.name,
      permissions: permissionNames,
      name: user.name,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: role.name,
        permissions: permissionNames,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
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
  } catch (error) {
    console.error("Login error:", error);
    // Fallback to demo login if DB is unavailable
    if (email && password) {
      const demo = demoLogin(email, password);
      if (demo) return demo;
    }
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
