"use client";
import React, {useActionState, useEffect} from 'react';
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import {createPermission} from "@/app/acction/permission-acction";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {FcLeft} from "react-icons/fc";

function NewPermission() {
    const router = useRouter()
    const [state, dispatch] = useActionState(createPermission, {
        errors: [],
        success: "",
        data: {
            code: 0,
            message: "",
            content: [],
        },
    });

    useEffect(() => {
        if (state.errors && state.errors.length > 0) {
            state.errors.forEach(error => toast.error(error))
        }
        if (state.success) {
            toast.success(state.success)
            router.push('/auth/admin/permissions')
        }
    }, [state, router])

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
                    Crear Nuevo Permiso
                </h1>
                <form className="space-y-5"
                      action={dispatch}>
                    <label
                        className="block text-gray-700 text-sm font-semibold mb-2"
                        htmlFor="permissionName"
                    >
                        Nombre del Permiso
                    </label>
                    <Input placeholder="Ingrese el nombre del permiso"
                           type="text"
                           name="name"
                           id="name"
                    />
                    <Button name={"Crear permiso"}/>
                </form>
            </div>
        </div>
    );
}

export default NewPermission;