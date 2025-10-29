"use server";
import {
    newPermissionSchema, newPermissionsResponse,
    permissionSchema,
    permissionsResponse
} from "@/app/types/permissions";
import {getSession} from "@/app/utilis/auth";

export async function getAllPermissions(page = 0, size = 10) {
    const {token} = await getSession();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/permissions/all?page=${page}&size=${size}`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        cache: "no-store",
    });
    if (!res.ok) throw new Error(`Error fetching permissions: ${res.statusText}`);
    const data = await res.json();
    const parsed = permissionsResponse.safeParse(data);
    if (!parsed.success) throw new Error("Invalid permissions response");
    return parsed.data;
}

type PrevState = {
    errors: string[];
    success?: string;
    data?: newPermissionsResponse;
}

export async function createPermission(
    prevState: PrevState,
    formdata: FormData
): Promise<PrevState> {
    const parseForm = newPermissionSchema.safeParse({
        name: formdata.get("name"),
    });

    if (!parseForm.success) {
        return {
            errors: parseForm.error.issues.map((i) => i.message),
            success: "",
        };
    }

    const {token} = await getSession();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/permissions`;
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(parseForm.data),
        cache: "no-store",
    });
    if (!res.ok) {
        return {
            errors: [`Error creating permission: ${res.statusText}`],
            success: "",
        };
    }
    const data = await res.json();
    console.log(data)
    const parsed = newPermissionsResponse.safeParse(data);
    if (!parsed.success) {
        return {
            errors: ["Invalid create permission response"],
            success: "",
        };
    }
    return {
        errors: [],
        success: parsed.data.message,
        data: parsed.data,
    };
}

export async function updatePermission(prevState: PrevState, formdata: FormData, id: number) {
    const parseForm = newPermissionSchema.safeParse({
        name: formdata.get("name"),
    });

    if (!parseForm.success) {
        return {
            errors: parseForm.error.issues.map((i) => i.message),
            success: "",
        };
    }
    const {token} = await getSession();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/permissions/${id}`;
    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(parseForm.data),
        cache: "no-store",
    });
    if (!res.ok) {
        return {
            errors: [`Error updating permission: ${res.statusText}`],
            success: "",
        };
    }
    const data = await res.json();
    const parsed = newPermissionsResponse.safeParse(data);
    if (!parsed.success) {
        return {
            errors: ["Invalid update permission response"],
            success: "",
        };
    }
    return {
        errors: [],
        success: parsed.data.message,
        data: parsed.data,
    };
}

export async function getPermissionById(id: number) {
    const {token} = await getSession();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/permissions/${id}`;
    const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            cache: "no-store",
        }
    );
    if (!res.ok) throw new Error(`Error fetching permission: ${res.statusText}`);
    const data = await res.json();
    const parsed = newPermissionsResponse.safeParse(data);
    if (!parsed.success) throw new Error("Invalid permission response");

    return parsed.data.content[0];
}

export async function deletePermission(id: number) {
    const {token} = await getSession();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/permissions/${id}`;
    const res = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            cache: "no-store",
        }
    );
    if (!res.ok) throw new Error(`Error deleting permission: ${res.statusText}`);
    return {
        message: "Permiso eliminado exitósamente",
    };
}