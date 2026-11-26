import { eq } from 'drizzle-orm'
import { portalUsers, portalLoginLogs } from '../../database/schema'
import { useDb } from '../../database'
import { hashPassword } from '../../utils/password'
import { usePortalSession } from '../../utils/auth'
import { isEmailAuthEnabled } from '../../utils/portalSettings'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  if (!(await isEmailAuthEnabled())) {
    throw createError({
      statusCode: 403,
      statusMessage: 'El registro con correo y contraseña está desactivado. Usa "Continuar con Google".',
    })
  }

  const body = await readBody(event)
  const { name, email, password } = body || {}

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El nombre debe tener al menos 2 caracteres.',
    })
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ingresa un correo electrónico válido.',
    })
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: 'La contraseña debe tener al menos 8 caracteres.',
    })
  }

  const cleanName = name.trim().slice(0, 150)
  const cleanEmail = email.trim().toLowerCase()
  const db = useDb()

  const [existing] = await db
    .select({ id: portalUsers.id })
    .from(portalUsers)
    .where(eq(portalUsers.email, cleanEmail))
    .limit(1)

  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Ya existe una cuenta registrada con este correo electrónico.',
    })
  }

  const passwordHash = await hashPassword(password)
  const now = new Date()

  const [createdUser] = await db
    .insert(portalUsers)
    .values({
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      isActive: true,
      lastLoginAt: now,
    })
    .returning({
      id: portalUsers.id,
      name: portalUsers.name,
      email: portalUsers.email,
      avatarUrl: portalUsers.avatarUrl,
      authProvider: portalUsers.authProvider,
      isActive: portalUsers.isActive,
      lastLoginAt: portalUsers.lastLoginAt,
      createdAt: portalUsers.createdAt,
    })

  if (!createdUser) {
    throw createError({
      statusCode: 500,
      statusMessage: 'No se pudo completar el registro. Inténtalo de nuevo.',
    })
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1'
  const userAgent = getRequestHeader(event, 'user-agent') || 'unknown'

  await db.insert(portalLoginLogs).values({
    userId: createdUser.id,
    email: createdUser.email,
    status: 'success',
    ipAddress: ip,
    userAgent,
  })

  const session = await usePortalSession(event)
  await session.update({
    id: createdUser.id,
    email: createdUser.email,
    name: createdUser.name,
  })

  return {
    success: true,
    user: createdUser,
  }
})
