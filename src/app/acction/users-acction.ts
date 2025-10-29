"use server"
import {getSession} from "@/app/utilis/auth";
import {
    CreateUserRequest,
    createUserRequest,
    profileSchema,
    userSchema,
    usersResponse
} from "@/app/types/users";
import {CreateTaskRequest} from "@/app/types/tasks";

export async function getUsersByName(username: string) {
    const {token} = await getSession()
    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/username?username=${username}`
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    })
    if (!res.ok) {
        throw new Error('Failed to fetch users')
    }

    const data = await res.json()
    const parsed = userSchema.safeParse(data)
    if (!parsed.success) {
        throw new Error('Invalid users response')
    }
    return parsed.data
}

export async function getUserProfile() {
    const {token, userId} = await getSession()
    const url = `${process.env.NEXT_PUBLIC_API_URL}/users/profile/${userId}`
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application-json',
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    })

    if (!res.ok) {
        throw new Error("Failed to fetch users")
    }
    const data = await res.json()
    const parsed = profileSchema.safeParse(data)
    if (!parsed.success) {
        throw new Error('Failed to fetch users')
    }
    console.log(parsed)
    return parsed.data
}

export async function getAllUsers(page = 0, size = 10) {
    const {token} = await getSession()
    const url = `${process.env.NEXT_PUBLIC_API_URL}/users/all?page=${page}&size=${size}`
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    })
    if (!res.ok) {
        throw new Error('Failed to fetch users')
    }

    const data = await res.json()
    const parsed = usersResponse.safeParse(data)
    if (!parsed.success) {
        throw new Error('Invalid users response')
    }
    return parsed.data
}

type PrevState = {
    errors: string[];
    data?: CreateUserRequest;
    success?: string;
}

export async function createUser(prevState: PrevState, formData: FormData) {
    const role = formData.get('roleRequest');
    const parsedForm = createUserRequest.safeParse({
        username: formData.get('username'),
        password: formData.get('password'),
        roleRequest: {
            roleListName: [role]
        }
    })

    if (!parsedForm.success) {
        return {
            errors: parsedForm.error.issues.map((i) => i.message),
            data: prevState.data,
            success: "",
        };
    }
    try {
        const {token} = await getSession()
        const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/register`
        console.log(parsedForm.data)
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(parsedForm.data),
            cache: 'no-store'
        })

        if (!res.ok) {
            return {
                errors: ['Error en la solicitud'],
                data: prevState.data,
                success: ""
            }
        }

        return {
            errors: [],
            success: "Usuario creado correctamente"
        }

    } catch (error) {
        return {
            errors: ['Error en la solicitud'],
            data: prevState.data,
            success: ""
        }
    }
}


export async function deleteUser(id: number) {
    const {token} = await getSession()
    const url = `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`
    const res = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    })
    if (!res.ok) {
        throw new Error('Failed to delete user')
    }
    return {
        message: 'Usuario eliminado correctamente'
    }
}