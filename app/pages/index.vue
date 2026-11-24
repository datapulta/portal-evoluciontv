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
    <!-- Hero Editorial con Tarjetas de Ligera Curvatura -->
    <section class="max-w-7xl mx-auto px-0 pt-0 pb-6 md:px-4 md:py-8">
      <div v-if="featuredArticle" class="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
        <!-- Nota Principal en Tarjeta (full-bleed en móvil, 8 columnas en escritorio) -->
        <article class="lg:col-span-8 group flex flex-col bg-white dark:bg-neutral-900/60 border-b border-x-0 border-t-0 md:border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 rounded-b-2xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
          <!-- Imagen protagonista sin texto encimado -->
          <NuxtLink
            :to="`/noticias/${featuredArticle.slug}`"
            class="block overflow-hidden bg-neutral-100 dark:bg-neutral-900 aspect-[16/10] md:aspect-[16/9]"
            :aria-label="featuredArticle.title"
          >
            <img
              v-if="featuredArticle.feature_image"
              :src="featuredArticle.feature_image"
              :alt="featuredArticle.title"
              class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            />
          </NuxtLink>

          <!-- Bloque editorial limpio debajo de la imagen -->
          <div class="p-4 sm:p-5 md:p-6 space-y-2.5">
            <div class="flex items-center gap-2.5">
              <span
                v-if="featuredArticle.primary_tag"
                class="text-xs font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400"
              >
                {{ featuredArticle.primary_tag.name }}
              </span>
              <span v-if="featuredArticle.primary_tag" class="text-neutral-300 dark:text-neutral-700">•</span>
              <span class="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Nota Principal
              </span>
            </div>

            <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-tight tracking-tight">
              <NuxtLink :to="`/noticias/${featuredArticle.slug}`">
                {{ featuredArticle.title }}
              </NuxtLink>
            </h1>

            <p class="text-neutral-600 dark:text-neutral-300 text-sm md:text-base line-clamp-3 leading-relaxed max-w-3xl">
              {{ featuredArticle.excerpt }}
            </p>

            <div class="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
              <span class="font-bold text-neutral-800 dark:text-neutral-200">
                {{ featuredArticle.primary_author?.name || 'Redacción Evolución TV' }}
              </span>
              <span>•</span>
              <span>Lectura de {{ featuredArticle.reading_time || 4 }} min</span>
            </div>
          </div>
        </article>

        <!-- Notas Secundarias (tarjetas individuales con ligera curvatura) -->
        <div
          v-if="secondaryArticles.length > 0"
          class="lg:col-span-4 flex flex-col gap-4 px-3 md:px-0"
        >
          <article
            v-for="article in secondaryArticles"
            :key="article.id"
            class="group bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 rounded-2xl p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300 flex gap-4 items-start"
          >
            <NuxtLink
              :to="`/noticias/${article.slug}`"
              class="w-28 h-24 sm:w-32 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 block"
            >
              <img
                v-if="article.feature_image"
                :src="article.feature_image"
                :alt="article.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </NuxtLink>

            <div class="flex-1 min-w-0 space-y-1">
              <span
                v-if="article.primary_tag"
                class="block text-[11px] font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400"
              >
                {{ article.primary_tag.name }}
              </span>
              <h2 class="text-sm sm:text-base font-black text-neutral-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-snug line-clamp-2">
                <NuxtLink :to="`/noticias/${article.slug}`">
                  {{ article.title }}
                </NuxtLink>
              </h2>
              <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                {{ article.excerpt }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Cuadrícula de Más Noticias -->
    <section v-if="allArticles.length > 0" class="max-w-7xl mx-auto px-4 py-8 md:py-12 border-t border-neutral-200 dark:border-neutral-900">
      <div class="flex items-center justify-between mb-8 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-6 bg-red-600 rounded-sm"></span>
          <h2 class="text-xl md:text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
            Más Noticias y Coberturas
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
    <section class="max-w-7xl mx-auto px-4 pb-24 md:pb-16">
      <div class="bg-gradient-to-r from-red-50 via-white to-neutral-50 dark:from-red-950/40 dark:via-neutral-900 dark:to-neutral-950 border border-red-200 dark:border-red-900/40 rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm dark:shadow-2xl">
        <div class="space-y-3 max-w-xl">
          <span class="text-red-600 dark:text-red-500 font-bold text-xs uppercase tracking-widest">
            Comunidad Independiente
          </span>
          <h3 class="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white">
            Recibe las noticias de Evolución TV en tu correo
          </h3>
          <p class="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
            Suscríbete a nuestro boletín matutino con las coberturas exclusivas, análisis de coyuntura y resúmenes de nuestra señal informativa.
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
