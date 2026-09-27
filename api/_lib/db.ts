import { neon } from '@neondatabase/serverless'

// Vercel + Neon automatically injects DATABASE_URL as an environment
// variable once the database is connected to this project — nothing to
// configure by hand.
export const sql = neon(process.env.DATABASE_URL!)

/** Generates a short, human-readable order code like "SB-4K9X2P". */
export function generateOrderCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no O/0/I/1 to avoid confusion when read aloud
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return `SB-${code}`
}
