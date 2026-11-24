import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

// Cargar variables de .env manualmente si no están en process.env
const envPath = path.resolve(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const [k, ...v] = trimmed.split('=')
    if (k && v.length && !process.env[k.trim()]) {
      process.env[k.trim()] = v.join('=').trim()
    }
  }
}

const API_URL = (process.env.NUXT_PUBLIC_NEWS_API_URL || 'https://cms-etv.webia.studio').replace(/\/+$/, '')
const ADMIN_KEY = process.env.NEWS_ADMIN_API_KEY || process.env.GHOST_ADMIN_API_KEY

function base64url(buf) {
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function createGhostAdminToken(adminKey) {
  if (!adminKey || !adminKey.includes(':')) {
    throw new Error('La Admin API Key no tiene el formato válido "id:secreto_hex".')
  }
  const [keyId, secretHex] = adminKey.split(':')
  const header = { alg: 'HS256', typ: 'JWT', kid: keyId }
  const now = Math.floor(Date.now() / 1000)
  const payload = { iat: now, exp: now + 300, aud: '/admin/' }

  const encHeader = base64url(Buffer.from(JSON.stringify(header)))
  const encPayload = base64url(Buffer.from(JSON.stringify(payload)))
  const signature = crypto
    .createHmac('sha256', Buffer.from(secretHex, 'hex'))
    .update(`${encHeader}.${encPayload}`)
    .digest()
  return `${encHeader}.${encPayload}.${base64url(signature)}`
}

const redirectsYaml = `301:
  ^/$: https://etv.webia.studio/
  ^/tag/([^/]+)/?$: https://etv.webia.studio/categoria/$1
  ^/author/.*$: https://etv.webia.studio/
  ^/page/.*$: https://etv.webia.studio/
`

async function uploadRedirects() {
  if (!ADMIN_KEY) {
    throw new Error('NEWS_ADMIN_API_KEY no encontrada.')
  }

  const token = createGhostAdminToken(ADMIN_KEY)
  const form = new FormData()
  form.append('redirects', new Blob([redirectsYaml], { type: 'application/x-yaml' }), 'redirects.yaml')

  console.log(`Subiendo redirects.yaml a ${API_URL}/ghost/api/admin/redirects/upload/ ...`)
  const res = await fetch(`${API_URL}/ghost/api/admin/redirects/upload/`, {
    method: 'POST',
    headers: {
      Authorization: `Ghost ${token}`
    },
    body: form
  })

  if (!res.ok) {
    throw new Error(`Error al subir redirects.yaml (${res.status}): ${await res.text()}`)
  }

  console.log('redirects.yaml cargado correctamente en Ghost CMS (Modo Headless activo).')
}

uploadRedirects().catch((err) => {
  console.error(err)
  process.exit(1)
})
