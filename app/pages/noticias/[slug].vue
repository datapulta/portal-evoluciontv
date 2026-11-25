<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useNews } from '~/composables/useNews'
import NewsCard from '~/components/NewsCard.vue'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { getArticleBySlug, getArticles } = useNews()

// Carga del artículo principal
const { data: article, pending } = await useAsyncData(
  `article-${slug.value}`,
  () => getArticleBySlug(slug.value),
  { watch: [slug] }
)

// Carga de notas para navegación secuencial y carrusel inferior
const { data: relatedData } = await useAsyncData('related-news', () => getArticles({ limit: 8 }))

const allFeedArticles = computed(() => relatedData.value?.articles || [])

const currentIndex = computed(() =>
  allFeedArticles.value.findIndex(a => a.slug === slug.value)
)

const prevArticle = computed(() => {
  if (currentIndex.value > 0) {
    return allFeedArticles.value[currentIndex.value - 1]
  }
  return null
})

const nextArticle = computed(() => {
  if (currentIndex.value >= 0 && currentIndex.value < allFeedArticles.value.length - 1) {
    return allFeedArticles.value[currentIndex.value + 1]
  }
  if (currentIndex.value === -1 && allFeedArticles.value.length > 0) {
    return allFeedArticles.value[0]
  }
  return null
})

const relatedArticles = computed(() => {
  return allFeedArticles.value.filter(a => a.slug !== slug.value)
})

const sliderRef = ref<HTMLElement | null>(null)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)

const updateSliderState = () => {
  const el = sliderRef.value
  if (!el) return
  canScrollPrev.value = el.scrollLeft > 4
  canScrollNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
}

const scrollSlider = (direction: 'prev' | 'next') => {
  if (!sliderRef.value) return
  const offset = Math.max(320, sliderRef.value.clientWidth * 0.75)
  sliderRef.value.scrollBy({
    left: direction === 'next' ? offset : -offset,
    behavior: 'smooth'
  })
}

const readingProgress = ref(0)
const showBackToTop = ref(false)
const canNativeShare = ref(false)

const updateReadingMetrics = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  readingProgress.value = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0
  showBackToTop.value = scrollTop > 500
}

const scrollToTop = () => {
  if (typeof window === 'undefined') return
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  nextTick(updateSliderState)
  canNativeShare.value = typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  window.addEventListener('scroll', updateReadingMetrics, { passive: true })
  updateReadingMetrics()
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', updateReadingMetrics)
  }
})

watch(relatedArticles, () => {
  nextTick(updateSliderState)
})

const SITE_URL = 'https://etv.webia.studio'
const canonicalUrl = computed(() => `${SITE_URL}/noticias/${slug.value}`)
const copiedLink = ref(false)

const copyArticleLink = async () => {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return
  try {
    await navigator.clipboard.writeText(canonicalUrl.value)
    copiedLink.value = true
    setTimeout(() => {
      copiedLink.value = false
    }, 2000)
  } catch {}
}

const nativeShare = async () => {
  if (typeof navigator === 'undefined' || !navigator.share || !article.value) return
  try {
    await navigator.share({
      title: article.value.title,
      text: article.value.excerpt || article.value.title,
      url: canonicalUrl.value
    })
  } catch {}
}

const whatsappShareUrl = computed(() => {
  const title = article.value?.title || 'Evolución TV'
  return `https://wa.me/?text=${encodeURIComponent(`${title} — ${canonicalUrl.value}`)}`
})

const xShareUrl = computed(() => {
  const title = article.value?.title || 'Evolución TV'
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(canonicalUrl.value)}`
})

const facebookShareUrl = computed(() => {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl.value)}`
})

const chatGptUrl = computed(() => {
  const prompt = `Resume y analiza los puntos clave de este artículo de Evolución TV: ${canonicalUrl.value}`
  return `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`
})

const perplexityUrl = computed(() => {
  const prompt = `Analiza y resume este artículo de Evolución TV: ${canonicalUrl.value}`
  return `https://www.perplexity.ai/search?q=${encodeURIComponent(prompt)}`
})

// Omite el primer párrafo del cuerpo si ya se despliega en el encabezado como excerpt/bajada
const formattedArticleHtml = computed(() => {
  if (!article.value?.html) return ''
  const html = article.value.html
  if (article.value.excerpt) {
    const cleanExcerpt = article.value.excerpt.trim().replace(/\s+/g, ' ')
    const firstPRegex = /<p\b[^>]*>(.*?)<\/p>/is
    const match = html.match(firstPRegex)
    if (match) {
      const firstPText = match[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ')
      if (
        firstPText && cleanExcerpt &&
        (firstPText.startsWith(cleanExcerpt.substring(0, 40)) || cleanExcerpt.startsWith(firstPText.substring(0, 40)))
      ) {
        return html.replace(firstPRegex, '').trim()
      }
    }
  }
  return html
})

const newsArticleSchema = computed(() => {
  if (!article.value) return null
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.value.title,
    description: article.value.excerpt || 'Cobertura informativa de Evolución TV',
    image: article.value.feature_image ? [article.value.feature_image] : undefined,
    datePublished: article.value.published_at,
    inLanguage: 'es-MX',
    articleSection: article.value.primary_tag?.name || 'Noticias',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl.value
    },
    author: {
      '@type': 'Person',
      name: article.value.primary_author?.name || 'Equipo Editorial ETV'
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'Evolución TV',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.svg`
      }
    }
  })
})

// Metadatos SEO, Open Graph y JSON-LD dinámicos para buscadores y chats de IA
useHead({
  title: computed(() => article.value ? `${article.value.title} | Evolución TV` : 'Noticia | Evolución TV'),
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl
    }
  ],
  meta: [
    {
      name: 'description',
      content: computed(() => article.value?.excerpt || 'Cobertura informativa de Evolución TV')
    },
    {
      property: 'og:type',
      content: 'article'
    },
    {
      property: 'og:site_name',
      content: 'Evolución TV'
    },
    {
      property: 'og:url',
      content: canonicalUrl
    },
    {
      property: 'og:title',
      content: computed(() => article.value?.title || 'Evolución TV')
    },
    {
      property: 'og:description',
      content: computed(() => article.value?.excerpt || '')
    },
    {
      property: 'og:image',
      content: computed(() => article.value?.feature_image || '')
    },
    {
      property: 'article:published_time',
      content: computed(() => article.value?.published_at || '')
    },
    {
      property: 'article:section',
      content: computed(() => article.value?.primary_tag?.name || 'Noticias')
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: computed(() => article.value?.title || 'Evolución TV')
    },
    {
      name: 'twitter:description',
      content: computed(() => article.value?.excerpt || '')
    },
    {
      name: 'twitter:image',
      content: computed(() => article.value?.feature_image || '')
    }
  ],
  script: computed(() =>
    newsArticleSchema.value
      ? [{ type: 'application/ld+json', innerHTML: newsArticleSchema.value }]
      : []
  )
})

const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="min-h-screen transition-colors duration-200">
    <!-- Barra de progreso de lectura fija en borde superior -->
    <div
      aria-hidden="true"
      class="fixed top-0 left-0 h-1 bg-gradient-to-r from-etv-blue-500 to-etv-orange-500 z-[60] transition-[width] duration-75"
      :style="{ width: `${readingProgress}%` }"
    ></div>

    <!-- Barra superior de navegación / Breadcrumb (no-sticky para no quedar tapada por HeaderNav) -->
    <div class="border-b border-neutral-200 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/40 transition-colors">
      <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div class="flex items-center gap-2 text-xs md:text-sm">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-1.5 font-bold text-neutral-600 dark:text-neutral-400 hover:text-etv-blue-600 dark:hover:text-etv-blue-400 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Portada
          </NuxtLink>
          <span v-if="article?.primary_tag" class="text-neutral-400">/</span>
          <NuxtLink
            v-if="article?.primary_tag"
            :to="`/categoria/${article.primary_tag.slug}`"
            class="font-semibold text-neutral-500 dark:text-neutral-400 hover:text-etv-orange-600 dark:hover:text-etv-orange-400 transition-colors truncate"
          >
            {{ article.primary_tag.name }}
          </NuxtLink>
        </div>

        <div v-if="article?.primary_tag" class="flex items-center gap-2 shrink-0">
          <span
            class="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white shadow-sm"
            :style="{ backgroundColor: article.primary_tag.color || '#01abe8' }"
          >
            {{ article.primary_tag.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Skeleton de carga sincronizado (imagen arriba + título abajo) -->
    <div v-if="pending && !article" class="max-w-4xl mx-auto px-4 pt-5 pb-12 md:py-10 space-y-6 animate-pulse">
      <div class="aspect-[16/10] md:aspect-[16/9] w-full bg-neutral-200 dark:bg-neutral-800 rounded-2xl md:rounded-3xl"></div>
      <div class="h-4 w-48 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
      <div class="h-11 w-full bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
      <div class="h-6 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
      <div class="space-y-3 pt-4">
        <div class="h-4 w-full bg-neutral-200 dark:bg-neutral-800 rounded"></div>
        <div class="h-4 w-11/12 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
        <div class="h-4 w-4/5 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
      </div>
    </div>

    <!-- Contenido del Artículo -->
    <article v-else-if="article" class="max-w-4xl mx-auto px-4 pt-5 pb-10 md:py-10">
      <!-- Imagen Destacada al Inicio (proporción 16:9 completa sin recorte 21:9) -->
      <div v-if="article.feature_image" class="relative rounded-2xl md:rounded-3xl overflow-hidden mb-7 md:mb-8 border border-neutral-200 dark:border-neutral-800 shadow-xl aspect-[16/10] md:aspect-[16/9] bg-neutral-100 dark:bg-neutral-900">
        <img
          :src="article.feature_image"
          :alt="article.feature_image_alt || article.title"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Encabezado Editorial Debajo de la Imagen -->
      <header class="space-y-4 mb-8 pb-6 border-b border-neutral-200 dark:border-neutral-800/80">
        <div class="flex flex-wrap items-center gap-2.5 text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
          <NuxtLink
            v-if="article.primary_tag"
            :to="`/categoria/${article.primary_tag.slug}`"
            class="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white shadow-sm"
            :style="{ backgroundColor: article.primary_tag.color || '#01abe8' }"
          >
            {{ article.primary_tag.name }}
          </NuxtLink>
          <span class="capitalize">{{ formatDate(article.published_at) }}</span>
          <span>•</span>
          <span>{{ article.reading_time || 4 }} min de lectura</span>
        </div>

        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight">
          {{ article.title }}
        </h1>

        <p v-if="article.excerpt" class="text-lg md:text-xl text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
          {{ article.excerpt }}
        </p>

        <!-- Barra de Autor + Compartir Rápido -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/60">
          <div class="flex items-center gap-3">
            <img
              v-if="article.primary_author?.profile_image"
              :src="article.primary_author.profile_image"
              :alt="article.primary_author.name"
              class="w-10 h-10 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
            />
            <div v-else class="w-10 h-10 rounded-full bg-etv-orange-100 dark:bg-etv-orange-950 border border-etv-orange-300 dark:border-etv-orange-800 flex items-center justify-center text-etv-orange-700 dark:text-etv-orange-300 font-bold text-sm">
              {{ (article.primary_author?.name || 'ETV')[0] }}
            </div>
            <div>
              <p class="text-sm font-bold text-neutral-900 dark:text-white">
                {{ article.primary_author?.name || 'Equipo Editorial ETV' }}
              </p>
              <p class="text-xs text-neutral-500 dark:text-neutral-400">
                Redacción y Periodismo Independiente
              </p>
            </div>
          </div>

          <!-- Acciones rápidas de compartir desde la cabecera -->
          <div class="flex items-center gap-1.5 text-xs font-semibold">
            <button
              type="button"
              @click="copyArticleLink"
              class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
            >
              {{ copiedLink ? '¡Copiado!' : 'Copiar' }}
            </button>
            <a
              :href="whatsappShareUrl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Compartir en WhatsApp"
              class="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 transition-colors"
            >
              WhatsApp
            </a>
            <a
              :href="xShareUrl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Compartir en X"
              class="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors"
            >
              X
            </a>
          </div>
        </div>
      </header>

      <!-- Cuerpo del Artículo con Tipografía Editorial Serif (Newsreader) -->
      <div
        v-if="formattedArticleHtml"
        class="prose-news font-serif text-neutral-800 dark:text-neutral-200 leading-relaxed space-y-6 text-lg md:text-[1.2rem]"
        v-html="formattedArticleHtml"
      ></div>
      <div v-else class="font-serif text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed py-8">
        <p>{{ article.excerpt }}</p>
      </div>

      <!-- Pie del Artículo, Compartir y Herramientas IA -->
      <div class="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white font-bold px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 transition-colors text-sm shadow-sm w-fit"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a la Portada
          </NuxtLink>

          <!-- Botones de compartir directo -->
          <div class="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span class="text-neutral-500 dark:text-neutral-400 mr-1">Compartir:</span>
            <a
              :href="whatsappShareUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 transition-colors"
            >
              WhatsApp
            </a>
            <a
              :href="xShareUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors"
            >
              X
            </a>
            <a
              :href="facebookShareUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 transition-colors"
            >
              Facebook
            </a>
            <button
              v-if="canNativeShare"
              type="button"
              @click="nativeShare"
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
            >
              Más...
            </button>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-end gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          <button
            type="button"
            @click="copyArticleLink"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            {{ copiedLink ? '¡Enlace copiado!' : 'Copiar enlace' }}
          </button>
          <a
            :href="chatGptUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-etv-blue-600 dark:hover:text-etv-blue-400 transition-colors"
          >
            Resumir en ChatGPT
          </a>
          <a
            :href="perplexityUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-etv-blue-600 dark:hover:text-etv-blue-400 transition-colors"
          >
            Consultar en Perplexity
          </a>
        </div>
      </div>

      <!-- Navegación secuencial entre artículos -->
      <nav
        v-if="prevArticle || nextArticle"
        aria-label="Navegación entre artículos"
        class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <NuxtLink
          v-if="prevArticle"
          :to="`/noticias/${prevArticle.slug}`"
          class="group p-5 rounded-2xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 hover:border-etv-blue-500/50 dark:hover:border-etv-blue-500/50 transition-all shadow-sm flex flex-col gap-1.5"
        >
          <span class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 group-hover:text-etv-blue-600 dark:group-hover:text-etv-blue-400 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Nota anterior
          </span>
          <span class="text-sm md:text-base font-bold text-neutral-900 dark:text-white group-hover:text-etv-orange-600 dark:group-hover:text-etv-orange-400 transition-colors line-clamp-2">
            {{ prevArticle.title }}
          </span>
        </NuxtLink>
        <div v-else class="hidden sm:block"></div>

        <NuxtLink
          v-if="nextArticle"
          :to="`/noticias/${nextArticle.slug}`"
          class="group p-5 rounded-2xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 hover:border-etv-blue-500/50 dark:hover:border-etv-blue-500/50 transition-all shadow-sm flex flex-col items-end text-right gap-1.5"
        >
          <span class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 group-hover:text-etv-blue-600 dark:group-hover:text-etv-blue-400 transition-colors">
            Nota siguiente
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
          <span class="text-sm md:text-base font-bold text-neutral-900 dark:text-white group-hover:text-etv-orange-600 dark:group-hover:text-etv-orange-400 transition-colors line-clamp-2">
            {{ nextArticle.title }}
          </span>
        </NuxtLink>
      </nav>
    </article>

    <!-- Estado si no existe el artículo -->
    <div v-else-if="!pending" class="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div class="w-16 h-16 mx-auto rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 flex items-center justify-center text-etv-blue-500">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 class="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white">Artículo no encontrado</h2>
      <p class="text-neutral-600 dark:text-neutral-400 text-sm">
        El contenido que buscas no está disponible o fue retirado de la redacción.
      </p>
      <NuxtLink
        to="/"
        class="inline-block bg-etv-orange-500 hover:bg-etv-orange-400 text-neutral-950 font-black px-6 py-2.5 rounded-xl transition-colors text-sm shadow-md"
      >
        Regresar al Inicio
      </NuxtLink>
    </div>

    <!-- Artículos Relacionados (Slider Horizontal) -->
    <section v-if="relatedArticles.length > 0" class="max-w-7xl mx-auto px-4 py-16 border-t border-neutral-200 dark:border-neutral-800/80">
      <div class="flex items-center justify-between gap-4 mb-8">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-6 bg-gradient-to-b from-etv-orange-500 to-etv-blue-500 rounded-sm"></span>
          <h2 class="text-xl md:text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
            Más Noticias y Coberturas
          </h2>
        </div>

        <div v-if="canScrollPrev || canScrollNext" class="flex items-center gap-2">
          <button
            type="button"
            :disabled="!canScrollPrev"
            @click="scrollSlider('prev')"
            aria-label="Noticias anteriores"
            :class="[
              'p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors shadow-sm',
              canScrollPrev
                ? 'hover:text-etv-blue-600 dark:hover:text-etv-blue-400 hover:border-etv-blue-500/40 cursor-pointer'
                : 'opacity-40 cursor-not-allowed'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            :disabled="!canScrollNext"
            @click="scrollSlider('next')"
            aria-label="Siguientes noticias"
            :class="[
              'p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors shadow-sm',
              canScrollNext
                ? 'hover:text-etv-blue-600 dark:hover:text-etv-blue-400 hover:border-etv-blue-500/40 cursor-pointer'
                : 'opacity-40 cursor-not-allowed'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref="sliderRef"
        @scroll.passive="updateSliderState"
        class="no-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-4 px-4 md:mx-0 md:px-0"
      >
        <NewsCard
          v-for="rel in relatedArticles"
          :key="rel.id"
          :post="rel"
          class="w-[82vw] sm:w-[320px] lg:w-[calc(33.333%-1rem)] shrink-0 snap-start"
        />
      </div>
    </section>

    <!-- Botón flotante Volver arriba (derecha, sin chocar con RadioPlayer en izquierda) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <button
        v-if="showBackToTop"
        type="button"
        @click="scrollToTop"
        aria-label="Volver arriba"
        title="Volver arriba"
        class="fixed bottom-4 right-4 z-40 w-10 h-10 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:text-etv-orange-600 dark:hover:text-etv-orange-400 hover:border-etv-orange-500 shadow-lg flex items-center justify-center transition-colors cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </Transition>
  </div>
</template>

<style>
/* Estilos editoriales para el cuerpo de la noticia */
.prose-news p {
  margin-bottom: 1.5rem;
  line-height: 1.85;
}

.prose-news p.lead {
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.75;
}
:root:not(.dark) .prose-news p.lead {
  color: #171717;
}
:root.dark .prose-news p.lead {
  color: #f5f5f5;
}

.prose-news h2 {
  font-size: 1.75rem;
  font-weight: 900;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
  border-left: 3px solid #fe9903;
  padding-left: 0.75rem;
}
:root:not(.dark) .prose-news h2 {
  color: #0a0a0a;
}
:root.dark .prose-news h2 {
  color: #ffffff;
}

.prose-news h3 {
  font-size: 1.35rem;
  font-weight: 800;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}
:root:not(.dark) .prose-news h3 {
  color: #171717;
}
:root.dark .prose-news h3 {
  color: #ffffff;
}

.prose-news ul,
.prose-news ol {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
  list-style-type: disc;
}

.prose-news li {
  margin-bottom: 0.5rem;
  line-height: 1.75;
}

.prose-news blockquote {
  border-left: 4px solid #01abe8;
  padding: 1.25rem 1.5rem;
  margin: 2rem 0;
  border-radius: 0 1rem 1rem 0;
  font-style: italic;
  font-size: 1.15rem;
}
:root:not(.dark) .prose-news blockquote {
  background-color: rgba(1, 171, 232, 0.05);
  color: #262626;
}
:root.dark .prose-news blockquote {
  background-color: rgba(1, 171, 232, 0.1);
  color: #e5e5e5;
}

.prose-news a {
  color: #0086bd;
  text-decoration: underline;
  text-underline-offset: 4px;
}
:root.dark .prose-news a {
  color: #33c2fb;
}
.prose-news a:hover {
  color: #fe9903;
}

.prose-news img {
  border-radius: 1rem;
  margin: 2rem 0;
  width: 100%;
}
</style>
