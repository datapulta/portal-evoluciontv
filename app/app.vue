<script setup lang="ts">
import HeaderNav from '~/components/HeaderNav.vue'
import FooterSection from '~/components/FooterSection.vue'
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
    <!-- Navegación y Cabecera -->
    <HeaderNav />

    <!-- Contenido Principal con Enrutador NuxtPage -->
    <main class="flex-1">
      <NuxtPage />
    </main>

    <!-- Pie de Página -->
    <FooterSection />
  </div>
</template>
