<script setup lang="ts">
defineProps<{
  compact?: boolean
}>()

const socialNetworks = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/EvolucionTV',
    hoverClass: 'hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/40'
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@EvolucionTV',
    hoverClass: 'hover:text-red-600 dark:hover:text-red-400 hover:border-red-500/40'
  },
  {
    name: 'X',
    url: 'https://x.com/evoluciontv',
    hoverClass: 'hover:text-neutral-950 dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-500'
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/evoluciontv',
    hoverClass: 'hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-500/40'
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@evoluciontvmexico',
    hoverClass: 'hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/40'
  }
]
</script>

<template>
  <div :class="['flex items-center flex-wrap', compact ? 'gap-2' : 'gap-2.5']">
    <a
      v-for="social in socialNetworks"
      :key="social.name"
      :href="social.url"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`Evolución TV en ${social.name}`"
      :title="`Evolución TV en ${social.name}`"
      :class="[
        'inline-flex items-center justify-center rounded-xl transition-all',
        compact
          ? 'p-1.5 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200/70 dark:hover:bg-neutral-800/80'
          : 'p-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 shadow-sm',
        social.hoverClass
      ]"
    >
      <!-- Facebook -->
      <svg v-if="social.name === 'Facebook'" :class="compact ? 'w-3.5 h-3.5' : 'w-4 h-4'" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>

      <!-- YouTube -->
      <svg v-else-if="social.name === 'YouTube'" :class="compact ? 'w-3.5 h-3.5' : 'w-4 h-4'" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>

      <!-- X (Twitter) -->
      <svg v-else-if="social.name === 'X'" :class="compact ? 'w-3.5 h-3.5' : 'w-4 h-4'" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>

      <!-- Instagram -->
      <svg v-else-if="social.name === 'Instagram'" :class="compact ? 'w-3.5 h-3.5' : 'w-4 h-4'" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>

      <!-- TikTok -->
      <svg v-else-if="social.name === 'TikTok'" :class="compact ? 'w-3.5 h-3.5' : 'w-4 h-4'" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    </a>
  </div>
</template>
