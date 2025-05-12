<script setup lang="ts">

definePageMeta({
  layout: 'landing',
})


import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import { LucideEye, LucideEyeClosed, Loader2, UserCheck } from 'lucide-vue-next'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Toaster } from '@/components/ui/toast'

const { register } = useAuthStore()

const registered = ref(false)
const apiError = ref('')
const loading = ref(false)
const showPassword = ref(false)
const email = ref('')

const rawSchema = z
  .object({
    firstname: z.string().min(3, { message: 'O nome deve ter no mínimo 3 caracteres' }).max(50),
    lastname: z.string().min(3, { message: 'O sobrenome deve ter no mínimo 3 caracteres' }).max(50),
    email: z.string().email({ message: 'Digite um e-mail válido' }),
    password: z.string()
    .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
    .regex(/[A-Z]/, { message: 'A senha deve ter pelo menos uma letra maiúscula' })
    .regex(/[a-z]/, { message: 'A senha deve ter pelo menos uma letra minúscula' })
    .regex(/[0-9]/, { message: 'A senha deve ter pelo menos um número' })
    .max(50),
    confirmPassword: z
      .string()
      .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
      .max(50),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'As senhas não coincidem',
        path: ['confirmPassword'],  // atribui o erro ao campo confirmPassword
      })
    }
  })

const formSchema = toTypedSchema(rawSchema)

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    apiError.value = ''
    await register(
      values.firstname,
      values.lastname,
      values.email,
      values.password,
      values.confirmPassword)

    email.value = values.email
    registered.value = true
  } catch (err) {
    console.error(err)
    apiError.value = 'Erro ao cadastrar usuário'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="!registered" class="w-full p-5 pt-20 px-4">
    <Card class="mx-auto max-w-lg w-full">
      <CardHeader>
        <CardTitle class="text-2xl">Cadastro</CardTitle>
        <CardDescription>Entre com seu e-mail para acessar sua conta</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="grid gap-2" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="firstname" :validate-on-model-update="!isFieldDirty">
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="lastname" :validate-on-model-update="!isFieldDirty">
            <FormItem>
              <FormLabel>Sobrenome</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="email" :validate-on-model-update="!isFieldDirty">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password" :validate-on-model-update="!isFieldDirty">
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <div class="relative w-full">
                  <Input :type="showPassword ? 'text' : 'password'" v-bind="componentField" />
                  <span v-if="componentField.modelValue"
                    class="absolute end-0 inset-y-0 flex items-center justify-center pr-3 cursor-pointer text-muted-foreground"
                    @click="showPassword = !showPassword">
                    <component :is="showPassword ? LucideEyeClosed : LucideEye" class="w-5 h-5" />
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="confirmPassword" :validate-on-model-update="!isFieldDirty">
            <FormItem>
              <FormLabel>Confirmar Senha</FormLabel>
              <FormControl>
                <Input type="password" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Toaster />
          <Button type="submit" class="bg-green-600 hover:bg-green-500" :disabled="loading">
            <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
            {{ loading ? 'Cadastrando...' : '14 Dias Grátis' }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
  <!-- Card de Cadastrado com sucesso -->
  <div v-if="registered" class="w-full p-5 pt-20 px-4">
    <Card class="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle class="text-2xl text-center">
          Cadastrado com sucesso!
        </CardTitle>
      </CardHeader>
      <CardContent class="flex flex-col items-center">
        <UserCheck class="w-12 h-12 text-green-600" />
        <p class="text-center mt-4">Foi enviado um email de ativação para {{ email }}</p>
      </CardContent>
    </Card>
  </div>
</template>
