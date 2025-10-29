export type RoleEnum = "ADMIN" | "USER" | "INVITED";

import z from 'zod';

export const roleEnum = z.enum(["ADMIN", "USER", "INVITED"]);

export const roleSchema = z.object({
    id: z.number(),
    roleEnum: roleEnum,
    permissions: z.array(z.string())
});

export const newRoleRequest = z.object({
    roleEnum: roleEnum,
    permissions: z.array(z.string()).min(1, {message: "Debe asignar al menos un permiso al rol"})
});

export const rolesResponse = z.object({
    code: z.number(),
    message: z.string(),
    content: z.array(roleSchema),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    first: z.boolean(),
    last: z.boolean(),
    hasNext: z.boolean(),
    hasPrevious: z.boolean()
});

export const roleResponse = z.object({
    code: z.number(),
    message: z.string(),
    content: z.array(roleSchema)
});

/*{
    "code": 200,
    "message": "Role found with ID: 8",
    "content": [
    {
        "id": 8,
        "roleEnum": "INVITED",
        "permissions": [
            "READ"
        ]
    }
]
}*/
export type Role = z.infer<typeof roleSchema>;
export type RolesResponse = z.infer<typeof rolesResponse>;
export type NewRoleRequest = z.infer<typeof newRoleRequest>;
export type RoleResponse = z.infer<typeof roleResponse>;

