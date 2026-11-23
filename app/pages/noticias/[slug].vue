<script setup lang="ts">
import { computed } from 'vue'
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

// Carga de notas relacionadas para el pie de página
const { data: relatedData } = await useAsyncData('related-news', () => getArticles({ limit: 4 }))
const relatedArticles = computed(() => {
  return (relatedData.value?.articles || []).filter(a => a.slug !== slug.value).slice(0, 3)
})

// Metadatos SEO dinámicos
useHead({
  title: computed(() => article.value ? `${article.value.title} | Evolución TV` : 'Noticia | Evolución TV'),
  meta: [
    {
      name: 'description',
      content: computed(() => article.value?.excerpt || 'Cobertura informativa de Evolución TV')
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
    }
  ]
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
  <div class="min-h-screen">
    <!-- Barra superior de navegación / Retorno -->
    <div class="border-b border-neutral-800/80 bg-neutral-900/40 backdrop-blur-md sticky top-14 z-40">
      <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-neutral-400 hover:text-red-400 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la Portada
        </NuxtLink>

        <div v-if="article?.primary_tag" class="flex items-center gap-2">
          <span
            class="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white"
            :style="{ backgroundColor: article.primary_tag.color || '#dc2626' }"
          >
            {{ article.primary_tag.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Contenido del Artículo -->
    <article v-if="article" class="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <!-- Encabezado Editorial -->
      <header class="space-y-4 mb-8">
        <div class="flex items-center gap-3 text-xs md:text-sm text-neutral-400">
          <span class="capitalize">{{ formatDate(article.published_at) }}</span>
          <span>•</span>
          <span>{{ article.reading_time || 4 }} min de lectura</span>
        </div>

        <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight md:leading-tight">
          {{ article.title }}
        </h1>

        <p v-if="article.excerpt" class="text-lg md:text-xl text-neutral-300 leading-relaxed font-medium">
          {{ article.excerpt }}
        </p>

        <!-- Barra de Autor y Redacción -->
        <div class="flex items-center justify-between pt-4 border-t border-neutral-800/80">
          <div class="flex items-center gap-3">
            <img
              v-if="article.primary_author?.profile_image"
              :src="article.primary_author.profile_image"
              :alt="article.primary_author.name"
              class="w-10 h-10 rounded-full object-cover border border-neutral-700"
            />
            <div v-else class="w-10 h-10 rounded-full bg-red-950 border border-red-800 flex items-center justify-center text-red-300 font-bold text-sm">
              {{ (article.primary_author?.name || 'ETV')[0] }}
            </div>
            <div>
              <p class="text-sm font-bold text-white">
                {{ article.primary_author?.name || 'Equipo Editorial ETV' }}
              </p>
              <p class="text-xs text-neutral-400">
                Redacción y Periodismo Independiente
              </p>
            </div>
          </div>
        </div>
      </header>

      <!-- Imagen Destacada -->
      <div v-if="article.feature_image" class="relative rounded-3xl overflow-hidden mb-10 border border-neutral-800 shadow-2xl aspect-video md:aspect-[21/9]">
        <img
          :src="article.feature_image"
          :alt="article.title"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Cuerpo del Artículo -->
      <div
        v-if="article.html"
        class="prose-news text-neutral-200 leading-relaxed space-y-6 text-base md:text-lg"
        v-html="article.html"
      ></div>
      <div v-else class="text-neutral-400 text-base leading-relaxed py-8">
        <p>{{ article.excerpt }}</p>
      </div>

      <!-- Pie del Artículo y Compartir -->
      <div class="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-5 py-2.5 rounded-xl border border-neutral-700 transition-colors text-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la Portada
        </NuxtLink>

        <div class="flex items-center gap-2 text-xs text-neutral-400">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          Publicado por la Redacción de Evolución TV
        </div>
      </div>
    </article>

    <!-- Estado si no existe el artículo -->
    <div v-else-if="!pending" class="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div class="w-16 h-16 mx-auto rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-red-500">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 class="text-2xl md:text-3xl font-black text-white">Artículo no encontrado</h2>
      <p class="text-neutral-400 text-sm">
        El contenido que buscas no está disponible o fue retirado de la redacción.
      </p>
      <NuxtLink
        to="/"
        class="inline-block bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
      >
        Regresar al Inicio
      </NuxtLink>
    </div>

    <!-- Artículos Relacionados -->
    <section v-if="relatedArticles.length > 0" class="max-w-7xl mx-auto px-4 py-16 border-t border-neutral-800/80">
      <div class="flex items-center gap-2 mb-8">
        <span class="w-2.5 h-6 bg-red-600 rounded-sm"></span>
        <h2 class="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
          Más Investigaciones y Coberturas
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NewsCard
          v-for="rel in relatedArticles"
          :key="rel.id"
          :post="rel"
        />
      </div>
    </section>
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
  color: #f5f5f5;
  line-height: 1.75;
}

.prose-news h2 {
  font-size: 1.75rem;
  font-weight: 900;
  color: #ffffff;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
  border-left: 3px solid #dc2626;
  padding-left: 0.75rem;
}

.prose-news h3 {
  font-size: 1.35rem;
  font-weight: 800;
  color: #ffffff;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
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
  border-left: 4px solid #dc2626;
  background-color: rgba(220, 38, 38, 0.05);
  padding: 1.25rem 1.5rem;
  margin: 2rem 0;
  border-radius: 0 1rem 1rem 0;
  font-style: italic;
  font-size: 1.15rem;
  color: #e5e5e5;
}

.prose-news a {
  color: #ef4444;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.prose-news a:hover {
  color: #f87171;
}

.prose-news img {
  border-radius: 1rem;
  margin: 2rem 0;
  width: 100%;
}
</style>
