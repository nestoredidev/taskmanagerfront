"use client";
import React, {useActionState, useEffect, useState} from 'react';
import Link from "next/link";
import {FcLeft} from "react-icons/fc";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import {Task, UpdateTaskRequest} from "@/app/types/tasks";
import {getTaskById, updateTask} from "@/app/acction/tasks-acctions";
import {useParams, useRouter} from "next/navigation";
import {toast} from "react-toastify";
import {updatePermission} from "@/app/acction/permission-acction";

type PrevStateU = {
    errors: string[];
    success?: string;
}

function EditTasksPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);
    const [task, setTask] = useState<Task | null>(null);

    useEffect(() => {
        const fetchTask = async () => {
            const data = await getTaskById(id);
            setTask(data);
        };
        fetchTask();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, type, checked} = e.target;
        setTask((prev) =>
            prev
                ? {
                    ...prev,
                    [name]: type === "checkbox" ? checked : value,
                }
                : prev
        );
    };

    const [state, dispatch] = useActionState(
        async (prevState: PrevStateU, formData: FormData) => {
            return await updateTask(prevState, formData, id);
        },
        {errors: [], success: ""}
    );

    useEffect(() => {
        if (state.errors && state.errors.length > 0) {
            state.errors.forEach(error => toast.error(error))
        }
        if (state.success) {
            toast.success(state.success)
            router.push('/auth/admin/tasks')
        }
    }, [state, router])


    return (
        <div
            className="space-y-6 max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
            <Link href="/auth/admin/tasks">
                <span>
                    <FcLeft size={24}
                            className="hover:bg-indigo-200 rounded-md"/>
                </span>
            </Link>
            <form className="space-y-4" action={dispatch}>
                <h2 className="text-2xl font-bold mb-4 text-center">Actualizar
                    Tarea</h2>
                <div>
                    <label htmlFor="title"
                           className="block text-sm font-medium mb-1">Título de
                        la tarea</label>
                    <Input
                        id="title"
                        name="title"
                        value={task?.title || ""}
                        onChange={handleChange}
                        placeholder="Título de la tarea..."
                        className="w-full"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description"
                           className="block text-sm font-medium mb-1">Descripción
                        de la tarea</label>
                    <Input
                        id="description"
                        name="description"
                        value={task?.description || ""}
                        onChange={handleChange}
                        placeholder="Descripción de la tarea..."
                        className="w-full"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="completed"
                           className="text-sm">Completada</label>
                    <input
                        id="completed"
                        name="completed"
                        type="checkbox"
                        checked={task?.completed || false}
                        onChange={handleChange}
                    />
                </div>
                <Button name="Actualizar"/>
            </form>
        </div>
    );
}

export default EditTasksPage;