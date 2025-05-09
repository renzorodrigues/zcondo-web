import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { login as loginApi } from '@/lib/api/authService'
import { refresh as refreshApi } from '@/lib/api/authService'
import { logout as logoutApi } from '@/lib/api/authService'
import { checkActivation as checkActivationApi } from '@/lib/api/userService'
import { protegido as protegidoApi } from '@/lib/api/authService'

export interface User {
  username: string
  name: string
  email: string
  avatar: string | null
  roles: string[]
  profileCompleted: boolean
}

export const useAuthStore = defineStore('auth', () => {
  // STATE
  const accessToken = ref<string | null>(null)
  const user = ref<User | null>(null)
  const isRefreshing = ref(false)

  // GETTERS
  const isAuthenticated = computed(() => !!accessToken.value)

  // ACTIONS
  function setUser(newUser: User, refreshExpiresIn: number) {
    user.value = newUser
    const userCookie = useCookie('user', { maxAge: refreshExpiresIn });
    userCookie.value = JSON.stringify(newUser)
  }

  function clearUser() {
    user.value = null
    accessToken.value = null
    const userCookie = useCookie('user');
    userCookie.value = null;
    const isProfileCompletedCookie = useCookie('isProfileCompleted');
    isProfileCompletedCookie.value = null;
  }

  function setAccessToken(token: string) {
    accessToken.value = token
  }

  // LOGIN
  async function login(username: string, password: string): Promise<boolean> {
    const response = await loginApi({ username, password })
    response.data.user.profileCompleted = await checkActivationApi(response.data.user.email)
    setAccessToken(response.data.token.access_token)
    setUser(response.data.user, response.data.token.refresh_expires_in)
    return response.data.user.profileCompleted
  }

  // REFRESH
  async function refresh() {
    isRefreshing.value = true
    const response = await refreshApi()
    response.data.user.profileCompleted = await checkActivationApi(response.data.user.email)
    setAccessToken(response.data.token.access_token)
    setUser(response.data.user, response.data.token.refresh_expires_in)
    isRefreshing.value = false
  }

  // LOGOUT
  async function logout() {
    try {
      await logoutApi()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      clearUser()
      await navigateTo('/auth/login')
    }
  }

  // LOGOUT
  async function protegido() {
    await protegidoApi()
    const isProfileCompletedCookie = useCookie('isProfileCompleted')
    isProfileCompletedCookie.value = 'true'
  }

  return {
    accessToken,
    user,
    isAuthenticated,
    isRefreshing,
    setUser,
    clearUser,
    setAccessToken,
    login,
    refresh,
    logout,
    protegido
  }
}, {
  persist: import.meta.client
    ? {
      storage: localStorage,
      pick: ['user'],
    }
    : false,
})
