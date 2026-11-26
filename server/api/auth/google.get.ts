import { randomBytes } from 'node:crypto'

export const OAUTH_STATE_COOKIE = 'etv_oauth_state'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  if (!config.googleClientId || !config.googleClientSecret) {
    throw createError({
      statusCode: 503,
      statusMessage: 'El inicio de sesión con Google no está configurado en el servidor.',
    })
  }

  const query = getQuery(event)
  const rawRedirect = typeof query.redirect === 'string' ? query.redirect : '/'
  const isMobileDeepLink = rawRedirect === 'evoluciontv://auth/callback'
  const safeRedirect =
    isMobileDeepLink || (rawRedirect.startsWith('/') && !rawRedirect.startsWith('//'))
      ? rawRedirect
      : '/'

  const state = randomBytes(24).toString('hex')
  const statePayload = JSON.stringify({ state, redirect: safeRedirect })

  setCookie(event, OAUTH_STATE_COOKIE, Buffer.from(statePayload).toString('base64url'), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })

  const origin = getRequestURL(event).origin
  const redirectUri = `${origin}/api/auth/google/callback`

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', config.googleClientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'openid email profile')
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('prompt', 'select_account')

  return sendRedirect(event, authUrl.toString(), 302)
})
