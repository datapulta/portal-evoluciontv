<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTheme } from '~/composables/useTheme'
import type { NavCategory } from '~~/server/api/categories.get'

const { isDark, toggleTheme } = useTheme()
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

// Consulta reactiva SSR de las categorías dinámicas desde Ghost CMS
const { data: remoteCategories } = await useAsyncData<NavCategory[]>(
  'nav-categories',
  () => $fetch('/api/categories')
)

interface NavItem {
  name: string
  to: string
  highlight?: boolean
  color?: string
}

const navigationItems = computed<NavItem[]>(() => {
  const items: NavItem[] = [
    { name: 'Portada', to: '/' }
  ]

  if (remoteCategories.value && remoteCategories.value.length > 0) {
    for (const cat of remoteCategories.value) {
      items.push({
        name: cat.name,
        to: `/categoria/${cat.slug}`,
        color: cat.color
      })
    }
  } else {
    items.push(
      { name: 'Coberturas ETV', to: '/categoria/coberturas-etv' },
      { name: 'Más bandas', to: '/categoria/mas-bandas' },
      { name: 'EvolucioNotas', to: '/categoria/evolucionotas' },
      { name: 'Quiénes somos', to: '/categoria/quienes-somos' }
    )
  }

  items.push(
    { name: 'Señal en Vivo', to: '/en-vivo', highlight: true },
    { name: 'Contacto', to: '/#contacto' }
  )

  return items
})
</script>

<template>
  <header class="border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 sticky top-0 z-50 backdrop-blur-md transition-colors duration-200">
    <!-- Barra superior de última hora y fecha -->
    <div class="border-b border-neutral-200/80 dark:border-neutral-800/60 bg-neutral-100/80 dark:bg-neutral-900/60 text-xs py-1.5 px-4 transition-colors">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 overflow-hidden">
          <span class="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase shrink-0 animate-pulse">
            Última Hora
          </span>
          <p class="text-neutral-700 dark:text-neutral-300 truncate font-medium">
            Evolución TV transmite cobertura especial y mesas de debate ciudadano en vivo.
          </p>
        </div>

        <div class="hidden md:flex items-center gap-4 shrink-0 text-neutral-500 dark:text-neutral-400 capitalize">
          <span>{{ currentDate }}</span>
        </div>
      </div>
    </div>

    <!-- Barra principal con Logo, Transmisión y Selector de Tema -->
    <div class="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
      <!-- Logo Evolución TV -->
      <NuxtLink to="/" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-md shadow-red-900/30 group-hover:scale-105 transition-transform">
          <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <span class="text-2xl font-black tracking-tight text-neutral-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
              EVOLUCIÓN
            </span>
            <span class="bg-red-600 text-white text-xs font-black px-1.5 py-0.5 rounded">
              TV
            </span>
          </div>
          <span class="text-[10px] tracking-widest text-neutral-500 dark:text-neutral-400 uppercase font-semibold">
            Medio Digital Independiente
          </span>
        </div>
      </NuxtLink>

      <!-- Acciones de Cabecera: Modo Claro/Oscuro + Botón En Vivo + Móvil -->
      <div class="flex items-center gap-3">
        <!-- Conmutador Modo Claro / Modo Oscuro (Desktop) -->
        <button
          @click="toggleTheme"
          type="button"
          :title="isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'"
          :aria-label="isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'"
          class="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-all cursor-pointer shadow-sm"
        >
          <!-- Ícono de Sol para cuando está en modo oscuro (indica pasar a claro) -->
          <svg v-if="isDark" class="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <!-- Ícono de Luna para cuando está en modo claro (indica pasar a oscuro) -->
          <svg v-else class="w-4 h-4 text-neutral-700 transition-transform -rotate-12 hover:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <!-- Botón Transmisión en Vivo -->
        <NuxtLink
          to="/en-vivo"
          class="hidden md:flex items-center gap-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-red-500/30 px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-sm"
        >
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          SEÑAL EN VIVO
        </NuxtLink>

        <!-- Botón menú móvil -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 focus:outline-none"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Navegación de categorías dinámicas (Desktop) -->
    <nav class="hidden md:block border-t border-neutral-200/80 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/30 transition-colors">
      <div class="max-w-7xl mx-auto px-4 flex items-center gap-7 text-sm overflow-x-auto scrollbar-none">
        <NuxtLink
          v-for="cat in navigationItems"
          :key="cat.name"
          :to="cat.to"
          :class="[
            'py-3 font-semibold transition-colors border-b-2 whitespace-nowrap',
            cat.highlight
              ? 'text-red-600 dark:text-red-400 border-red-600'
              : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white border-transparent hover:border-neutral-400 dark:hover:border-neutral-500'
          ]"
        >
          {{ cat.name }}
        </NuxtLink>
      </div>
    </nav>

    <!-- Menú móvil colapsable -->
    <div v-if="mobileMenuOpen" class="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-3 space-y-2 transition-colors">
      <div class="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <span class="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Apariencia</span>
        <button
          @click="toggleTheme"
          class="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
        >
          <span>{{ isDark ? 'Modo Oscuro Activo' : 'Modo Claro Activo' }}</span>
          <span class="text-sm">{{ isDark ? '🌙' : '☀️' }}</span>
        </button>
      </div>

      <NuxtLink
        v-for="cat in navigationItems"
        :key="cat.name"
        :to="cat.to"
        @click="mobileMenuOpen = false"
        class="block py-2 text-neutral-800 dark:text-neutral-200 font-medium hover:text-red-600 dark:hover:text-red-400"
      >
        {{ cat.name }}
      </NuxtLink>
    </div>
  </header>
</template>
