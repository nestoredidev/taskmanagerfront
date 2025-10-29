import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthIndex() {
    const c = await cookies();
    const token = c.get("token")?.value;
    if (!token) redirect("/login");

    const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/validate-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
        cache: "no-store",
    });

    const json = await r.json().catch(() => null);
    const ok = r.ok && json?.status === true;
    if (!ok) redirect("/login");

    const role: string | undefined =
        json?.role ??
        (Array.isArray(json?.authorities) ? json.authorities[0] : undefined);

    if (role === "ADMIN") redirect("/auth/admin");
    if (role === "USER")  redirect("/auth/user");

    // fallback si no hay rol reconocido
    redirect("/login");
}
