const SITE_URL = 'https://etv.webia.studio'

const escapeXml = (str: string) =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=300')

  const config = useRuntimeConfig()
  const apiUrl = (process.env.NUXT_PUBLIC_NEWS_API_URL || config.public.newsApiUrl || 'https://cms-etv.webia.studio').replace(/\/+$/, '')
  const apiKey = process.env.NUXT_PUBLIC_NEWS_API_KEY || config.public.newsApiKey || ''

  let categories: Array<{ slug: string }> = []
  let posts: Array<{ slug: string; updated_at?: string; published_at?: string }> = []

  try {
    categories = await $fetch('/api/categories')
  } catch {
    categories = []
  }

  if (apiKey) {
    try {
      const res = await $fetch<{ posts: typeof posts }>(
        `${apiUrl}/ghost/api/content/posts/?key=${apiKey}&limit=all&fields=slug,updated_at,published_at`
      )
      posts = res.posts || []
    } catch {
      posts = []
    }
  }

  const urls: Array<{ loc: string; lastmod?: string; changefreq: string; priority: string }> = [
    { loc: `${SITE_URL}/`, changefreq: 'hourly', priority: '1.0' },
    { loc: `${SITE_URL}/radio`, changefreq: 'daily', priority: '0.9' },
    { loc: `${SITE_URL}/en-vivo`, changefreq: 'daily', priority: '0.9' },
    { loc: `${SITE_URL}/quienes-somos`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${SITE_URL}/buscar`, changefreq: 'weekly', priority: '0.6' },
    { loc: `${SITE_URL}/codigo-etica`, changefreq: 'yearly', priority: '0.4' },
    { loc: `${SITE_URL}/privacidad`, changefreq: 'yearly', priority: '0.4' }
  ]

  for (const cat of categories) {
    if (cat.slug === 'quienes-somos') continue
    urls.push({
      loc: `${SITE_URL}/categoria/${cat.slug}`,
      changefreq: 'daily',
      priority: '0.8'
    })
  }

  for (const post of posts) {
    const mod = (post.updated_at || post.published_at || '').slice(0, 10)
    urls.push({
      loc: `${SITE_URL}/noticias/${post.slug}`,
      lastmod: mod || undefined,
      changefreq: 'weekly',
      priority: '0.9'
    })
  }

  const itemsXml = urls
    .map((u) => {
      const lastmodTag = u.lastmod ? `\n    <lastmod>${escapeXml(u.lastmod)}</lastmod>` : ''
      return `  <url>\n    <loc>${escapeXml(u.loc)}</loc>${lastmodTag}\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${itemsXml}\n</urlset>\n`
})
