import type { H3Event } from 'h3'
import { eq } from 'drizzle-orm'
import { portalUsers } from '../database/schema'
import { useDb } from '../database'

export const PORTAL_SESSION_NAME = 'etv_portal_session'

export interface AuthenticatedPortalUser {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  authProvider: string
  isActive: boolean
  lastLoginAt: Date | null
  createdAt: Date
}

/**
 * Obtiene o crea el manejador de sesión sellada HttpOnly para usuarios finales del portal.
 */
export async function usePortalSession(event: H3Event) {
  return useSession<{ id?: string; email?: string; name?: string }>(event, {
    password: useRuntimeConfig().sessionSecret,
    name: PORTAL_SESSION_NAME,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    },
  })
}

/**
 * Verifica que la petición tenga una sesión válida y un usuario activo en PostgreSQL.
 */
export async function requirePortalAuth(event: H3Event): Promise<AuthenticatedPortalUser> {
  const session = await usePortalSession(event)

  if (!session.data?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No autorizado. Inicia sesión para continuar.',
    })
  }

  const db = useDb()
  const [user] = await db
    .select({
      id: portalUsers.id,
      name: portalUsers.name,
      email: portalUsers.email,
      avatarUrl: portalUsers.avatarUrl,
      authProvider: portalUsers.authProvider,
      isActive: portalUsers.isActive,
      lastLoginAt: portalUsers.lastLoginAt,
      createdAt: portalUsers.createdAt,
    })
    .from(portalUsers)
    .where(eq(portalUsers.id, session.data.id))
    .limit(1)

  if (!user || !user.isActive) {
    await session.clear()
    throw createError({
      statusCode: 401,
      statusMessage: 'Sesión inválida o cuenta desactivada.',
    })
  }

  return user
}
