import { computed } from 'vue'

export interface PortalUserProfile {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  authProvider: string
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
}

interface AuthMeResponse {
  authenticated: boolean
  user: PortalUserProfile | null
}

export function useAuth() {
  const user = useState<PortalUserProfile | null>('portal-auth-user', () => null)
  const initialized = useState<boolean>('portal-auth-initialized', () => false)
  const loading = useState<boolean>('portal-auth-loading', () => false)

  const isAuthenticated = computed(() => Boolean(user.value))

  async function fetchUser(force = false): Promise<PortalUserProfile | null> {
    if (initialized.value && !force) {
      return user.value
    }

    loading.value = true
    try {
      const requestFetch = useRequestFetch()
      const data = await requestFetch<AuthMeResponse>('/api/auth/me')
      user.value = data?.authenticated ? data.user : null
    } catch {
      user.value = null
    } finally {
      initialized.value = true
      loading.value = false
    }

    return user.value
  }

  async function login(email: string, password: string): Promise<PortalUserProfile> {
    loading.value = true
    try {
      const res = await $fetch<{ success: boolean; user: PortalUserProfile }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      user.value = res.user
      initialized.value = true
      return res.user
    } finally {
      loading.value = false
    }
  }

  async function register(name: string, email: string, password: string): Promise<PortalUserProfile> {
    loading.value = true
    try {
      const res = await $fetch<{ success: boolean; user: PortalUserProfile }>('/api/auth/register', {
        method: 'POST',
        body: { name, email, password },
      })
      user.value = res.user
      initialized.value = true
      return res.user
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    loading.value = true
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      user.value = null
      initialized.value = true
      loading.value = false
    }
  }

  return {
    user,
    isAuthenticated,
    initialized,
    loading,
    fetchUser,
    login,
    register,
    logout,
  }
}
