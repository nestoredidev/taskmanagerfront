"use server"
import {getSession} from "@/app/utilis/auth";
import {
    createTaskRequest,
    CreateTaskRequest, taskResponse,
    tasksAllResponse, updateTaskRequest, UpdateTaskRequest
} from "@/app/types/tasks";

export async function getAllTasks(page = 0, size = 6) {
    const {token} = await getSession()
    const url = `${process.env.NEXT_PUBLIC_API_URL}/task/all?page=${page}&size=${size}`
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    })
    if (!res.ok) {
        throw new Error('Failed to fetch tasks')
    }

    const data = await res.json()
    const parsed = tasksAllResponse.safeParse(data)
    if (!parsed.success) {
        throw new Error('Invalid tasks response')
    }
    return parsed.data
}

type PrevState = {
    errors: string[];
    success?: string;
    data?: CreateTaskRequest;
}

export async function createTask(prevstate: PrevState, formdata: FormData) {
    const parseForm = createTaskRequest.safeParse({
        title: formdata.get('title'),
        description: formdata.get('description') || null,
        completed: formdata.get('completed') === 'on',
        user: {
            id: Number(formdata.get('userId'))
        }
    })
    if (!parseForm.success) {
        return {
            errors: parseForm.error.issues.map((i) => i.message),
            success: ''
        }
    }

    const {token} = await getSession()
    const url = `${process.env.NEXT_PUBLIC_API_URL}/task`
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(parseForm.data),
        cache: 'no-store'
    })
    if (!res.ok) {
        return {
            errors: [`Error creating task: ${res.statusText}`],
            success: ''
        }
    }
    return {
        errors: [],
        success: 'Task created successfully'
    }
}

type PrevStateU = {
    errors: string[];
    success?: string;
    data?: UpdateTaskRequest;
}

export async function updateTask(prevstate: PrevStateU, formdata: FormData, id: number) {

    const parseForm = updateTaskRequest.safeParse({
        title: formdata.get('title'),
        description: formdata.get('description'),
        completed: formdata.get('completed') === 'on',
    })

    if (!parseForm.success) {
        return {
            errors: parseForm.error.issues.map((i) => i.message),
            success: ''
        }
    }

    const {token} = await getSession()
    const url = `${process.env.NEXT_PUBLIC_API_URL}/task/${id}`
    const res = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(parseForm.data),
        cache: 'no-store'
    })
    if (!res.ok) {
        return {
            errors: [`Error updating task: ${res.statusText}`],
            success: ''
        }
    }
    return {
        errors: [],
        success: 'Tarea actualizada correctamente'
    }
}

export async function getTaskById(id: number) {
    const {token} = await getSession()
    const url = `${process.env.NEXT_PUBLIC_API_URL}/task/${id}`
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    })
    if (!res.ok) {
        throw new Error('Failed to fetch task')
    }

    const data = await res.json()
    const parsed = taskResponse.safeParse(data)
    if (!parsed.success) {
        throw new Error('Invalid task response')
    }
    console.log(parsed.data)
    return parsed.data.content[0]
}

export async function deleteTask(id: number) {
    const {token} = await getSession()
    const url = `${process.env.NEXT_PUBLIC_API_URL}/task/${id}`
    const res = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    })
    if (!res.ok) {
        throw new Error('Failed to delete task')
    }
    return {
        message: 'Tarea eliminada correctamente'
    }
}

export async function getTaskByIdClient(page = 0, size = 10) {
    const {token, userId} = await getSession()
    const url = `${process.env.NEXT_PUBLIC_API_URL}/task/by-user/${userId}?page=${page}&size=${size}`
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    })
    if (!res.ok) {
        throw new Error('Failed to fetch tasks')
    }

    const data = await res.json()
    const parsed = tasksAllResponse.safeParse(data)
    if (!parsed.success) {
        throw new Error('Invalid tasks response')
    }
    return parsed.data

}

export async function completeTask(id: number) {
    const {token} = await getSession()
    const url = `${process.env.NEXT_PUBLIC_API_URL}/task/complete/${id}`
    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    })
    if (!res.ok) {
        throw new Error('Failed to complete task')
    }
    return {
        message: 'Tarea completada correctamente'
    }
}