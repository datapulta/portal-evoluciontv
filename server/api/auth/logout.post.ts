import { usePortalSession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const session = await usePortalSession(event)
  await session.clear()

  return {
    success: true,
    message: 'Sesión cerrada correctamente.',
  }
})
