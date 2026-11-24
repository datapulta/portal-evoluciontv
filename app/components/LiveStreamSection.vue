<script setup lang="ts">
import { ref } from 'vue'

const isMuted = ref(true)
const streamQuality = ref('1080p HD')

const currentShow = {
  title: 'Evolución Noticias - Edición Central',
  anchor: 'Conducción: Redacción y Corresponsales',
  nextShow: '23:30 - Análisis y Debate Sin Censura',
  viewers: '1,420 espectadores en vivo'
}
</script>

<template>
  <section id="en-vivo" class="bg-gradient-to-b from-neutral-900 to-neutral-950 border-y border-neutral-800 py-10 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 bg-etv-blue-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            <span class="w-2 h-2 rounded-full bg-white animate-ping"></span>
            En Vivo
          </div>
          <div>
            <h2 class="text-xl md:text-2xl font-black text-white">
              Señal Digital 24/7
            </h2>
            <p class="text-xs text-neutral-400">
              Transmisión ininterrumpida de noticias, debates y reportajes especiales
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3 text-xs text-neutral-400">
          <span class="inline-flex items-center gap-1.5 bg-neutral-800/80 px-3 py-1.5 rounded-lg border border-neutral-700/50">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {{ currentShow.viewers }}
          </span>
          <span class="bg-neutral-800/80 px-2.5 py-1.5 rounded-lg border border-neutral-700/50 font-mono text-neutral-300">
            {{ streamQuality }}
          </span>
        </div>
      </div>

      <!-- Reproductor Multimedia -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Pantalla de Video -->
        <div class="lg:col-span-2 relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 flex items-center justify-center group">
          <!-- Imagen de fondo de estudio de TV simulando señal -->
          <img
            src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80"
            alt="Señal en vivo Evolución TV"
            class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-102 transition-transform duration-700"
          />

          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

          <!-- Logo en esquina superior -->
          <div class="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
            <span class="text-xs font-black tracking-wider text-etv-orange-500">EVOLUCIÓN</span>
            <span class="text-[10px] bg-etv-blue-500 text-white font-bold px-1 rounded">TV</span>
            <span class="text-[10px] text-neutral-400 font-mono">VIVO</span>
          </div>

          <!-- Botón de Play Central -->
          <button
            class="relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-etv-blue-500 to-etv-orange-500 hover:brightness-110 text-white flex items-center justify-center shadow-xl shadow-etv-blue-950/60 transform hover:scale-110 transition-all cursor-pointer"
            aria-label="Reproducir señal en vivo"
          >
            <svg class="w-8 h-8 ml-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>

          <!-- Barra inferior del reproductor -->
          <div class="absolute bottom-0 inset-x-0 p-4 flex items-center justify-between text-xs text-white bg-gradient-to-t from-black/95 to-transparent">
            <div>
              <p class="font-bold text-sm md:text-base">{{ currentShow.title }}</p>
              <p class="text-neutral-400 text-xs">{{ currentShow.anchor }}</p>
            </div>
            <div class="flex items-center gap-3">
              <button
                @click="isMuted = !isMuted"
                class="p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 transition-colors"
                :title="isMuted ? 'Activar sonido' : 'Silenciar'"
              >
                <svg v-if="isMuted" class="w-4 h-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
                <svg v-else class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Parrilla de programación contigua -->
        <div class="bg-neutral-900/90 rounded-2xl p-5 border border-neutral-800 flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-bold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <svg class="w-4 h-4 text-etv-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Programación de Hoy
            </h3>

            <div class="space-y-3">
              <div class="p-3 rounded-xl bg-etv-blue-950/30 border border-etv-blue-800/40">
                <div class="flex items-center justify-between text-xs text-etv-blue-400 font-bold mb-1">
                  <span>AHORA EN VIVO</span>
                  <span>22:00 - 23:30</span>
                </div>
                <h4 class="text-sm font-bold text-white">Evolución Noticias Central</h4>
                <p class="text-xs text-neutral-400 mt-0.5">Resumen de los hechos más importantes de la jornada.</p>
              </div>

              <div class="p-3 rounded-xl bg-neutral-800/40 border border-neutral-700/30">
                <div class="flex items-center justify-between text-xs text-neutral-400 font-medium mb-1">
                  <span>SIGUIENTE</span>
                  <span>23:30 - 00:30</span>
                </div>
                <h4 class="text-sm font-bold text-neutral-200">Mesa de Análisis y Debate</h4>
                <p class="text-xs text-neutral-400 mt-0.5">Panelistas invitados examinan la agenda política.</p>
              </div>

              <div class="p-3 rounded-xl bg-neutral-800/20 border border-neutral-700/20">
                <div class="flex items-center justify-between text-xs text-neutral-500 font-medium mb-1">
                  <span>MADRUGADA</span>
                  <span>00:30 - 06:00</span>
                </div>
                <h4 class="text-sm font-bold text-neutral-300">Documentales y Reportajes ETV</h4>
                <p class="text-xs text-neutral-400 mt-0.5">Investigaciones especiales de fondo.</p>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs">
            <span class="text-neutral-400">¿Quieres participar en vivo?</span>
            <a href="mailto:redaccion@evoluciontv.com" class="text-etv-orange-400 hover:text-etv-orange-300 font-semibold underline">
              Envía tu reporte
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
