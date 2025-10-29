"use client";
import React, {use, useActionState, useEffect} from 'react';
import {createUser} from "@/app/acction/users-acction";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";

function NewUserPage() {
    const router = useRouter()
    const [state, dispatch] = useActionState(createUser, {
        errors: [],
        success: '',
    }

)
useEffect(() => {
    if (state.errors && state.errors.length > 0) {
        state.errors.forEach(error => toast.error(error))
    }
    if (state.success) {
        toast.success(state.success)
        router.push('/auth/admin/users')
    }
}, [state, router])

return (
    <div
        className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-sky-700">Crear nuevo
            usuario</h1>
        <form className="space-y-4" action={dispatch}>
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
            <div>
                <label htmlFor="role"
                       className="block text-slate-600 mb-1">Rol</label>
                <select
                    id="role"
                    name="roleRequest"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="USER">Usuario</option>
                    <option value="ADMIN">Administrador</option>
                    <option value="INVITED">Invitado</option>
                </select>
            </div>
            <button
                type="submit"
                className="mt-4 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
                Crear Usuario
            </button>
        </form>
    </div>
);
}

export default NewUserPage;