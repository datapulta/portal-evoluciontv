<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNews } from '~/composables/useNews'
import NewsCard from '~/components/NewsCard.vue'

useHead({
  title: 'Señal en Vivo 24/7 | Evolución TV',
  meta: [
    {
      name: 'description',
      content: 'Transmisión ininterrumpida de noticias, análisis ciudadano y coberturas especiales de Evolución TV en vivo.'
    },
    {
      property: 'og:title',
      content: 'Señal en Vivo 24/7 | Evolución TV'
    },
    {
      property: 'og:description',
      content: 'Sigue nuestra transmisión de televisión digital independiente en vivo.'
    }
  ]
})

const isPlaying = ref(true)
const isMuted = ref(true)
const streamQuality = ref('1080p HD')

const currentShow = {
  title: 'Evolución Noticias - Edición Central',
  anchor: 'Conducción: Redacción y Corresponsales',
  viewers: '1,420 espectadores en vivo',
  nextShow: '23:30 - Mesa de Análisis y Debate'
}

const schedule = [
  {
    status: 'EN VIVO AHORA',
    time: '22:00 - 23:30',
    title: 'Evolución Noticias Central',
    desc: 'Resumen completo de los hechos más relevantes de la jornada con enlaces en directo.',
    active: true
  },
  {
    status: 'SIGUIENTE',
    time: '23:30 - 00:30',
    title: 'Mesa de Análisis y Debate',
    desc: 'Especialistas independientes discuten las reformas de transparencia y economía.',
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

// Noticias para mantener informado al espectador
const { getArticles } = useNews()
const { data: newsData } = await useAsyncData('live-recent-news', () => getArticles({ limit: 3 }))
const recentNews = computed(() => newsData.value?.articles || [])
</script>

<template>
  <div class="min-h-screen bg-neutral-950 pb-16">
    <!-- Barra superior de navegación / Retorno -->
    <div class="border-b border-neutral-800/80 bg-neutral-900/40 backdrop-blur-md sticky top-14 z-40">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-neutral-400 hover:text-red-400 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a las Noticias
        </NuxtLink>

        <div class="flex items-center gap-3 text-xs">
          <span class="flex items-center gap-1.5 bg-red-600/10 border border-red-500/30 text-red-400 font-bold px-3 py-1 rounded-full">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            TRANSMISIÓN DIGITAL EN VIVO
          </span>
        </div>
      </div>
    </div>

    <!-- Contenedor Principal de la Emisión -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Título de la Sección -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-2.5 h-6 bg-red-600 rounded-sm"></span>
            <h1 class="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
              Televisión Digital en Vivo (24/7)
            </h1>
          </div>
          <p class="text-xs md:text-sm text-neutral-400">
            Transmisión ininterrumpida de periodismo de investigación, debates sin censura y coberturas ciudadanas.
          </p>
        </div>

        <div class="flex items-center gap-3 text-xs text-neutral-400">
          <span class="inline-flex items-center gap-1.5 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {{ currentShow.viewers }}
          </span>
          <span class="bg-neutral-900 px-2.5 py-1.5 rounded-lg border border-neutral-800 font-mono text-neutral-300">
            {{ streamQuality }}
          </span>
        </div>
      </div>

      <!-- Cuadrícula: Reproductor y Parrilla -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Reproductor Panorámico (8 columnas) -->
        <div class="lg:col-span-8 flex flex-col gap-4">
          <div class="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 flex items-center justify-center group">
            <img
              src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80"
              alt="Señal en vivo Evolución TV"
              class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-102 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/40"></div>

            <!-- Identificador en esquina superior -->
            <div class="absolute top-5 left-5 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10">
              <span class="text-xs font-black tracking-wider text-red-500">EVOLUCIÓN</span>
              <span class="text-[10px] bg-red-600 text-white font-black px-1.5 py-0.5 rounded">TV</span>
              <span class="text-[10px] text-neutral-400 font-mono">SEÑAL MATRIZ</span>
            </div>

            <!-- Botón de Reproducción -->
            <button
              @click="isPlaying = !isPlaying"
              class="relative z-10 w-20 h-20 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-950 transform hover:scale-110 transition-all cursor-pointer"
              :aria-label="isPlaying ? 'Pausar transmisión' : 'Iniciar transmisión'"
            >
              <svg v-if="isPlaying" class="w-8 h-8 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
              <svg v-else class="w-8 h-8 ml-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>

            <!-- Controles inferiores de la emisión -->
            <div class="absolute bottom-0 inset-x-0 p-5 flex items-center justify-between text-xs text-white bg-gradient-to-t from-black/95 to-transparent">
              <div>
                <p class="font-bold text-base md:text-lg text-white">{{ currentShow.title }}</p>
                <p class="text-neutral-400 text-xs">{{ currentShow.anchor }}</p>
              </div>

              <div class="flex items-center gap-3">
                <button
                  @click="isMuted = !isMuted"
                  class="p-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/60 transition-colors cursor-pointer"
                  :title="isMuted ? 'Activar sonido' : 'Silenciar'"
                >
                  <svg v-if="isMuted" class="w-5 h-5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                  <svg v-else class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Módulo de Participación Ciudadana -->
          <div class="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-bold text-white">¿Tienes un reporte ciudadano en vivo?</h3>
                <p class="text-xs text-neutral-400">Envía tus denuncias o testimonios directamente a nuestra mesa de redacción.</p>
              </div>
            </div>
            <a
              href="https://cms-etv.webia.studio/ghost"
              target="_blank"
              class="bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-neutral-700 transition-colors shrink-0"
            >
              Contactar a Cabina
            </a>
          </div>
        </div>

        <!-- Parrilla de Programación (4 columnas) -->
        <div class="lg:col-span-4 flex flex-col gap-6">
          <div class="bg-neutral-900/80 rounded-3xl p-6 border border-neutral-800 flex flex-col justify-between">
            <div>
              <h3 class="text-base font-black text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      ? 'bg-red-950/30 border-red-800/50 shadow-lg shadow-red-950/20'
                      : 'bg-neutral-900/60 border-neutral-800/80'
                  ]"
                >
                  <div class="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span :class="item.active ? 'text-red-400' : 'text-neutral-500'">{{ item.status }}</span>
                    <span class="text-neutral-400 font-mono">{{ item.time }}</span>
                  </div>
                  <h4 class="text-sm font-bold text-white mb-1">{{ item.title }}</h4>
                  <p class="text-xs text-neutral-400 leading-relaxed">{{ item.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Coberturas y Noticias Relacionadas -->
      <section v-if="recentNews.length > 0" class="mt-16 pt-12 border-t border-neutral-800">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-6 bg-red-600 rounded-sm"></span>
            <h2 class="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
              Investigaciones de la Redacción
            </h2>
          </div>
          <NuxtLink to="/" class="text-xs font-bold text-neutral-400 hover:text-white transition-colors">
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
