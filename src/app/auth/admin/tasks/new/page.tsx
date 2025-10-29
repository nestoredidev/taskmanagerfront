"use client"
import React, {useEffect, useState} from 'react';
import {useActionState} from "react";
import {Users} from "@/app/types/users";
import {getUsersByName} from "@/app/acction/users-acction";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import {createTask} from "@/app/acction/tasks-acctions";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import {FcLeft} from "react-icons/fc";
import Link from "next/link";

function NewTasks() {
    const [username, setUsername] = useState('');
    const [users, setUsers] = useState<Users | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const router = useRouter();

    const [state, dispacth] = useActionState(createTask, {
        errors: [],
        success: "",
    });

    useEffect(() => {
        if (username.trim() === '') {
            setUsers(null);
            return;
        }
        const fetchUsers = async () => {
            const data = await getUsersByName(username);
            setUsers(data);
        };
        fetchUsers();
    }, [username]);

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
            <form className="space-y-4" action={dispacth}>
                <h2 className="text-2xl font-bold mb-4 text-center">Nueva
                    Tarea</h2>
                <div>
                    <label htmlFor="title"
                           className="block text-sm font-medium mb-1">Título de
                        la tarea</label>
                    <Input id="title" name="title"
                           placeholder="Título de la tarea..."
                           className="w-full" required/>
                </div>
                <div>
                    <label htmlFor="description"
                           className="block text-sm font-medium mb-1">Descripción
                        de la tarea</label>
                    <Input id="description" name="description"
                           placeholder="Descripción de la tarea..."
                           className="w-full"/>
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="completed"
                           className="text-sm">Completada</label>
                    <input id="completed" name="completed" type="checkbox"/>
                </div>
                <div>
                    <label htmlFor="username"
                           className="block text-sm font-medium mb-1">Buscar
                        usuario</label>
                    <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Buscar usuario..."
                        className="w-full"
                        autoComplete="off"
                    />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mt-4 mb-2">Usuarios a
                        asignar</h3>
                    <ul className="bg-gray-50 rounded p-2 max-h-40 overflow-y-auto">
                        {users?.content.length
                            ? users.content.map((item) => (
                                <li
                                    key={item.id}
                                    className={`py-1 px-2 hover:bg-gray-100 rounded cursor-pointer ${selectedUserId === item.id ? "bg-blue-100 font-bold" : ""}`}
                                    onClick={() => setSelectedUserId(item.id)}
                                >
                                    {item.username}
                                </li>
                            ))
                            : <li className="text-gray-400">No hay usuarios</li>
                        }
                    </ul>
                    {/* Campo oculto para enviar el userId seleccionado */}
                    <input type="hidden" name="userId"
                           value={selectedUserId ?? ""} required/>
                </div>
                <Button name="Crear Tarea"/>
            </form>
        </div>
    );
}

export default NewTasks;