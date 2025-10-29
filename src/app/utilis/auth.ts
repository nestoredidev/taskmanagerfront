// lib/server/auth.ts
import "server-only";
import {cookies} from "next/headers";
import {cache} from "react";
import {redirect} from "next/navigation";

export type Role = "ADMIN" | "USER";
type Session = {
    token?: string | null;
    role?: Role | null,
    userId?: string | null
};

// Normaliza "ROLE_ADMIN" | "ADMIN" -> "ADMIN"
export function normalizeRole(raw?: string | null): Role | null {
    const r = (raw ?? "").replace(/^ROLE_/, "").toUpperCase();
    return r === "ADMIN" || r === "USER" ? (r as Role) : null;
}

// Lee cookies una sola vez por request (cachea por request)
export const getSession = cache(async (): Promise<Session> => {
    const c = await cookies();
    const token = c.get("token")?.value ?? null;
    const roleCookie = c.get("role")?.value ?? null;
    const role = normalizeRole(roleCookie);
   const userId = c.get("id")?.value ?? null;
    return {token, role,userId };
});

// (opcional) valida el token contra tu API
export const validateToken = cache(async () => {
    const {token} = await getSession();
    if (!token) return null;
    try {
        const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/validate-token`, {
            method: "POST",
            headers: {"Content-Type": "application/json", token},
            cache: "no-store",
        });
        const json = await r.json().catch(() => null);
        const ok = r.ok && json?.status === true;
        return ok ? json : null; // puedes devolver claims/authorities si tu API los trae
    } catch {
        return null;
    }
});

// Guards reutilizables
export async function requireAuth() {
    const {token} = await getSession();
    if (!token) redirect("/login");
    const valid = await validateToken();
    if (!valid) redirect("/login");
}

export async function requireRole(required: Role) {
    await requireAuth();
    const {role} = await getSession();
    if (role !== required) {
        redirect(required === "ADMIN" ? "/auth/user" : "/auth/admin");
    }
}
