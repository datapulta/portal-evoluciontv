import { eq } from 'drizzle-orm'
import { portalSettings } from '../database/schema'
import { useDb } from '../database'

export const EMAIL_AUTH_KEY = 'email_auth_enabled'

/**
 * Indica si el registro e inicio de sesión con correo y contraseña está habilitado.
 * Por defecto devuelve true si no existe registro en portal_settings.
 */
export async function isEmailAuthEnabled(): Promise<boolean> {
  try {
    const db = useDb()
    const [row] = await db
      .select({ value: portalSettings.value })
      .from(portalSettings)
      .where(eq(portalSettings.key, EMAIL_AUTH_KEY))
      .limit(1)

    if (!row) return true
    return row.value !== 'false'
  } catch {
    return true
  }
}
