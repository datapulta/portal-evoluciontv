<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md'
  }>(),
  { size: 'md' }
)
</script>

<template>
  <div
    :class="[
      'rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0',
      size === 'sm' ? 'w-9 h-9 p-1.5' : 'w-10 h-10 p-1.5'
    ]"
  >
    <svg viewBox="0 0 48 48" class="w-full h-full" fill="none" aria-hidden="true">
      <!-- Triángulo Play azul oficial (#01ABE8) detrás -->
      <path
        d="M11 8.5C11 7.1 12.5 6.2 13.7 6.9L37.5 20.4C38.7 21.1 38.7 22.9 37.5 23.6L13.7 37.1C12.5 37.8 11 36.9 11 35.5V8.5Z"
        fill="#01ABE8"
      />
      <!-- Pantalla y señal TV naranja oficial (#FE9903) al frente -->
      <rect
        x="16"
        y="17"
        width="25"
        height="18"
        rx="4"
        fill="#FE9903"
        stroke="currentColor"
        class="text-white dark:text-neutral-900"
        stroke-width="2.5"
      />
      <!-- Ondas y punto de transmisión en vivo dentro de la pantalla -->
      <circle cx="23.5" cy="26" r="2.5" fill="#ffffff" />
      <path
        d="M28.5 22.5C30.4 24.4 30.4 27.6 28.5 29.5M32.5 20C35.5 23.3 35.5 28.7 32.5 32"
        stroke="#ffffff"
        stroke-width="2.5"
        stroke-linecap="round"
      />
    </svg>
  </div>
</template>
