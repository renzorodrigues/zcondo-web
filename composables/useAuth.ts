import { useRouter } from 'vue-router'
import { login as loginApi, checkActivation } from '@/lib/api/authService'

export function useAuth() {
    const router = useRouter()

    // Tokens e usuário autenticado
    const accessToken = useState<string | null>('access_token', () => null)
    const user = useState<{ name: string; email: string } | null>('user', () => null)

    // Login
    async function login(username: string, password: string) {
        try {
            const response = await loginApi({ username, password })

            accessToken.value = response.data.token.access_token

            user.value = {
                name: response.data.user.name,
                email: response.data.user.email
            }

            const isActivated = await checkActivation(response.data.user.email)

            if (isActivated) {
                router.push('/dashboard')
            } else {
                router.push('/complete-profile')
            }
        } catch (err) {
            console.error('Erro ao logar:', err)
            throw err
        }
    }

    // Refresh
    async function refresh() {
        try {
            const { data, error } = await useFetch<{
                data: {
                    token: {
                        access_token: string
                    }
                    user: {
                        name: string
                        email: string
                    }
                }
            }>('/api/v1/authentication/refresh', {
                method: 'POST',
                credentials: 'include'
            })

            if (error.value) throw new Error('Erro no refresh token.')

            accessToken.value = data.value?.data?.token.access_token ?? null
            user.value = data.value?.data?.user ?? null
        } catch (err) {
            console.error('Erro ao atualizar token:', err)
            logout()
        }
    }

    // 🚪 Logout com backend
    async function logout() {
        try {
            await $fetch('/api/v1/authentication/logout', {
                method: 'DELETE',
                credentials: 'include'
            })
        } catch (err) {
            console.warn('Erro ao deslogar no backend:', err)
        }

        accessToken.value = null
        user.value = null
        router.push('/login')
    }

    return {
        accessToken,
        user,
        login,
        refresh,
        logout
    }
}
