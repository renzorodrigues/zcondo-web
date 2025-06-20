<script setup lang="ts">

definePageMeta({
    layout: 'landing',
})

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, AlertTriangle, LucideCheck } from 'lucide-vue-next'

const { activate } = useAuthStore()

const loading = ref(false)
const activated = ref(false)
const errorMessage = ref('')

const route = useRoute()

async function onSubmit() {
    loading.value = true
    errorMessage.value = ''
    try {
        const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
        await activate(id);
        activated.value = true
    } catch (err) {
        console.error(err)
        errorMessage.value = 'Código de ativação não encontrado ou já utilizado.'
    }
    finally {
        loading.value = false
    }
}
</script>

<template>
    <!-- Card de Ativação -->
    <div v-if="!activated && !errorMessage" class="w-full p-5 pt-20 px-4">
        <Card class="mx-auto max-w-sm w-full">
            <Button @click="onSubmit" class="w-full bg-green-600 hover:bg-green-500" :disabled="loading">
                <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
                {{ loading ? 'Ativando...' : 'Ativar Conta' }}
            </Button>
        </Card>
    </div>
    <!-- Card de Sucesso -->
    <div v-if="activated" class="w-full p-5 pt-20 px-4">
        <Card class="mx-auto max-w-sm w-full">
            <CardHeader>
                <CardTitle class="text-2xl text-center">
                    Conta ativada com sucesso!
                </CardTitle>
            </CardHeader>
            <CardContent class="flex flex-col items-center">
                <LucideCheck class="w-12 h-12 text-green-600" />
                <p class="text-center mt-4">Agora você pode fazer login.</p>
            </CardContent>
        </Card>
    </div>

    <!-- Card de Erro -->
    <div v-if="errorMessage" class="w-full p-5 pt-20 px-4">
        <Card class="mx-auto max-w-sm w-full">
            <CardHeader>
                <CardTitle class="text-2xl text-center">
                    Erro na ativação
                </CardTitle>
            </CardHeader>
            <CardContent class="flex flex-col items-center">
                <AlertTriangle class="w-12 h-12 text-red-600" />
                <p class="text-center mt-4 text-red-600">{{ errorMessage }}</p>
                <Button class="w-full mt-4" :disabled="loading">
                    <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
                    {{ loading ? 'Tentando novamente...' : 'Entre em contato' }}
                </Button>
            </CardContent>
        </Card>
    </div>
</template>
