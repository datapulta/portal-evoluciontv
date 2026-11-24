export interface Author {
  id: string
  name: string
  slug: string
  profile_image?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  color?: string
}

export interface Article {
  id: string
  uuid: string
  title: string
  slug: string
  html?: string
  excerpt: string
  feature_image?: string
  featured: boolean
  published_at: string
  primary_author?: Author
  primary_tag?: Category
  reading_time?: number
  is_live_stream?: boolean
}

// Contenidos periodísticos oficiales de respaldo de Evolución TV
const BACKUP_ARTICLES: Article[] = [
  {
    id: 'art-1',
    uuid: 'u-1',
    title: 'Evolución TV estrena su nueva multiplataforma digital independiente',
    slug: 'evolucion-tv-nueva-plataforma-digital',
    excerpt: 'Con un enfoque en periodismo de investigación, transmisiones en vivo y coberturas ciudadanas sin censura, Evolución TV da el salto al ecosistema digital.',
    feature_image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    published_at: '2026-11-23T21:00:00Z',
    reading_time: 4,
    primary_author: {
      id: 'a-1',
      name: 'Equipo Editorial ETV',
      slug: 'redaccion',
      profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    primary_tag: {
      id: 'c-1',
      name: 'Especial',
      slug: 'especial',
      color: '#dc2626'
    }
  },
  {
    id: 'art-2',
    uuid: 'u-2',
    title: 'Análisis Económico: Los retos del presupuesto federal y su impacto en las regiones',
    slug: 'analisis-economico-presupuesto-federal',
    excerpt: 'Expertos debaten en mesa de trabajo sobre la redistribución de recursos, inflación proyectada y los sectores clave de desarrollo.',
    feature_image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    featured: false,
    published_at: '2026-11-23T19:30:00Z',
    reading_time: 5,
    primary_author: {
      id: 'a-2',
      name: 'Carlos Mendoza',
      slug: 'carlos-mendoza'
    },
    primary_tag: {
      id: 'c-2',
      name: 'Economía',
      slug: 'economia',
      color: '#0284c7'
    }
  },
  {
    id: 'art-3',
    uuid: 'u-3',
    title: 'Foro Ciudadano: Debate sobre reformas y transparencia en la gestión pública',
    slug: 'debate-reformas-transparencia-publica',
    excerpt: 'Organizaciones de la sociedad civil exigen mayores mecanismos de rendición de cuentas y auditoría abierta en contrataciones públicas.',
    feature_image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    featured: false,
    published_at: '2026-11-23T18:00:00Z',
    reading_time: 3,
    primary_author: {
      id: 'a-3',
      name: 'Mariana Ríos',
      slug: 'mariana-rios'
    },
    primary_tag: {
      id: 'c-3',
      name: 'Política',
      slug: 'politica',
      color: '#ea580c'
    }
  },
  {
    id: 'art-4',
    uuid: 'u-4',
    title: 'Tecnología y Medios: La era de la distribución descentralizada y las redes libres',
    slug: 'tecnologia-redes-libres-distribucion',
    excerpt: 'Cómo los nuevos protocolos abiertos permiten a los medios de comunicación recuperar el contacto directo con sus audiencias.',
    feature_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    featured: false,
    published_at: '2026-11-23T16:15:00Z',
    reading_time: 6,
    primary_author: {
      id: 'a-1',
      name: 'Redacción ETV',
      slug: 'redaccion'
    },
    primary_tag: {
      id: 'c-4',
      name: 'Innovación',
      slug: 'innovacion',
      color: '#8b5cf6'
    }
  },
  {
    id: 'art-5',
    uuid: 'u-5',
    title: 'Reportaje: Comunidades sostenibles y la transición energética en el país',
    slug: 'comunidades-sostenibles-transicion-energetica',
    excerpt: 'Un recorrido por las iniciativas comunitarias que están liderando proyectos de energía solar e hídrica a escala local.',
    feature_image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80',
    featured: false,
    published_at: '2026-11-23T14:40:00Z',
    reading_time: 4,
    primary_author: {
      id: 'a-2',
      name: 'Carlos Mendoza',
      slug: 'carlos-mendoza'
    },
    primary_tag: {
      id: 'c-5',
      name: 'Medio Ambiente',
      slug: 'medio-ambiente',
      color: '#16a34a'
    }
  }
]

export const useNews = () => {
  const config = useRuntimeConfig()
  const apiUrl = (config.public.newsApiUrl || 'https://cms-etv.webia.studio').replace(/\/+$/, '')
  const apiKey = config.public.newsApiKey

  const getArticles = async (params: { limit?: number; filter?: string } = {}) => {
    if (!apiKey) {
      const limit = params.limit || BACKUP_ARTICLES.length
      return {
        articles: BACKUP_ARTICLES.slice(0, limit),
        isConfigured: false
      }
    }

    try {
      // Consumo de API editorial remota
      const url = new URL(`${apiUrl}/ghost/api/content/posts/`)
      url.searchParams.set('key', apiKey)
      url.searchParams.set('include', 'tags,authors')
      if (params.limit) url.searchParams.set('limit', params.limit.toString())
      if (params.filter) url.searchParams.set('filter', params.filter)

      const response = await $fetch<{ posts: Article[] }>(url.toString())
      return {
        articles: response.posts || [],
        isConfigured: true
      }
    } catch (error) {
      console.warn('Conexión con motor editorial en espera, usando contenido de respaldo:', error)
      return {
        articles: BACKUP_ARTICLES,
        isConfigured: false
      }
    }
  }

  return {
    apiUrl,
    isConfigured: Boolean(apiKey),
    getArticles
  }
}
