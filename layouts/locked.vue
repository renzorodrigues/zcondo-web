<template>
    <div class="min-h-screen bg-gray-100">
        <header class="w-full px-4 py-3 bg-white shadow flex justify-end">
            <ClientOnly>
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <div class="flex items-center">
                            <Avatar class="w-8 h-8 mr-2" size="sm">
                                <AvatarFallback>{{ initials }}</AvatarFallback>
                            </Avatar>
                            <span class="text-sm font-medium text-gray-800 cursor-default">
                                {{ user?.name }}
                            </span>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="w-48">
                        <DropdownMenuLabel>{{ user?.email }}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem @click="logout" class="cursor-pointer" aria-checked="false">
                            <span class="flex items-center">
                                <LucideLogOut class="w-4 h-4 mr-2" aria-hidden="true" /> Sair
                            </span>
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </ClientOnly>
        </header>

        <main class="flex items-center justify-center p-6">
            <NuxtPage />
        </main>
    </div>
</template>

<script setup lang="ts">
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LucideLogOut } from 'lucide-vue-next'

const auth = useAuthStore()
const user = useCookie<User | null>('user')

const initials = computed(() => {
    const name = user.value?.name || ''
    return name
        .split(' ')
        .filter(Boolean)
        .map((n: string) => n[0])
        .filter((_: string, i: number, arr: string[]) => i === 0 || i === arr.length - 1)
        .join('')
        .toUpperCase()
})

const logout = () => {
    auth.logout()
}
</script>