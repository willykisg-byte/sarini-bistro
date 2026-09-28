import { neon } from '@neondatabase/serverless'

// Vercel + Neon injects DATABASE_URL automatically once the database is
// connected to the project. We connect lazily so a missing variable gives a
// clear error instead of crashing the whole function on load.
export function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }
  return neon(url)
}

/** Generates a short, human-readable order code like "SB-4K9X2P". */
export function generateOrderCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no O/0/I/1 to avoid confusion when read aloud
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return `SB-${code}`
}
