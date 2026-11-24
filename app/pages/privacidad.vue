<script setup lang="ts">
useHead({
  title: 'Aviso de Privacidad | Evolución TV',
  meta: [
    {
      name: 'description',
      content: 'Política de privacidad, uso de cookies locales y resguardo de datos de lectores y suscriptores en Evolución TV.'
    }
  ]
})
</script>

<template>
  <div class="min-h-screen py-8 md:py-12 transition-colors duration-200">
    <div class="max-w-4xl mx-auto px-4 space-y-8">
      <div class="flex items-center justify-between">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-etv-blue-600 dark:hover:text-etv-blue-400 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la Portada
        </NuxtLink>
        <span class="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          Privacidad y Datos
        </span>
      </div>

      <article class="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 md:p-10 shadow-sm space-y-6">
        <div class="space-y-3">
          <span class="inline-flex items-center gap-2 bg-etv-blue-500/10 border border-etv-blue-500/30 text-etv-blue-600 dark:text-etv-blue-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            Transparencia Digital
          </span>
          <h1 class="text-3xl md:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
            Aviso de Privacidad
          </h1>
          <p class="text-sm text-neutral-500 dark:text-neutral-400">
            Evolución TV — Plataforma Digital Independiente
          </p>
        </div>

        <div class="space-y-5 text-sm md:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
          <section class="space-y-2">
            <h2 class="text-lg font-black text-neutral-900 dark:text-white">1. Datos que recopilamos</h2>
            <p>
              La navegación general por Evolución TV es libre y no requiere registro. Únicamente recabamos tu correo electrónico cuando decides suscribirte voluntariamente a nuestro boletín informativo o nos envías un reporte ciudadano a nuestra mesa de redacción.
            </p>
          </section>

          <section class="space-y-2">
            <h2 class="text-lg font-black text-neutral-900 dark:text-white">2. Almacenamiento local del navegador</h2>
            <p>
              Guardamos únicamente preferencias técnicas en el almacenamiento local (<code>localStorage</code>) de tu navegador, como el tema visual seleccionado (modo claro u oscuro) y tus ajustes de volumen o estado del reproductor de Evolución Radio. No vendemos ni compartimos perfiles con terceros.
            </p>
          </section>

          <section class="space-y-2">
            <h2 class="text-lg font-black text-neutral-900 dark:text-white">3. Derechos y contacto</h2>
            <p>
              Puedes solicitar en cualquier momento la baja de nuestro boletín o la eliminación de tu dirección de correo electrónico escribiendo a <a href="mailto:redaccion@evoluciontv.com" class="text-etv-blue-600 dark:text-etv-blue-400 font-semibold underline hover:text-etv-orange-600 dark:hover:text-etv-orange-400 transition-colors">redaccion@evoluciontv.com</a>.
            </p>
          </section>
        </div>
      </article>
    </div>
  </div>
</template>
