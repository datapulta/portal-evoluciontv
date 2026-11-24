<script setup lang="ts">
import SocialLinks from '~/components/SocialLinks.vue'

const currentYear = new Date().getFullYear()

const footerCategories = [
  { name: 'Portada Principal', to: '/' },
  { name: 'Coberturas ETV', to: '/categoria/coberturas-etv' },
  { name: 'Más bandas', to: '/categoria/mas-bandas' },
  { name: 'EvolucioNotas', to: '/categoria/evolucionotas' },
  { name: 'Señal en Vivo (24/7)', to: '/en-vivo', highlight: true },
  { name: 'Quiénes somos', to: '/quienes-somos' }
]
</script>

<template>
  <footer class="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 py-12 px-4 transition-colors duration-200">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
      <!-- Columna 1: Identidad -->
      <div class="md:col-span-2 space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-black shadow-md shadow-red-900/30">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span class="text-xl font-black text-neutral-900 dark:text-white tracking-tight">
            EVOLUCIÓN <span class="text-red-600">TV</span>
          </span>
        </div>
        <p class="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 max-w-md leading-relaxed">
          Medio de comunicación independiente comprometido con la verdad, la libertad de prensa, el periodismo de investigación y la transmisión de noticias en directo para todo el país.
        </p>
        <div class="flex flex-col gap-3 pt-1">
          <div class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span class="inline-flex items-center gap-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-3 py-1 rounded-full text-neutral-700 dark:text-neutral-300 shadow-sm">
              <span class="w-2 h-2 rounded-full bg-red-500"></span>
              Transmisión Digital & Cobertura en Vivo
            </span>
          </div>
          <SocialLinks />
        </div>
      </div>

      <!-- Columna 2: Secciones Editoriales Oficiales -->
      <div>
        <h4 class="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">Secciones</h4>
        <ul class="space-y-2 text-xs md:text-sm">
          <li v-for="cat in footerCategories" :key="cat.name">
            <NuxtLink
              :to="cat.to"
              :class="[
                'transition-colors',
                cat.highlight
                  ? 'text-red-600 dark:text-red-400 font-bold hover:underline'
                  : 'hover:text-red-600 dark:hover:text-red-400 text-neutral-600 dark:text-neutral-400'
              ]"
            >
              {{ cat.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Columna 3: Editorial y Contacto -->
      <div>
        <h4 class="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">Redacción</h4>
        <ul class="space-y-2 text-xs md:text-sm">
          <li><a href="mailto:redaccion@evoluciontv.com" class="hover:text-neutral-900 dark:hover:text-white transition-colors">Buzón de Denuncias</a></li>
          <li><a href="#" class="hover:text-neutral-900 dark:hover:text-white transition-colors">Código de Ética Periodística</a></li>
          <li><a href="#" class="hover:text-neutral-900 dark:hover:text-white transition-colors">Aviso de Privacidad</a></li>
        </ul>
      </div>
    </div>

    <div class="max-w-7xl mx-auto pt-8 border-t border-neutral-200 dark:border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
      <p>© {{ currentYear }} Evolución TV. Todos los derechos reservados. Medio de comunicación independiente.</p>
      <p>Plataforma Oficial de Noticias y Televisión Digital</p>
    </div>
  </footer>
</template>
