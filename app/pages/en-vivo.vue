<script setup lang="ts">
useHead({
  title: 'Señal en Vivo | Evolución TV',
  meta: [
    {
      name: 'description',
      content: 'Cabina digital de televisión de Evolución TV: programación en directo, programas en YouTube y señal de Evolución Radio 24/7.'
    },
    {
      property: 'og:title',
      content: 'Señal en Vivo | Evolución TV'
    },
    {
      property: 'og:description',
      content: 'Sigue la programación y transmisiones especiales de Evolución TV.'
    }
  ]
})

const currentShow = {
  title: 'Evolución Noticias - Edición Central',
  anchor: 'Conducción: Redacción y Corresponsales',
  nextShow: '23:30 - Análisis y Debate Sin Censura'
}
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-12 transition-colors duration-200">
    <!-- Barra superior de navegación / Retorno -->
    <div class="border-b border-neutral-200 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/40">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-etv-blue-600 dark:hover:text-etv-blue-400 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a las Noticias
        </NuxtLink>

        <span class="flex items-center gap-1.5 bg-etv-blue-500/10 border border-etv-blue-500/30 text-etv-blue-600 dark:text-etv-blue-400 font-bold px-3 py-1 rounded-full text-xs shadow-sm">
          <span class="w-2 h-2 rounded-full bg-etv-blue-500 animate-pulse"></span>
          CABINA TELEVISIÓN DIGITAL
        </span>
      </div>
    </div>

    <!-- Contenedor Principal Centrado -->
    <div class="max-w-5xl mx-auto px-4 py-8">
      <!-- Título de la Sección -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-2.5 h-6 bg-gradient-to-b from-etv-orange-500 to-etv-blue-500 rounded-sm"></span>
            <h1 class="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
              Televisión Digital en Vivo
            </h1>
          </div>
          <p class="text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
            Programación informativa, mesas de debate ciudadano y enlace directo con nuestras señales activas.
          </p>
        </div>

        <NuxtLink
          to="/radio"
          class="inline-flex items-center gap-2 bg-etv-blue-600 hover:bg-etv-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-etv-blue-900/20 transition-colors w-fit shrink-0"
        >
          <span class="w-2 h-2 rounded-full bg-white animate-ping"></span>
          Escuchar Evolución Radio 24/7
        </NuxtLink>
      </div>

      <!-- Cabina Panorámica Centrada (sin encimamientos en móvil) -->
      <div class="flex flex-col gap-5">
        <div class="relative min-h-[360px] sm:min-h-[430px] lg:aspect-video bg-neutral-950 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col justify-between p-5 sm:p-8">
          <div
            aria-hidden="true"
            class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(1,171,232,0.18),rgba(254,153,3,0.08)_45%,transparent_70%)]"
          ></div>

          <!-- Identificador en flujo normal arriba -->
          <div class="relative z-10 flex items-center justify-between gap-2">
            <div class="inline-flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 w-fit">
              <span class="text-xs font-black tracking-wider text-etv-orange-500">EVOLUCIÓN</span>
              <span class="text-[10px] bg-etv-blue-500 text-white font-black px-1.5 py-0.5 rounded">TV</span>
              <span class="text-[10px] text-neutral-400 font-mono">SEÑAL DE VIDEO</span>
            </div>
          </div>

          <!-- Estado central perfectamente cuadrado y centrado -->
          <div class="relative z-10 text-center max-w-xl mx-auto my-6 space-y-4">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-etv-blue-300 text-xs font-semibold">
              <span class="w-2 h-2 rounded-full bg-etv-orange-400"></span>
              En espera de próxima transmisión de video
            </div>

            <h2 class="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
              {{ currentShow.title }}
            </h2>
            <p class="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Mientras preparamos la próxima emisión de televisión en directo, puedes escuchar nuestra señal continua de audio o ver los programas publicados en YouTube.
            </p>

            <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="https://www.youtube.com/@EvolucionTV"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 bg-etv-orange-500 hover:bg-etv-orange-400 text-neutral-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg transition-colors"
              >
                Ver programas en YouTube ↗
              </a>
              <NuxtLink
                to="/radio"
                class="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl border border-etv-blue-500/40 transition-colors"
              >
                Ir a Evolución Radio 24/7
              </NuxtLink>
            </div>
          </div>

          <!-- Pie de cabina -->
          <div class="relative z-10 hidden sm:flex pt-4 items-center justify-between text-xs text-neutral-400 border-t border-white/10">
            <span>{{ currentShow.anchor }}</span>
            <span class="font-mono text-neutral-300">{{ currentShow.nextShow }}</span>
          </div>
        </div>

        <!-- Módulo de Participación Ciudadana -->
        <div class="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-etv-blue-50 dark:bg-etv-blue-500/10 border border-etv-blue-200 dark:border-etv-blue-500/25 flex items-center justify-center text-etv-blue-600 dark:text-etv-blue-400 shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-bold text-neutral-900 dark:text-white">¿Tienes una banda o toquín en puerta?</h3>
              <p class="text-xs text-neutral-600 dark:text-neutral-400">Envía tus fechas, lanzamientos o propuestas de cobertura a nuestra cabina de redacción.</p>
            </div>
          </div>
          <ProtectedEmail
            as-button
            label="Contactar a Cabina"
            subject="Propuesta de Banda o Toquin ETV"
            button-class="bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-neutral-700 transition-colors shrink-0 shadow-sm cursor-pointer inline-flex items-center gap-2"
          />
        </div>
      </div>
    </div>
  </div>
</template>
