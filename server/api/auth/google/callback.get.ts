import { eq, or } from 'drizzle-orm'
import { portalUsers, portalLoginLogs } from '../../../database/schema'
import { useDb } from '../../../database'
import { usePortalSession } from '../../../utils/auth'
import { OAUTH_STATE_COOKIE } from '../google.get'

interface GoogleTokenResponse {
  access_token?: string
  id_token?: string
  error?: string
}

interface GoogleUserInfo {
  sub: string
  email: string
  email_verified?: boolean
  name?: string
  picture?: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const code = typeof query.code === 'string' ? query.code : ''
  const returnedState = typeof query.state === 'string' ? query.state : ''

  const rawCookie = getCookie(event, OAUTH_STATE_COOKIE)
  deleteCookie(event, OAUTH_STATE_COOKIE, { path: '/' })

  if (!code || !returnedState || !rawCookie || !config.googleClientId || !config.googleClientSecret) {
    return sendRedirect(event, '/login?error=google_auth_failed', 302)
  }

  let parsedState: { state?: string; redirect?: string } = {}
  try {
    parsedState = JSON.parse(Buffer.from(rawCookie, 'base64url').toString('utf8'))
  } catch {
    return sendRedirect(event, '/login?error=google_auth_failed', 302)
  }

  if (!parsedState.state || parsedState.state !== returnedState) {
    return sendRedirect(event, '/login?error=google_auth_failed', 302)
  }

  const isMobileDeepLink = parsedState.redirect === 'evoluciontv://auth/callback'
  const safeRedirect =
    isMobileDeepLink ||
    (typeof parsedState.redirect === 'string' &&
      parsedState.redirect.startsWith('/') &&
      !parsedState.redirect.startsWith('//'))
      ? parsedState.redirect
      : '/'

  const origin = getRequestURL(event).origin
  const redirectUri = `${origin}/api/auth/google/callback`

  let googleUser: GoogleUserInfo
  try {
    const tokenRes = await $fetch<GoogleTokenResponse>('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: config.googleClientId,
        client_secret: config.googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }).toString(),
    })

    if (!tokenRes.access_token) {
      return sendRedirect(event, '/login?error=google_auth_failed', 302)
    }

    googleUser = await $fetch<GoogleUserInfo>('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenRes.access_token}`,
      },
    })
  } catch {
    return sendRedirect(event, '/login?error=google_auth_failed', 302)
  }

  if (!googleUser?.sub || !googleUser?.email) {
    return sendRedirect(event, '/login?error=google_auth_failed', 302)
  }

  const cleanEmail = googleUser.email.trim().toLowerCase()
  const displayName = (googleUser.name || cleanEmail.split('@')[0] || 'Usuario').trim().slice(0, 150)
  const avatarUrl = googleUser.picture || null
  const db = useDb()
  const now = new Date()
  const ip = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1'
  const userAgent = getRequestHeader(event, 'user-agent') || 'unknown'

  let [user] = await db
    .select()
    .from(portalUsers)
    .where(or(eq(portalUsers.googleId, googleUser.sub), eq(portalUsers.email, cleanEmail)))
    .limit(1)

  if (user) {
    if (!user.isActive) {
      await db.insert(portalLoginLogs).values({
        userId: user.id,
        email: cleanEmail,
        status: 'failed',
        ipAddress: ip,
        userAgent,
      })
      return sendRedirect(event, '/login?error=account_disabled', 302)
    }

    const [updated] = await db
      .update(portalUsers)
      .set({
        googleId: user.googleId || googleUser.sub,
        avatarUrl: avatarUrl || user.avatarUrl,
        name: user.name || displayName,
        lastLoginAt: now,
        updatedAt: now,
      })
      .where(eq(portalUsers.id, user.id))
      .returning()

    if (updated) {
      user = updated
    }
  } else {
    const [created] = await db
      .insert(portalUsers)
      .values({
        name: displayName,
        email: cleanEmail,
        googleId: googleUser.sub,
        avatarUrl,
        authProvider: 'google',
        isActive: true,
        lastLoginAt: now,
      })
      .returning()

    if (!created) {
      return sendRedirect(event, '/login?error=google_auth_failed', 302)
    }
    user = created
  }

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

  if (isMobileDeepLink) {
    const mobileUri = new URL('evoluciontv://auth/callback')
    mobileUri.searchParams.set('id', String(user.id))
    mobileUri.searchParams.set('name', user.name)
    mobileUri.searchParams.set('email', user.email)
    if (user.avatarUrl) {
      mobileUri.searchParams.set('avatarUrl', user.avatarUrl)
    }
    return sendRedirect(event, mobileUri.toString(), 302)
  }

  return sendRedirect(event, safeRedirect, 302)
})
