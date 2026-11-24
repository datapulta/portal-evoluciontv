<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useNews, type Article } from '~/composables/useNews'
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
  () => getArticles({ filter: `tag:${slug.value}`, limit: 12 }),
  { watch: [slug] }
)

const articles = computed<Article[]>(() => {
  return categoryData.value?.articles || []
})

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
      <div class="mb-8 flex items-center justify-between">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la Portada
        </NuxtLink>

        <span class="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          Sección Editorial Oficial
        </span>
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

      <!-- Cuadrícula de Artículos de la Categoría -->
      <section v-if="articles.length > 0">
        <div class="flex items-center justify-between mb-6 pb-2 border-b border-neutral-200 dark:border-neutral-800">
          <h2 class="text-lg font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            Artículos y Coberturas Publicadas ({{ articles.length }})
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NewsCard
            v-for="article in articles"
            :key="article.id"
            :post="article"
          />
        </div>
      </section>

      <!-- Estado Vacío amigable para categorías recién creadas -->
      <div
        v-else-if="!pending"
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
        <div class="pt-2">
          <NuxtLink
            to="/"
            class="inline-block bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-800 dark:hover:bg-neutral-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-xs"
          >
            Explorar Portada General
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
