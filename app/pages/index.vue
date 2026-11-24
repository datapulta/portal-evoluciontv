<script setup lang="ts">
import { computed } from 'vue'
import { useNews, type Article } from '~/composables/useNews'
import NewsCard from '~/components/NewsCard.vue'

const { getArticles } = useNews()

// Server-Side Rendering (SSR) optimizado para SEO y carga inmediata
const { data: newsResult } = await useAsyncData('home-articles', () => getArticles({ limit: 8 }))

const featuredArticle = computed<Article | null>(() => newsResult.value?.articles?.[0] || null)
const secondaryArticles = computed<Article[]>(() => newsResult.value?.articles?.slice(1, 3) || [])
const allArticles = computed<Article[]>(() => newsResult.value?.articles?.slice(3) || [])
</script>

<template>
  <div class="transition-colors duration-200">
    <!-- Hero de Noticias Destacadas -->
    <section class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-6 bg-red-600 rounded-sm"></span>
          <h1 class="text-xl md:text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
            Noticias Destacadas
          </h1>
        </div>
        <span class="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Edición en Tiempo Real</span>
      </div>

      <div v-if="featuredArticle" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Nota Principal (8 columnas) -->
        <article class="lg:col-span-8 group relative bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-end min-h-[420px] md:min-h-[500px]">
          <!-- Enlace clickeable sobre la imagen y fondo -->
          <NuxtLink
            :to="`/noticias/${featuredArticle.slug}`"
            class="absolute inset-0 z-0 block cursor-pointer"
            :aria-label="featuredArticle.title"
          >
            <img
              v-if="featuredArticle.feature_image"
              :src="featuredArticle.feature_image"
              :alt="featuredArticle.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent"></div>
          </NuxtLink>

          <div class="relative z-10 p-6 md:p-8 space-y-3 pointer-events-none">
            <div class="flex items-center gap-2 pointer-events-auto">
              <span class="bg-red-600 text-white font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-md shadow-md">
                Nota Principal
              </span>
              <span
                v-if="featuredArticle.primary_tag"
                class="bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md"
              >
                {{ featuredArticle.primary_tag.name }}
              </span>
            </div>

            <h2 class="text-2xl md:text-4xl font-black text-white group-hover:text-red-400 transition-colors leading-tight pointer-events-auto">
              <NuxtLink :to="`/noticias/${featuredArticle.slug}`">
                {{ featuredArticle.title }}
              </NuxtLink>
            </h2>

            <p class="text-neutral-200 text-sm md:text-base line-clamp-2 max-w-3xl leading-relaxed">
              {{ featuredArticle.excerpt }}
            </p>

            <div class="flex items-center gap-4 text-xs text-neutral-300 pt-2">
              <span class="font-bold text-white">
                {{ featuredArticle.primary_author?.name || 'Redacción Evolución TV' }}
              </span>
              <span>•</span>
              <span>Lectura de {{ featuredArticle.reading_time || 4 }} min</span>
            </div>
          </div>
        </article>

        <!-- Dos Noticias Secundarias (4 columnas) -->
        <div class="lg:col-span-4 flex flex-col gap-6">
          <NewsCard
            v-for="article in secondaryArticles"
            :key="article.id"
            :post="article"
            class="flex-1"
          />
        </div>
      </div>
    </section>

    <!-- Cuadrícula de Más Noticias e Investigaciones -->
    <section class="max-w-7xl mx-auto px-4 py-8 md:py-12 border-t border-neutral-200 dark:border-neutral-900">
      <div class="flex items-center justify-between mb-8 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-6 bg-red-600 rounded-sm"></span>
          <h2 class="text-xl md:text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
            Investigación y Actualidad
          </h2>
        </div>
        <div class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          Actualizado por la Redacción
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NewsCard
          v-for="article in allArticles"
          :key="article.id"
          :post="article"
        />
      </div>
    </section>

    <!-- Sección de Suscripción / Boletín de Evolución TV -->
    <section class="max-w-7xl mx-auto px-4 pb-16">
      <div class="bg-gradient-to-r from-red-50 via-white to-neutral-50 dark:from-red-950/40 dark:via-neutral-900 dark:to-neutral-950 border border-red-200 dark:border-red-900/40 rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm dark:shadow-2xl">
        <div class="space-y-3 max-w-xl">
          <span class="text-red-600 dark:text-red-500 font-bold text-xs uppercase tracking-widest">
            Comunidad Independiente
          </span>
          <h3 class="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white">
            Recibe las noticias de Evolución TV en tu correo
          </h3>
          <p class="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
            Suscríbete a nuestro boletín matutino con las investigaciones exclusivas, análisis de coyuntura y resúmenes de nuestra señal informativa.
          </p>
        </div>

        <form @submit.prevent class="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="tu.correo@ejemplo.com"
            class="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-red-500 min-w-[280px] shadow-inner"
          />
          <button
            type="submit"
            class="bg-red-600 hover:bg-red-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors cursor-pointer shadow-lg shadow-red-900/30"
          >
            Suscribirme
          </button>
        </form>
      </div>
    </section>
  </div>
</template>
