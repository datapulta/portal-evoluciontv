<script setup lang="ts">
import SocialLinks from '~/components/SocialLinks.vue'
import BrandMark from '~/components/BrandMark.vue'

const currentYear = new Date().getFullYear()

const footerCategories = [
  { name: 'Portada Principal', to: '/' },
  { name: 'Coberturas ETV', to: '/categoria/coberturas-etv' },
  { name: 'Más bandas', to: '/categoria/mas-bandas' },
  { name: 'EvolucioNotas', to: '/categoria/evolucionotas' },
  { name: 'Evolución Radio', to: '/radio' },
  { name: 'Señal en Vivo (24/7)', to: '/en-vivo', highlight: true },
  { name: 'Buscar Noticias', to: '/buscar' },
  { name: 'Quiénes somos', to: '/quienes-somos' }
]
</script>

<template>
  <footer class="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 py-12 px-4 transition-colors duration-200">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
      <!-- Columna 1: Identidad -->
      <div class="md:col-span-2 space-y-4">
        <div class="flex items-center gap-3">
          <BrandMark size="sm" />
          <span class="text-xl font-black text-neutral-900 dark:text-white tracking-tight">
            EVOLUCIÓN <span class="text-etv-orange-600 dark:text-etv-orange-500">TV</span>
          </span>
        </div>
        <p class="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 max-w-md leading-relaxed">
          Medio de comunicación independiente comprometido con la verdad, la libertad de prensa, el periodismo de investigación y la transmisión de noticias en directo para todo el país.
        </p>
        <div class="flex flex-col gap-3 pt-1">
          <div class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span class="inline-flex items-center gap-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-3 py-1 rounded-full text-neutral-700 dark:text-neutral-300 shadow-sm">
              <span class="w-2 h-2 rounded-full bg-etv-blue-500"></span>
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
                  ? 'text-etv-blue-600 dark:text-etv-blue-400 font-bold hover:underline'
                  : 'hover:text-etv-orange-600 dark:hover:text-etv-orange-400 text-neutral-600 dark:text-neutral-400'
              ]"
            >
              {{ cat.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Columna 3: Editorial y Contacto -->
      <div id="contacto" class="scroll-mt-32">
        <h4 class="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">Redacción y Contacto</h4>
        <ul class="space-y-2 text-xs md:text-sm">
          <li><NuxtLink to="/contacto" class="hover:text-etv-orange-600 dark:hover:text-etv-orange-400 font-semibold transition-colors flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-etv-orange-500"></span>Contacto y Redes Sociales</NuxtLink></li>
          <li><a href="mailto:redaccion@evoluciontv.com" class="hover:text-neutral-900 dark:hover:text-white transition-colors">redaccion@evoluciontv.com</a></li>
          <li><a href="mailto:redaccion@evoluciontv.com?subject=Reporte%20Ciudadano" class="hover:text-neutral-900 dark:hover:text-white transition-colors">Buzón de Denuncias</a></li>
          <li><NuxtLink to="/codigo-etica" class="hover:text-etv-orange-600 dark:hover:text-etv-orange-400 transition-colors">Código de Ética Periodística</NuxtLink></li>
          <li><NuxtLink to="/privacidad" class="hover:text-etv-orange-600 dark:hover:text-etv-orange-400 transition-colors">Aviso de Privacidad</NuxtLink></li>
        </ul>
      </div>
    </div>

    <div class="max-w-7xl mx-auto pt-8 border-t border-neutral-200 dark:border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
      <p>© {{ currentYear }} Evolución TV. Todos los derechos reservados. Medio de comunicación independiente.</p>
      <p>Plataforma Oficial de Noticias y Televisión Digital</p>
    </div>
  </footer>
</template>
