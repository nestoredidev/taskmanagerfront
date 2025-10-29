"use client"
import Link from "next/link";
import {logout} from "../../auth/logout/route";
import type {Role} from "../../utilis/auth";
import {usePathname} from "next/navigation";
import {useState} from "react";
import {FcManager} from "react-icons/fc";

export default function Navbar({role}: { role: Role | null | undefined }) {
    const pathName = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const isActive = (path: string) => pathName?.includes(path);

    return (
        <nav className="bg-gradient-to-r from-sky-600 to-sky-500 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link
                            href="/auth/admin"
                            className="text-white font-bold text-xl lg:text-2xl hover:text-sky-200 transition-colors duration-200"
                        >
                            TaskManager
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {(role === "USER" || role === "ADMIN") && (
                            <Link
                                href="/auth/profile"
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                                    isActive('/admin/profile')
                                        ? 'bg-white text-sky-600'
                                        : 'text-white hover:bg-white hover:bg-opacity-20'
                                }`}
                            >
                                <FcManager className={'w-6 h-6 text-white'}/>
                            </Link>
                        )}
                        {role === "ADMIN" && (
                            <>
                                <Link
                                    href="/auth/admin/tasks"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        isActive('/admin/tasks')
                                            ? 'bg-white text-sky-600 shadow-md'
                                            : 'text-white hover:bg-white hover:bg-opacity-20 hover:text-white'
                                    }`}
                                >
                                    Tareas
                                </Link>
                                <Link
                                    href="/auth/admin/users"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        isActive('/admin/users')
                                            ? 'bg-white text-sky-600 shadow-md'
                                            : 'text-white hover:bg-white hover:bg-opacity-20 hover:text-white'
                                    }`}
                                >
                                    Usuarios
                                </Link>
                                <Link
                                    href="/auth/admin/roles"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        isActive('/admin/roles')
                                            ? 'bg-white text-sky-600 shadow-md'
                                            : 'text-white hover:bg-white hover:bg-opacity-20 hover:text-white'
                                    }`}
                                >
                                    Roles
                                </Link>
                                <Link
                                    href="/auth/admin/permissions"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        isActive('/admin/permissions')
                                            ? 'bg-white text-sky-600 shadow-md'
                                            : 'text-white hover:bg-white hover:bg-opacity-20 hover:text-white'
                                    }`}
                                >
                                    Permisos
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Desktop Logout Button */}
                    <div className="hidden md:block">
                        <form action={logout}>
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none"
                                     stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round"
                                          strokeLinejoin="round" strokeWidth={2}
                                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                </svg>
                                Cerrar Sesión
                            </button>
                        </form>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
                            aria-expanded="false"
                        >
                            <svg className="h-6 w-6" stroke="currentColor"
                                 fill="none" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round"
                                          strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
                                ) : (
                                    <path strokeLinecap="round"
                                          strokeLinejoin="round" strokeWidth={2}
                                          d="M4 6h16M4 12h16M4 18h16"/>
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div
                    className={`md:hidden transition-all duration-300 ease-in-out ${
                        isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                    }`}>
                    <div
                        className="px-2 pt-2 pb-3 space-y-1 bg-sky-600 rounded-b-lg">
                        {(role === "USER" || role === "ADMIN") && (
                            <Link
                                href="/auth/admin/profile"
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                                    isActive('/admin/profile')
                                        ? 'bg-white text-sky-600'
                                        : 'text-white hover:bg-white hover:bg-opacity-20'
                                }`}
                            >
                                <FcManager className={'w-6 h-6 text-white'}/>
                            </Link>
                        )}
                        {role === "ADMIN" && (
                            <>
                                <Link
                                    href="/auth/admin/tasks"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                                        isActive('/admin/tasks')
                                            ? 'bg-white text-sky-600'
                                            : 'text-white hover:bg-white hover:bg-opacity-20'
                                    }`}
                                >
                                    Tareas
                                </Link>
                                <Link
                                    href="/auth/admin/users"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                                        isActive('/admin/users')
                                            ? 'bg-white text-sky-600'
                                            : 'text-white hover:bg-white hover:bg-opacity-20'
                                    }`}
                                >
                                    Usuarios
                                </Link>
                                <Link
                                    href="/auth/admin/roles"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                                        isActive('/admin/roles')
                                            ? 'bg-white text-sky-600'
                                            : 'text-white hover:bg-white hover:bg-opacity-20'
                                    }`}
                                >
                                    Roles
                                </Link>
                                <Link
                                    href="/auth/admin/permissions"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                                        isActive('/admin/permissions')
                                            ? 'bg-white text-sky-600'
                                            : 'text-white hover:bg-white hover:bg-opacity-20'
                                    }`}
                                >
                                    Permisos
                                </Link>
                            </>
                        )}

                        {/* Mobile Logout */}
                        <div className="pt-2 border-t border-sky-500">
                            <form action={logout}>
                                <button
                                    type="submit"
                                    className="w-full flex items-center px-3 py-2 text-left bg-red-500 hover:bg-red-600 text-white text-base font-medium rounded-md transition-colors duration-200"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none"
                                         stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                    </svg>
                                    Cerrar Sesión
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}