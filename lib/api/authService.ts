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
      profileCompleted: boolean
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
  } catch {
    throw createError({ statusCode: 401 })
  }
}

export async function refresh(): Promise<LoginResponse> {
  const config = useRuntimeConfig()

  try {
    const raw = await $fetch('/api/v1/authentication/refresh', {
      baseURL: config.public.apiBase,
      method: 'POST',
      credentials: 'include'
    })

    console.log('🔍 Resposta crua do refresh:', raw)

    return raw as LoginResponse // força o tipo sem travar o catch
  } catch (err: any) {
    console.error('❌ Erro real no refresh:', err)
    throw createError({ statusCode: 401, statusMessage: 'Erro ao renovar token', cause: err })
  }
}

export async function logout(): Promise<void> {
  const config = useRuntimeConfig()
  try {
    await $fetch('/api/v1/authentication/logout', {
      baseURL: config.public.apiBase,
      method: 'DELETE',
      credentials: 'include'
    })
  } catch (err) {
    throw createError({ statusCode: 500, statusMessage: 'Erro ao fazer logout', cause: err })
  }
}

// TESTE - PODE APAGAR DEPOIS
export async function protegido(): Promise<void> {
  const config = useRuntimeConfig()
  // await $fetch('/api/v1/authentication/protegido', {
  //   baseURL: config.public.apiBase,
  //   method: 'GET',
  //   credentials: 'include'
  // })
}