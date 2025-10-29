"use client";
import React, {useEffect, useState} from "react";
import {
    deletePermission,
    getAllPermissions
} from "@/app/acction/permission-acction";
import {PermissionsResponse} from "@/app/types/permissions";
import {FcEmptyTrash} from "react-icons/fc";
import {MdEdit} from "react-icons/md";
import Link from "next/link";
import Button from "@/app/components/ui/Button";
import {toast} from "react-toastify";

function PermissionsPage() {
    const [response, setResponse] = useState<PermissionsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);

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


    useEffect(() => {
        fetchPermissions(page);
    }, [page]);

    const handleDelete = async (id: number) => {
        try {
            await deletePermission(id);
            toast.success("Permiso eliminado correctamente");
            fetchPermissions(page);
        } catch (error) {
            toast.error("Error al eliminar el permiso");
        }
    }


    if (loading) return (
        <div className="flex items-center justify-center min-h-64">
            <div
                className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Cargando permisos...</span>
        </div>
    );

    if (error) return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
                <svg className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20"
                     fill="currentColor">
                    <path fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"/>
                </svg>
                <span className="text-red-800 font-medium">Error: {error}</span>
            </div>
        </div>
    );

    if (!response) return null;

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
                    <Link href="permissions/new">
                        <Button name="Agregar Permiso"/>
                    </Link>
                </div>
            </div>
            <div
                className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col"
                                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                ID
                            </th>
                            <th scope="col"
                                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                Nombre del Permiso
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                Acciones
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {response.content.map((perm, index) => (
                            <tr
                                key={perm.id}
                                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-200`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                    #{perm.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                {perm.name}
                                            </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap flex items-center">
                                    <Link href={`permissions/edit/${perm.id}`}>
                                        <MdEdit
                                            className="text-blue-500 w-6 h-6"/>
                                    </Link>
                                    <button
                                        className="ml-4 text-red-600 hover:text-red-900 font-semibold">
                                        <FcEmptyTrash className="w-6 h-6"
                                                      onClick={() => handleDelete(perm.id)}
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
                                <span className="text-sm text-gray-600">
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

export default PermissionsPage;