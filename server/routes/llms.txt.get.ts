const SITE_URL = 'https://etv.webia.studio'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=300')

  const config = useRuntimeConfig()
  const apiUrl = (process.env.NUXT_PUBLIC_NEWS_API_URL || config.public.newsApiUrl || 'https://cms-etv.webia.studio').replace(/\/+$/, '')
  const apiKey = process.env.NUXT_PUBLIC_NEWS_API_KEY || config.public.newsApiKey || ''

  let categories: Array<{ name: string; slug: string; description?: string }> = []
  let posts: Array<{ title: string; slug: string; excerpt?: string; published_at?: string; primary_tag?: { name: string } }> = []

  try {
    categories = await $fetch('/api/categories')
  } catch {
    categories = [
      { name: 'Coberturas ETV', slug: 'coberturas-etv' },
      { name: 'Más bandas', slug: 'mas-bandas' },
      { name: 'EvolucioNotas', slug: 'evolucionotas' },
      { name: 'Quiénes somos', slug: 'quienes-somos' }
    ]
  }

  if (apiKey) {
    try {
      const res = await $fetch<{ posts: typeof posts }>(
        `${apiUrl}/ghost/api/content/posts/?key=${apiKey}&include=tags&limit=50&fields=title,slug,excerpt,published_at`
      )
      posts = res.posts || []
    } catch {
      posts = []
    }
  }

  const lines: string[] = [
    '# Evolución TV',
    '',
    '> Medio digital independiente dedicado al periodismo, coberturas informativas, cultura alternativa, análisis editorial, señal de televisión en vivo y Evolución Radio.',
    '',
    '## Secciones Principales',
    `- [Portada](${SITE_URL}/): Noticias destacadas y coberturas recientes.`,
    `- [Señal en Vivo (24/7)](${SITE_URL}/en-vivo): Transmisión digital en vivo y programación.`,
    `- [Quiénes Somos](${SITE_URL}/quienes-somos): Identidad, misión, visión y objetivos de Evolución TV.`,
    `- [Mapa del Sitio XML](${SITE_URL}/sitemap.xml): Índice completo de URLs.`,
    '',
    '## Categorías Editoriales'
  ]

  for (const cat of categories) {
    const href = cat.slug === 'quienes-somos' ? `${SITE_URL}/quienes-somos` : `${SITE_URL}/categoria/${cat.slug}`
    lines.push(`- [${cat.name}](${href})${cat.description ? `: ${cat.description}` : ''}`)
  }

  lines.push('', '## Artículos y Noticias Publicadas')
  if (posts.length === 0) {
    lines.push('- Consulta el portal principal para ver las publicaciones más recientes.')
  } else {
    for (const post of posts) {
      const date = post.published_at ? post.published_at.slice(0, 10) : ''
      const tag = post.primary_tag?.name ? ` [${post.primary_tag.name}]` : ''
      const summary = post.excerpt ? ` — ${post.excerpt.replace(/\s+/g, ' ').trim()}` : ''
      lines.push(`- [${post.title}](${SITE_URL}/noticias/${post.slug})${tag}${date ? ` (${date})` : ''}${summary}`)
    }
  }

  lines.push('')
  return lines.join('\n')
})
