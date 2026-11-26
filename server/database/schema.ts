import { pgTable, uuid, varchar, text, boolean, timestamp, serial } from 'drizzle-orm/pg-core'

export const portalUsers = pgTable('portal_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash'),
  googleId: varchar('google_id', { length: 255 }).unique(),
  avatarUrl: text('avatar_url'),
  authProvider: varchar('auth_provider', { length: 30 }).notNull().default('local'),
  isActive: boolean('is_active').notNull().default(true),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const portalLoginLogs = pgTable('portal_login_logs', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => portalUsers.id, { onDelete: 'set null' }),
  email: varchar('email', { length: 255 }).notNull(),
  status: varchar('status', { length: 20 }).notNull(), // 'success', 'failed'
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type PortalUser = typeof portalUsers.$inferSelect
export type NewPortalUser = typeof portalUsers.$inferInsert

export const portalSettings = pgTable('portal_settings', {
  key: varchar('key', { length: 100 }).primaryKey(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
