<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNews, type Article, type PaginationMeta } from '~/composables/useNews'
import { useRadio } from '~/composables/useRadio'
import NewsCard from '~/components/NewsCard.vue'
import BannerSpot from '~/components/BannerSpot.vue'

const { getArticles } = useNews()
const { isPlaying, isLoading, currentTrack, togglePlay } = useRadio()

// Server-Side Rendering (SSR) optimizado para SEO y carga inmediata
const { data: newsResult } = await useAsyncData('home-articles', () => getArticles({ limit: 8, page: 1 }))

const extraArticles = ref<Article[]>([])
const loadingMore = ref(false)
const currentPage = ref(1)
const pagination = ref<PaginationMeta | null>(newsResult.value?.pagination || null)

const featuredArticle = computed<Article | null>(() => {
  const articles = newsResult.value?.articles || []
  return articles.find(a => a.featured) || articles[0] || null
})

const remainingArticles = computed<Article[]>(() => {
  const articles = newsResult.value?.articles || []
  if (!featuredArticle.value) return articles
  return articles.filter(a => a.id !== featuredArticle.value?.id)
})

const secondaryCount = computed(() => {
  const total = remainingArticles.value.length
  return total >= 5 ? 3 : 2
})

const secondaryArticles = computed<Article[]>(() =>
  remainingArticles.value.slice(0, secondaryCount.value)
)

const allArticles = computed<Article[]>(() => {
  const base = remainingArticles.value.slice(secondaryCount.value)
  if (extraArticles.value.length === 0) return base
  const seen = new Set([
    ...(featuredArticle.value ? [featuredArticle.value.id] : []),
    ...remainingArticles.value.map(a => a.id)
  ])
  return [...base, ...extraArticles.value.filter(a => !seen.has(a.id))]
})

const hasMoreArticles = computed(() => {
  const activeMeta = pagination.value || newsResult.value?.pagination
  return Boolean(activeMeta?.next)
})

const loadMoreArticles = async () => {
  if (loadingMore.value || !hasMoreArticles.value) return
  loadingMore.value = true
  try {
    const nextPage = currentPage.value + 1
    const res = await getArticles({ limit: 8, page: nextPage })
    const existingIds = new Set([
      ...(featuredArticle.value ? [featuredArticle.value.id] : []),
      ...remainingArticles.value.map(a => a.id),
      ...extraArticles.value.map(a => a.id)
    ])
    const uniqueNew = res.articles.filter(a => !existingIds.has(a.id))
    extraArticles.value.push(...uniqueNew)
    currentPage.value = nextPage
    pagination.value = res.pagination
  } finally {
    loadingMore.value = false
  }
}

const formatShortDate = (dateStr?: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// Boletín de Noticias (Ghost Members API)
const newsletterEmail = ref('')
const newsletterStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const newsletterMessage = ref('')

const submitNewsletter = async () => {
  const email = newsletterEmail.value.trim()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newsletterStatus.value = 'error'
    newsletterMessage.value = 'Ingresa un correo electrónico válido para suscribirte.'
    return
  }

  newsletterStatus.value = 'loading'
  newsletterMessage.value = ''

  try {
    const res = await $fetch<{ ok: boolean; status: string; message: string }>('/api/newsletter', {
      method: 'POST',
      body: { email }
    })
    newsletterStatus.value = 'success'
    newsletterMessage.value = res.message
    if (res.status === 'subscribed') {
      newsletterEmail.value = ''
    }
  } catch (err: any) {
    newsletterStatus.value = 'error'
    newsletterMessage.value = err?.data?.message || err?.data?.statusMessage || 'No pudimos completar tu suscripción. Intenta de nuevo.'
  }
}
</script>

<template>
  <div class="transition-colors duration-200">
    <!-- Banner Institucional entre Header y Artículos -->
    <BannerSpot />

    <!-- Hero Editorial con Tarjetas de Ligera Curvatura -->
    <section class="max-w-7xl mx-auto px-0 pt-0 pb-6 md:px-4 md:py-8">
      <div v-if="featuredArticle" class="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
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
          <div class="p-4 sm:p-5 md:p-6 space-y-2.5 flex flex-col flex-1 justify-between">
            <div class="space-y-2.5">
              <div class="flex items-center gap-2.5">
                <span
                  v-if="featuredArticle.primary_tag"
                  class="text-xs font-extrabold uppercase tracking-wider text-etv-orange-600 dark:text-etv-orange-400"
                >
                  {{ featuredArticle.primary_tag.name }}
                </span>
                <span v-if="featuredArticle.primary_tag" class="text-neutral-300 dark:text-neutral-700">•</span>
                <span class="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  {{ featuredArticle.featured ? 'Destacado' : 'Nota Principal' }}
                </span>
              </div>

              <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 dark:text-white group-hover:text-etv-orange-600 dark:group-hover:text-etv-orange-400 transition-colors leading-tight tracking-tight">
                <NuxtLink :to="`/noticias/${featuredArticle.slug}`">
                  {{ featuredArticle.title }}
                </NuxtLink>
              </h1>

              <p class="text-neutral-600 dark:text-neutral-300 text-sm md:text-base line-clamp-3 leading-relaxed max-w-3xl">
                {{ featuredArticle.excerpt }}
              </p>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500 dark:text-neutral-400 pt-3 border-t border-neutral-100 dark:border-neutral-800/60 mt-auto">
              <div class="flex items-center gap-2">
                <img
                  v-if="featuredArticle.primary_author?.profile_image"
                  :src="featuredArticle.primary_author.profile_image"
                  :alt="featuredArticle.primary_author.name"
                  class="w-5 h-5 rounded-full object-cover"
                />
                <span class="font-bold text-neutral-800 dark:text-neutral-200">
                  {{ featuredArticle.primary_author?.name || 'Redacción Evolución TV' }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="featuredArticle.published_at">{{ formatShortDate(featuredArticle.published_at) }}</span>
                <span v-if="featuredArticle.published_at">•</span>
                <span>{{ featuredArticle.reading_time || 4 }} min de lectura</span>
              </div>
            </div>
          </div>
        </article>

        <!-- Notas Secundarias compactas + Bloque de Señal en Directo -->
        <div
          v-if="secondaryArticles.length > 0"
          class="lg:col-span-4 flex flex-col gap-4 px-3 md:px-0"
        >
          <article
            v-for="article in secondaryArticles"
            :key="article.id"
            class="group bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 rounded-2xl p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300 flex gap-3.5 sm:gap-4 items-start"
          >
            <NuxtLink
              :to="`/noticias/${article.slug}`"
              class="w-28 h-24 sm:w-32 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 block"
            >
              <img
                v-if="article.feature_image"
                :src="article.feature_image"
                :alt="article.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </NuxtLink>

            <div class="flex-1 min-w-0 space-y-1.5">
              <span
                v-if="article.primary_tag"
                class="block text-[11px] font-extrabold uppercase tracking-wider text-etv-blue-600 dark:text-etv-blue-400"
              >
                {{ article.primary_tag.name }}
              </span>
              <h2 class="text-sm sm:text-base font-black text-neutral-900 dark:text-white group-hover:text-etv-orange-600 dark:group-hover:text-etv-orange-400 transition-colors leading-snug line-clamp-2">
                <NuxtLink :to="`/noticias/${article.slug}`">
                  {{ article.title }}
                </NuxtLink>
              </h2>
              <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                {{ article.excerpt }}
              </p>

              <div class="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 pt-0.5">
                <span v-if="article.published_at">{{ formatShortDate(article.published_at) }}</span>
                <span v-if="article.reading_time">• {{ article.reading_time }} min</span>
              </div>
            </div>
          </article>

          <!-- Bloque compacto de Señal en Directo para equilibrar la columna lateral -->
          <aside class="bg-gradient-to-br from-etv-blue-50 via-white to-etv-orange-50 dark:from-etv-blue-950/30 dark:via-neutral-900/90 dark:to-etv-orange-950/20 border border-etv-blue-200 dark:border-etv-blue-900/50 rounded-2xl p-4 shadow-sm space-y-3.5">
            <div class="flex items-center justify-between gap-2">
              <span class="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-etv-blue-600 dark:text-etv-blue-400">
                <span class="w-2 h-2 rounded-full bg-etv-blue-500 animate-pulse"></span>
                Señal Digital 24/7
              </span>
              <NuxtLink
                to="/en-vivo"
                class="text-[11px] font-bold text-etv-orange-600 dark:text-etv-orange-400 hover:underline"
              >
                Cabina TV →
              </NuxtLink>
            </div>

            <div class="flex items-center gap-3">
              <button
                type="button"
                @click="togglePlay"
                :aria-label="isPlaying ? 'Pausar Evolución Radio' : 'Escuchar Evolución Radio'"
                class="w-11 h-11 rounded-full bg-gradient-to-br from-etv-blue-500 to-etv-orange-500 hover:brightness-110 text-white flex items-center justify-center shrink-0 shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <svg v-if="isLoading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <svg v-else-if="isPlaying" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
                <svg v-else class="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>

              <div class="min-w-0 flex-1">
                <NuxtLink to="/radio" class="text-sm font-black text-neutral-900 dark:text-white hover:text-etv-orange-600 dark:hover:text-etv-orange-400 transition-colors">
                  Evolución Radio en Vivo
                </NuxtLink>
                <ClientOnly>
                  <p class="text-xs text-neutral-600 dark:text-neutral-300 truncate" :title="currentTrack">
                    {{ isPlaying ? `Sonando: ${currentTrack}` : currentTrack }}
                  </p>
                  <template #fallback>
                    <p class="text-xs text-neutral-600 dark:text-neutral-300 truncate">Señal Digital 24/7</p>
                  </template>
                </ClientOnly>
              </div>
            </div>

            <div class="pt-2.5 border-t border-neutral-200/80 dark:border-neutral-800 flex flex-wrap items-center gap-1.5">
              <NuxtLink
                to="/categoria/coberturas-etv"
                class="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-etv-orange-500 transition-colors"
              >
                Coberturas ETV
              </NuxtLink>
              <NuxtLink
                to="/categoria/evolucionotas"
                class="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-etv-blue-500 transition-colors"
              >
                EvolucioNotas
              </NuxtLink>
              <NuxtLink
                to="/categoria/mas-bandas"
                class="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-etv-orange-500 transition-colors"
              >
                Más bandas
              </NuxtLink>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- Cuadrícula de Más Noticias -->
    <section v-if="allArticles.length > 0" class="max-w-7xl mx-auto px-4 py-8 md:py-12 border-t border-neutral-200 dark:border-neutral-900">
      <div class="flex items-center justify-between mb-8 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-6 bg-gradient-to-b from-etv-orange-500 to-etv-blue-500 rounded-sm"></span>
          <h2 class="text-xl md:text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
            Más Noticias y Coberturas
          </h2>
        </div>
        <div class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          <span class="w-2 h-2 rounded-full bg-etv-blue-500"></span>
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

      <!-- Paginación Real -->
      <div v-if="hasMoreArticles" class="mt-10 flex justify-center">
        <button
          type="button"
          :disabled="loadingMore"
          @click="loadMoreArticles"
          class="inline-flex items-center gap-2 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white font-bold text-sm px-6 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:border-etv-blue-500 shadow-sm transition-colors cursor-pointer disabled:opacity-60"
        >
          <span>{{ loadingMore ? 'Cargando noticias...' : 'Cargar más noticias' }}</span>
        </button>
      </div>
    </section>

    <!-- Sección de Suscripción / Boletín de Evolución TV -->
    <section class="max-w-7xl mx-auto px-4 pb-24 md:pb-16">
      <div class="bg-gradient-to-r from-etv-orange-50 via-white to-etv-blue-50 dark:from-etv-orange-950/30 dark:via-neutral-900 dark:to-etv-blue-950/30 border border-etv-orange-200 dark:border-etv-blue-900/40 rounded-3xl p-5 sm:p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 shadow-sm dark:shadow-2xl">
        <div class="space-y-3 max-w-xl">
          <span class="text-etv-blue-600 dark:text-etv-blue-400 font-bold text-xs uppercase tracking-widest">
            Comunidad Independiente
          </span>
          <h3 class="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white">
            Recibe las noticias de Evolución TV en tu correo
          </h3>
          <p class="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
            Suscríbete a nuestro boletín matutino con las coberturas exclusivas, análisis de coyuntura y resúmenes de nuestra señal informativa.
          </p>
        </div>

        <div class="w-full lg:w-auto space-y-2.5">
          <form @submit.prevent="submitNewsletter" class="flex flex-col sm:flex-row gap-3">
            <input
              v-model="newsletterEmail"
              type="email"
              required
              :disabled="newsletterStatus === 'loading'"
              placeholder="tu.correo@ejemplo.com"
              aria-label="Correo electrónico para el boletín"
              class="w-full sm:w-auto sm:min-w-[280px] bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm px-4 py-3 rounded-xl focus:border-etv-blue-500 shadow-inner disabled:opacity-60"
            />
            <button
              type="submit"
              :disabled="newsletterStatus === 'loading'"
              class="bg-etv-orange-500 hover:bg-etv-orange-400 text-neutral-950 font-black text-sm px-6 py-3 rounded-xl transition-colors cursor-pointer shadow-lg shadow-etv-orange-900/20 disabled:opacity-60 shrink-0"
            >
              {{ newsletterStatus === 'loading' ? 'Registrando...' : 'Suscribirme' }}
            </button>
          </form>

          <p
            v-if="newsletterMessage"
            :class="[
              'text-xs font-semibold px-1',
              newsletterStatus === 'success'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-etv-orange-700 dark:text-etv-orange-400'
            ]"
            role="status"
          >
            {{ newsletterMessage }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
