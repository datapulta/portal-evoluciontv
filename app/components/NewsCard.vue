<script setup lang="ts">
import type { Article } from '~/composables/useNews'

defineProps<{
  post: Article
  horizontal?: boolean
}>()

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short'
  })
}
</script>

<template>
  <article
    :class="[
      'group bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700/80 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col',
      horizontal ? 'md:flex-row' : ''
    ]"
  >
    <!-- Imagen del artículo -->
    <div
      :class="[
        'relative overflow-hidden bg-neutral-950 shrink-0',
        horizontal ? 'md:w-2/5 aspect-video md:aspect-auto' : 'aspect-video'
      ]"
    >
      <img
        v-if="post.feature_image"
        :src="post.feature_image"
        :alt="post.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-600">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      </div>

      <!-- Tag de categoría -->
      <span
        v-if="post.primary_tag"
        class="absolute top-3 left-3 text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md text-white shadow-md backdrop-blur-md"
        :style="{ backgroundColor: post.primary_tag.color || '#dc2626' }"
      >
        {{ post.primary_tag.name }}
      </span>
    </div>

    <!-- Contenido -->
    <div class="p-5 flex flex-col justify-between flex-1">
      <div>
        <h3 class="text-base md:text-lg font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug mb-2">
          <a :href="`#${post.slug}`">
            {{ post.title }}
          </a>
        </h3>

        <p class="text-neutral-400 text-xs md:text-sm line-clamp-2 mb-4 leading-relaxed">
          {{ post.excerpt }}
        </p>
      </div>

      <!-- Metadatos de Autor y Fecha -->
      <div class="flex items-center justify-between text-xs text-neutral-400 pt-3 border-t border-neutral-800/60 mt-auto">
        <div class="flex items-center gap-2">
          <img
            v-if="post.primary_author?.profile_image"
            :src="post.primary_author.profile_image"
            :alt="post.primary_author.name"
            class="w-5 h-5 rounded-full object-cover"
          />
          <span class="font-medium text-neutral-300">
            {{ post.primary_author?.name || 'Redacción' }}
          </span>
        </div>

        <div class="flex items-center gap-2 text-neutral-400">
          <span>{{ formatDate(post.published_at) }}</span>
          <span v-if="post.reading_time">• {{ post.reading_time }} min</span>
        </div>
      </div>
    </div>
  </article>
</template>
