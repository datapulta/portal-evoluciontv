<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { LogOut, Mail, Calendar, ShieldCheck, ArrowLeft } from 'lucide-vue-next'

definePageMeta({
  middleware: 'portal-auth',
})

useHead({
  title: 'Mi Perfil | Evolución TV',
})

const router = useRouter()
const { user, logout } = useAuth()
const loggingOut = ref(false)

const initials = computed(() => {
  const name = user.value?.name?.trim() || 'ETV'
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
})

function formatDate(dateStr?: string | null) {
  if (!dateStr) return 'Reciente'
  try {
    return new Date(dateStr).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return 'Reciente'
  }
}

async function handleLogout() {
  loggingOut.value = true
  try {
    await logout()
    await router.push('/')
  } finally {
    loggingOut.value = false
  }
}
</script>

<template>
  <section class="max-w-3xl mx-auto px-4 py-10 sm:py-14">
    <div class="mb-6">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-etv-orange-600 dark:hover:text-etv-orange-400 transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
        Volver a la portada
      </NuxtLink>
    </div>

    <div class="bg-white dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl shadow-neutral-900/5 dark:shadow-black/30 overflow-hidden">
      <div class="h-24 bg-gradient-to-r from-etv-orange-500/20 via-etv-blue-500/20 to-etv-orange-500/10 border-b border-neutral-200 dark:border-neutral-800"></div>

      <div class="px-6 sm:px-8 pb-8">
        <div class="-mt-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div class="flex items-end gap-4">
            <img
              v-if="user?.avatarUrl"
              :src="user.avatarUrl"
              :alt="user.name"
              referrerpolicy="no-referrer"
              class="w-20 h-20 rounded-2xl object-cover shadow-lg border-4 border-white dark:border-neutral-900 shrink-0"
            />
            <div v-else class="w-20 h-20 rounded-2xl bg-etv-orange-500 text-neutral-950 font-black text-2xl flex items-center justify-center shadow-lg border-4 border-white dark:border-neutral-900 shrink-0">
              {{ initials }}
            </div>
            <div class="pb-1">
              <h1 class="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                {{ user?.name }}
              </h1>
              <span class="inline-flex items-center gap-1 text-xs font-bold text-etv-blue-600 dark:text-etv-blue-400 bg-etv-blue-500/10 px-2.5 py-0.5 rounded-full mt-1">
                <ShieldCheck class="w-3.5 h-3.5" />
                Cuenta de Comunidad Activa
              </span>
            </div>
          </div>

          <button
            type="button"
            @click="handleLogout"
            :disabled="loggingOut"
            class="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:border-red-500/50 hover:bg-red-50 dark:hover:bg-red-950/30 text-neutral-700 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-400 text-xs font-bold px-4 py-2.5 transition-all cursor-pointer shrink-0"
          >
            <LogOut class="w-4 h-4" />
            <span>{{ loggingOut ? 'Saliendo...' : 'Cerrar sesión' }}</span>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <div class="rounded-xl bg-neutral-50 dark:bg-neutral-950/70 border border-neutral-200/80 dark:border-neutral-800 p-4">
            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
              <Mail class="w-3.5 h-3.5" />
              Correo electrónico
            </div>
            <p class="text-sm font-semibold text-neutral-900 dark:text-white break-all">
              {{ user?.email }}
            </p>
          </div>

          <div class="rounded-xl bg-neutral-50 dark:bg-neutral-950/70 border border-neutral-200/80 dark:border-neutral-800 p-4">
            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
              <Calendar class="w-3.5 h-3.5" />
              Miembro desde
            </div>
            <p class="text-sm font-semibold text-neutral-900 dark:text-white">
              {{ formatDate(user?.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
