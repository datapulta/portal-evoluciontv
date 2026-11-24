<script setup lang="ts">
import { ref } from 'vue'

useHead({
  title: 'Contacto y Bandas Independientes | Evolución TV',
  meta: [
    {
      name: 'description',
      content: 'Canales directos de comunicación para bandas independientes, promotores y seguidores de la escena de ska, reggae, rock y música alternativa en México. Evolución TV.'
    },
    {
      property: 'og:title',
      content: 'Contacto y Bandas Independientes | Evolución TV'
    },
    {
      property: 'og:description',
      content: 'Envío de música, EPK de bandas, coberturas de toquines y festivales, entrevistas y redes oficiales de Evolución TV.'
    }
  ]
})

const copiedEmail = ref<string | null>(null)
let copyTimer: ReturnType<typeof setTimeout> | null = null

const copyToClipboard = async (email: string) => {
  try {
    await navigator.clipboard.writeText(email)
    copiedEmail.value = email
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copiedEmail.value = null
    }, 2500)
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err)
  }
}

const contactChannels = [
  {
    id: 'musica',
    title: 'Envío de Música & Bandas Independientes',
    badge: 'Escena Musical & Bandas',
    badgeColor: 'bg-etv-orange-500/10 text-etv-orange-600 dark:text-etv-orange-400 border-etv-orange-500/20',
    iconColor: 'text-etv-orange-500',
    description: 'Envío de sencillos, EPK, comunicados o lanzamientos de bandas de ska, reggae, rock y ritmos afines para reseña, difusión y programación en Evolución Radio.',
    email: 'redaccion@evoluciontv.com',
    subject: 'Envío de Música / Nueva Banda - Evolución TV',
    actionText: 'Enviar Música o EPK'
  },
  {
    id: 'coberturas',
    title: 'Coberturas de Toquines & Festivales',
    badge: 'En Vivo & Festivales',
    badgeColor: 'bg-etv-blue-500/10 text-etv-blue-600 dark:text-etv-blue-400 border-etv-blue-500/20',
    iconColor: 'text-etv-blue-500',
    description: 'Acreditaciones de prensa, crónicas de conciertos, cobertura fotográfica de toquines y difusión de carteles y eventos de la escena mexicana.',
    email: 'redaccion@evoluciontv.com',
    subject: 'Cobertura de Toquín / Festival - Evolución TV',
    actionText: 'Solicitar Cobertura de Toquín'
  },
  {
    id: 'sesiones',
    title: 'Sesiones en Vivo & Entrevistas',
    badge: 'Cabina & Sesiones ETV',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    iconColor: 'text-purple-500',
    description: 'Coordinación de entrevistas presenciales o remotas, sesiones acústicas en cabina, cápsulas y alianzas con promotores culturales y sellos independientes.',
    email: 'redaccion@evoluciontv.com',
    subject: 'Sesiones en Vivo y Entrevistas - Evolución TV',
    actionText: 'Agendar Entrevista o Sesión'
  }
]

const socialChannels = [
  {
    name: 'Facebook',
    handle: '@EvolucionTV',
    url: 'https://www.facebook.com/EvolucionTV',
    description: 'Transmisiones en vivo, coberturas especiales y debates de nuestra comunidad.',
    btnColor: 'hover:bg-blue-600 hover:text-white hover:border-blue-600',
    accentText: 'text-blue-600 dark:text-blue-400'
  },
  {
    name: 'YouTube',
    handle: '@EvolucionTV',
    url: 'https://www.youtube.com/@EvolucionTV',
    description: 'Emisiones completas, reportajes a fondo, sesiones en vivo y archivo audiovisual.',
    btnColor: 'hover:bg-red-600 hover:text-white hover:border-red-600',
    accentText: 'text-red-600 dark:text-red-400'
  },
  {
    name: 'X (Twitter)',
    handle: '@evoluciontv',
    url: 'https://x.com/evoluciontv',
    description: 'Última hora, actualizaciones al instante y seguimiento de notas periodísticas.',
    btnColor: 'hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 hover:border-neutral-900 dark:hover:border-white',
    accentText: 'text-neutral-900 dark:text-neutral-100'
  },
  {
    name: 'Instagram',
    handle: '@evoluciontv',
    url: 'https://www.instagram.com/evoluciontv',
    description: 'Fotogalerías, coberturas visuales, historias exclusivas y detrás de cámaras.',
    btnColor: 'hover:bg-pink-600 hover:text-white hover:border-pink-600',
    accentText: 'text-pink-600 dark:text-pink-400'
  },
  {
    name: 'TikTok',
    handle: '@evoluciontvmexico',
    url: 'https://www.tiktok.com/@evoluciontvmexico',
    description: 'Noticias dinámicas en formato vertical, fragmentos de entrevistas y cápsulas culturales.',
    btnColor: 'hover:bg-cyan-600 hover:text-white hover:border-cyan-600',
    accentText: 'text-cyan-600 dark:text-cyan-400'
  }
]
</script>

<template>
  <div class="min-h-screen py-8 md:py-12 transition-colors duration-200">
    <div class="max-w-6xl mx-auto px-4 space-y-12">
      <!-- Breadcrumb de navegación -->
      <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
        <NuxtLink to="/" class="hover:text-etv-orange-600 dark:hover:text-etv-orange-400 transition-colors flex items-center gap-1.5 font-medium">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Inicio
        </NuxtLink>
        <span class="text-neutral-300 dark:text-neutral-700">/</span>
        <span class="text-neutral-800 dark:text-neutral-200 font-semibold">Contacto y Bandas</span>
      </nav>

      <!-- Encabezado Principal / Hero -->
      <section class="text-center max-w-3xl mx-auto space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-etv-orange-500/10 text-etv-orange-600 dark:text-etv-orange-400 border border-etv-orange-500/20 uppercase tracking-widest">
          <span class="w-2 h-2 rounded-full bg-etv-orange-500 animate-pulse"></span>
          Escena Musical Independiente
        </div>
        <h1 class="text-3xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tight">
          Hablemos con la <span class="text-etv-orange-500">Cabina</span> de Evolución TV
        </h1>
        <p class="text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Somos un medio de comunicación independiente dedicado a impulsar la escena musical en México: ska, reggae, rock y cultura alternativa. Sin intermediarios ni formularios: conecta directamente con nuestro equipo de redacción y programación.
        </p>
      </section>

      <!-- Canales Directos de Correo Electrónico (Tarjetas de Acción Directa) -->
      <section class="space-y-6">
        <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <h2 class="text-xl md:text-2xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
            <span class="w-2.5 h-6 bg-etv-orange-500 rounded-full inline-block"></span>
            Canales de Enlace Directo
          </h2>
          <span class="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:inline">
            Para bandas, músicos, promotores y eventos
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article
            v-for="channel in contactChannels"
            :key="channel.id"
            class="bg-white dark:bg-neutral-900/90 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 hover:shadow-md"
          >
            <div class="space-y-4">
              <div class="flex items-center justify-between gap-2">
                <span :class="['text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider', channel.badgeColor]">
                  {{ channel.badge }}
                </span>
                <span class="text-xs font-mono text-neutral-400 dark:text-neutral-500">ETV-COM</span>
              </div>

              <h3 class="text-lg font-bold text-neutral-900 dark:text-white">
                {{ channel.title }}
              </h3>

              <p class="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {{ channel.description }}
              </p>

              <!-- Dirección de correo visible y opción de copia -->
              <div class="p-3 bg-neutral-50 dark:bg-neutral-950/70 rounded-xl border border-neutral-200/70 dark:border-neutral-800/80 flex items-center justify-between gap-2">
                <span class="text-xs sm:text-sm font-mono text-neutral-800 dark:text-neutral-200 truncate select-all">
                  {{ channel.email }}
                </span>
                <button
                  type="button"
                  @click="copyToClipboard(channel.email)"
                  :title="`Copiar ${channel.email}`"
                  class="shrink-0 p-1.5 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors text-xs font-semibold flex items-center gap-1"
                >
                  <svg v-if="copiedEmail === channel.email" class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>{{ copiedEmail === channel.email ? '¡Copiado!' : 'Copiar' }}</span>
                </button>
              </div>
            </div>

            <div class="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800">
              <a
                :href="`mailto:${channel.email}?subject=${encodeURIComponent(channel.subject)}`"
                class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-etv-orange-500 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-etv-orange-500 dark:hover:text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {{ channel.actionText }}
              </a>
            </div>
          </article>
        </div>
      </section>

      <!-- Redes Sociales Oficiales -->
      <section class="space-y-6">
        <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <h2 class="text-xl md:text-2xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
            <span class="w-2.5 h-6 bg-etv-blue-500 rounded-full inline-block"></span>
            Comunidad y Redes Sociales Oficiales
          </h2>
          <span class="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:inline">
            Interactúa en tiempo real
          </span>
        </div>

        <p class="text-sm text-neutral-600 dark:text-neutral-400">
          Sigue nuestras coberturas de conciertos, transmisiones de radio en vivo y contenidos audiovisuales exclusivos en nuestras plataformas verificadas:
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <article
            v-for="social in socialChannels"
            :key="social.name"
            class="p-5 rounded-2xl bg-white dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <!-- Facebook -->
                  <svg v-if="social.name === 'Facebook'" class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                  <!-- YouTube -->
                  <svg v-else-if="social.name === 'YouTube'" class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  <!-- X -->
                  <svg v-else-if="social.name === 'X (Twitter)'" class="w-5 h-5 text-neutral-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <!-- Instagram -->
                  <svg v-else-if="social.name === 'Instagram'" class="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <!-- TikTok -->
                  <svg v-else-if="social.name === 'TikTok'" class="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                  {{ social.name }}
                </span>
                <span class="text-xs font-mono text-neutral-500 dark:text-neutral-400">{{ social.handle }}</span>
              </div>
              <p class="text-xs text-neutral-600 dark:text-neutral-400">
                {{ social.description }}
              </p>
            </div>

            <div class="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
              <a
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                :class="[
                  'w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors',
                  social.btnColor
                ]"
              >
                <span>Seguir en {{ social.name }}</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </article>
        </div>
      </section>

      <!-- Compromiso Editorial, Escucha de Material y Transparencia -->
      <section class="bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950 p-6 md:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1">
            <h3 class="text-lg md:text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <svg class="w-5 h-5 text-etv-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              Compromiso Editorial y Escucha Musical
            </h3>
            <p class="text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
              En Evolución TV fomentamos un espacio libre y abierto para la música sin ataduras ni compromisos corporativos.
            </p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <NuxtLink
              to="/codigo-etica"
              class="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-etv-orange-600 dark:hover:text-etv-orange-400 transition-colors"
            >
              Código de Ética
            </NuxtLink>
            <NuxtLink
              to="/privacidad"
              class="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-etv-blue-600 dark:hover:text-etv-blue-400 transition-colors"
            >
              Aviso de Privacidad
            </NuxtLink>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
          <div class="flex items-start gap-2.5">
            <span class="w-1.5 h-1.5 rounded-full bg-etv-orange-500 mt-2 shrink-0"></span>
            <p><strong>Tiempos de escucha:</strong> Nuestro equipo de redacción y programación musical escucha y revisa el material recibido en un plazo habitual de 24 a 48 horas hábiles.</p>
          </div>
          <div class="flex items-start gap-2.5">
            <span class="w-1.5 h-1.5 rounded-full bg-etv-blue-500 mt-2 shrink-0"></span>
            <p><strong>Protección de datos y autoría:</strong> El material sonoro, gráfico y comunicados enviados se manejan con estricto respeto a los derechos de autor y a nuestro aviso de privacidad.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
