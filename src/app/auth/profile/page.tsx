"use client"
import React, {useEffect, useState} from 'react';
import {getUserProfile} from "@/app/acction/users-acction";
import {UserProfile} from "@/app/types/users";
import {FcLeft} from "react-icons/fc";
import Link from "next/link";

function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const data = await getUserProfile();
            setProfile(data);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) return <div className="text-center py-8">Cargando...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div
            className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <Link href="/auth">
                    <span>
                        <FcLeft size={24}
                                className="hover:bg-indigo-200 rounded-md"/>
                    </span>
            </Link>
            <h1 className="text-2xl font-bold mb-4 text-sky-700">Mi perfil</h1>
            {profile?.content.map((item) => (
                <div key={item.id} className="mb-4">
                    <p className="text-lg font-semibold">Usuario: <span
                        className="font-normal">{item.username}</span></p>
                    <p className="mb-2">Rol: <span
                        className="font-medium text-sky-600">{item.role.roleEnum}</span>
                    </p>
                    <div>
                        <span className="font-semibold">Permisos:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {item.role.permissions.map(permission => (
                                <span
                                    key={permission}
                                    className="bg-sky-100 text-sky-700 px-2 py-1 rounded text-xs font-medium"
                                >
                                                                {permission}
                                                            </span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProfilePage;