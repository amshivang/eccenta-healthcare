import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || (process.env.NODE_ENV === "production" ? (() => { throw new Error("JWT_SECRET environment variable is required in production"); })() : "eccenta-dev-fallback-secret-local-only");
  return new TextEncoder().encode(secret);
}

async function verifyJwt(token: string): Promise<Record<string, any> | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as Record<string, any>;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Paths that do not require authentication
  if (
    pathname.startsWith('/api/auth') || 
    pathname.startsWith('/_next') ||
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/403' ||
    (request.method === 'GET' && (
      pathname.startsWith('/api/doctors') ||
      pathname.startsWith('/api/hospitals') ||
      pathname.startsWith('/api/labs') ||
      pathname.startsWith('/api/pharmacies') ||
      pathname.startsWith('/api/blood-banks') ||
      pathname.startsWith('/api/ambulance') ||
      pathname.startsWith('/api/health')
    ))
  ) {
    return NextResponse.next();
  }

  // All other routes require auth
  if (!token) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const payload = await verifyJwt(token);
    if (!payload) {
      if (pathname.startsWith('/api')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
    const role = payload.role as string;
    
    // RBAC Logic
    
    // Admin routes
    if (pathname.startsWith('/admin') && !['SUPER_ADMIN', 'ADMIN'].includes(role)) {
      return NextResponse.redirect(new URL('/403', request.url));
    }

    // Doctor routes
    if (pathname.startsWith('/doctor') && role !== 'DOCTOR') {
      return NextResponse.redirect(new URL('/403', request.url));
    }

    // Patient routes
    if (pathname.startsWith('/patient') && role !== 'PATIENT') {
      return NextResponse.redirect(new URL('/403', request.url));
    }

    // Lab routes
    if (pathname.startsWith('/lab') && role !== 'LAB_STAFF') {
      return NextResponse.redirect(new URL('/403', request.url));
    }

    // Pharmacy routes
    if (pathname.startsWith('/pharmacy') && role !== 'PHARMACIST') {
      return NextResponse.redirect(new URL('/403', request.url));
    }

    // Ambulance routes
    if (pathname.startsWith('/ambulance') && role !== 'AMBULANCE_DRIVER') {
      return NextResponse.redirect(new URL('/403', request.url));
    }
    
    // Hospital Admin routes
    if ((pathname.startsWith('/hospital') || pathname.startsWith('/dashboard/hospital')) && role !== 'HOSPITAL_ADMIN') {
      return NextResponse.redirect(new URL('/403', request.url));
    }
    
    return NextResponse.next();
  } catch (err) {
    // Invalid or expired token
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
