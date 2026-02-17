import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    // Paths that trigger a redirect to dashboard if logged in
    const authRoutes = ["/login", "/register"];

    // Helper to decode JWT payload (no verification, just for routing)
    const getRoleFromToken = (token: string): string | null => {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = atob(base64);
            const payload = JSON.parse(jsonPayload);
            return payload.role || null;
        } catch (e) {
            return null;
        }
    };

    if (token) {
        const role = getRoleFromToken(token);

        // If logged in and at root or auth pages, redirect to dashboard based on role
        if (pathname === "/" || authRoutes.some((route) => pathname.startsWith(route))) {
            if (role === "SYSTEM_ADMIN") {
                return NextResponse.redirect(new URL("/system", request.url));
            } else if (role === "PARTNER_ADMIN") {
                return NextResponse.redirect(new URL("/partner", request.url));
            }
        }

        // Role-based protection for /system
        if (pathname.startsWith("/system")) {
            if (role !== "SYSTEM_ADMIN") {
                if (role === "PARTNER_ADMIN") {
                    return NextResponse.redirect(new URL("/partner", request.url));
                }
                return NextResponse.redirect(new URL("/login", request.url));
            }
        }

        // Role-based protection for /partner
        if (pathname.startsWith("/partner")) {
            if (role !== "PARTNER_ADMIN") {
                if (role === "SYSTEM_ADMIN") {
                    return NextResponse.redirect(new URL("/system", request.url));
                }
                return NextResponse.redirect(new URL("/login", request.url));
            }
        }

    } else {
        // Not logged in

        // If accessing protected routes, redirect to login
        // Protected: /, /system, /partner
        const protectedPrefixes = ["/system", "/partner"];

        if (pathname === "/" || protectedPrefixes.some((route) => pathname.startsWith(route))) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
