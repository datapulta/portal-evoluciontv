<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from '~/composables/useTheme'
import { useNews } from '~/composables/useNews'
import SocialLinks from '~/components/SocialLinks.vue'
import BrandMark from '~/components/BrandMark.vue'
import type { NavCategory } from '~~/server/api/categories.get'

const route = useRoute()
const router = useRouter()
const { isDark, toggleTheme } = useTheme()
const { getArticles } = useNews()

const currentDate = ref('')
const mobileMenuOpen = ref(false)
const searchOpen = ref(false)
const searchQuery = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const toggleSearch = () => {
  searchOpen.value = !searchOpen.value
  if (searchOpen.value) {
    mobileMenuOpen.value = false
    nextTick(() => {
      searchInputRef.value?.focus()
    })
  }
}

const submitSearch = () => {
  const q = searchQuery.value.trim()
  if (!q) return
  searchOpen.value = false
  mobileMenuOpen.value = false
  router.push({ path: '/buscar', query: { q } })
}

// Consulta reactiva SSR de las categorías dinámicas desde Ghost CMS
const { data: remoteCategories } = await useAsyncData<NavCategory[]>(
  'nav-categories',
  () => $fetch('/api/categories')
)

// Nota más reciente para la barra de Última Hora
const { data: breakingData } = await useAsyncData(
  'header-breaking-news',
  () => getArticles({ limit: 1 })
)
const breakingNews = computed(() => breakingData.value?.articles?.[0] || null)

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
        to: cat.slug === 'quienes-somos' ? '/quienes-somos' : `/categoria/${cat.slug}`,
        color: cat.color
      })
    }
  } else {
    items.push(
      { name: 'Coberturas ETV', to: '/categoria/coberturas-etv' },
      { name: 'Más bandas', to: '/categoria/mas-bandas' },
      { name: 'EvolucioNotas', to: '/categoria/evolucionotas' },
      { name: 'Quiénes somos', to: '/quienes-somos' }
    )
  }

  items.push(
    { name: 'Evolución Radio', to: '/radio' },
    { name: 'Señal en Vivo', to: '/en-vivo', highlight: true },
    { name: 'Contacto', to: '/#contacto' }
  )

  return items
})

const isActiveRoute = (to: string) => {
  if (to === '/') return route.path === '/' && !route.hash
  if (to === '/#contacto') return route.path === '/' && route.hash === '#contacto'
  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <header class="border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 sticky top-0 z-50 backdrop-blur-md transition-colors duration-200">
    <!-- Barra superior de última hora y fecha -->
    <div class="border-b border-neutral-200/80 dark:border-neutral-800/60 bg-neutral-100/80 dark:bg-neutral-900/60 text-xs py-1.5 px-4 transition-colors">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 overflow-hidden">
          <span class="bg-etv-orange-500 text-neutral-950 font-black px-2 py-0.5 rounded text-[10px] tracking-wider uppercase shrink-0 animate-pulse">
            Última Hora
          </span>
          <NuxtLink
            v-if="breakingNews"
            :to="`/noticias/${breakingNews.slug}`"
            class="text-neutral-700 dark:text-neutral-300 hover:text-etv-blue-600 dark:hover:text-etv-blue-400 truncate font-medium transition-colors"
            :title="breakingNews.title"
          >
            {{ breakingNews.title }}
          </NuxtLink>
          <p v-else class="text-neutral-700 dark:text-neutral-300 truncate font-medium">
            Evolución TV transmite cobertura especial y mesas de debate ciudadano en vivo.
          </p>
        </div>

        <div class="hidden md:flex items-center gap-4 shrink-0 text-neutral-500 dark:text-neutral-400 capitalize">
          <span>{{ currentDate }}</span>
          <span class="text-neutral-300 dark:text-neutral-700">|</span>
          <SocialLinks compact />
        </div>
      </div>
    </div>

    <!-- Barra principal con Logo, Transmisión, Buscador y Selector de Tema -->
    <div class="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
      <!-- Logo Evolución TV -->
      <NuxtLink to="/" class="flex items-center gap-3 group shrink-0">
        <BrandMark />
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <span class="text-2xl font-black tracking-tight text-neutral-900 dark:text-white group-hover:text-etv-orange-600 dark:group-hover:text-etv-orange-400 transition-colors">
              EVOLUCIÓN
            </span>
            <span class="bg-etv-orange-500 text-neutral-950 text-xs font-black px-1.5 py-0.5 rounded">
              TV
            </span>
          </div>
          <span class="text-[10px] tracking-widest text-neutral-500 dark:text-neutral-400 uppercase font-semibold">
            Medio Digital Independiente
          </span>
        </div>
      </NuxtLink>

      <!-- Acciones de Cabecera: Buscador + Modo Claro/Oscuro + Botón En Vivo + Móvil -->
      <div class="flex items-center gap-2.5 sm:gap-3">
        <!-- Botón Buscador -->
        <button
          @click="toggleSearch"
          type="button"
          title="Buscar noticias"
          aria-label="Buscar noticias"
          :aria-expanded="searchOpen"
          class="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-all cursor-pointer shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        <!-- Conmutador Modo Claro / Modo Oscuro -->
        <button
          @click="toggleTheme"
          type="button"
          :title="isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'"
          :aria-label="isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'"
          class="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-all cursor-pointer shadow-sm"
        >
          <svg v-if="isDark" class="w-4 h-4 text-etv-orange-400 transition-transform rotate-0 hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="w-4 h-4 text-etv-blue-600 transition-transform -rotate-12 hover:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <!-- Botón Transmisión en Vivo -->
        <NuxtLink
          to="/en-vivo"
          class="hidden md:flex items-center gap-2.5 bg-etv-blue-500/10 hover:bg-etv-blue-500/20 text-etv-blue-600 dark:text-etv-blue-400 hover:text-etv-blue-700 dark:hover:text-etv-blue-300 border border-etv-blue-500/35 px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-sm"
        >
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-etv-blue-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-etv-blue-500"></span>
          </span>
          SEÑAL EN VIVO
        </NuxtLink>

        <!-- Botón menú móvil -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen; searchOpen = false"
          :aria-expanded="mobileMenuOpen"
          aria-label="Abrir menú de navegación"
          class="md:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
        >
          <svg v-if="!mobileMenuOpen" class="w-6 h-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          <svg v-else class="w-6 h-6 transition-transform duration-200 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Buscador desplegable -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="searchOpen" class="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/95 dark:bg-neutral-900/95 px-4 py-3">
        <form @submit.prevent="submitSearch" class="max-w-3xl mx-auto flex items-center gap-2">
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="search"
            placeholder="Buscar noticias, reportajes, artistas o temas..."
            class="flex-1 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm px-4 py-2 rounded-xl focus:border-etv-blue-500"
          />
          <button
            type="submit"
            class="bg-etv-orange-500 hover:bg-etv-orange-400 text-neutral-950 text-xs font-black px-4 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            Buscar
          </button>
          <button
            type="button"
            @click="searchOpen = false"
            class="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg cursor-pointer"
            aria-label="Cerrar buscador"
          >
            ✕
          </button>
        </form>
      </div>
    </Transition>

    <!-- Navegación de categorías dinámicas centrada en Desktop -->
    <nav class="hidden md:block border-t border-neutral-200/80 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/30 transition-colors">
      <div class="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-6 lg:gap-x-7 text-sm">
        <NuxtLink
          v-for="cat in navigationItems"
          :key="cat.name"
          :to="cat.to"
          :class="[
            'py-3 font-semibold transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5',
            isActiveRoute(cat.to)
              ? 'text-etv-orange-600 dark:text-etv-orange-400 border-etv-orange-500 font-bold'
              : cat.highlight
                ? 'text-etv-blue-600 dark:text-etv-blue-400 border-transparent hover:border-etv-blue-500/60 hover:text-etv-blue-700 dark:hover:text-etv-blue-300'
                : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white border-transparent hover:border-etv-blue-400 dark:hover:border-etv-blue-500'
          ]"
        >
          <span v-if="cat.highlight" class="w-1.5 h-1.5 rounded-full bg-etv-blue-500 animate-pulse"></span>
          {{ cat.name }}
        </NuxtLink>
      </div>
    </nav>

    <!-- Menú móvil colapsable con transición moderna -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2 scale-[0.98]"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-2 scale-[0.98]"
    >
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md px-4 py-3 space-y-2 shadow-xl">
        <div class="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
          <span class="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Apariencia</span>
          <button
            @click="toggleTheme"
            class="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 cursor-pointer"
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
          :class="[
            'block py-2 px-2 rounded-lg font-medium transition-colors',
            isActiveRoute(cat.to)
              ? 'bg-etv-orange-50 dark:bg-etv-orange-950/40 text-etv-orange-600 dark:text-etv-orange-400 font-bold'
              : 'text-neutral-800 dark:text-neutral-200 hover:text-etv-orange-600 dark:hover:text-etv-orange-400'
          ]"
        >
          {{ cat.name }}
        </NuxtLink>

        <div class="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <span class="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Síguenos</span>
          <SocialLinks compact />
        </div>
      </div>
    </Transition>
  </header>
</template>
