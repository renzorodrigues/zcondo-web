import { createError } from 'h3'

export interface LoginPayload {
    username: string
    password: string
}

export interface LoginResponse {
    data: {
        token: {
            access_token: string
            refresh_token: string
            token_type: string
            expires_in: number
            refresh_expires_in: number
        }
        user: {
            username: string
            name: string
            email: string
            avatar: string | null
            roles: string[]
        }
    }
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    const config = useRuntimeConfig()
    try {
        const data = await $fetch<LoginResponse>('/api/v1/authentication/login', {
            baseURL: config.public.apiBase,
            method: 'POST',
            body: payload,
            credentials: 'include'
        })

        return data
    } catch (err) {
        throw createError({ statusCode: 401, statusMessage: 'Login inválido', cause: err })
    }
}

export async function checkActivation(email: string): Promise<boolean> {
    const config = useRuntimeConfig()
    try {
        const result = await $fetch<boolean>(`/api/v1/users/check-activation/${email}`, {
            baseURL: config.public.apiBase
        })

        return result === true
    } catch (err) {
        throw createError({ statusCode: 400, statusMessage: 'Erro ao verificar ativação', cause: err })
    }
}
