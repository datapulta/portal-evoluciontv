import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

// Cargar .env
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
  const encSignature = base64url(signature)

  return `${encHeader}.${encPayload}.${encSignature}`
}

async function syncCategories() {
  if (!ADMIN_KEY) {
    throw new Error('NEWS_ADMIN_API_KEY no encontrada.')
  }
  const token = createGhostAdminToken(ADMIN_KEY)
  const headers = {
    Authorization: `Ghost ${token}`,
    'Content-Type': 'application/json'
  }

  console.log('1. Consultando posts actuales...')
  const postsRes = await fetch(`${API_URL}/ghost/api/admin/posts/?limit=all&include=tags`, { headers })
  const postsData = await postsRes.json()
  const posts = postsData.posts || []

  // Reclasificar artículos
  for (const post of posts) {
    if (post.slug.includes('jensen-huang')) {
      console.log(`Reclasificando post Jensen Huang (${post.id}) -> Coberturas ETV...`)
      const updateRes = await fetch(`${API_URL}/ghost/api/admin/posts/${post.id}/`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          posts: [{
            id: post.id,
            updated_at: post.updated_at,
            tags: [{ name: 'Coberturas ETV', slug: 'coberturas-etv' }]
          }]
        })
      })
      if (!updateRes.ok) {
        console.error('Error al actualizar Jensen Huang:', await updateRes.text())
      } else {
        console.log('Post Jensen Huang reclasificado exitosamente.')
      }
    } else if (post.slug.includes('investigacion-especial') || post.slug.includes('periodismo-digital')) {
      console.log(`Reclasificando post Institucional (${post.id}) -> Quiénes somos...`)
      const updateRes = await fetch(`${API_URL}/ghost/api/admin/posts/${post.id}/`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          posts: [{
            id: post.id,
            updated_at: post.updated_at,
            tags: [{ name: 'Quiénes somos', slug: 'quienes-somos' }]
          }]
        })
      })
      if (!updateRes.ok) {
        console.error('Error al actualizar Post Institucional:', await updateRes.text())
      } else {
        console.log('Post Institucional reclasificado exitosamente.')
      }
    }
  }

  // Obtener tags
  console.log('2. Consultando tags en Ghost CMS...')
  const tagsRes = await fetch(`${API_URL}/ghost/api/admin/tags/?limit=all`, { headers })
  const tagsData = await tagsRes.json()
  const allTags = tagsData.tags || []

  const obsoleteSlugs = ['news', 'especial', 'investigacion', 'tecnologia', 'innovacion']
  for (const tag of allTags) {
    if (obsoleteSlugs.includes(tag.slug.toLowerCase())) {
      console.log(`Eliminando tag obsoleto: ${tag.name} (${tag.slug}) [${tag.id}]...`)
      const delRes = await fetch(`${API_URL}/ghost/api/admin/tags/${tag.id}/`, {
        method: 'DELETE',
        headers
      })
      if (delRes.ok || delRes.status === 204) {
        console.log(`Tag ${tag.name} eliminado correctamente.`)
      } else {
        console.warn(`No se pudo eliminar tag ${tag.name}:`, await delRes.text())
      }
    }
  }

  // Verificar estado final
  console.log('3. Validando estado final de tags en Ghost CMS...')
  const finalTagsRes = await fetch(`${API_URL}/ghost/api/admin/tags/?limit=all`, { headers })
  const finalTagsData = await finalTagsRes.json()
  console.log('Tags oficiales restantes:', (finalTagsData.tags || []).map(t => ({ name: t.name, slug: t.slug, color: t.color })))

  console.log('4. Validando estado final de posts...')
  const finalPostsRes = await fetch(`${API_URL}/ghost/api/admin/posts/?limit=all&include=tags`, { headers })
  const finalPostsData = await finalPostsRes.json()
  console.log('Posts reclasificados:', (finalPostsData.posts || []).map(p => ({ title: p.title, tags: (p.tags || []).map(t => t.name) })))
}

syncCategories().catch(console.error)
