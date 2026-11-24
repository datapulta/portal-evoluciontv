<script setup lang="ts">
import { useRadio } from '~/composables/useRadio'

const {
  isPlaying,
  isMuted,
  volume,
  isMinimized,
  isLoading,
  currentTrack,
  togglePlay,
  setVolume,
  toggleMute,
  toggleMinimize
} = useRadio()

const onVolumeInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  setVolume(Number(target.value))
}
</script>

<template>
  <aside
    aria-label="Reproductor Evolución Radio"
    class="fixed bottom-4 left-4 z-50 max-w-[calc(100vw-2rem)]"
  >
    <!-- Modo Mini-Dock compacto (con Play/Pause directo y expandir) -->
    <div
      v-if="isMinimized"
      class="flex items-center gap-2.5 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-2 border-red-600/80 text-neutral-900 dark:text-white pl-2 pr-3 py-1.5 rounded-full shadow-2xl transition-all"
    >
      <button
        type="button"
        @click="togglePlay"
        :aria-label="isPlaying ? 'Pausar Evolución Radio' : 'Reproducir Evolución Radio'"
        class="w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shrink-0 shadow-sm cursor-pointer transition-transform active:scale-95"
      >
        <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <svg v-else-if="isPlaying" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
        <svg v-else class="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>

      <button
        type="button"
        @click="toggleMinimize"
        class="flex items-center gap-2 text-left cursor-pointer group"
        title="Expandir reproductor"
      >
        <span class="relative flex h-2 w-2 shrink-0" v-if="isPlaying">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
        </span>
        <span class="text-xs font-black tracking-tight group-hover:text-red-600 transition-colors">
          EVOLUCIÓN <span class="text-red-600 font-bold">radio</span>
        </span>
        <svg class="w-3.5 h-3.5 text-neutral-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </button>
    </div>

    <!-- Vista expandida estilo reproductor flotante -->
    <div
      v-else
      class="relative w-[320px] sm:w-[340px] bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-2 border-red-600/80 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3.5 transition-colors"
    >
      <!-- Botón minimizar en esquina superior derecha -->
      <button
        type="button"
        @click="toggleMinimize"
        aria-label="Minimizar reproductor de radio"
        title="Minimizar"
        class="absolute top-2 right-2 p-1 rounded-lg text-red-600/80 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />
        </svg>
      </button>

      <!-- Botón circular rojo Play / Pause -->
      <button
        type="button"
        @click="togglePlay"
        :aria-label="isPlaying ? 'Pausar Evolución Radio' : 'Reproducir Evolución Radio'"
        class="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-700 hover:from-red-500 hover:to-red-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-900/30 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-red-600/15"
      >
        <svg v-if="isLoading" class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <svg v-else-if="isPlaying" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
        <svg v-else class="w-6 h-6 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>

      <!-- Información de la estación y controles de volumen -->
      <div class="flex-1 min-w-0 pr-4 space-y-1">
        <NuxtLink to="/radio" class="flex flex-col leading-none group w-fit" title="Ir a página de Evolución Radio">
          <span class="text-base font-black tracking-tight text-red-600 group-hover:underline">
            EVOLUCIÓN
          </span>
          <span class="text-xs font-bold tracking-wide text-neutral-900 dark:text-white -mt-0.5">
            radio
          </span>
        </NuxtLink>

        <p class="text-[11px] font-medium text-neutral-600 dark:text-neutral-300 truncate flex items-center gap-1.5">
          <span
            v-if="isPlaying"
            class="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shrink-0"
          ></span>
          <span class="truncate">{{ isPlaying ? `En vivo · ${currentTrack}` : currentTrack }}</span>
        </p>

        <!-- Barra de volumen -->
        <div class="flex items-center gap-2 pt-0.5">
          <button
            type="button"
            @click="toggleMute"
            :aria-label="isMuted ? 'Activar sonido' : 'Silenciar radio'"
            class="text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer shrink-0"
          >
            <svg v-if="isMuted || volume === 0" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </button>

          <input
            type="range"
            min="0"
            max="100"
            :value="isMuted ? 0 : volume"
            @input="onVolumeInput"
            aria-label="Volumen de Evolución Radio"
            class="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
        </div>
      </div>
    </div>
  </aside>
</template>
