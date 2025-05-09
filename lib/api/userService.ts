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