import fs from 'node:fs'
import path from 'node:path'
import { createGhostAdminToken } from './publish-article.mjs'

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

const tagsToCreate = [
  {
    name: 'Quiénes somos',
    slug: 'quienes-somos',
    color: '#dc2626',
    description: 'Notas institucionales, historia, equipo editorial y pronunciamientos de Evolución TV.'
  },
  {
    name: 'Coberturas ETV',
    slug: 'coberturas-etv',
    color: '#ea580c',
    description: 'Coberturas periodísticas en directo, transmisiones especiales y reportajes en el terreno.'
  },
  {
    name: 'Más bandas',
    slug: 'mas-bandas',
    color: '#8b5cf6',
    description: 'Difusión de la escena musical independiente, bandas urbanas emergentes y cultura alternativa.'
  },
  {
    name: 'EvolucioNotas',
    slug: 'evolucionotas',
    color: '#0284c7',
    description: 'Columna editorial propia, análisis crítico y notas de opinión de la redacción de Evolución TV.'
  }
]

async function createTags() {
  if (!ADMIN_KEY) {
    throw new Error('Falta NEWS_ADMIN_API_KEY en .env')
  }

  const token = createGhostAdminToken(ADMIN_KEY)
  const url = `${API_URL}/ghost/api/admin/tags/`

  console.log(`Conectando con Ghost Admin API en: ${url}`)

  for (const tag of tagsToCreate) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Ghost ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tags: [tag] })
      })

      const data = await response.json()
      if (response.ok) {
        console.log(`✓ Creada categoría: "${tag.name}" (slug: ${tag.slug}, id: ${data.tags[0].id})`)
      } else {
        const msg = data.errors?.[0]?.message || JSON.stringify(data)
        if (msg.includes('already exists') || msg.includes('duplicate')) {
          console.log(`ℹ Categoría "${tag.name}" ya existía previamente.`)
        } else {
          console.error(`✗ Error al crear "${tag.name}":`, msg)
        }
      }
    } catch (err) {
      console.error(`✗ Excepción en "${tag.name}":`, err.message)
    }
  }
}

createTags().then(() => console.log('Proceso de categorías completado.')).catch(console.error)
