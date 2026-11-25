import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function useDb() {
  if (!_db) {
    const config = useRuntimeConfig()
    const connectionString =
      config.databaseUrl ||
      process.env.DATABASE_URL ||
      'postgresql://etv_admin:EtvDbPassword2026SecureKey99@159.195.13.43:5433/panel_evoluciontv'

    const client = postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    })

    _db = drizzle(client, { schema })
  }
  return _db
}
