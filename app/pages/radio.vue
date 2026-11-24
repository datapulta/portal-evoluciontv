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
  currentArtist,
  currentTitle,
  currentArt,
  listenersCount,
  togglePlay
} = useRadio()
</script>

<template>
  <div class="relative py-6 md:py-10 px-4 transition-colors duration-200 overflow-hidden">
    <!-- Resplandor ambiental sutil dual Azul y Naranja para evitar vacío plano en desktop -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(1,171,232,0.14),rgba(254,153,3,0.06)_50%,transparent_75%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(1,171,232,0.16),rgba(254,153,3,0.08)_50%,transparent_75%)]"
    ></div>

    <div class="relative max-w-3xl w-full mx-auto">
      <!-- Cabina Compacta Unificada de Evolución Radio -->
      <section class="bg-white/95 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-xl overflow-hidden">
        <!-- Cabecera integrada (elimina la franja vacía externa) -->
        <div class="px-5 sm:px-7 py-3.5 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/70 dark:bg-neutral-950/50 flex flex-wrap items-center justify-between gap-3">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-95"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Explorar la plataforma
          </NuxtLink>

          <div class="flex items-center gap-2">
            <span
              v-if="listenersCount > 0"
              class="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-2.5 py-1 rounded-full"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {{ listenersCount }} {{ listenersCount === 1 ? 'oyente' : 'oyentes' }}
            </span>
            <span class="inline-flex items-center gap-2 bg-etv-blue-500/10 border border-etv-blue-500/30 text-etv-blue-600 dark:text-etv-blue-400 font-bold px-3 py-1 rounded-full text-xs">
              <span class="w-2 h-2 rounded-full bg-etv-blue-500 animate-ping"></span>
              RADIO EN VIVO · 24/7
            </span>
          </div>
        </div>

        <!-- Cuerpo Principal: ancho exacto para el botón + bloque editorial -->
        <div class="p-5 sm:p-7 flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <!-- Botón Protagonista con Ondas Radiales (sin espacio muerto lateral) -->
          <div class="w-full md:w-44 shrink-0 flex flex-col items-center justify-center gap-3">
            <div class="relative flex items-center justify-center">
              <!-- Ondas concéntricas animadas cuando está transmitiendo -->
              <span
                v-if="isPlaying"
                class="absolute w-40 h-40 rounded-full border-2 border-etv-blue-500/35 animate-ping"
                style="animation-duration: 2.2s;"
              ></span>
              <span
                v-if="isPlaying"
                class="absolute w-36 h-36 rounded-full bg-etv-blue-500/10 animate-pulse"
              ></span>
              <span
                v-else
                class="absolute w-36 h-36 rounded-full border border-neutral-200 dark:border-neutral-800"
              ></span>

              <button
                type="button"
                @click="togglePlay"
                :aria-label="isPlaying ? 'Pausar Evolución Radio' : 'Reproducir Evolución Radio'"
                class="relative z-10 overflow-hidden w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-etv-blue-500 to-etv-orange-500 hover:brightness-110 text-white flex items-center justify-center shadow-2xl shadow-etv-blue-900/35 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-8 ring-etv-blue-500/15"
              >
                <img
                  v-if="currentArt"
                  :src="currentArt"
                  alt=""
                  class="absolute inset-0 w-full h-full object-cover opacity-25 scale-105"
                />
                <svg v-if="isLoading" class="relative z-10 w-11 h-11 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <svg v-else-if="isPlaying" class="relative z-10 w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
                <svg v-else class="relative z-10 w-12 h-12 ml-1.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>

            <span
              :class="[
                'inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full border transition-colors',
                isPlaying
                  ? 'bg-etv-orange-50 dark:bg-etv-orange-950/40 border-etv-orange-200 dark:border-etv-orange-900/60 text-etv-orange-700 dark:text-etv-orange-400'
                  : 'bg-neutral-100 dark:bg-neutral-800/70 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300'
              ]"
            >
              <span :class="['w-2 h-2 rounded-full', isPlaying ? 'bg-etv-orange-500 animate-pulse' : 'bg-neutral-400']"></span>
              {{ isLoading ? 'Conectando...' : isPlaying ? 'Transmisión Activa' : 'Toca para escuchar' }}
            </span>
          </div>

          <!-- Información de la Estación y Pista en Vivo -->
          <div class="flex-1 min-w-0 w-full space-y-4">
            <div class="space-y-1.5 text-center md:text-left">
              <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
                Evolución <span class="text-etv-orange-500">Radio</span>
              </h1>
              <p class="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Música independiente, cultura alternativa y programación continua. La señal sigue activa aunque navegues por nuestras noticias.
              </p>
            </div>

            <!-- Tarjeta Sonando Ahora con Carátula y Metadatos de AzuraCast -->
            <div class="bg-neutral-50 dark:bg-neutral-950/70 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-11 h-11 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shrink-0 flex items-center justify-center">
                  <img
                    v-if="currentArt"
                    :src="currentArt"
                    :alt="currentTitle || currentTrack"
                    class="w-full h-full object-cover"
                  />
                  <svg v-else class="w-5 h-5 text-etv-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>

                <div class="min-w-0">
                  <span class="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    {{ isLoading ? 'Conectando señal...' : isPlaying ? 'Sonando ahora' : 'Programación actual' }}
                  </span>
                  <p class="text-sm font-bold text-neutral-900 dark:text-white truncate" :title="currentTrack">
                    {{ currentTitle || currentTrack }}
                  </p>
                  <p v-if="currentArtist" class="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {{ currentArtist }}
                  </p>
                </div>
              </div>

              <span class="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-etv-blue-600 dark:text-etv-blue-400 shrink-0">
                AUDIO HD
              </span>
            </div>

            <!-- Redes sociales y salto rápido a TV -->
            <div class="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 dark:border-neutral-800">
              <SocialLinks />
              <NuxtLink
                to="/en-vivo"
                class="text-xs font-bold text-etv-blue-600 dark:text-etv-blue-400 hover:underline"
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
