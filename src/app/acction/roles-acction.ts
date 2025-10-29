"use server";
import {getSession} from "@/app/utilis/auth";
import {
    newRoleRequest,
    NewRoleRequest,
    roleResponse,
    rolesResponse
} from "@/app/types/roles";

export async function getAllRoles(page = 0, size = 10) {
    const {token} = await getSession()
    const url = `${process.env.NEXT_PUBLIC_API_URL}/role/all?page=${page}&size=${size}`
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        cache: "no-store",
    })
    if (!res.ok) throw new Error(`Error fetching roles: ${res.statusText}`)
    const data = await res.json()
    const parsed = rolesResponse.safeParse(data)
    if (!parsed.success) throw new Error("Invalid roles response")
    return parsed.data
}

export async function getRoleById(id: number) {
    const {token} = await getSession()
    const url = `${process.env.NEXT_PUBLIC_API_URL}/role/${id}`
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        cache: "no-store",
    })
    if (!res.ok) throw new Error(`Error fetching role: ${res.statusText}`)
    const data = await res.json()
    const parsed = roleResponse.safeParse(data)
    if (!parsed.success) throw new Error("Invalid role response")
    return parsed.data
}

type  PrevState = {
    errors: string[];
    success?: string;
    data?: NewRoleRequest;
}

export async function createRole(prevstate: PrevState, formdata: FormData) {
    const parseForm = newRoleRequest.safeParse({
        roleEnum: formdata.get("name"),
        permissions: formdata.getAll("permissions") as string[],
    })
    if (!parseForm.success) {
        return {
            errors: parseForm.error.issues.map((i) => i.message),
            success: "",
        }
    }
    console.log(parseForm)

    const {token} = await getSession()
    const url = `${process.env.NEXT_PUBLIC_API_URL}/role`
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(parseForm.data),
        cache: "no-store",
    })
    if (!res.ok) {
        return {
            errors: [`Error creating role: ${res.statusText}`],
            success: "",
        }
    }

    const data = await res.json()

    return {
        errors: [],
        success: "Rol creado con éxito",
        data: data,
    }

}

export async function deleteRole(id: number) {
    const {token} = await getSession()
    const url = `${process.env.NEXT_PUBLIC_API_URL}/role/${id}`
    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        cache: "no-store",
    })
    if (!res.ok) {
        throw new Error(`Error deleting role: ${res.statusText}`)
    }
    return "Role deleted successfully"
}