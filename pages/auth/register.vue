<script setup lang="ts">

definePageMeta({
  layout: 'landing',
})


import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { h } from 'vue'
import { useForm } from 'vee-validate'
import { LucideEye, LucideEyeClosed, Loader2 } from 'lucide-vue-next'
import { GalleryVerticalEnd } from 'lucide-vue-next'
import { Search } from 'lucide-vue-next'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()

const { register } = useAuthStore()

const form = reactive({
  email: '',
  password: ''
})

const errors = ref<{ email?: string[]; password?: string[] }>({})
const apiError = ref('')
const loading = ref(false)
const showPassword = ref(false)

const rawSchema = z
  .object({
    firstname: z.string().min(3, { message: 'O nome deve ter no mínimo 3 caracteres' }).max(50),
    lastname: z.string().min(3, { message: 'O sobrenome deve ter no mínimo 3 caracteres' }).max(50),
    email: z.string().email({ message: 'Digite um e-mail válido' }),
    password: z.string().min(3, { message: 'A senha deve ter no mínimo 3 caracteres' }).max(50),
    confirmPassword: z
      .string()
      .min(3, { message: 'A senha deve ter no mínimo 3 caracteres' })
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
  toast({
    title: 'You submitted the following values:',
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
  })
  await register(
    values.firstname,
    values.lastname,
    values.email,
    values.password,
    values.confirmPassword)
})
</script>

<template>
  <div class="w-full p-5 pt-20 px-4">
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
          <Button type="submit" class="bg-green-600 hover:bg-green-500" @click="() => {
            toast({
              title: 'Scheduled: Catch up',
              description: 'Friday, February 10, 2023 at 5:57 PM',
            });
          }">
            14 Dias Grátis
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
  <!-- <div class="hidden lg:block">
      <img class="rounded-full transition-transform transform hover:scale-125" src="/public/img/buildings.png"
        alt="Starship starts the engine" loading="eager" format="avif" width="650" height="512" />
    </div> -->
</template>
