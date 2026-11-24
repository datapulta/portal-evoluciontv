import { getGhostConfig, createGhostAdminToken } from '~~/server/utils/ghostAdmin'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; name?: string }>(event)
  const email = String(body?.email || '').trim().toLowerCase()
  const name = String(body?.name || '').trim()

  if (!email || !EMAIL_REGEX.test(email)) {
    throw createError({
      statusCode: 400,
      message: 'Por favor ingresa un correo electrónico válido.'
    })
  }

  const { apiUrl, adminKey } = getGhostConfig()

  if (!adminKey) {
    throw createError({
      statusCode: 503,
      message: 'El servicio de suscripción no está disponible temporalmente.'
    })
  }

  try {
    const token = createGhostAdminToken(adminKey)
    await $fetch(`${apiUrl}/ghost/api/admin/members/`, {
      method: 'POST',
      headers: {
        Authorization: `Ghost ${token}`,
        'Content-Type': 'application/json'
      },
      body: {
        members: [
          {
            email,
            ...(name ? { name } : {}),
            labels: [{ name: 'boletin-web' }],
            note: 'Suscripción registrada desde panel-evoluciontv'
          }
        ]
      }
    })

    return {
      ok: true,
      status: 'subscribed',
      message: '¡Gracias por suscribirte! Pronto recibirás nuestras novedades editoriales.'
    }
  } catch (err: any) {
    const statusCode = err?.statusCode || err?.response?.status
    const errorMsg = JSON.stringify(err?.data || err?.response?._data || '').toLowerCase()

    if (statusCode === 422 && (errorMsg.includes('already exists') || errorMsg.includes('member'))) {
      return {
        ok: true,
        status: 'already_subscribed',
        message: 'Este correo ya se encuentra suscrito al boletín de Evolución TV.'
      }
    }

    throw createError({
      statusCode: 502,
      message: 'No pudimos registrar tu suscripción en este momento. Intenta de nuevo.'
    })
  }
})
