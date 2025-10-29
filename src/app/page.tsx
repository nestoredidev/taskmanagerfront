export default function Home() {
    return (
        <div
            className="p-4 flex flex-col justify-center items-center h-screen bg-teal-400">
            <h1 className="text-5xl font-bold text-slate-800">
                Gestor de Tareas con Roles y Permisos
            </h1>
            <div
                className="flex flex-col justify-center items-center w-1/2 mt-6 bg-yellow-200 p-6 rounded-lg shadow-lg">
                <p className="mt-4 text-lg text-slate-900">
                    Bienvenido a la aplicación de gestión de tareas con roles y
                    permisos.
                </p>
                <p className="mt-2 text-lg text-slate-900">
                    Aquí puedes crear, asignar y gestionar tareas según los
                    roles definidos.
                </p>
            </div>
        </div>
    );
}
