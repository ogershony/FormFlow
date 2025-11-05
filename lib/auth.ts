import bcrypt from 'bcryptjs'

export async function verifyPassword(password: string): Promise<boolean> {
  const hashedPassword = process.env.ADMIN_PASSWORD_HASH

  if (!hashedPassword) {
    console.error('ADMIN_PASSWORD_HASH not set in environment variables')
    return false
  }

  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    console.error('Error verifying password:', error)
    return false
  }
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

// Simple token generation (in production, use JWT or similar)
export function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
