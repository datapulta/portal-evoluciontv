<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md'
  }>(),
  { size: 'md' }
)
</script>

<template>
  <img
    src="/logo-etv.png"
    alt="Evolución TV"
    :class="[
      'w-auto object-contain shrink-0 transition-transform group-hover:scale-105',
      size === 'sm' ? 'h-9' : 'h-11'
    ]"
  />
</template>
