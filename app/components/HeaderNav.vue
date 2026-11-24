<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isLive = ref(true)
const currentDate = ref('')
const mobileMenuOpen = ref(false)

onMounted(() => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const categories = [
  { name: 'Portada', href: '#' },
  { name: 'Nacional', href: '#nacional' },
  { name: 'Política', href: '#politica' },
  { name: 'Economía', href: '#economia' },
  { name: 'Investigación', href: '#investigacion' },
  { name: 'Señal en Vivo', href: '#en-vivo', highlight: true },
  { name: 'Opinión', href: '#opinion' }
]
</script>

<template>
  <header class="border-b border-neutral-800 bg-neutral-950/95 sticky top-0 z-50 backdrop-blur-md">
    <!-- Barra superior de última hora y fecha -->
    <div class="border-b border-neutral-800/60 bg-neutral-900/60 text-xs py-1.5 px-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 overflow-hidden">
          <span class="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase shrink-0 animate-pulse">
            Última Hora
          </span>
          <p class="text-neutral-300 truncate font-medium">
            Evolución TV transmite cobertura especial y mesas de debate ciudadano en vivo.
          </p>
        </div>

        <div class="hidden md:flex items-center gap-4 shrink-0 text-neutral-400 capitalize">
          <span>{{ currentDate }}</span>
          <span class="text-neutral-700">|</span>
          <a
            href="https://cms-etv.webia.studio/ghost"
            target="_blank"
            class="text-neutral-300 hover:text-red-400 transition-colors flex items-center gap-1 font-semibold"
          >
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            Panel de Redacción
          </a>
        </div>
      </div>
    </div>

    <!-- Barra principal con Logo -->
    <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Logo Evolución TV -->
      <a href="/" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-950/50 group-hover:scale-105 transition-transform">
          <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <span class="text-2xl font-black tracking-tight text-white group-hover:text-red-500 transition-colors">
              EVOLUCIÓN
            </span>
            <span class="bg-red-600 text-white text-xs font-black px-1.5 py-0.5 rounded">
              TV
            </span>
          </div>
          <span class="text-[10px] tracking-widest text-neutral-400 uppercase font-semibold">
            Medio Digital Independiente
          </span>
        </div>
      </a>

      <!-- Botón Transmisión en Vivo -->
      <div class="flex items-center gap-3">
        <a
          href="#en-vivo"
          class="flex items-center gap-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 border border-red-500/30 px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-sm"
        >
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          SEÑAL EN VIVO
        </a>

        <!-- Botón menú móvil -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 focus:outline-none"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Navegación de categorías -->
    <nav class="hidden md:block border-t border-neutral-800/60 bg-neutral-900/30">
      <div class="max-w-7xl mx-auto px-4 flex items-center gap-8 text-sm">
        <a
          v-for="cat in categories"
          :key="cat.name"
          :href="cat.href"
          :class="[
            'py-3 font-semibold transition-colors border-b-2',
            cat.highlight
              ? 'text-red-400 border-red-600'
              : 'text-neutral-300 hover:text-white border-transparent hover:border-neutral-500'
          ]"
        >
          {{ cat.name }}
        </a>
      </div>
    </nav>

    <!-- Menú móvil colapsable -->
    <div v-if="mobileMenuOpen" class="md:hidden border-t border-neutral-800 bg-neutral-900 px-4 py-3 space-y-2">
      <a
        v-for="cat in categories"
        :key="cat.name"
        :href="cat.href"
        @click="mobileMenuOpen = false"
        class="block py-2 text-neutral-200 font-medium hover:text-red-400"
      >
        {{ cat.name }}
      </a>
      <a
        href="https://cms-etv.webia.studio/ghost"
        target="_blank"
        class="block py-2 text-emerald-400 font-semibold border-t border-neutral-800 pt-3"
      >
        Acceso Redacción (CMS)
      </a>
    </div>
  </header>
</template>
