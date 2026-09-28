import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Checks the staff password sent in the `x-admin-key` header against the
 * ADMIN_PASSWORD environment variable set in Vercel. Returns true if allowed;
 * otherwise it has already sent the error response.
 */
export function requireAdmin(req: VercelRequest, res: VercelResponse): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    res.status(500).json({ error: 'Staff password has not been set up yet.' })
    return false
  }

  const given = String(req.headers['x-admin-key'] ?? '')

  // Compare every character so timing doesn't reveal how close a guess was.
  let mismatch = given.length === expected.length ? 0 : 1
  const length = Math.max(given.length, expected.length)
  for (let i = 0; i < length; i++) {
    mismatch |= (given.charCodeAt(i) || 0) ^ (expected.charCodeAt(i) || 0)
  }

  if (mismatch !== 0) {
    res.status(401).json({ error: 'Wrong password' })
    return false
  }
  return true
}
