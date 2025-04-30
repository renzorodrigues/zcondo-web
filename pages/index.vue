<script setup>
import { useUserStore } from '@/stores/userStore'

const user = useUserStore()

function handleLogin() {
  user.login('Renzo')
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Página Inicial</h1>

    <div v-if="!user.loggedIn">
      <button @click="handleLogin" class="bg-blue-600 text-white px-4 py-2 rounded">
        Entrar
      </button>
    </div>

    <div v-else>
      <p class="mb-2">Olá, {{ user.name }}!</p>
      <button @click="user.logout" class="bg-red-500 text-white px-4 py-2 rounded">
        Sair
      </button>
    </div>
  </div>
</template>

