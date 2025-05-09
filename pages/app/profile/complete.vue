<script setup lang="ts">
import { Button } from '@/components/ui/button'
definePageMeta({
  layout: 'locked',
})

const auth = useAuthStore()

const protegido = () => {
    auth.protegido()
}
</script>

<template>
  <Button variant="outline" class="w-full" @click="protegido">
    <span class="text-sm font-medium">Protegido</span>
  </Button>
  <ClientOnly>
    <div v-if="auth.user" class="p-4">
      <h1 class="text-xl font-bold mb-4">Complete seu cadastro</h1>
      <p>Olá, {{ auth.user.name }} — complete suas informações abaixo.</p>
    </div>

    <div v-else class="p-4 text-sm text-muted-foreground">
      Carregando perfil...
    </div>
  </ClientOnly>
</template>
