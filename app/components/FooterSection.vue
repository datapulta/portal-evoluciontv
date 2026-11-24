<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-neutral-800 bg-neutral-950 text-neutral-400 py-12 px-4">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
      <!-- Columna 1: Identidad -->
      <div class="md:col-span-2 space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-black">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span class="text-xl font-black text-white tracking-tight">
            EVOLUCIÓN <span class="text-red-500">TV</span>
          </span>
        </div>
        <p class="text-xs md:text-sm text-neutral-400 max-w-md leading-relaxed">
          Medio de comunicación independiente comprometido con la verdad, la libertad de prensa, el periodismo de investigación y la transmisión de noticias en directo para todo el país.
        </p>
        <div class="flex items-center gap-2 text-xs text-neutral-400">
          <span class="inline-flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full text-neutral-300">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            Ghost 6.0 CMS + Fediverse Ready
          </span>
        </div>
      </div>

      <!-- Columna 2: Secciones -->
      <div>
        <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-3">Secciones</h4>
        <ul class="space-y-2 text-xs md:text-sm">
          <li><a href="#" class="hover:text-red-400 transition-colors">Portada Nacional</a></li>
          <li><a href="#politica" class="hover:text-red-400 transition-colors">Política & Estado</a></li>
          <li><a href="#economia" class="hover:text-red-400 transition-colors">Economía & Negocios</a></li>
          <li><a href="#investigacion" class="hover:text-red-400 transition-colors">Unidad de Investigación</a></li>
          <li><a href="#en-vivo" class="hover:text-red-400 transition-colors text-red-400 font-semibold">Señal en Vivo (TV)</a></li>
        </ul>
      </div>

      <!-- Columna 3: Editorial y Contacto -->
      <div>
        <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-3">Redacción</h4>
        <ul class="space-y-2 text-xs md:text-sm">
          <li>
            <a
              href="https://cms-etv.webia.studio/ghost"
              target="_blank"
              class="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Panel de Redacción
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </li>
          <li><a href="mailto:redaccion@evoluciontv.com" class="hover:text-white transition-colors">Buzón de Denuncias</a></li>
          <li><a href="#" class="hover:text-white transition-colors">Código de Ética</a></li>
          <li><a href="#" class="hover:text-white transition-colors">Aviso de Privacidad</a></li>
        </ul>
      </div>
    </div>

    <div class="max-w-7xl mx-auto pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
      <p>© {{ currentYear }} Evolución TV. Todos los derechos reservados. Medio de comunicación independiente.</p>
      <p>Desarrollado con Nuxt 4 & Ghost CMS</p>
    </div>
  </footer>
</template>
