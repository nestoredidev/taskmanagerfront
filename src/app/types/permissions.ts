import z from 'zod'

export const permissionSchema = z.object({
    id: z.number(),
    name: z.string()
})

export const newPermissionSchema = z.object({
    name: z.string().min(3, {message: "El nombre del permiso debe tener al menos 3 caracteres"}).max(50, {message: "El nombre del permiso debe tener como máximo 50 caracteres"})
})

export const newPermissionsResponse = z.object({
    code: z.number(),
    message: z.string(),
    content: z.array(permissionSchema)
})

export const permissionsResponse = z.object({
    code: z.number(),
    message: z.string(),
    content: z.array(permissionSchema),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    first: z.boolean(),
    last: z.boolean(),
    hasNext: z.boolean(),
    hasPrevious: z.boolean()
})

export type Permission = z.infer<typeof permissionSchema>
export type PermissionsResponse = z.infer<typeof permissionsResponse>
export type newPermissionsResponse = z.infer<typeof newPermissionsResponse>