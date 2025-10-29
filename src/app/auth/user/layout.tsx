import {requireRole} from "@/app/utilis/auth";

export default async function UserLayout({children}: {
    children: React.ReactNode
}) {

    await requireRole("USER")
    return <>{children}</>;
}
