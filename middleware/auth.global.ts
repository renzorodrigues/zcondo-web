export default defineNuxtRouteMiddleware(async (to, from) => {
    const auth = useAuthStore()

    // Verificação no servidor
    // if (import.meta.server) {
    //     const refreshToken = useCookie('refresh_token').value
    //     const user = useCookie<User | null>('user').value

    //     // Se tem refresh token ou user armazenado, está autenticado
    //     const isAuthenticated = refreshToken && user ? true : false

    //     if (isAuthenticated && !user?.profileCompleted && to.path !== '/app/profile/complete') {
    //         // Se não tem o perfil completo e está tentando acessar /app, redireciona para /app/complete-profile
    //         return navigateTo('/app/profile/complete')
    //     }

    //     // Se autenticado e tentando acessar fora de /app, redireciona
    //     if (isAuthenticated && user?.profileCompleted && (!to.path.startsWith('/app') || to.path === '/app/profile/complete')) {
    //         return navigateTo('/app')
    //     }

    //     // Se não autenticado e tentando acessar /app, redireciona para login
    //     if (!isAuthenticated && to.path.startsWith('/app')) {
    //         return navigateTo('/auth/login')
    //     }

    //     return
    // }
})