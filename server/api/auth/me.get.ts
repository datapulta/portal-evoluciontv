import { eq } from 'drizzle-orm'
import { portalUsers } from '../../database/schema'
import { useDb } from '../../database'
import { usePortalSession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const session = await usePortalSession(event)

  if (!session.data?.id) {
    return {
      authenticated: false,
      user: null,
    }
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
    return {
      authenticated: false,
      user: null,
    }
  }

  return {
    authenticated: true,
    user,
  }
})
