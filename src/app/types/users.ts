import z from "zod";
import {roleSchema} from "@/app/types/roles";

export const userSchema = z.object({
    code: z.number(),
    message: z.string(),
    content: z.array(z.object({
        id: z.number(),
        username: z.string()
    })),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    first: z.boolean(),
    last: z.boolean(),
    hasNext: z.boolean(),
    hasPrevious: z.boolean()
})

export const permissionEnum = z.enum(["READ", "UPDATE", "CREATE", "DELETE"]);
export const roleEnum = z.enum(["ADMIN", "USER", "INVITED"]);

export const profileSchema = z.object({
    code: z.number(),
    message: z.string(),
    content: z.array(z.object({
        id: z.number(),
        username: z.string(),
        role: z.object({
            id: z.number(),
            roleEnum: z.string(),
            permissions: z.array(z.string())
        })
    }))
});


export const usersResponse = z.object({
    code: z.number(),
    message: z.string(),
    content: z.array(z.object({
        id: z.number(),
        username: z.string(),
        role: z.object({
            id: z.number(),
            roleEnum: z.string(),
            permissions: z.array(z.string())
        })
    })),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    first: z.boolean(),
    last: z.boolean(),
    hasNext: z.boolean(),
    hasPrevious: z.boolean()
})


export const createUserRequest = z.object({
    username: z.string().min(3, {message: "El nombre de usuario debe tener al menos 3 caracteres"}).max(20, {message: "El nombre de usuario debe tener como máximo 20 caracteres"}),
    password: z.string().min(8, {message: "La contraseña debe tener al menos 4 caracteres"}).max(100, {message: "La contraseña debe tener como máximo 100 caracteres"}),
    roleRequest: z.object({
        roleListName: z.array(z.string()).min(1, {message: "Debe asignar al menos un rol al usuario"})
    })
})


export type Users = z.infer<typeof userSchema>
export type UserProfile = z.infer<typeof profileSchema>
export type UsersResponse = z.infer<typeof usersResponse>
export type CreateUserRequest = z.infer<typeof createUserRequest>





