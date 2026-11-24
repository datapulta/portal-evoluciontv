import { getGhostConfig, createGhostAdminToken } from '~~/server/utils/ghostAdmin'

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
  { id: 'cat-3', name: 'EvolucioNotas', slug: 'evolucionotas', color: '#01abe8', description: 'Columna crítica y apuntes de redacción.' },
  { id: 'cat-4', name: 'Quiénes somos', slug: 'quienes-somos', color: '#fe9903', description: 'Manifiesto y equipo de Evolución TV.' }
]

export default defineEventHandler(async () => {
  const { apiUrl, adminKey } = getGhostConfig()

  if (!adminKey) {
    return FALLBACK_CATEGORIES
  }

  try {
    const token = createGhostAdminToken(adminKey)
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
      color: t.accent_color || '#01abe8',
      description: t.description || ''
    }))
  } catch (error) {
    console.warn('[server/api/categories] Error al consultar Ghost Admin API, usando categorías de respaldo:', error)
    return FALLBACK_CATEGORIES
  }
})
