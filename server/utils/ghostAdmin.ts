import crypto from 'node:crypto'

export interface GhostServerConfig {
  apiUrl: string
  contentKey: string
  adminKey: string
}

/**
 * Obtiene la configuración de Ghost CMS desde variables de entorno y runtimeConfig.
 */
export function getGhostConfig(): GhostServerConfig {
  const config = useRuntimeConfig()
  const apiUrl = (process.env.NUXT_PUBLIC_NEWS_API_URL || config.public.newsApiUrl || 'https://cms-etv.webia.studio').replace(/\/+$/, '')
  const contentKey = process.env.NUXT_PUBLIC_NEWS_API_KEY || config.public.newsApiKey || ''
  const adminKey = process.env.NEWS_ADMIN_API_KEY || process.env.GHOST_ADMIN_API_KEY || ''

  return { apiUrl, contentKey, adminKey }
}

function base64url(buf: Buffer): string {
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

/**
 * Genera un token JWT firmado con HMAC-SHA256 para autenticar peticiones a Ghost Admin API.
 */
export function createGhostAdminToken(adminKey: string): string {
  const parts = adminKey.split(':')
  const id = parts[0] || ''
  const secret = parts[1] || ''
  const header = base64url(Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT', kid: id })))
  const now = Math.floor(Date.now() / 1000)
  const payload = base64url(Buffer.from(JSON.stringify({ iat: now, exp: now + 300, aud: '/admin/' })))
  const sig = base64url(crypto.createHmac('sha256', Buffer.from(secret, 'hex')).update(`${header}.${payload}`).digest())
  return `${header}.${payload}.${sig}`
}
