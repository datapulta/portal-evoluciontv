<script setup lang="ts">
import { useRadio } from '~/composables/useRadio'
import SocialLinks from '~/components/SocialLinks.vue'

useHead({
  title: 'Evolución Radio en Vivo | Evolución TV',
  meta: [
    {
      name: 'description',
      content: 'Escucha Evolución Radio en vivo las 24 horas en audio de calidad HD. Música, cultura alternativa y señal digital independiente.'
    },
    {
      property: 'og:title',
      content: 'Evolución Radio en Vivo | Evolución TV'
    },
    {
      property: 'og:description',
      content: 'Transmisión continua de Evolución Radio en audio de calidad HD.'
    }
  ]
})

const {
  isPlaying,
  isLoading,
  currentTrack,
  togglePlay
} = useRadio()
</script>

<template>
  <div class="min-h-[calc(100vh-8rem)] flex items-center py-4 md:py-8 transition-colors duration-200">
    <div class="max-w-5xl w-full mx-auto px-4 space-y-4">
      <!-- Barra superior con botón Explorar la plataforma -->
      <div class="flex items-center justify-between gap-3">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-95"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Explorar la plataforma
        </NuxtLink>

        <span class="inline-flex items-center gap-2 bg-red-600/10 border border-red-500/30 text-red-600 dark:text-red-400 font-bold px-3 py-1.5 rounded-full text-xs">
          <span class="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
          RADIO EN VIVO · 24/7
        </span>
      </div>

      <!-- Cabina Principal de Evolución Radio -->
      <section class="bg-white dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-10 md:p-12 shadow-xl relative overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <!-- Botón Protagonista con Ondas Radiales de Transmisión -->
          <div class="md:col-span-5 flex flex-col items-center justify-center gap-5 py-6">
            <div class="relative flex items-center justify-center">
              <!-- Ondas concéntricas animadas cuando está transmitiendo -->
              <span
                v-if="isPlaying"
                class="absolute w-44 h-44 sm:w-48 sm:h-48 rounded-full border-2 border-red-500/30 animate-ping"
                style="animation-duration: 2.2s;"
              ></span>
              <span
                v-if="isPlaying"
                class="absolute w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-red-600/10 animate-pulse"
              ></span>
              <span
                v-else
                class="absolute w-40 h-40 sm:w-44 sm:h-44 rounded-full border border-neutral-200 dark:border-neutral-800"
              ></span>

              <button
                type="button"
                @click="togglePlay"
                :aria-label="isPlaying ? 'Pausar Evolución Radio' : 'Reproducir Evolución Radio'"
                class="relative z-10 w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-red-500 to-red-700 hover:from-red-500 hover:to-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-900/40 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-8 ring-red-600/15"
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
            </div>

            <!-- Píldora limpia de estado -->
            <span
              :class="[
                'inline-flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full border transition-colors',
                isPlaying
                  ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400'
                  : 'bg-neutral-100 dark:bg-neutral-800/70 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300'
              ]"
            >
              <span :class="['w-2 h-2 rounded-full', isPlaying ? 'bg-red-600 animate-pulse' : 'bg-neutral-400']"></span>
              {{ isLoading ? 'Conectando...' : isPlaying ? 'Transmisión Activa' : 'Toca para escuchar' }}
            </span>
          </div>

          <!-- Información de la Estación -->
          <div class="md:col-span-7 space-y-6">
            <div class="space-y-2">
              <span class="text-xs font-black uppercase tracking-widest text-red-600 dark:text-red-400">
                Estación Digital 24/7
              </span>
              <h1 class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-white">
                Evolución <span class="text-red-600">Radio</span>
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
                AUDIO HD
              </span>
            </div>

            <!-- Redes sociales y salto rápido a TV -->
            <div class="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 dark:border-neutral-800">
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
