// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['@/assets/css/tailwind.css'],

  modules: [
    '@pinia/nuxt',
    'shadcn-nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      apiBase: 'https://api.zcondo.com.br' //process.env.NUXT_PUBLIC_API_BASE
    }
  },

  compatibilityDate: '2025-04-29',
})