<script setup lang="ts">
import SocialLinks from '~/components/SocialLinks.vue'

useHead({
  title: 'Quiénes Somos | Evolución TV',
  meta: [
    {
      name: 'description',
      content: 'Evolución TV es un medio de comunicación independiente, sin límites, con contenidos propios y creativos creados por jóvenes emprendedores.'
    },
    {
      property: 'og:title',
      content: 'Quiénes Somos | Evolución TV'
    },
    {
      property: 'og:description',
      content: 'Conoce nuestra misión, visión y objetivos como proyecto de televisión digital independiente.'
    }
  ]
})

const objetivos = [
  {
    plazo: 'A corto plazo',
    color: 'text-etv-orange-700 dark:text-etv-orange-400',
    border: 'border-etv-orange-200 dark:border-etv-orange-900/50',
    badgeBg: 'bg-etv-orange-50 dark:bg-etv-orange-950/40',
    desc: 'Atraer la atención del público joven a través de las redes sociales para crear una comunidad que permita la interacción mutua.'
  },
  {
    plazo: 'Mediano plazo',
    color: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-900/50',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
    desc: 'Establecernos como un proyecto innovador, original y reconocido en la red, para que nuestros seguidores se sientan identificados con los contenidos y el proyecto en general.'
  },
  {
    plazo: 'Largo plazo',
    color: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-900/50',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    desc: 'Ser un proyecto establecido y reconocido por los contenidos propios y por la originalidad de los mismos.'
  }
]
</script>

<template>
  <div class="min-h-screen py-8 md:py-12 transition-colors duration-200">
    <div class="max-w-6xl mx-auto px-4 space-y-12">
      <!-- Barra superior de navegación / Retorno -->
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
          Identidad Institucional
        </span>
      </div>

      <!-- Hero / Quiénes somos -->
      <header class="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
        <div class="max-w-3xl space-y-6 relative z-10">
          <div class="inline-flex items-center gap-2 bg-etv-blue-500/10 border border-etv-blue-500/30 text-etv-blue-600 dark:text-etv-blue-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <span class="w-2 h-2 rounded-full bg-etv-blue-500"></span>
            Quiénes Somos
          </div>

          <h1 class="text-3xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight">
            Medio digital independiente, <span class="text-etv-orange-500">sin límites</span> y en constante evolución.
          </h1>

          <div class="space-y-4 text-base md:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <p>
              <strong>Evolución TV</strong> es un medio de comunicación independiente, sin límites, con contenidos propios y creativos que muestran diferentes ángulos con respecto a los medios tradicionales.
            </p>
            <p>
              Somos un grupo de jóvenes emprendedores que por medio de reportajes, entrevistas, notas, fotografías y sesiones en vivo, se mantiene presente haciendo uso de las nuevas tecnologías, evolucionando.
            </p>
          </div>
        </div>
      </header>

      <!-- Misión y Visión -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Misión -->
        <div class="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-sm space-y-4">
          <div class="w-12 h-12 rounded-2xl bg-etv-orange-50 dark:bg-etv-orange-950/50 border border-etv-orange-200 dark:border-etv-orange-900/60 flex items-center justify-center text-etv-orange-600 dark:text-etv-orange-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 class="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
            Misión
          </h2>
          <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm md:text-base">
            Crear contenidos originales en video que permitan a los intervidentes (antes televidentes) disfrutar de nuevas alternativas de televisión desde cualquier dispositivo que cuente con internet.
          </p>
        </div>

        <!-- Visión -->
        <div class="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-sm space-y-4">
          <div class="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-900/60 flex items-center justify-center text-sky-600 dark:text-sky-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
            Visión
          </h2>
          <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm md:text-base">
            Ser un proyecto reconocido en el mundo del internet y más allá de sus fronteras cibernéticas, gracias a los contenidos de calidad generados por jóvenes emprendedores que buscarán mantenerse en constante evolución.
          </p>
        </div>
      </section>

      <!-- Objetivos -->
      <section class="space-y-6">
        <div class="flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-800">
          <span class="w-2.5 h-6 bg-gradient-to-b from-etv-orange-500 to-etv-blue-500 rounded-sm"></span>
          <h2 class="text-xl md:text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
            Objetivos
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article
            v-for="(obj, index) in objetivos"
            :key="obj.plazo"
            :class="[
              'bg-white dark:bg-neutral-900/60 border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between space-y-4',
              obj.border
            ]"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span :class="['text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full', obj.badgeBg, obj.color]">
                  {{ obj.plazo }}
                </span>
                <span class="text-xs font-mono font-bold text-neutral-400 dark:text-neutral-600">
                  0{{ index + 1 }}
                </span>
              </div>
              <p class="text-neutral-700 dark:text-neutral-300 text-sm md:text-base leading-relaxed">
                {{ obj.desc }}
              </p>
            </div>
          </article>
        </div>
      </section>

      <!-- Cierre / Invitación -->
      <section class="bg-gradient-to-r from-etv-orange-50 via-white to-etv-blue-50 dark:from-etv-orange-950/30 dark:via-neutral-900 dark:to-etv-blue-950/30 border border-etv-orange-200 dark:border-etv-blue-900/40 rounded-3xl p-8 md:p-12 text-center space-y-6 shadow-sm">
        <div class="space-y-2 max-w-2xl mx-auto">
          <h2 class="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white">
            ¿Quieres saber más de nosotros?
          </h2>
          <p class="text-neutral-700 dark:text-neutral-300 text-base md:text-lg">
            Entonces sigue navegando y reproduciendo nuestros vídeos.
          </p>
          <p class="text-sm font-bold text-etv-blue-600 dark:text-etv-blue-400 pt-1">
            Gracias por interesarte en conocernos
          </p>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
          <NuxtLink
            to="/en-vivo"
            class="inline-flex items-center gap-2 bg-etv-blue-600 hover:bg-etv-blue-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-lg shadow-etv-blue-900/25"
          >
            <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            Ver Señal en Vivo
          </NuxtLink>
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white font-bold text-sm px-6 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 transition-colors shadow-sm"
          >
            Explorar Portada
          </NuxtLink>
        </div>

        <div class="pt-4 flex flex-col items-center gap-2">
          <span class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Síguenos en redes</span>
          <SocialLinks />
        </div>
      </section>
    </div>
  </div>
</template>
