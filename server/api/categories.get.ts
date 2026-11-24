import crypto from 'node:crypto'

export interface NavCategory {
  id: string
  name: string
  slug: string
  color?: string
  description?: string
}

const FALLBACK_CATEGORIES: NavCategory[] = [
  { id: 'cat-1', name: 'Coberturas ETV', slug: 'coberturas-etv', color: '#ea580c', description: 'Coberturas especiales y despachos periodísticos.' },
  { id: 'cat-2', name: 'Más bandas', slug: 'mas-bandas', color: '#8b5cf6', description: 'Música y cultura alternativa.' },
  { id: 'cat-3', name: 'EvolucioNotas', slug: 'evolucionotas', color: '#0284c7', description: 'Columna crítica y apuntes de redacción.' },
  { id: 'cat-4', name: 'Quiénes somos', slug: 'quienes-somos', color: '#dc2626', description: 'Manifiesto y equipo de Evolución TV.' }
]

function base64url(buf: Buffer): string {
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function createGhostToken(key: string): string {
  const [id, secret] = key.split(':')
  const h = base64url(Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT', kid: id })))
  const now = Math.floor(Date.now() / 1000)
  const p = base64url(Buffer.from(JSON.stringify({ iat: now, exp: now + 300, aud: '/admin/' })))
  const sig = base64url(crypto.createHmac('sha256', Buffer.from(secret, 'hex')).update(`${h}.${p}`).digest())
  return `${h}.${p}.${sig}`
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiUrl = (process.env.NUXT_PUBLIC_NEWS_API_URL || config.public.newsApiUrl || 'https://cms-etv.webia.studio').replace(/\/+$/, '')
  const adminKey = process.env.NEWS_ADMIN_API_KEY || process.env.GHOST_ADMIN_API_KEY

  if (!adminKey) {
    return FALLBACK_CATEGORIES
  }

  try {
    const token = createGhostToken(adminKey)
    const response = await $fetch<{ tags: any[] }>(`${apiUrl}/ghost/api/admin/tags/?limit=all`, {
      headers: {
        Authorization: `Ghost ${token}`
      }
    })

    if (!response.tags || response.tags.length === 0) {
      return FALLBACK_CATEGORIES
    }

    // Filtrar etiquetas internas que inician con # (utilizadas para configuración interna de Ghost)
    const publicTags = response.tags.filter((t: any) => !t.name.startsWith('#'))

    return publicTags.map((t: any): NavCategory => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      color: t.accent_color || '#dc2626',
      description: t.description || ''
    }))
  } catch (error) {
    console.warn('[server/api/categories] Error al consultar Ghost Admin API, usando categorías de respaldo:', error)
    return FALLBACK_CATEGORIES
  }
})
