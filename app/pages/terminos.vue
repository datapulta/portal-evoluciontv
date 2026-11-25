<script setup lang="ts">
useHead({
  title: 'Términos y Condiciones | Evolución TV',
  meta: [
    {
      name: 'description',
      content: 'Términos y condiciones de uso del portal informativo, transmisión en vivo y cuentas de comunidad de Evolución TV.'
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
          Marco Legal
        </span>
      </div>

      <article class="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 md:p-10 shadow-sm space-y-6">
        <div class="space-y-3">
          <span class="inline-flex items-center gap-2 bg-etv-orange-500/10 border border-etv-orange-500/30 text-etv-orange-600 dark:text-etv-orange-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            Condiciones de Uso
          </span>
          <h1 class="text-3xl md:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
            Términos y Condiciones
          </h1>
          <p class="text-sm text-neutral-500 dark:text-neutral-400">
            Evolución TV — Plataforma Digital Independiente
          </p>
        </div>

        <div class="space-y-5 text-sm md:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
          <section class="space-y-2">
            <h2 class="text-lg font-black text-neutral-900 dark:text-white">1. Aceptación y uso del portal</h2>
            <p>
              Al acceder y utilizar el portal web de Evolución TV, su señal en vivo, radio digital o crear una cuenta de usuario, aceptas cumplir con los presentes Términos y Condiciones y con nuestro <NuxtLink to="/privacidad" class="text-etv-blue-600 dark:text-etv-blue-400 font-semibold underline">Aviso de Privacidad</NuxtLink>.
            </p>
          </section>

          <section class="space-y-2">
            <h2 class="text-lg font-black text-neutral-900 dark:text-white">2. Cuentas de usuario y acceso</h2>
            <p>
              El registro en el portal es gratuito. Puedes crear tu cuenta mediante correo electrónico y contraseña o a través de tu cuenta de Google. Eres responsable de mantener la confidencialidad de tus credenciales y de toda actividad realizada desde tu sesión.
            </p>
          </section>

          <section class="space-y-2">
            <h2 class="text-lg font-black text-neutral-900 dark:text-white">3. Normas de participación comunitaria</h2>
            <p>
              Nos reservamos el derecho de suspender o desactivar cuentas que incurran en suplantación de identidad, spam, acoso, discurso de odio o intentos de comprometer la seguridad e integridad técnica de la plataforma.
            </p>
          </section>

          <section class="space-y-2">
            <h2 class="text-lg font-black text-neutral-900 dark:text-white">4. Propiedad intelectual</h2>
            <p>
              Los artículos periodísticos, fotografías, transmisiones, identidad gráfica y logotipos publicados en Evolución TV pertenecen a sus respectivos autores y a Evolución TV. Se permite compartir enlaces citando la fuente.
            </p>
          </section>

          <section class="space-y-2">
            <h2 class="text-lg font-black text-neutral-900 dark:text-white">5. Contacto y modificaciones</h2>
            <p>
              Evolución TV podrá actualizar estos términos cuando incorpore nuevas funcionalidades. Para aclaraciones o soporte sobre tu cuenta, escríbenos a <ProtectedEmail text-class="text-etv-blue-600 dark:text-etv-blue-400 font-semibold underline hover:text-etv-orange-600 dark:hover:text-etv-orange-400 transition-colors cursor-pointer" />.
            </p>
          </section>
        </div>
      </article>
    </div>
  </div>
</template>
