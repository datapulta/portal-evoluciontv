<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderNav from '~/components/HeaderNav.vue'
import FooterSection from '~/components/FooterSection.vue'
import RadioPlayer from '~/components/RadioPlayer.vue'
import { useTheme } from '~/composables/useTheme'

const route = useRoute()
const isRadioPage = computed(() => route.path === '/radio')
const { isDark } = useTheme()

useHead({
  htmlAttrs: {
    class: () => isDark.value ? 'dark' : ''
  },
  script: [
    {
      children: `(function(){try{const t=localStorage.getItem('etv-theme');const d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&d)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()`,
      type: 'text/javascript'
    }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-200">
    <!-- Navegación y Cabecera -->
    <HeaderNav />

    <!-- Contenido Principal con Enrutador NuxtPage -->
    <main class="flex-1">
      <NuxtPage />
    </main>

    <!-- Pie de Página (oculto en /radio para una experiencia limpia) -->
    <FooterSection v-if="!isRadioPage" />

    <!-- Reproductor Flotante Persistente Evolución Radio -->
    <ClientOnly>
      <RadioPlayer v-if="!isRadioPage" />
    </ClientOnly>
  </div>
</template>
