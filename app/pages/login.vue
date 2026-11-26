<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Eye, EyeOff, LogIn, AlertCircle, ArrowRight, Radio, MessageSquare, ShieldCheck } from 'lucide-vue-next'
import BrandMark from '~/components/BrandMark.vue'

const route = useRoute()
const router = useRouter()
const { login, isAuthenticated, fetchUser } = useAuth()

await fetchUser()
if (isAuthenticated.value) {
  await navigateTo('/perfil')
}

const { data: authConfig } = await useAsyncData('portal-auth-config', () =>
  $fetch<{ emailAuthEnabled: boolean; googleAuthEnabled: boolean }>('/api/auth/config')
)
const emailAuthEnabled = computed(() => authConfig.value?.emailAuthEnabled ?? true)

useHead({
  title: 'Iniciar Sesión | Evolución TV',
  meta: [
    { name: 'description', content: 'Accede a tu cuenta de comunidad en Evolución TV.' },
  ],
})

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const submitting = ref(false)
const errorMessage = ref('')

if (route.query.error === 'google_auth_failed') {
  errorMessage.value = 'No se pudo completar el inicio de sesión con Google. Inténtalo de nuevo.'
} else if (route.query.error === 'account_disabled') {
  errorMessage.value = 'Tu cuenta se encuentra desactivada.'
}

const redirectTarget = computed(() => {
  const raw = route.query.redirect
  if (typeof raw === 'string' && raw.startsWith('/') && !raw.startsWith('//')) {
    return raw
  }
  return '/'
})

const googleAuthUrl = computed(() => `/api/auth/google?redirect=${encodeURIComponent(redirectTarget.value)}`)

async function handleSubmit() {
  errorMessage.value = ''
  if (!email.value.trim() || !password.value) {
    errorMessage.value = 'Ingresa tu correo electrónico y contraseña.'
    return
  }

  submitting.value = true
  try {
    await login(email.value.trim(), password.value)
    await router.push(redirectTarget.value)
  } catch (err: any) {
    errorMessage.value =
      err?.data?.statusMessage ||
      err?.statusMessage ||
      'No pudimos iniciar sesión. Verifica tus credenciales.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="max-w-4xl mx-auto px-4 py-8 sm:py-12">
    <div class="bg-white dark:bg-neutral-900/95 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl shadow-neutral-900/10 dark:shadow-black/50 overflow-hidden grid grid-cols-1 md:grid-cols-12">
      <!-- Columna Editorial / Identidad -->
      <div class="md:col-span-5 bg-gradient-to-br from-etv-orange-500/15 via-neutral-50 to-etv-blue-500/15 dark:from-etv-orange-500/15 dark:via-neutral-950 dark:to-etv-blue-500/15 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 flex flex-col justify-between gap-6">
        <div>
          <div class="flex items-center gap-3 mb-5">
            <BrandMark />
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-etv-orange-500/15 text-etv-orange-700 dark:text-etv-orange-400 border border-etv-orange-500/30">
              Comunidad ETV
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
            Tu espacio en la escena independiente
          </h1>
          <p class="mt-2.5 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Inicia sesión para conectar con la señal en vivo, noticias y comunidad de Evolución TV.
          </p>
        </div>

        <ul class="hidden md:space-y-3.5 md:block text-xs text-neutral-700 dark:text-neutral-300">
          <li class="flex items-start gap-2.5">
            <Radio class="w-4 h-4 text-etv-orange-500 shrink-0 mt-0.5" />
            <span>Participa durante transmisiones de TV en vivo y Evolución Radio.</span>
          </li>
          <li class="flex items-start gap-2.5">
            <MessageSquare class="w-4 h-4 text-etv-blue-500 shrink-0 mt-0.5" />
            <span>Comenta coberturas, estrenos de bandas y mesas de debate.</span>
          </li>
          <li class="flex items-start gap-2.5">
            <ShieldCheck class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>Acceso rápido, seguro y sin spam.</span>
          </li>
        </ul>
      </div>

      <!-- Columna de Acceso -->
      <div class="md:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
        <div class="mb-6">
          <h2 class="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
            Iniciar Sesión
          </h2>
          <p class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {{ emailAuthEnabled ? 'Elige cómo deseas acceder a tu cuenta.' : 'Accede en un clic con tu cuenta de Google.' }}
          </p>
        </div>

        <div
          v-if="errorMessage"
          role="alert"
          class="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 px-3.5 py-3 text-sm text-red-700 dark:text-red-300"
        >
          <AlertCircle class="w-4 h-4 shrink-0 mt-0.5" />
          <span>{{ errorMessage }}</span>
        </div>

        <a
          :href="googleAuthUrl"
          class="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-800/90 hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-900 dark:text-white font-bold text-sm px-5 py-3.5 transition-all shadow-sm"
        >
          <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z" />
            <path fill="#FBBC05" d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z" />
          </svg>
          <span>Continuar con Google</span>
        </a>

        <template v-if="emailAuthEnabled">
          <div class="relative my-5">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-neutral-200 dark:border-neutral-800"></div>
            </div>
            <div class="relative flex justify-center text-xs uppercase tracking-wider">
              <span class="bg-white dark:bg-neutral-900 px-3 text-neutral-400 font-semibold">o continúa con tu correo</span>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label for="login-email" class="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                Correo electrónico
              </label>
              <input
                id="login-email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                placeholder="tu@correo.com"
                class="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-4 py-2.5 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-etv-blue-500 focus:outline-none focus:ring-2 focus:ring-etv-blue-500/20 transition-all"
              />
            </div>

            <div>
              <label for="login-password" class="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                Contraseña
              </label>
              <div class="relative">
                <input
                  id="login-password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  required
                  placeholder="••••••••"
                  class="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-4 pr-11 py-2.5 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-etv-blue-500 focus:outline-none focus:ring-2 focus:ring-etv-blue-500/20 transition-all"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                >
                  <EyeOff v-if="showPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              :disabled="submitting"
              class="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-etv-orange-500 hover:bg-etv-orange-400 disabled:opacity-60 disabled:cursor-not-allowed text-neutral-950 font-black text-sm px-5 py-3 transition-all shadow-sm cursor-pointer"
            >
              <LogIn class="w-4 h-4" />
              <span>{{ submitting ? 'Verificando...' : 'Entrar a mi cuenta' }}</span>
            </button>
          </form>

          <div class="mt-6 pt-5 border-t border-neutral-200 dark:border-neutral-800 text-center">
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
              ¿Aún no tienes cuenta?
              <NuxtLink
                :to="{ path: '/registro', query: route.query.redirect ? { redirect: route.query.redirect } : undefined }"
                class="inline-flex items-center gap-1 font-bold text-etv-blue-600 dark:text-etv-blue-400 hover:underline ml-1"
              >
                Crear cuenta gratis
                <ArrowRight class="w-3.5 h-3.5" />
              </NuxtLink>
            </p>
          </div>
        </template>

        <div v-else class="mt-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/70 p-4 space-y-2">
          <p class="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Acceso directo y protegido con Google
          </p>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            No necesitas recordar nuevas contraseñas. Solo usamos tu nombre, correo y foto de perfil para identificarte en el portal.
          </p>
        </div>

        <p class="mt-6 pt-4 border-t border-neutral-200/80 dark:border-neutral-800/80 text-[11px] text-center text-neutral-500 dark:text-neutral-400">
          Al continuar, aceptas nuestros
          <NuxtLink to="/terminos" class="font-semibold text-etv-blue-600 dark:text-etv-blue-400 hover:underline">Términos y Condiciones</NuxtLink>
          y el
          <NuxtLink to="/privacidad" class="font-semibold text-etv-blue-600 dark:text-etv-blue-400 hover:underline">Aviso de Privacidad</NuxtLink>.
        </p>
      </div>
    </div>
  </section>
</template>
