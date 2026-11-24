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

export function createGhostAdminToken(adminKey) {
  if (!adminKey || !adminKey.includes(':')) {
    throw new Error('La Admin API Key no tiene el formato válido "id:secreto_hex".')
  }
  const [keyId, secretHex] = adminKey.split(':')
  const header = { alg: 'HS256', typ: 'JWT', kid: keyId }
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iat: now,
    exp: now + 300,
    aud: '/admin/'
  }

  const encHeader = base64url(Buffer.from(JSON.stringify(header)))
  const encPayload = base64url(Buffer.from(JSON.stringify(payload)))
  const unsignedToken = `${encHeader}.${encPayload}`
  const signature = crypto.createHmac('sha256', Buffer.from(secretHex, 'hex')).update(unsignedToken).digest()
  return `${unsignedToken}.${base64url(signature)}`
}

export async function publishArticle(articleData, options = {}) {
  const adminKey = options.adminKey || ADMIN_KEY
  if (!adminKey) {
    throw new Error('Falta la variable NEWS_ADMIN_API_KEY en .env o pasada por opciones.')
  }

  const token = createGhostAdminToken(adminKey)
  const url = `${API_URL}/ghost/api/admin/posts/?source=html`

  const payload = {
    posts: [
      {
        title: articleData.title,
        custom_excerpt: articleData.excerpt || undefined,
        html: articleData.html,
        feature_image: articleData.feature_image || undefined,
        featured: Boolean(articleData.featured),
        status: articleData.status || 'published',
        tags: articleData.tags
          ? articleData.tags.map(t => (typeof t === 'string' ? { name: t } : t))
          : undefined
      }
    ]
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Ghost ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(`Error en Ghost Admin API (${response.status}): ${JSON.stringify(data.errors || data)}`)
  }

  return data.posts[0]
}

// Ejecución directa por CLI
if (process.argv[1]?.endsWith('publish-article.mjs')) {
  const testMode = process.argv.includes('--test')
  if (testMode) {
    console.log('--- Publicador de Artículos Evolución TV ---')
    if (!ADMIN_KEY) {
      console.error('ERROR: No se encontró NEWS_ADMIN_API_KEY en .env.')
      console.error('Por favor agrega la Admin API Key en .env con el formato: NEWS_ADMIN_API_KEY=id:secreto')
      process.exit(1)
    }

    const testPost = {
      title: 'Investigación Especial: El Futuro del Periodismo Digital en Evolución TV',
      excerpt: 'Un análisis exhaustivo sobre los desafíos de la desinformación y el papel de los medios independientes.',
      html: `
        <p class="lead">Evolución TV consolida su modelo de transmisión independiente y redacción digital abierta a la ciudadanía.</p>
        <h2>Autonomía y Compromiso Informativo</h2>
        <p>A través de investigaciones de campo, coberturas en tiempo real y análisis riguroso, nuestro equipo periodístico ofrece una alternativa veraz y sin censura.</p>
        <blockquote>"La libertad de prensa no se negocia; se ejerce a diario con responsabilidad y rigor profesional."</blockquote>
        <p>Sigue nuestras emisiones diarias y participa en las mesas de debate ciudadano.</p>
      `,
      feature_image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
      tags: ['Especial', 'Investigación'],
      status: 'published'
    }

    console.log(`Publicando nota de prueba en: ${API_URL}...`)
    publishArticle(testPost)
      .then(post => {
        console.log('✓ ¡Artículo publicado exitosamente en Ghost CMS!')
        console.log(`ID: ${post.id}`)
        console.log(`Título: ${post.title}`)
        console.log(`Slug: ${post.slug}`)
        console.log(`URL local: http://localhost:3005/noticias/${post.slug}`)
      })
      .catch(err => {
        console.error('Error al publicar artículo:', err.message)
        process.exit(1)
      })
  } else {
    console.log('Uso: node scripts/publish-article.mjs --test')
  }
}
