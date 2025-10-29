"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
    const cooki = await cookies();
    cooki.set("token", "", { path: "/", maxAge: 0 });
    cooki.set("role",  "", { path: "/", maxAge: 0 });
    redirect("/login?logged_out=1");
}
