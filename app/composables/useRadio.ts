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

const GLOBAL_AUDIO_KEY = '__EVOLUCION_RADIO_AUDIO__'
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let userPaused = true

const getGlobalAudio = (): HTMLAudioElement | null => {
  if (typeof window === 'undefined') return null
  const win = window as unknown as Record<string, HTMLAudioElement | undefined>
  return win[GLOBAL_AUDIO_KEY] || null
}

const setGlobalAudio = (audio: HTMLAudioElement) => {
  if (typeof window === 'undefined') return
  const win = window as unknown as Record<string, HTMLAudioElement | undefined>
  win[GLOBAL_AUDIO_KEY] = audio
}

export const useRadio = () => {
  const setupMediaSession = () => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.value,
      artist: 'Evolución Radio',
      album: 'Evolución TV — Medio Digital Independiente'
    })
    navigator.mediaSession.setActionHandler('play', () => {
      if (!isPlaying.value) togglePlay()
    })
    navigator.mediaSession.setActionHandler('pause', () => {
      if (isPlaying.value) togglePlay()
    })
  }

  const scheduleReconnect = () => {
    if (userPaused || !streamUrl.value || reconnectTimer) return
    reconnectTimer = setTimeout(async () => {
      reconnectTimer = null
      const audio = getAudio()
      if (!audio || userPaused) return
      try {
        isLoading.value = true
        audio.src = streamUrl.value
        await audio.play()
        isPlaying.value = true
      } catch {
        isLoading.value = false
      }
    }, 3000)
  }

  const getAudio = () => {
    if (typeof window === 'undefined') return null
    let audio = getGlobalAudio()
    if (!audio) {
      audio = new Audio()
      audio.preload = 'none'
      audio.volume = isMuted.value ? 0 : volume.value / 100

      audio.addEventListener('waiting', () => {
        isLoading.value = true
      })
      audio.addEventListener('playing', () => {
        isLoading.value = false
        isPlaying.value = true
        setupMediaSession()
      })
      audio.addEventListener('pause', () => {
        isLoading.value = false
        if (userPaused) {
          isPlaying.value = false
        }
      })
      audio.addEventListener('stalled', scheduleReconnect)
      audio.addEventListener('error', scheduleReconnect)

      setGlobalAudio(audio)
    }
    return audio
  }

  const togglePlay = async () => {
    const audio = getAudio()
    if (!audio) return

    if (isPlaying.value) {
      userPaused = true
      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
        reconnectTimer = null
      }
      audio.pause()
      isPlaying.value = false
      if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused'
      }
      return
    }

    userPaused = false
    if (streamUrl.value) {
      try {
        isLoading.value = true
        if (audio.src !== streamUrl.value) {
          audio.src = streamUrl.value
        }
        await audio.play()
        isPlaying.value = true
        setupMediaSession()
        if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
          navigator.mediaSession.playbackState = 'playing'
        }
      } catch {
        isLoading.value = false
        isPlaying.value = false
      }
    } else {
      isPlaying.value = true
      setupMediaSession()
    }
  }

  const setVolume = (val: number) => {
    volume.value = Math.max(0, Math.min(100, val))
    if (volume.value > 0 && isMuted.value) {
      isMuted.value = false
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('etv-radio-volume', String(volume.value))
      localStorage.setItem('etv-radio-muted', String(isMuted.value))
    }
    const audio = getAudio()
    if (audio) {
      audio.volume = isMuted.value ? 0 : volume.value / 100
    }
  }

  const toggleMute = () => {
    isMuted.value = !isMuted.value
    if (typeof window !== 'undefined') {
      localStorage.setItem('etv-radio-muted', String(isMuted.value))
    }
    const audio = getAudio()
    if (audio) {
      audio.volume = isMuted.value ? 0 : volume.value / 100
    }
  }

  const toggleMinimize = () => {
    isMinimized.value = !isMinimized.value
    if (typeof window !== 'undefined') {
      localStorage.setItem('etv-radio-minimized', String(isMinimized.value))
    }
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    const savedVol = localStorage.getItem('etv-radio-volume')
    const savedMute = localStorage.getItem('etv-radio-muted')
    const savedMin = localStorage.getItem('etv-radio-minimized')

    if (savedVol !== null && !Number.isNaN(Number(savedVol))) {
      volume.value = Math.max(0, Math.min(100, Number(savedVol)))
    }
    if (savedMute !== null) {
      isMuted.value = savedMute === 'true'
    }
    if (savedMin !== null) {
      isMinimized.value = savedMin === 'true'
    }

    const existing = getGlobalAudio()
    if (existing) {
      existing.volume = isMuted.value ? 0 : volume.value / 100
      isPlaying.value = !existing.paused
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
