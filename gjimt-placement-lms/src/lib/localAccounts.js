/* =========================================================
   Local accounts — used only while Firebase is NOT connected.
   Accounts live in this browser. Passwords are never stored:
   only a salted PBKDF2-SHA-256 hash (150,000 rounds).
   Once Firebase is configured, sign-up goes to Firebase instead.
========================================================= */
const ACCOUNTS_KEY = 'gjimt:lms:local-accounts'
const ITERATIONS = 150000
const encoder = new TextEncoder()

const toHex = (buffer) => [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
const fromHex = (hex) => new Uint8Array(hex.match(/../g).map((pair) => parseInt(pair, 16)))
const normaliseEmail = (email) => String(email || '').trim().toLowerCase()

const subtle = () => {
  const api = globalThis.crypto?.subtle
  if (!api) throw new Error('Open the LMS on localhost or an https:// address to create or use local accounts.')
  return api
}

async function hashPassword(password, saltBytes, iterations = ITERATIONS) {
  const key = await subtle().importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await subtle().deriveBits({ name: 'PBKDF2', salt: saltBytes, iterations, hash: 'SHA-256' }, key, 256)
  return toHex(bits)
}

const readAccounts = (storage) => {
  try { return JSON.parse(storage.getItem(ACCOUNTS_KEY) || '[]') } catch { return [] }
}

export const findLocalAccount = (email, storage = globalThis.localStorage) =>
  readAccounts(storage).find((account) => account.email === normaliseEmail(email)) || null

/** Creates the account and returns the public profile (no hash). */
export async function createLocalAccount({ name, email, password }, storage = globalThis.localStorage) {
  const accounts = readAccounts(storage)
  const cleanEmail = normaliseEmail(email)
  if (accounts.some((account) => account.email === cleanEmail)) {
    throw new Error('An account with this email already exists — sign in instead.')
  }
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(16))
  const account = {
    uid: `local-${toHex(globalThis.crypto.getRandomValues(new Uint8Array(8)))}`,
    name: String(name).trim().replace(/\s+/g, ' '),
    email: cleanEmail,
    salt: toHex(salt),
    hash: await hashPassword(password, salt),
    iterations: ITERATIONS,
    createdAt: new Date().toISOString(),
  }
  storage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]))
  return { uid: account.uid, name: account.name, email: account.email, createdAt: account.createdAt }
}

/** Returns the public profile when the password matches, otherwise throws a friendly error. */
export async function verifyLocalAccount(email, password, storage = globalThis.localStorage) {
  const account = findLocalAccount(email, storage)
  if (!account) throw new Error('No account found for this email — create an account first.')
  const hash = await hashPassword(password, fromHex(account.salt), account.iterations || ITERATIONS)
  if (hash !== account.hash) throw new Error('Email or password is incorrect.')
  return { uid: account.uid, name: account.name, email: account.email, createdAt: account.createdAt }
}
