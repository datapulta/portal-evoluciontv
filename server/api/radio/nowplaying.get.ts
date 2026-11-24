export interface RadioNowPlaying {
  stationName: string
  songText: string
  artist: string
  title: string
  album: string
  art: string | null
  listeners: number
  isLive: boolean
}

const AZURACAST_NOWPLAYING_URL = 'https://r3.webia.studio/api/nowplaying/estereo_fonik'
const CACHE_TTL_MS = 15_000

const DEFAULT_RESPONSE: RadioNowPlaying = {
  stationName: 'Evolución Radio',
  songText: 'Señal Digital 24/7',
  artist: '',
  title: 'Señal Digital 24/7',
  album: '',
  art: null,
  listeners: 0,
  isLive: false
}

let cachedData: RadioNowPlaying | null = null
let cachedAt = 0

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'public, max-age=10')

  const now = Date.now()
  if (cachedData && now - cachedAt < CACHE_TTL_MS) {
    return cachedData
  }

  try {
    const res = await $fetch<any>(AZURACAST_NOWPLAYING_URL, { timeout: 5000 })
    const song = res?.now_playing?.song || {}
    const payload: RadioNowPlaying = {
      stationName: 'Evolución Radio',
      songText: String(song.text || 'Señal Digital 24/7').trim(),
      artist: String(song.artist || '').trim(),
      title: String(song.title || song.text || 'Señal Digital 24/7').trim(),
      album: String(song.album || '').trim(),
      art: typeof song.art === 'string' && song.art.startsWith('http') ? song.art : null,
      listeners: Number(res?.listeners?.current ?? res?.listeners?.total ?? 0) || 0,
      isLive: Boolean(res?.live?.is_live)
    }

    cachedData = payload
    cachedAt = now
    return payload
  } catch {
    return cachedData || DEFAULT_RESPONSE
  }
})
