<script setup lang="ts">
import { useRadio } from '~/composables/useRadio'
import SocialLinks from '~/components/SocialLinks.vue'

useHead({
  title: 'Evolución Radio en Vivo | Evolución TV',
  meta: [
    {
      name: 'description',
      content: 'Escucha Evolución Radio en vivo las 24 horas en calidad HD (320 kbps). Música, cultura alternativa y señal digital independiente.'
    },
    {
      property: 'og:title',
      content: 'Evolución Radio en Vivo | Evolución TV'
    },
    {
      property: 'og:description',
      content: 'Transmisión continua de Evolución Radio en MP3 320 kbps.'
    }
  ]
})

const {
  isPlaying,
  isMuted,
  volume,
  isLoading,
  currentTrack,
  togglePlay,
  setVolume,
  toggleMute
} = useRadio()

const onVolumeInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  setVolume(Number(target.value))
}

const equalizerBars = [
  'h-5', 'h-9', 'h-4', 'h-11', 'h-7', 'h-12', 'h-6', 'h-10', 'h-4', 'h-8', 'h-5', 'h-9'
]
</script>

<template>
  <div class="min-h-screen py-8 md:py-12 transition-colors duration-200">
    <div class="max-w-5xl mx-auto px-4 space-y-8">
      <!-- Barra superior de navegación / Retorno -->
      <div class="flex items-center justify-between">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la Portada
        </NuxtLink>

        <span class="inline-flex items-center gap-2 bg-red-600/10 border border-red-500/30 text-red-600 dark:text-red-400 font-bold px-3 py-1 rounded-full text-xs">
          <span class="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
          320 KBPS MP3 · EN VIVO
        </span>
      </div>

      <!-- Cabina Principal de Evolución Radio -->
      <section class="bg-white dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-10 md:p-12 shadow-xl relative overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <!-- Botón Protagonista y Visualizador -->
          <div class="md:col-span-5 flex flex-col items-center justify-center gap-6 py-4">
            <button
              type="button"
              @click="togglePlay"
              :aria-label="isPlaying ? 'Pausar Evolución Radio' : 'Reproducir Evolución Radio'"
              class="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-red-500 to-red-700 hover:from-red-500 hover:to-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-900/40 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-8 ring-red-600/15"
            >
              <svg v-if="isLoading" class="w-12 h-12 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <svg v-else-if="isPlaying" class="w-14 h-14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
              <svg v-else class="w-14 h-14 ml-1.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>

            <!-- Barras de ecualizador -->
            <div class="flex items-end justify-center gap-1.5 h-12" aria-hidden="true">
              <span
                v-for="(barHeight, idx) in equalizerBars"
                :key="idx"
                :class="[
                  'w-1.5 rounded-full transition-all duration-300',
                  isPlaying
                    ? `${barHeight} bg-red-600 animate-pulse`
                    : 'h-2 bg-neutral-300 dark:bg-neutral-700'
                ]"
                :style="{ animationDelay: `${idx * 90}ms` }"
              ></span>
            </div>
          </div>

          <!-- Información y Controles de Audio -->
          <div class="md:col-span-7 space-y-6">
            <div class="space-y-2">
              <span class="text-xs font-black uppercase tracking-widest text-red-600 dark:text-red-400">
                Estación Digital 24/7
              </span>
              <h1 class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-white">
                EVOLUCIÓN <span class="text-red-600">radio</span>
              </h1>
              <p class="text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Música independiente, cultura alternativa y programación continua. La señal se mantiene activa aunque sigas navegando por nuestras noticias.
              </p>
            </div>

            <!-- Estado actual -->
            <div class="bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div class="min-w-0">
                <span class="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  {{ isLoading ? 'Conectando señal...' : isPlaying ? 'Sonando ahora' : 'Listo para escuchar' }}
                </span>
                <p class="text-sm sm:text-base font-bold text-neutral-900 dark:text-white truncate">
                  {{ currentTrack }}
                </p>
              </div>
              <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 shrink-0">
                MP3 320k
              </span>
            </div>

            <!-- Control de Volumen -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400">
                <span>Volumen</span>
                <span>{{ isMuted ? 'Silenciado' : `${volume}%` }}</span>
              </div>
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  @click="toggleMute"
                  :aria-label="isMuted ? 'Activar sonido' : 'Silenciar radio'"
                  class="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer"
                >
                  <svg v-if="isMuted || volume === 0" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  :value="isMuted ? 0 : volume"
                  @input="onVolumeInput"
                  aria-label="Control de volumen de Evolución Radio"
                  class="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>
            </div>

            <!-- Redes sociales y salto rápido a TV -->
            <div class="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 dark:border-neutral-800">
              <SocialLinks />
              <NuxtLink
                to="/en-vivo"
                class="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
              >
                Ir a Señal en Vivo (TV) →
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
