import z from 'zod'

export const loginRequest = z.object({
	username: z.string().min(3).max(20),
	password: z.string().min(4).max(100),
})
export const loginResponse = z.object({
	id: z.string(),
	role: z.enum(['ROLE_ADMIN', 'ROLE_USER', 'ROLE_INVITED']),
	username: z.string(),
	message: z.string(),
	token: z.string(),
	status: z.boolean(),
})

export type LoginRequest = z.infer<typeof loginRequest>
export type LoginResponse = z.infer<typeof loginResponse>
