// app/auth/admin/layout.tsx
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {requireRole} from "@/app/utilis/auth";

export default async function AdminLayout({children}: {
    children: React.ReactNode
}) {

    await requireRole("ADMIN")
    return <>{children}</>;
}
