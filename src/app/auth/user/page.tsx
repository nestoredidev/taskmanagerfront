"use client";
import {useEffect, useState} from "react";
import {TasksAllResponse, Task} from "@/app/types/tasks";
import {getTaskByIdClient, completeTask} from "@/app/acction/tasks-acctions";
import {toast} from "react-toastify";

export function UserPage() {
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tasks, setTasks] = useState<TasksAllResponse | null>(null);

    const fetchTasks = async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTaskByIdClient(page);
            setTasks(data);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks(page);
    }, [page]);

    const handleCompleteTask = async (id: number) => {
        try {
            await completeTask(id);
            toast.success("Tarea completada correctamente");
            fetchTasks(page);
        } catch (error) {
            toast.error("Error al completar la tarea");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Cargando...</span>
        </div>
    );
    if (error) return <div>{error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Tus tareas</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tasks?.content.length ? tasks.content.map((task: Task) => (
                    <div key={task.id} className="bg-white shadow rounded-lg p-4 flex flex-col gap-2">
                        <h3 className="text-lg font-semibold text-blue-700">{task.title}</h3>
                        <p className="text-gray-600">{task.description}</p>
                        <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${task.completed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
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
                            <span className="text-xs text-gray-500 uppercase">Usuario: {task.username}</span>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full text-center text-gray-500">No hay tareas.</div>
                )}
            </div>
            {/* Paginación */}
            <div className="flex justify-center items-center gap-4 mt-8">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={tasks?.first}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Anterior
                </button>
                <span className="text-sm">
                    Página {tasks ? tasks.page + 1 : 1} de {tasks ? tasks.totalPages : 1}
                </span>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={tasks?.last}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}

export default UserPage;