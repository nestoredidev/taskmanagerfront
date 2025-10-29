'use client'
import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function AdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setLoading(true);
            await fetch('/auth/logout', {method: 'POST', cache: 'no-store'});
            // Por si aún tienes algo en localStorage de etapas previas:
            localStorage.removeItem('token');
        } catch (e) {
            // opcional: mostrar toast de error
        } finally {
            setLoading(false);
            router.replace('/login');      // o '/auth/login' si esa es tu ruta
            router.refresh();              // fuerza re-render del árbol
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6 text-center text-sky-700">Panel
                    de
                    Administración</h1>
            </div>
            <div></div>
        </div>
    );
}
