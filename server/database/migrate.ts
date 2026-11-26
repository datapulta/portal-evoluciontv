import postgres from 'postgres'

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://etv_admin:EtvDbPassword2026SecureKey99@159.195.13.43:5433/panel_evoluciontv'

async function runMigration() {
  console.log('Connecting to PostgreSQL database...')
  const sql = postgres(connectionString)

  try {
    console.log('Creating portal_users and portal_login_logs tables if they do not exist...')

    await sql`
      CREATE TABLE IF NOT EXISTS portal_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(150) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT,
        google_id VARCHAR(255) UNIQUE,
        avatar_url TEXT,
        auth_provider VARCHAR(30) NOT NULL DEFAULT 'local',
        is_active BOOLEAN NOT NULL DEFAULT true,
        last_login_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `

    await sql`ALTER TABLE portal_users ALTER COLUMN password_hash DROP NOT NULL;`
    await sql`ALTER TABLE portal_users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;`
    await sql`ALTER TABLE portal_users ADD COLUMN IF NOT EXISTS avatar_url TEXT;`
    await sql`ALTER TABLE portal_users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(30) NOT NULL DEFAULT 'local';`

    await sql`
      CREATE TABLE IF NOT EXISTS portal_login_logs (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES portal_users(id) ON DELETE SET NULL,
        email VARCHAR(255) NOT NULL,
        status VARCHAR(20) NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS portal_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `

    await sql`
      INSERT INTO portal_settings (key, value)
      VALUES ('email_auth_enabled', 'true')
      ON CONFLICT (key) DO NOTHING;
    `

    console.log('Portal auth migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

runMigration()
