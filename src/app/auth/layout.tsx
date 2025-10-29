import Navbar from "@/app/components/ui/Navbar";
import {getSession} from "@/app/utilis/auth";

export default async function AuthLayout({children}: { children: React.ReactNode }) {
    const { role } = await getSession();
    return (
        <div>
            <Navbar role={role} />
            {children}
        </div>
    )
}
