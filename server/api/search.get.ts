import { getGhostConfig } from '~~/server/utils/ghostAdmin'

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export default defineEventHandler(async (event) => {
  const queryParams = getQuery(event)
  const rawQuery = String(queryParams.q || '').trim()
  const normalizedQuery = normalizeText(rawQuery)

  if (!normalizedQuery) {
    return { query: rawQuery, articles: [] }
  }

  const { apiUrl, contentKey } = getGhostConfig()
  if (!contentKey) {
    return { query: rawQuery, articles: [] }
  }

  try {
    const url = new URL(`${apiUrl}/ghost/api/content/posts/`)
    url.searchParams.set('key', contentKey)
    url.searchParams.set('include', 'tags,authors')
    url.searchParams.set('limit', 'all')
    url.searchParams.set(
      'fields',
      'id,uuid,title,slug,excerpt,feature_image,featured,published_at,reading_time'
    )

    const response = await $fetch<{ posts: any[] }>(url.toString())
    const posts = response.posts || []

    const tokens = normalizedQuery.split(/\s+/).filter(Boolean)
    const matched = posts.filter((post) => {
      const searchable = normalizeText(
        [
          post.title || '',
          post.excerpt || '',
          post.primary_tag?.name || '',
          post.primary_author?.name || ''
        ].join(' ')
      )
      return tokens.every(token => searchable.includes(token))
    })

    return {
      query: rawQuery,
      articles: matched
    }
  } catch (error) {
    console.warn('[server/api/search] Error consultando artículos en Ghost:', error)
    return { query: rawQuery, articles: [] }
  }
})
