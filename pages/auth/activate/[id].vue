<script setup lang="ts">

definePageMeta({
    layout: 'landing',
})

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Check, LucideCheck } from 'lucide-vue-next'

const { activate } = useAuthStore()

const loading = ref(false)
const activated = ref(false)

const route = useRoute()

async function onSubmit() {
    loading.value = true
    try {
        const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
        await activate(id);
        activated.value = true
    } catch (err) {
        console.error(err)
        loading.value = false
    }
    loading.value = false
}
</script>

<template>
    <div v-if="!activated" class="w-full p-5 pt-20 px-4">
        <Card class="mx-auto max-w-sm w-full">
            <CardHeader>
                <CardTitle class="text-2xl">Ativação</CardTitle>
                <CardDescription>Ative a sua conta</CardDescription>
            </CardHeader>
            <CardContent>
                <Button @click="onSubmit" class="w-full" :disabled="loading">
                    <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
                    {{ loading ? 'Ativando...' : 'Ativar' }}
                </Button>
            </CardContent>
        </Card>
    </div>
    <div v-if="activated" class="w-full p-5 pt-20 px-4">
        <Card class="mx-auto max-w-sm w-full">
            <CardHeader>
                <CardTitle class="text-2xl text-center">Sua conta está ativada!</CardTitle>
            </CardHeader>
            <CardContent class="flex flex-col items-center">
                <LucideCheck class="w-12 h-12 text-green-600" />
            </CardContent>
        </Card>
    </div>
</template>
