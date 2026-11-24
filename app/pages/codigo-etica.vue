<script setup lang="ts">
useHead({
  title: 'Código de Ética Periodística | Evolución TV',
  meta: [
    {
      name: 'description',
      content: 'Principios editoriales, rigor informativo, independencia y responsabilidad ciudadana de Evolución TV.'
    }
  ]
})

const principles = [
  {
    title: 'Independencia Editorial',
    desc: 'Evolución TV mantiene autonomía frente a partidos políticos, poderes públicos e intereses comerciales que comprometan la veracidad de nuestras investigaciones.'
  },
  {
    title: 'Verificación y Rigor',
    desc: 'Toda cobertura y despacho informativo se contrasta con fuentes directas, documentales o testimoniales antes de su publicación en el portal y en señal abierta digital.'
  },
  {
    title: 'Derecho de Réplica y Corrección',
    desc: 'Reconocemos y rectificamos cualquier error fáctico de manera transparente, garantizando el derecho de réplica a las personas o instituciones aludidas.'
  },
  {
    title: 'Pluralidad y Cultura Alternativa',
    desc: 'Abrimos espacio a voces ciudadanas, proyectos independientes y expresiones culturales que rara vez encuentran cobertura en los medios tradicionales.'
  }
]
</script>

<template>
  <div class="min-h-screen py-8 md:py-12 transition-colors duration-200">
    <div class="max-w-4xl mx-auto px-4 space-y-8">
      <div class="flex items-center justify-between">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la Portada
        </NuxtLink>
        <span class="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          Marco Editorial
        </span>
      </div>

      <header class="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 md:p-10 shadow-sm space-y-4">
        <span class="inline-flex items-center gap-2 bg-red-600/10 border border-red-500/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
          Ética y Periodismo
        </span>
        <h1 class="text-3xl md:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
          Código de Ética Periodística
        </h1>
        <p class="text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Lineamientos que guían la labor informativa, la cobertura ciudadana y la producción audiovisual de Evolución TV.
        </p>
      </header>

      <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article
          v-for="(item, idx) in principles"
          :key="item.title"
          class="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 md:p-7 shadow-sm space-y-2.5"
        >
          <span class="text-xs font-mono font-bold text-red-600 dark:text-red-400">
            0{{ idx + 1 }}
          </span>
          <h2 class="text-lg font-black text-neutral-900 dark:text-white">
            {{ item.title }}
          </h2>
          <p class="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {{ item.desc }}
          </p>
        </article>
      </section>

      <div class="bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
          ¿Deseas solicitar una aclaración editorial o ejercer tu derecho de réplica?
        </p>
        <a
          href="mailto:redaccion@evoluciontv.com?subject=Aclaraci%C3%B3n%20Editorial"
          class="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0"
        >
          Escribir a Redacción
        </a>
      </div>
    </div>
  </div>
</template>
