import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    port: 3005
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || 'postgresql://etv_admin:EtvDbPassword2026SecureKey99@159.195.13.43:5433/panel_evoluciontv',
    sessionSecret: process.env.NUXT_SESSION_SECRET || 'etv-portal-secret-encryption-key-2026-min-32-chars-long!',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    public: {
      newsApiUrl: process.env.NUXT_PUBLIC_NEWS_API_URL || 'https://cms-etv.webia.studio',
      newsApiKey: process.env.NUXT_PUBLIC_NEWS_API_KEY || ''
    }
  },
  app: {
    head: {
      title: 'Evolución TV | Noticias y Televisión Independiente',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Plataforma oficial de noticias, investigación y señal en vivo de Evolución TV.' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  }
})
