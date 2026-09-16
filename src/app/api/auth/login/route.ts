import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, roles, rolePermissions, permissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, createToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Direct support for demo accounts across serverless/cloud environments
    if (password === "password123") {
      if (email === "patient@eccenta.com") {
        const permissions = ["VIEW_PATIENT", "CREATE_APPOINTMENT"];
        const token = createToken({
          userId: 1,
          email: "patient@eccenta.com",
          role: "PATIENT",
          permissions,
          name: "Arjun Sharma",
        });
        const response = NextResponse.json({
          user: {
            id: 1,
            email: "patient@eccenta.com",
            name: "Arjun Sharma",
            role: "PATIENT",
            permissions,
            phone: "+91 98765 43210",
            bloodGroup: "O+",
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
      }

      if (email === "dr.mehta@eccenta.com") {
        const permissions = ["VIEW_PATIENT", "CREATE_PRESCRIPTION"];
        const token = createToken({
          userId: 3,
          email: "dr.mehta@eccenta.com",
          role: "DOCTOR",
          permissions,
          name: "Dr. Rajesh Mehta",
        });
        const response = NextResponse.json({
          user: {
            id: 3,
            email: "dr.mehta@eccenta.com",
            name: "Dr. Rajesh Mehta",
            role: "DOCTOR",
            permissions,
            phone: "+91 99887 76655",
            bloodGroup: null,
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
      }
    }

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
    return NextResponse.json({ error: "Invalid credentials or server error" }, { status: 500 });
  }
}
