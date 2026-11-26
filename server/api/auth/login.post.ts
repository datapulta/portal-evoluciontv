import { eq } from 'drizzle-orm'
import { portalUsers, portalLoginLogs } from '../../database/schema'
import { useDb } from '../../database'
import { verifyPassword } from '../../utils/password'
import { usePortalSession } from '../../utils/auth'
import { isEmailAuthEnabled } from '../../utils/portalSettings'

export default defineEventHandler(async (event) => {
  if (!(await isEmailAuthEnabled())) {
    throw createError({
      statusCode: 403,
      statusMessage: 'El inicio de sesión con correo y contraseña está desactivado. Usa "Continuar con Google".',
    })
  }

  const body = await readBody(event)
  const { email, password } = body || {}

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Correo electrónico y contraseña son obligatorios.',
    })
  }

  const cleanEmail = email.trim().toLowerCase()
  const db = useDb()

  const [user] = await db
    .select()
    .from(portalUsers)
    .where(eq(portalUsers.email, cleanEmail))
    .limit(1)

  const ip = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1'
  const userAgent = getRequestHeader(event, 'user-agent') || 'unknown'

  if (!user || !user.isActive) {
    await db.insert(portalLoginLogs).values({
      email: cleanEmail,
      status: 'failed',
      ipAddress: ip,
      userAgent,
    })

    throw createError({
      statusCode: 401,
      statusMessage: 'Credenciales inválidas o cuenta inactiva.',
    })
  }

  if (!user.passwordHash) {
    await db.insert(portalLoginLogs).values({
      userId: user.id,
      email: cleanEmail,
      status: 'failed',
      ipAddress: ip,
      userAgent,
    })

    throw createError({
      statusCode: 401,
      statusMessage: 'Esta cuenta fue creada con Google. Usa el botón "Continuar con Google".',
    })
  }

  const isValid = await verifyPassword(password, user.passwordHash)
  if (!isValid) {
    await db.insert(portalLoginLogs).values({
      userId: user.id,
      email: cleanEmail,
      status: 'failed',
      ipAddress: ip,
      userAgent,
    })

    throw createError({
      statusCode: 401,
      statusMessage: 'Credenciales inválidas o cuenta inactiva.',
    })
  }

  const now = new Date()
  await db
    .update(portalUsers)
    .set({ lastLoginAt: now, updatedAt: now })
    .where(eq(portalUsers.id, user.id))

  await db.insert(portalLoginLogs).values({
    userId: user.id,
    email: cleanEmail,
    status: 'success',
    ipAddress: ip,
    userAgent,
  })

  const session = await usePortalSession(event)
  await session.update({
    id: user.id,
    email: user.email,
    name: user.name,
  })

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      authProvider: user.authProvider,
      isActive: user.isActive,
      lastLoginAt: now,
      createdAt: user.createdAt,
    },
  }
})
