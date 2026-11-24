<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNews, type Article } from '~/composables/useNews'
import NewsCard from '~/components/NewsCard.vue'

const route = useRoute()
const router = useRouter()
const { searchArticles } = useNews()

const queryInput = ref(String(route.query.q || ''))
const searchInputRef = ref<HTMLInputElement | null>(null)
const currentQuery = computed(() => String(route.query.q || '').trim())

const { data: searchData, pending } = await useAsyncData(
  () => `search-${currentQuery.value}`,
  () => searchArticles(currentQuery.value),
  { watch: [currentQuery] }
)

const results = computed<Article[]>(() => searchData.value?.articles || [])

const suggestedCategories = [
  { name: 'Coberturas ETV', to: '/categoria/coberturas-etv' },
  { name: 'Más bandas', to: '/categoria/mas-bandas' },
  { name: 'EvolucioNotas', to: '/categoria/evolucionotas' }
]

const submitSearch = () => {
  const q = queryInput.value.trim()
  router.push({ path: '/buscar', query: q ? { q } : {} })
}

watch(() => route.query.q, (val) => {
  queryInput.value = String(val || '')
})

onMounted(() => {
  if (!currentQuery.value) {
    searchInputRef.value?.focus()
  }
})

useHead({
  title: computed(() => currentQuery.value ? `Buscar: ${currentQuery.value} | Evolución TV` : 'Buscar Noticias | Evolución TV'),
  meta: [
    {
      name: 'description',
      content: 'Buscador editorial de noticias, investigaciones y reportajes en Evolución TV.'
    }
  ]
})
</script>

<template>
  <div class="min-h-screen py-8 md:py-12 transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-4 space-y-8">
      <!-- Barra superior -->
      <div class="flex items-center justify-between gap-4">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-etv-blue-600 dark:hover:text-etv-blue-400 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la Portada
        </NuxtLink>
        <span class="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          Archivo Editorial
        </span>
      </div>

      <!-- Caja de Búsqueda -->
      <header class="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 md:p-10 shadow-sm space-y-5">
        <div class="space-y-1.5">
          <h1 class="text-2xl md:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
            Buscar en Evolución TV
          </h1>
          <p class="text-sm text-neutral-600 dark:text-neutral-400">
            Encuentra notas, reportajes especiales, autores o cobertura musical.
          </p>
        </div>

        <form @submit.prevent="submitSearch" class="flex flex-col sm:flex-row gap-3">
          <input
            ref="searchInputRef"
            v-model="queryInput"
            type="search"
            placeholder="Escribe una palabra clave, tema o artista..."
            aria-label="Término de búsqueda"
            class="flex-1 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm md:text-base px-4 py-3 rounded-xl focus:border-etv-blue-500"
          />
          <button
            type="submit"
            class="bg-etv-orange-500 hover:bg-etv-orange-400 text-neutral-950 font-black text-sm px-6 py-3 rounded-xl transition-colors cursor-pointer shadow-md shrink-0"
          >
            Buscar
          </button>
        </form>

        <div class="flex flex-wrap items-center gap-2 pt-1">
          <span class="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Secciones:</span>
          <NuxtLink
            v-for="cat in suggestedCategories"
            :key="cat.to"
            :to="cat.to"
            class="text-xs font-bold px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            {{ cat.name }}
          </NuxtLink>
        </div>
      </header>

      <!-- Estado de carga -->
      <div v-if="pending && currentQuery" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="n in 3"
          :key="n"
          class="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden animate-pulse"
        >
          <div class="aspect-video bg-neutral-200 dark:bg-neutral-800"></div>
          <div class="p-5 space-y-3">
            <div class="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4"></div>
            <div class="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
          </div>
        </div>
      </div>

      <!-- Resultados -->
      <section v-else-if="currentQuery && results.length > 0" class="space-y-6">
        <div class="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
          <h2 class="text-base md:text-lg font-bold text-neutral-900 dark:text-white">
            {{ results.length }} {{ results.length === 1 ? 'resultado' : 'resultados' }} para "{{ currentQuery }}"
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NewsCard
            v-for="article in results"
            :key="article.id"
            :post="article"
          />
        </div>
      </section>

      <!-- Sin resultados -->
      <div
        v-else-if="currentQuery && !pending"
        class="bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-10 text-center max-w-xl mx-auto space-y-3"
      >
        <h3 class="text-lg font-black text-neutral-900 dark:text-white">
          No encontramos coincidencias para "{{ currentQuery }}"
        </h3>
        <p class="text-sm text-neutral-600 dark:text-neutral-400">
          Prueba con otras palabras clave o explora directamente las categorías editoriales.
        </p>
      </div>
    </div>
  </div>
</template>
