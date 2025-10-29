"use client"
import {useEffect} from "react";
import {useActionState} from "react";
import {loginAcction} from "@/app/acction/login-acction";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";



function LoginPage() {
    const router = useRouter();

    const [state, dispatch] = useActionState(loginAcction, {
        errors: [],
        data: {
            message: "",
            token: '',
            username: '',
            status: false,
            role: 'ROLE_ADMIN'
        },
        success: ''
    })

    useEffect(() => {
        if (state.errors && state.errors.length > 0) {
            state.errors.forEach(error => toast.error(error))
        }
        if (state.success) {
            toast.success(state.success)
            router.push('/auth/admin')
        }
    }, [state, router])

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-400">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-slate-700">Iniciar
                    sesión</h1>
                <form action={dispatch} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="username"
                               className="block text-slate-600 mb-1">Usuario</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"
                               className="block text-slate-600 mb-1">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-4 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;