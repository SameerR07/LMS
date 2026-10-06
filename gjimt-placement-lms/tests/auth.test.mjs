// Sign-up rules and local (browser) accounts — run with:  npm test
import assert from 'node:assert/strict'
import { friendlyAuthError, passwordProblem, passwordStrength, signUpProblems } from '../src/lib/authHelpers.js'
import { createLocalAccount, findLocalAccount, verifyLocalAccount } from '../src/lib/localAccounts.js'

let passed = 0
const test = async (name, fn) => { try { await fn(); passed++; console.log('  ✓', name) } catch (e) { console.log('  ✗', name, '\n    ', e.message); process.exitCode = 1 } }
const memoryStorage = () => { const data = new Map(); return { getItem: (k) => (data.has(k) ? data.get(k) : null), setItem: (k, v) => data.set(k, String(v)), dump: () => Object.fromEntries(data) } }

console.log('Sign-up rules')
await test('password rules', () => {
  assert.equal(passwordProblem('short1'), 'Use at least 8 characters.')
  assert.equal(passwordProblem('12345678'), 'Add at least one letter.')
  assert.equal(passwordProblem('abcdefgh'), 'Add at least one number.')
  assert.equal(passwordProblem('placement1'), '')
})
await test('strength meter', () => {
  assert.equal(passwordStrength('').label, '')
  assert.equal(passwordStrength('abc').label, 'Weak')
  assert.equal(passwordStrength('placement1').label, 'Weak')
  assert.equal(passwordStrength('Placement2026').label, 'Good')
  assert.equal(passwordStrength('Placement@2026!').label, 'Strong')
})
await test('form problems', () => {
  assert.deepEqual(signUpProblems({ name: 'A', email: 'x', password: 'abc', confirm: '' }), { name: 'Enter your full name.', email: 'Enter a valid email address.', password: 'Use at least 8 characters.' })
  assert.deepEqual(signUpProblems({ name: 'Simran Kaur', email: 's@gmail.com', password: 'placement1', confirm: 'placement2' }), { confirm: 'Passwords do not match.' })
  assert.deepEqual(signUpProblems({ name: 'Simran Kaur', email: 's@gmail.com', password: 'placement1', confirm: 'placement1' }), {})
})
await test('friendly Firebase errors', () => {
  assert.match(friendlyAuthError({ code: 'auth/email-already-in-use' }), /already exists/)
  assert.match(friendlyAuthError({ code: 'auth/invalid-credential' }), /incorrect/)
  assert.equal(friendlyAuthError({ message: 'Firebase: Something odd (auth/odd-thing).' }), 'Something odd')
})

console.log('Local accounts (no Firebase)')
await test('create → sign in → wrong password → duplicate', async () => {
  const storage = memoryStorage()
  const created = await createLocalAccount({ name: '  Simran   Kaur ', email: ' Simran@Example.com ', password: 'Placement2026' }, storage)
  assert.equal(created.name, 'Simran Kaur'); assert.equal(created.email, 'simran@example.com'); assert.match(created.uid, /^local-/)
  const raw = JSON.stringify(storage.dump())
  assert.ok(!raw.includes('Placement2026'), 'password is never stored'); assert.ok(findLocalAccount('SIMRAN@example.com', storage).hash.length === 64)
  const signedIn = await verifyLocalAccount('simran@example.com', 'Placement2026', storage)
  assert.equal(signedIn.uid, created.uid)
  await assert.rejects(verifyLocalAccount('simran@example.com', 'wrong-pass1', storage), /incorrect/)
  await assert.rejects(verifyLocalAccount('nobody@example.com', 'Placement2026', storage), /No account found/)
  await assert.rejects(createLocalAccount({ name: 'Other', email: 'simran@example.com', password: 'Another123' }, storage), /already exists/)
})
await test('same password, different accounts → different hashes (salted)', async () => {
  const storage = memoryStorage()
  await createLocalAccount({ name: 'A One', email: 'a@x.in', password: 'SamePass123' }, storage)
  await createLocalAccount({ name: 'B Two', email: 'b@x.in', password: 'SamePass123' }, storage)
  assert.notEqual(findLocalAccount('a@x.in', storage).hash, findLocalAccount('b@x.in', storage).hash)
})
console.log(`\n${passed} tests passed${process.exitCode ? ' — SOME FAILED' : ''}`)
