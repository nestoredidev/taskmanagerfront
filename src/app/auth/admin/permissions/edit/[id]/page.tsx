"use client";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import React, {useActionState, useEffect, useState} from "react";
import {
    getPermissionById,
    updatePermission
} from "@/app/acction/permission-acction";
import {useParams, useRouter} from "next/navigation";
import {newPermissionsResponse, Permission} from "@/app/types/permissions";
import {toast} from "react-toastify";
import Link from "next/link";
import {FcLeft} from "react-icons/fc";

type State = {
    errors: string[];
    success: string;
    data?: newPermissionsResponse;
};

function PermissionEdit() {
    const params = useParams();
    const id = Number(params.id);
    const router = useRouter();

    const [form, setForm] = useState<Permission>({id: 0, name: ""});
    const [loading, setLoading] = useState(true);

    const [state, dispatch] = useActionState(
        async (prevState: State, formData: FormData) => {
            return await updatePermission(prevState, formData, id);
        },
        {errors: [], success: "", data: undefined}
    );

    useEffect(() => {
        async function fetchPermission() {
            try {
                const data = await getPermissionById(id);
                setForm(data);
            } catch {
                setForm({id: 0, name: ""});
            } finally {
                setLoading(false);
            }
        }

        fetchPermission();
    }, [id]);

    useEffect(() => {
        if (state.errors && state.errors.length > 0) {
            state.errors.forEach(error => toast.error(error))
        }
        if (state.success) {
            toast.success(state.success)
            router.push('/auth/admin/permissions')
        }
    }, [state, router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };


    if (loading) return <div className="text-center py-10">Cargando...</div>;

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 px-4">
            <div
                className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
                <Link href="/auth/admin/permissions">
                    <span>
                        <FcLeft size={24}
                                className="hover:bg-indigo-200 rounded-md"/>
                    </span>
                </Link>

                <h1 className="text-2xl font-bold text-gray-800 text-center">
                    Actualizar Permiso
                </h1>
                <form className="space-y-5"
                      action={dispatch}
                >
                    <label
                        className="block text-gray-700 text-sm font-semibold mb-2"
                        htmlFor="name">
                        Nombre del Permiso
                    </label>
                    <Input
                        placeholder="Ingrese el nombre del permiso"
                        type="text"
                        name="name"
                        id="name"
                        value={form.name}
                        onChange={handleChange}
                    />
                    <Button name="Actualizar permiso"/>
                    {state.errors.length > 0 && (
                        <div className="text-red-500 text-sm">
                            {state.errors.map((err, i) => <div
                                key={i}>{err}</div>)}
                        </div>
                    )}
                    {state.success && (
                        <div
                            className="text-green-600 text-sm">{state.success}</div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default PermissionEdit;