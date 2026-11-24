<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useNews, type Article, type PaginationMeta } from '~/composables/useNews'
import NewsCard from '~/components/NewsCard.vue'
import type { NavCategory } from '~~/server/api/categories.get'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

// Cargar catálogo de categorías para metadatos
const { data: allCategories } = await useAsyncData<NavCategory[]>(
  'category-meta',
  () => $fetch('/api/categories')
)

const currentCategory = computed<NavCategory | null>(() => {
  return (allCategories.value || []).find(c => c.slug === slug.value) || null
})

// Cargar artículos asociados a la categoría
const { getArticles } = useNews()
const { data: categoryData, pending } = await useAsyncData(
  `category-articles-${slug.value}`,
  () => getArticles({ filter: `tag:${slug.value}`, limit: 9, page: 1 }),
  { watch: [slug] }
)

const extraArticles = ref<Article[]>([])
const currentPage = ref(1)
const loadingMore = ref(false)
const pagination = ref<PaginationMeta | null>(categoryData.value?.pagination || null)

watch(slug, () => {
  extraArticles.value = []
  currentPage.value = 1
  pagination.value = null
})

watch(categoryData, (val) => {
  if (val) pagination.value = val.pagination
})

const articles = computed<Article[]>(() => {
  const base = categoryData.value?.articles || []
  if (extraArticles.value.length === 0) return base
  const seen = new Set(base.map(a => a.id))
  return [...base, ...extraArticles.value.filter(a => !seen.has(a.id))]
})

const hasMore = computed(() => Boolean(pagination.value?.next))

const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  try {
    const nextPage = currentPage.value + 1
    const res = await getArticles({ filter: `tag:${slug.value}`, limit: 9, page: nextPage })
    const existingIds = new Set(articles.value.map(a => a.id))
    extraArticles.value.push(...res.articles.filter(a => !existingIds.has(a.id)))
    currentPage.value = nextPage
    pagination.value = res.pagination
  } finally {
    loadingMore.value = false
  }
}

// Metadatos SEO dinámicos
useHead({
  title: computed(() => currentCategory.value ? `${currentCategory.value.name} | Evolución TV` : 'Categoría | Evolución TV'),
  meta: [
    {
      name: 'description',
      content: computed(() => currentCategory.value?.description || 'Coberturas y notas periodísticas de Evolución TV.')
    }
  ]
})
</script>

<template>
  <div class="min-h-screen py-8 md:py-12 transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Barra superior / Retorno a Portada -->
      <div class="mb-8 flex items-center justify-between gap-4">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la Portada
        </NuxtLink>

        <NuxtLink
          to="/buscar"
          class="text-xs text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
        >
          Buscar en el archivo →
        </NuxtLink>
      </div>

      <!-- Cabecera de la Categoría -->
      <header class="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 md:p-10 mb-10 shadow-sm transition-colors">
        <div class="flex items-center gap-3 mb-4">
          <span
            class="w-3.5 h-3.5 rounded-full"
            :style="{ backgroundColor: currentCategory?.color || '#dc2626' }"
          ></span>
          <span
            class="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white shadow-sm"
            :style="{ backgroundColor: currentCategory?.color || '#dc2626' }"
          >
            {{ currentCategory?.name || slug }}
          </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tight mb-3">
          {{ currentCategory?.name || 'Sección Editorial' }}
        </h1>

        <p class="text-sm md:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          {{ currentCategory?.description || 'Despachos, investigaciones y coberturas periodísticas en esta sección.' }}
        </p>
      </header>

      <!-- Estado de carga (Skeleton) -->
      <div v-if="pending && articles.length === 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="n in 6"
          :key="n"
          class="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden animate-pulse"
        >
          <div class="aspect-video bg-neutral-200 dark:bg-neutral-800"></div>
          <div class="p-5 space-y-3">
            <div class="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-5/6"></div>
            <div class="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
            <div class="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3"></div>
          </div>
        </div>
      </div>

      <!-- Cuadrícula de Artículos de la Categoría -->
      <section v-else-if="articles.length > 0">
        <div class="flex items-center justify-between mb-6 pb-2 border-b border-neutral-200 dark:border-neutral-800">
          <h2 class="text-lg font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            Artículos y Coberturas Publicadas ({{ pagination?.total || articles.length }})
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NewsCard
            v-for="article in articles"
            :key="article.id"
            :post="article"
          />
        </div>

        <div v-if="hasMore" class="mt-10 flex justify-center">
          <button
            type="button"
            :disabled="loadingMore"
            @click="loadMore"
            class="inline-flex items-center gap-2 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white font-bold text-sm px-6 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 shadow-sm transition-colors cursor-pointer disabled:opacity-60"
          >
            {{ loadingMore ? 'Cargando artículos...' : 'Cargar más artículos' }}
          </button>
        </div>
      </section>

      <!-- Estado Vacío amigable para categorías recién creadas -->
      <div
        v-else
        class="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-12 text-center max-w-2xl mx-auto space-y-4 my-8 shadow-sm"
      >
        <div class="w-14 h-14 mx-auto rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-600 dark:text-red-400">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <h3 class="text-xl font-black text-neutral-900 dark:text-white">
          Próximas publicaciones en preparación
        </h3>
        <p class="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
          Nuestra mesa de redacción está preparando las próximas coberturas e investigaciones especiales para esta sección.
        </p>
        <div class="pt-2 flex flex-wrap justify-center gap-3">
          <NuxtLink
            to="/"
            class="inline-block bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-800 dark:hover:bg-neutral-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-xs"
          >
            Explorar Portada General
          </NuxtLink>
          <NuxtLink
            to="/buscar"
            class="inline-block bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 font-bold px-5 py-2.5 rounded-xl transition-colors text-xs"
          >
            Buscar Noticias
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
