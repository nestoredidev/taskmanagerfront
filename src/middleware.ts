// src/middleware.ts
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const roleCookie = req.cookies.get("role")?.value; // "ROLE_ADMIN" | "ROLE_USER"
    const {pathname} = req.nextUrl;

    const isAdminRoute = pathname.startsWith("/auth/admin");
    const isUserRoute = pathname.startsWith("/auth/user");
    const isLogin = pathname === "/login"; // ajusta si usas /auth/login

    if ((isAdminRoute || isUserRoute) && !token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Verifica token (sigue vigente)
    if (token && (isAdminRoute || isUserRoute)) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/validate-token`, {
                method: "POST",
                headers: {"Content-Type": "application/json", token},
                cache: "no-store",
            });
            const json = await res.json().catch(() => null);
            const ok = res.ok && json?.status === true;
            if (!ok) {
                const out = NextResponse.redirect(new URL("/login", req.url));
                out.cookies.set("token", "", {path: "/", maxAge: 0});
                out.cookies.set("role", "", {path: "/", maxAge: 0});
                return out;
            }
        } catch {
            const out = NextResponse.redirect(new URL("/login", req.url));
            out.cookies.set("token", "", {path: "/", maxAge: 0});
            out.cookies.set("role", "", {path: "/", maxAge: 0});
            return out;
        }
    }

    // Autorización por rol usando cookie `role` (sin decodificar)
    const role = (roleCookie ?? "").replace(/^ROLE_/, "").toUpperCase(); // "ADMIN" | "USER" | ""

    if (isAdminRoute && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/auth/user", req.url));
    }
    if (isUserRoute && role !== "USER") {
        return NextResponse.redirect(new URL("/auth/admin", req.url));
    }

    // Si ya tiene token y va a /login, mándalo a su dashboard según rol
    if (token && isLogin) {
        const dest = role === "ADMIN" ? "/auth/admin" : "/auth/user";
        return NextResponse.redirect(new URL(dest, req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/auth/admin/:path*", "/auth/user/:path*", "/login"], // ajusta si tu login es /auth/login
};
