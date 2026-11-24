<script setup lang="ts">
import { computed } from 'vue'
import { useNews } from '~/composables/useNews'
import NewsCard from '~/components/NewsCard.vue'

useHead({
  title: 'Señal en Vivo | Evolución TV',
  meta: [
    {
      name: 'description',
      content: 'Cabina digital de televisión de Evolución TV: programación en directo, programas en YouTube y señal de Evolución Radio 24/7.'
    },
    {
      property: 'og:title',
      content: 'Señal en Vivo | Evolución TV'
    },
    {
      property: 'og:description',
      content: 'Sigue la programación y transmisiones especiales de Evolución TV.'
    }
  ]
})

const currentShow = {
  title: 'Evolución Noticias - Edición Central',
  anchor: 'Conducción: Redacción y Corresponsales',
  nextShow: '23:30 - Análisis y Debate Sin Censura'
}

const schedule = [
  {
    status: 'PRÓXIMA EMISIÓN',
    time: '22:00 - 23:30',
    title: 'Evolución Noticias Central',
    desc: 'Resumen de los hechos más relevantes de la jornada con enlaces informativos.',
    active: true
  },
  {
    status: 'SIGUIENTE',
    time: '23:30 - 00:30',
    title: 'Mesa de Análisis y Debate',
    desc: 'Especialistas independientes discuten coyuntura pública, cultura y economía.',
    active: false
  },
  {
    status: 'MADRUGADA',
    time: '00:30 - 06:00',
    title: 'Documentales y Reportajes ETV',
    desc: 'Series de investigación periodística sobre comunidades y medio ambiente.',
    active: false
  },
  {
    status: 'MAÑANA',
    time: '06:00 - 09:00',
    title: 'Primera Emisión Informativa',
    desc: 'Apertura de jornada, agenda ciudadana y los primeros despachos del día.',
    active: false
  }
]

const { getArticles } = useNews()
const { data: newsData } = await useAsyncData('live-recent-news', () => getArticles({ limit: 3 }))
const recentNews = computed(() => newsData.value?.articles || [])
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-16 transition-colors duration-200">
    <!-- Barra superior de navegación / Retorno (no-sticky para no quedar oculta bajo HeaderNav) -->
    <div class="border-b border-neutral-200 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/40">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-etv-blue-600 dark:hover:text-etv-blue-400 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a las Noticias
        </NuxtLink>

        <span class="flex items-center gap-1.5 bg-etv-blue-500/10 border border-etv-blue-500/30 text-etv-blue-600 dark:text-etv-blue-400 font-bold px-3 py-1 rounded-full text-xs shadow-sm">
          <span class="w-2 h-2 rounded-full bg-etv-blue-500 animate-pulse"></span>
          CABINA TELEVISIÓN DIGITAL
        </span>
      </div>
    </div>

    <!-- Contenedor Principal de la Emisión -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Título de la Sección -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-2.5 h-6 bg-gradient-to-b from-etv-orange-500 to-etv-blue-500 rounded-sm"></span>
            <h1 class="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
              Televisión Digital en Vivo
            </h1>
          </div>
          <p class="text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
            Programación informativa, mesas de debate ciudadano y enlace directo con nuestras señales activas.
          </p>
        </div>

        <NuxtLink
          to="/radio"
          class="inline-flex items-center gap-2 bg-etv-blue-600 hover:bg-etv-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-etv-blue-900/20 transition-colors w-fit shrink-0"
        >
          <span class="w-2 h-2 rounded-full bg-white animate-ping"></span>
          Escuchar Evolución Radio 24/7
        </NuxtLink>
      </div>

      <!-- Cuadrícula: Cabina de Video y Parrilla -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Cabina Panorámica Honesta y Funcional (8 columnas) -->
        <div class="lg:col-span-8 flex flex-col gap-4">
          <div class="relative aspect-video bg-neutral-950 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 flex items-center justify-center p-6 sm:p-10">
            <div
              aria-hidden="true"
              class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(1,171,232,0.18),rgba(254,153,3,0.08)_45%,transparent_70%)]"
            ></div>

            <!-- Identificador en esquina superior -->
            <div class="absolute top-4 left-4 sm:top-5 sm:left-5 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10">
              <span class="text-xs font-black tracking-wider text-etv-orange-500">EVOLUCIÓN</span>
              <span class="text-[10px] bg-etv-blue-500 text-white font-black px-1.5 py-0.5 rounded">TV</span>
              <span class="text-[10px] text-neutral-400 font-mono">SEÑAL DE VIDEO</span>
            </div>

            <!-- Estado transparente de emisión -->
            <div class="relative z-10 text-center max-w-lg space-y-4">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-etv-blue-300 text-xs font-semibold">
                <span class="w-2 h-2 rounded-full bg-etv-orange-400"></span>
                En espera de próxima transmisión de video
              </div>

              <h2 class="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                {{ currentShow.title }}
              </h2>
              <p class="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Mientras preparamos la próxima emisión de televisión en directo, puedes escuchar nuestra señal continua de audio o ver los programas publicados en YouTube.
              </p>

              <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href="https://www.youtube.com/@EvolucionTV"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 bg-etv-orange-500 hover:bg-etv-orange-400 text-neutral-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg transition-colors"
                >
                  Ver programas en YouTube ↗
                </a>
                <NuxtLink
                  to="/radio"
                  class="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl border border-etv-blue-500/40 transition-colors"
                >
                  Ir a Evolución Radio 24/7
                </NuxtLink>
              </div>
            </div>

            <!-- Pie de cabina -->
            <div class="hidden sm:flex absolute bottom-0 inset-x-0 px-6 py-4 items-center justify-between text-xs text-neutral-400 border-t border-white/5 bg-black/40">
              <span>{{ currentShow.anchor }}</span>
              <span class="font-mono text-neutral-300">{{ currentShow.nextShow }}</span>
            </div>
          </div>

          <!-- Módulo de Participación Ciudadana -->
          <div class="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-etv-blue-50 dark:bg-etv-blue-500/10 border border-etv-blue-200 dark:border-etv-blue-500/25 flex items-center justify-center text-etv-blue-600 dark:text-etv-blue-400 shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-bold text-neutral-900 dark:text-white">¿Tienes un reporte ciudadano?</h3>
                <p class="text-xs text-neutral-600 dark:text-neutral-400">Envía tus denuncias o testimonios directamente a nuestra mesa de redacción.</p>
              </div>
            </div>
            <a
              href="mailto:redaccion@evoluciontv.com?subject=Reporte%20Ciudadano%20ETV"
              class="bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-neutral-700 transition-colors shrink-0 shadow-sm"
            >
              Contactar a Cabina
            </a>
          </div>
        </div>

        <!-- Parrilla de Programación (4 columnas) -->
        <div class="lg:col-span-4 flex flex-col gap-6">
          <div class="bg-white dark:bg-neutral-900/80 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between shadow-sm">
            <div>
              <h3 class="text-base font-black text-neutral-900 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                <svg class="w-5 h-5 text-etv-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Parrilla de Hoy
              </h3>

              <div class="space-y-4">
                <div
                  v-for="(item, idx) in schedule"
                  :key="idx"
                  :class="[
                    'p-4 rounded-2xl border transition-all',
                    item.active
                      ? 'bg-etv-blue-50 dark:bg-etv-blue-950/30 border-etv-blue-300 dark:border-etv-blue-800/50 shadow-sm'
                      : 'bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800/80'
                  ]"
                >
                  <div class="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span :class="item.active ? 'text-etv-blue-600 dark:text-etv-blue-400' : 'text-neutral-500'">{{ item.status }}</span>
                    <span class="text-neutral-500 dark:text-neutral-400 font-mono">{{ item.time }}</span>
                  </div>
                  <h4 class="text-sm font-bold text-neutral-900 dark:text-white mb-1">{{ item.title }}</h4>
                  <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{{ item.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Coberturas y Noticias Relacionadas -->
      <section v-if="recentNews.length > 0" class="mt-16 pt-12 border-t border-neutral-200 dark:border-neutral-800">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-6 bg-gradient-to-b from-etv-orange-500 to-etv-blue-500 rounded-sm"></span>
            <h2 class="text-xl md:text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
              Investigaciones de la Redacción
            </h2>
          </div>
          <NuxtLink to="/" class="text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
            Ver Toda la Portada →
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NewsCard
            v-for="article in recentNews"
            :key="article.id"
            :post="article"
          />
        </div>
      </section>
    </div>
  </div>
</template>
