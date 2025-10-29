"use client";
import React, {useEffect, useState} from "react";
import {deleteRole, getAllRoles} from "@/app/acction/roles-acction";
import Link from "next/link";
import Button from "@/app/components/ui/Button";
import {MdEdit} from "react-icons/md";
import {RolesResponse} from "@/app/types/roles";
import {deletePermission} from "@/app/acction/permission-acction";
import {toast} from "react-toastify";
import {FcEmptyTrash} from "react-icons/fc";

function RolesPage() {
    const [response, setResponse] = useState<RolesResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);

    const fechtRoles = async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllRoles(page);
            setResponse(data);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fechtRoles(page);
    }, [page]);

    if (error) return <span>{error}</span>;
    if (loading) return <span>Loading...</span>;
    if (!response) return <span>No hay datos.</span>;
    const handleDelete = async (id: number) => {
        try {
            await deleteRole(id);
            toast.success("Rol eliminado correctamente");
            fechtRoles(page);
        } catch (error) {
            toast.error("Error al eliminar el rol");
        }
    }

    return (
        <div className="space-y-6 p-6">
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                    Gestión de Permisos
                </h2>
                <p className="mt-2 text-gray-600">
                    Administra los permisos del sistema
                </p>
                <div className="flex justify-end">
                    <Link href="roles/new">
                        <Button name="Agregar Rol"/>
                    </Link>
                </div>
            </div>
            <div
                className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Nombre
                                del Rol
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Permisos</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Acciones</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {response.content.map((role, index) => (
                            <tr
                                key={role.id}
                                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-200`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                    #{role.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                                                <span
                                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                                    {role.roleEnum}
                                                                </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {role.permissions.map((perm, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-2 mb-2"
                                        >
                                            {perm}
                                        </span>
                                    ))}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap flex items-center">
                                    <button
                                        className="ml-4 text-red-600 hover:text-red-900 font-semibold">
                                        <FcEmptyTrash className="w-6 h-6"
                                                      onClick={() => handleDelete(role.id)}
                                        />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                <div className="bg-white px-6 py-4 border-t border-gray-200">
                    <div
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="text-sm text-gray-700">
                            Mostrando <span
                            className="font-medium">{response.content.length}</span> de{' '}
                            <span
                                className="font-medium">{response.totalElements}</span> permisos
                        </div>
                        <div className="flex items-center space-x-2">
                                                        <span
                                                            className="text-sm text-gray-600">
                                                            Página <span
                                                            className="font-medium">{response.page + 1}</span> de{' '}
                                                            <span
                                                                className="font-medium">{response.totalPages}</span>
                                                        </span>
                            <div className="flex space-x-1">
                                <button
                                    disabled={response.first}
                                    onClick={() => setPage(page - 1)}
                                    className="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    <svg className="h-4 w-4 mr-1" fill="none"
                                         stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M15 19l-7-7 7-7"/>
                                    </svg>
                                    Anterior
                                </button>
                                <button
                                    disabled={response.last}
                                    onClick={() => setPage(page + 1)}
                                    className="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    Siguiente
                                    <svg className="h-4 w-4 ml-1" fill="none"
                                         stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2} d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RolesPage;