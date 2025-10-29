import z from "zod";

export const taskSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().nullable(),
    completed: z.boolean(),
    userId: z.number(),
    username: z.string()
})

export const tasksAllResponse = z.object({
    code: z.number(),
    message: z.string(),
    content: z.array(taskSchema),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    first: z.boolean(),
    last: z.boolean(),
    hasNext: z.boolean(),
    hasPrevious: z.boolean()
})

export const createTaskRequest = z.object({
    title: z.string().min(1, {message: "El título es obligatorio"}),
    description: z.string().optional(),
    completed: z.boolean().optional(),
    user: z.object({
        id: z.number()
    })
})

export const updateTaskRequest = z.object({
    title: z.string().min(1, {message: "El título es obligatorio"}),
    description: z.string().optional(),
    completed: z.boolean().optional(),
})

export const taskResponse = z.object({
    code: z.number(),
    message: z.string(),
    content: z.array(taskSchema)

})

export type Task = z.infer<typeof taskSchema>;
export type TasksAllResponse = z.infer<typeof tasksAllResponse>;
export type CreateTaskRequest = z.infer<typeof createTaskRequest>;
export type UpdateTaskRequest = z.infer<typeof updateTaskRequest>;
export type TaskResponse = z.infer<typeof taskResponse>;

/*{
    "title": "Tarea de ejemplo para user 6",
    "description": "Descripción de la user 6",
    "completed": false,
    "user": {
    "id": 6
}*/

