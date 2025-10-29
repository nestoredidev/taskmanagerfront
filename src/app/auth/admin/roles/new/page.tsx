"use client";

import React, { useActionState, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FcLeft } from "react-icons/fc";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import { PermissionsResponse } from "@/app/types/permissions";
import { getAllPermissions } from "@/app/acction/permission-acction";
import { createRole } from "@/app/acction/roles-acction";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

function NewRoles() {
    const [response, setResponse] = useState<PermissionsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0); // si luego agregas paginación
    const router = useRouter();

    const fetchPermissions = async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllPermissions(page);
            setResponse(data);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const [state, dispatch] = useActionState(createRole, {
        errors: [],
        success: "",
    });

    useEffect(() => {
        if (state.errors && state.errors.length > 0) {
            state.errors.forEach((err) => toast.error(err));
        }
        if (state.success) {
            toast.success(state.success);
            router.push("/auth/admin/roles");
        }
    }, [state, router]);

    useEffect(() => {
        fetchPermissions(page);
    }, [page]);

    // ---- estado para el buscador y selección de permisos ----
    const [filter, setFilter] = useState("");
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const allPermissions = response?.content ?? [];
    const filtered = useMemo(() => {
        const q = filter.trim().toLowerCase();
        if (!q) return allPermissions;
        return allPermissions.filter((p) => p.name.toLowerCase().includes(q));
    }, [allPermissions, filter]);

    const toggle = (value: string) =>
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(value) ? next.delete(value) : next.add(value);
            return next;
        });

    const selectAllFiltered = () =>
        setSelected((prev) => {
            const next = new Set(prev);
            filtered.forEach((p) => next.add(p.name));
            return next;
        });

    const clearAll = () => setSelected(new Set());

    if (loading) return <span>loding</span>;
    if (error) return <span>{error}</span>;
    if (!response) return <span>No hay datos.</span>;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 px-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 space-y-6">
                <Link href="/auth/admin/roles">
          <span>
            <FcLeft size={24} className="hover:bg-indigo-200 rounded-md" />
          </span>
                </Link>

                <h1 className="text-2xl font-bold text-gray-800 text-center">
                    Crear nuevo rol
                </h1>

                <form className="space-y-5" action={dispatch}>
                    <label
                        className="block text-gray-700 text-sm font-semibold mb-2"
                        htmlFor="name"
                    >
                        Nombre del rol
                    </label>
                    <Input
                        placeholder="Ingrese el nombre del Rol"
                        type="text"
                        name="name"
                        id="name"
                    />

                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Asignar permisos
                        </label>

                        <fieldset className="border rounded-md bg-gray-50">
                            {/* Barra de acciones */}
                            <div className="sticky top-0 z-10 bg-gray-50 p-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                                <input
                                    type="text"
                                    placeholder="Buscar permiso…"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="w-full sm:max-w-xs rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={selectAllFiltered}
                                        className="text-xs px-3 py-1 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-800"
                                        title="Selecciona todos los permisos visibles"
                                    >
                                        Seleccionar visibles
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clearAll}
                                        className="text-xs px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
                                    >
                                        Limpiar
                                    </button>
                                    <span className="ml-auto text-xs text-gray-600">
                    Seleccionados: {selected.size} / {allPermissions.length}
                  </span>
                                </div>
                            </div>

                            {/* Lista de permisos */}
                            <div className="max-h-64 overflow-y-auto p-2">
                                {filtered.length === 0 ? (
                                    <p className="text-sm text-gray-500">Sin resultados.</p>
                                ) : (
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                        {filtered.map((item) => {
                                            const id = `perm-${item.id}`;
                                            const isChecked = selected.has(item.name);
                                            return (
                                                <div key={item.id} className="flex">
                                                    {/* Checkbox real (invisible pero accesible) */}
                                                    <input
                                                        id={id}
                                                        name="permissions"
                                                        type="checkbox"
                                                        value={item.name}
                                                        checked={isChecked}
                                                        onChange={() => toggle(item.name)}
                                                        className="peer sr-only"
                                                    />
                                                    {/* Chip clickeable */}
                                                    <label
                                                        htmlFor={id}
                                                        className="
                              w-full text-center cursor-pointer
                              px-3 py-2 rounded-full border
                              bg-white text-gray-700
                              hover:bg-blue-50 hover:border-blue-300
                              peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-checked:text-white
                              transition-colors text-xs font-medium
                            "
                                                        title={item.name}
                                                    >
                                                        {item.name}
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </fieldset>
                    </div>

                    <Button name={"Crear rol"} />
                </form>
            </div>
        </div>
    );
}

export default NewRoles;
