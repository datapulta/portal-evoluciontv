import { ref, onMounted } from 'vue'

// URL de streaming configurable para Evolución Radio (Icecast / Shoutcast / MP3 / AAC)
export const DEFAULT_RADIO_STREAM_URL = ''

const isPlaying = ref(false)
const isMuted = ref(false)
const volume = ref(80)
const isMinimized = ref(false)
const isLoading = ref(false)
const currentTrack = ref('Señal Digital 24/7')
const streamUrl = ref(DEFAULT_RADIO_STREAM_URL)

let audioInstance: HTMLAudioElement | null = null

export const useRadio = () => {
  const getAudio = () => {
    if (typeof window === 'undefined') return null
    if (!audioInstance) {
      audioInstance = new Audio()
      audioInstance.preload = 'none'
      audioInstance.volume = volume.value / 100

      audioInstance.addEventListener('waiting', () => {
        isLoading.value = true
      })
      audioInstance.addEventListener('playing', () => {
        isLoading.value = false
        isPlaying.value = true
      })
      audioInstance.addEventListener('pause', () => {
        isLoading.value = false
        isPlaying.value = false
      })
      audioInstance.addEventListener('error', () => {
        isLoading.value = false
        isPlaying.value = false
      })
    }
    return audioInstance
  }

  const togglePlay = async () => {
    const audio = getAudio()
    if (!audio) return

    if (isPlaying.value) {
      audio.pause()
      isPlaying.value = false
      return
    }

    if (streamUrl.value) {
      try {
        isLoading.value = true
        if (audio.src !== streamUrl.value) {
          audio.src = streamUrl.value
        }
        await audio.play()
        isPlaying.value = true
      } catch {
        isLoading.value = false
        isPlaying.value = false
      }
    } else {
      // Modo visual listo mientras se conecta la URL de streaming definitiva
      isPlaying.value = true
    }
  }

  const setVolume = (val: number) => {
    volume.value = Math.max(0, Math.min(100, val))
    if (volume.value > 0 && isMuted.value) {
      isMuted.value = false
    }
    const audio = getAudio()
    if (audio) {
      audio.volume = isMuted.value ? 0 : volume.value / 100
    }
  }

  const toggleMute = () => {
    isMuted.value = !isMuted.value
    const audio = getAudio()
    if (audio) {
      audio.volume = isMuted.value ? 0 : volume.value / 100
    }
  }

  const toggleMinimize = () => {
    isMinimized.value = !isMinimized.value
  }

  onMounted(() => {
    if (audioInstance) {
      audioInstance.volume = isMuted.value ? 0 : volume.value / 100
    }
  })

  return {
    isPlaying,
    isMuted,
    volume,
    isMinimized,
    isLoading,
    currentTrack,
    streamUrl,
    togglePlay,
    setVolume,
    toggleMute,
    toggleMinimize
  }
}
