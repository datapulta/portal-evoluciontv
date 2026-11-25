import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)

/**
 * Genera un hash seguro para la contraseña usando scrypt con salt aleatorio.
 * Formato resultante: salt:hash (hexadecimal)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer
  return `${salt}:${derivedKey.toString('hex')}`
}

/**
 * Compara una contraseña en texto plano contra un hash existente.
 */
export async function verifyPassword(password: string, combinedHash: string): Promise<boolean> {
  const parts = combinedHash.split(':')
  if (parts.length !== 2) return false
  const [salt, storedHash] = parts
  if (!salt || !storedHash) return false

  const keyBuffer = Buffer.from(storedHash, 'hex')
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer

  if (keyBuffer.length !== derivedKey.length) {
    return false
  }
  return timingSafeEqual(keyBuffer, derivedKey)
}
