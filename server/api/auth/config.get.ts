import { isEmailAuthEnabled } from '../../utils/portalSettings'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const emailAuthEnabled = await isEmailAuthEnabled()

  return {
    emailAuthEnabled,
    googleAuthEnabled: Boolean(config.googleClientId && config.googleClientSecret),
  }
})
