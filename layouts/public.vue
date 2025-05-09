<template>
    <div class="min-h-screen flex flex-col bg-gray-50">
      <header class="bg-white shadow p-4">
        <div class="container mx-auto flex justify-between items-center">
          <NuxtLink to="/" class="text-xl font-bold text-blue-600">ZCondo</NuxtLink>
  
          <div>
            <NuxtLink to="/auth/login" class="text-blue-600 hover:underline mr-4">Login</NuxtLink>
            <NuxtLink to="/auth/register" class="text-blue-600 hover:underline">Registrar</NuxtLink>
          </div>
        </div>
      </header>
  
      <main class="flex-1 container mx-auto p-4">
        <NuxtPage />
      </main>
  
      <footer class="bg-white text-center p-4 text-sm text-gray-500">
        &copy; 2025 ZCondo. Todos os direitos reservados.
      </footer>
    </div>
  </template>
  