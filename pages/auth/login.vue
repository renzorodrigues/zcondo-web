<script setup lang="ts">

definePageMeta({
  public: true
})

import { z } from 'zod'
import { reactive, ref } from 'vue'
import { LucideEye, LucideEyeClosed, Loader2 } from 'lucide-vue-next'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const { login } = useAuthStore()

const form = reactive({
    email: '',
    password: ''
})

const errors = ref<{ email?: string[]; password?: string[] }>({})
const apiError = ref('')
const loading = ref(false)
const showPassword = ref(false)

const schema = z.object({
    email: z.string().email({ message: 'Digite um e-mail válido' }),
    password: z.string().min(3, { message: 'A senha deve ter no mínimo 6 caracteres' })
})

function validate() {
    const result = schema.safeParse(form)

    if (!result.success) {
        errors.value = result.error.flatten().fieldErrors
        return false
    }

    errors.value = {}
    return true
}

async function onSubmit() {
    apiError.value = ''
    if (!validate()) return

    loading.value = true

    try {
        const profileCompleted = await login(form.email, form.password)
        const router = useRouter()
        router.replace(profileCompleted ? '/app' : '/app/profile/complete')
    } catch (err) {
        apiError.value = 'Usuário ou senha inválidos.'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="w-full h-screen flex items-center justify-center px-4">
        <Card class="mx-auto max-w-sm w-full">
            <CardHeader>
                <CardTitle class="text-2xl">Login</CardTitle>
                <CardDescription>Entre com seu e-mail para acessar sua conta</CardDescription>
            </CardHeader>
            <CardContent>
                <form class="grid gap-4" @submit.prevent="onSubmit">
                    <div v-if="apiError" class="text-sm text-red-500 text-center -mt-2">
                        {{ apiError }}
                    </div>

                    <div class="grid gap-2">
                        <Label for="email">Email</Label>
                        <Input id="email" type="email" placeholder="seu@email.com" v-model="form.email"
                            :class="{ 'border-red-500': errors.email }" />
                        <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email[0] }}</p>
                    </div>

                    <div class="grid gap-2">
                        <div class="flex items-center">
                            <Label for="password">Senha</Label>
                            <NuxtLink to="/auth/forgot-password" class="ml-auto inline-block text-sm underline">
                                Esqueceu a senha?
                            </NuxtLink>
                        </div>
                        <div class="relative">
                            <Input id="password" :type="showPassword ? 'text' : 'password'" v-model="form.password"
                                :class="{ 'border-red-500': errors.password }" class="pr-10" />
                            <button v-if="form.password" type="button"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                @click="showPassword = !showPassword">
                                <component :is="showPassword ? LucideEyeClosed : LucideEye" class="w-5 h-5" />
                            </button>
                        </div>
                        <p v-if="errors.password" class="text-sm text-red-500">{{ errors.password[0] }}</p>
                    </div>

                    <Button type="submit" class="w-full" :disabled="loading">
                        <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
                        {{ loading ? 'Entrando...' : 'Entrar' }}
                    </Button>
                </form>

                <div class="mt-4 text-center text-sm">
                    Não tem uma conta?
                    <NuxtLink to="/auth/register" class="underline">Cadastre-se</NuxtLink>
                </div>
            </CardContent>
        </Card>
    </div>
</template>
