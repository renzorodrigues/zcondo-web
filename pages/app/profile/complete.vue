<script setup lang="ts">
import { Button } from '@/components/ui/button'
definePageMeta({
  layout: 'locked',
})
</script>

<template>
  <Button variant="outline" class="w-full">
    <span class="text-sm font-medium">Protegido</span>
  </Button>
  <ClientOnly>
    <p>Olá, complete suas informações abaixo.</p>
  </ClientOnly>
</template>
