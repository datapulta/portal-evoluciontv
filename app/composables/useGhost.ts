export interface GhostAuthor {
  id: string
  name: string
  slug: string
  profile_image?: string
}

export interface GhostTag {
  id: string
  name: string
  slug: string
  color?: string
}

export interface GhostPost {
  id: string
  uuid: string
  title: string
  slug: string
  html?: string
  excerpt: string
  feature_image?: string
  featured: boolean
  published_at: string
  primary_author?: GhostAuthor
  primary_tag?: GhostTag
  reading_time?: number
  is_live_stream?: boolean
}

// Datos de muestra iniciales mientras se activa la API Key en el panel de Ghost
const DEMO_POSTS: GhostPost[] = [
  {
    id: 'demo-1',
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
      id: 't-1',
      name: 'Especial',
      slug: 'especial',
      color: '#dc2626'
    }
  },
  {
    id: 'demo-2',
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
      id: 't-2',
      name: 'Economía',
      slug: 'economia',
      color: '#0284c7'
    }
  },
  {
    id: 'demo-3',
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
      id: 't-3',
      name: 'Política',
      slug: 'politica',
      color: '#ea580c'
    }
  },
  {
    id: 'demo-4',
    uuid: 'u-4',
    title: 'Tecnología y Medios: La era de la distribución descentralizada y las redes libres',
    slug: 'tecnologia-redes-libres-distribucion',
    excerpt: 'Cómo los nuevos protocolos abiertos como ActivityPub permiten a los medios de comunicación recuperar el contacto directo con sus audiencias.',
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
      id: 't-4',
      name: 'Innovación',
      slug: 'innovacion',
      color: '#8b5cf6'
    }
  },
  {
    id: 'demo-5',
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
      id: 't-5',
      name: 'Medio Ambiente',
      slug: 'medio-ambiente',
      color: '#16a34a'
    }
  }
]

export const useGhost = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.ghostApiUrl || 'https://cms-etv.webia.studio'
  const contentKey = config.public.ghostContentKey

  const getPosts = async (params: { limit?: number; filter?: string } = {}) => {
    // Si no se ha configurado la API Key de Ghost aún, devolver datos de muestra
    if (!contentKey) {
      const limit = params.limit || DEMO_POSTS.length
      return {
        posts: DEMO_POSTS.slice(0, limit),
        isDemo: true
      }
    }

    try {
      const url = new URL(`${apiUrl}/ghost/api/content/posts/`)
      url.searchParams.set('key', contentKey)
      url.searchParams.set('include', 'tags,authors')
      if (params.limit) url.searchParams.set('limit', params.limit.toString())
      if (params.filter) url.searchParams.set('filter', params.filter)

      const response = await $fetch<{ posts: GhostPost[] }>(url.toString())
      return {
        posts: response.posts || [],
        isDemo: false
      }
    } catch (error) {
      console.warn('Error al conectar con Ghost API, usando datos de respaldo:', error)
      return {
        posts: DEMO_POSTS,
        isDemo: true
      }
    }
  }

  return {
    apiUrl,
    hasApiKey: Boolean(contentKey),
    getPosts
  }
}
