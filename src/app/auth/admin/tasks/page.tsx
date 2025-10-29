"use client";
import React, {useEffect, useState} from 'react';
import {
    completeTask,
    deleteTask,
    getAllTasks
} from "@/app/acction/tasks-acctions";
import {TasksAllResponse} from "@/app/types/tasks";
import Link from "next/link";
import Button from "@/app/components/ui/Button";
import {FcEmptyTrash} from "react-icons/fc";
import {MdEdit} from "react-icons/md";
import {toast} from "react-toastify";

function TasksPage() {
    const [page, setPage] = useState(0);
    const [response, setResponse] = useState<TasksAllResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllTasks(page);
            setResponse(data);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks(page);
    }, [page]);

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }
    if (loading) {
        return <div className="text-gray-500">Cargando tareas...</div>;
    }
    if (!response) {
        return <div>No hay tareas.</div>;
    }

    const handleDelete = async (id: number) => {
        try {
            await deleteTask(id);
            fetchTasks(page);
            toast.success("Tarea eliminada correctamente");
        } catch (error) {
            toast.error("Error al eliminar la tarea");
        }
    }

    const handleCompleteTask = async (id: number) => {
        try {
            await completeTask(id);
            toast.success("Tarea completada correctamente");
            fetchTasks(page);
        } catch (error) {
            toast.error("Error al completar la tarea");
        }
    }
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Gestión de Tareas</h2>
            <div className="flex justify-end">
                <Link href="tasks/new">
                    <Button name="Asignar nueva tarea"/>
                </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {response.content.map((task) => (
                    <div key={task.id}
                         className="bg-white shadow rounded-lg p-4 flex flex-col gap-2">
                        <div className="flex justify-end gap-2 mb-2">
                            <Link href={`tasks/edit/${task.id}`}>
                                <button
                                    type="button"
                                    className="p-1 rounded hover:bg-blue-100 transition"
                                    title="Editar"
                                >
                                    <MdEdit className="text-blue-500 w-6 h-6"/>
                                </button>
                            </Link>
                            <button
                                type="button"
                                className="p-1 rounded hover:bg-red-100 transition"
                                title="Borrar"
                                onClick={() => handleDelete(task.id)}
                            >
                                <FcEmptyTrash className="w-6 h-6"/>
                            </button>
                        </div>
                        <h3 className="text-lg font-semibold text-blue-700">{task.title}</h3>
                        <p className="text-gray-600">{task.description}</p>
                        <div className="flex items-center justify-between mt-2">
                            <span
                                className={`text-xs px-2 py-1 rounded-full ${task.completed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                {task.completed ? "Completada" : "Pendiente"}
                            </span>
                            {!task.completed && (
                                <button
                                    onClick={() => handleCompleteTask(task.id)}
                                    className="px-2 py-1 cursor-pointer bg-green-500 text-white text-xs rounded hover:bg-green-700 transition"
                                >
                                    Completar
                                </button>
                            )}
                        </div>
                        <div className="mt-4">
                            <span
                                className="text-xs text-gray-500 uppercase">Usuario: {task.username}</span>
                        </div>
                    </div>
                ))}
            </div>
            {/* Paginación */}
            <div className="flex justify-center items-center gap-4 mt-8">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={response.first}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Anterior
                </button>
                <span className="text-sm">
                        Página {response.page + 1} de {response.totalPages}
                    </span>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={response.last}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}

export default TasksPage;