// plugins/piniaPersist.client.ts
import { defineNuxtPlugin } from '#app'
import type { Pinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
    const pinia = nuxtApp.$pinia as Pinia
    pinia.use(persist)
})