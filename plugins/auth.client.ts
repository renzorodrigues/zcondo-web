export default defineNuxtPlugin(async (nuxtApp) => {
    const auth = useAuthStore()
    const router = useRouter()
    const route = useRoute()

    // Verifica se a rota atual é protegida (dentro de /app)
    const isProtectedRoute = route.path.startsWith('/app')

    if (!auth.isAuthenticated && isProtectedRoute) {
        try {
            await auth.refresh()
        } catch (error) {
            auth.logout()
            router.push('/auth/login')
        }
    }
})