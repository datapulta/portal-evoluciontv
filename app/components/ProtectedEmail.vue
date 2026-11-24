<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    user?: string
    domain?: string
    tld?: string
    subject?: string
    label?: string
    asButton?: boolean
    showCopy?: boolean
    buttonClass?: string
    textClass?: string
  }>(),
  {
    user: 'redaccion',
    domain: 'evoluciontv',
    tld: 'mx',
    subject: '',
    label: '',
    asButton: false,
    showCopy: false,
    buttonClass: '',
    textClass: ''
  }
)

const isCopied = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

const emailAddress = computed(() => `${props.user}@${props.domain}.${props.tld}`)

const openMailClient = () => {
  if (typeof window === 'undefined') return
  const subjectParam = props.subject ? `?subject=${encodeURIComponent(props.subject)}` : ''
  window.location.href = `mailto:${emailAddress.value}${subjectParam}`
}

const copyToClipboard = async () => {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return
  try {
    await navigator.clipboard.writeText(emailAddress.value)
    isCopied.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      isCopied.value = false
    }, 2500)
  } catch (err) {
    console.error('Error al copiar correo:', err)
  }
}
</script>

<template>
  <div class="inline-flex items-center gap-2">
    <!-- Opción 1: Botón de acción con estilo -->
    <button
      v-if="asButton"
      type="button"
      @click="openMailClient"
      :class="buttonClass || 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-etv-orange-500 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-etv-orange-500 dark:hover:text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-sm cursor-pointer'"
    >
      <slot name="icon">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </slot>
      <span>{{ label || emailAddress }}</span>
    </button>

    <!-- Opción 2: Enlace visual seguro con trampa anti-bot -->
    <button
      v-else
      type="button"
      @click="openMailClient"
      :title="`Contactar a ${emailAddress}`"
      :class="textClass || 'text-left hover:text-etv-orange-600 dark:hover:text-etv-orange-400 transition-colors cursor-pointer inline-flex items-center gap-1 font-mono'"
    >
      <span v-if="label">{{ label }}</span>
      <span v-else class="select-all">
        {{ user }}<span class="hidden select-none" aria-hidden="true">[anti-spam-trap]</span>@{{ domain }}.{{ tld }}
      </span>
    </button>

    <!-- Botón de copiado opcional -->
    <button
      v-if="showCopy"
      type="button"
      @click="copyToClipboard"
      :title="`Copiar ${emailAddress}`"
      class="shrink-0 p-1.5 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
    >
      <svg v-if="isCopied" class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
      </svg>
      <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <span class="text-[11px]">{{ isCopied ? '¡Copiado!' : 'Copiar' }}</span>
    </button>
  </div>
</template>
