"use server";

import {loginRequest, loginResponse, LoginResponse} from "@/app/types/Login";
import {cookies} from "next/headers";

type ActionStateType = {
    errors: string[];
    data: LoginResponse;
    success?: string;
};

export async function loginAcction(prevState: ActionStateType, formData: FormData) {
    const parsedForm = loginRequest.safeParse({
        username: formData.get("username"),
        password: formData.get("password"),
    });

    if (!parsedForm.success) {
        return {
            errors: parsedForm.error.issues.map((i) => i.message),
            data: prevState.data,
            success: "",
        };
    }

    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
        const res = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(parsedForm.data),
            cache: "no-store",
        });

        if (!res.ok) {
            return {
                errors: ["Error en la solicitud"],
                data: prevState.data,
                success: ""
            };
        }

        const data = await res.json();
        const parsed = loginResponse.safeParse(data);
        if (!parsed.success) {
            return {
                errors: ["Respuesta inválida del servidor"],
                data: prevState.data,
                success: ""
            };
        }

        const {token, role, id} = parsed.data; // role viene como "ROLE_ADMIN" | "ROLE_USER"

        // Cookie del token (HTTP-only)
        (await cookies()).set("token", token, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 días
            secure: process.env.NODE_ENV === "production",
        });

        // Cookie del rol (sin decodificar JWT)
        (await cookies()).set("role", role, {
            httpOnly: true, // la leerás en server (layouts/middleware)
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            secure: process.env.NODE_ENV === "production",
        });

        (await cookies()).set("id", id, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            secure: process.env.NODE_ENV === "production",
        });

        return {
            errors: [],
            data: parsed.data, // { status, token, role, username, ... }
            success: "Inicio de sesión exitoso",
        };
    } catch {
        return {
            errors: ["Error inesperado"],
            data: prevState.data,
            success: ""
        };
    }
}
