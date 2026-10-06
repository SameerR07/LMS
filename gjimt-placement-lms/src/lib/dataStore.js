import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import { seedData } from '../data/seedData'
import { computeLoginStats } from './statsCore'

const LOCAL_PREFIX = 'gjimt:lms:data:'
export const LOCAL_DATA_PREFIX = LOCAL_PREFIX
/** Fired on window whenever records saved in this browser change (detail.name = collection). */
export const DATA_CHANGED_EVENT = 'gjimt:data-changed'
/** Firestore doc holding only the three login-page numbers — readable before sign-in (see firestore.rules). */
export const PUBLIC_STATS_PATH = ['public', 'loginStats']
const STATS_CACHE_KEY = 'gjimt:lms:login-stats'
const STATS_SOURCES = ['students', 'placements', 'internships']

const announceChange = (name) => {
  try { window.dispatchEvent(new CustomEvent(DATA_CHANGED_EVENT, { detail: { name } })) } catch { /* not running in a browser */ }
}

const makeId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const readLocal = (name) => {
  const key = `${LOCAL_PREFIX}${name}`
  const raw = localStorage.getItem(key)
  if (raw) return JSON.parse(raw)

  const initial = (seedData[name] || []).map((item) => ({ ...item, id: makeId(), createdAt: new Date().toISOString() }))
  localStorage.setItem(key, JSON.stringify(initial))
  return initial
}

const writeLocal = (name, records) => {
  localStorage.setItem(`${LOCAL_PREFIX}${name}`, JSON.stringify(records))
  announceChange(name)
  return records
}

const mapFirestoreDoc = (snap) => ({ id: snap.id, ...snap.data() })

const seedFirestoreCollection = async (name) => {
  const batch = seedData[name] || []
  const ref = collection(db, name)
  const created = []
  for (const item of batch) {
    const snap = await addDoc(ref, { ...item, createdAt: new Date().toISOString() })
    created.push({ id: snap.id, ...item })
  }
  return created
}

export async function listRecords(name) {
  if (isFirebaseConfigured) {
    try {
      const snapshot = await getDocs(collection(db, name))
      if (!snapshot.empty) return snapshot.docs.map(mapFirestoreDoc)
      if ((seedData[name] || []).length) return seedFirestoreCollection(name)
      return []
    } catch (error) {
      console.warn(`[GJIMT LMS] Falling back to local ${name} data:`, error)
      return readLocal(name)
    }
  }
  return readLocal(name)
}

export async function addRecord(name, payload) {
  const record = { ...payload, createdAt: new Date().toISOString() }
  if (isFirebaseConfigured) {
    try {
      const snap = await addDoc(collection(db, name), record)
      afterCloudWrite(name)
      return { id: snap.id, ...record }
    } catch (error) {
      console.warn(`[GJIMT LMS] Firestore add failed, using local data:`, error)
    }
  }
  const records = readLocal(name)
  const next = { id: makeId(), ...record }
  writeLocal(name, [next, ...records])
  return next
}

export async function updateRecord(name, id, payload) {
  if (isFirebaseConfigured) {
    try {
      await updateDoc(doc(db, name, id), payload)
      afterCloudWrite(name)
      return { id, ...payload }
    } catch (error) {
      console.warn(`[GJIMT LMS] Firestore update failed, using local data:`, error)
    }
  }
  const records = readLocal(name)
  const next = records.map((item) => (item.id === id ? { ...item, ...payload } : item))
  writeLocal(name, next)
  return next.find((item) => item.id === id)
}

export async function deleteRecord(name, id) {
  if (isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, name, id))
      afterCloudWrite(name)
      return
    } catch (error) {
      console.warn(`[GJIMT LMS] Firestore delete failed, using local data:`, error)
    }
  }
  const records = readLocal(name)
  writeLocal(name, records.filter((item) => item.id !== id))
}

/**
 * Bulk save used by spreadsheet import.
 * creates: [payload], updates: [{ id, changes }]
 * Firestore: batched writes (400 per batch, under the 500 limit). If Firestore refuses,
 * the remaining rows fall back to local storage — the same behaviour as single adds.
 */
export async function importRecords(name, { creates = [], updates = [] }, onProgress = () => {}) {
  const now = new Date().toISOString()
  const ops = [
    ...creates.map((payload) => ({ type: 'create', data: { ...payload, createdAt: now } })),
    ...updates.map(({ id, changes }) => ({ type: 'update', id, data: changes })),
  ]
  const total = ops.length
  let done = 0

  if (isFirebaseConfigured && total) {
    try {
      for (let start = 0; start < ops.length; start += 400) {
        const chunk = ops.slice(start, start + 400)
        const batch = writeBatch(db)
        chunk.forEach((op) => {
          if (op.type === 'create') batch.set(doc(collection(db, name)), op.data)
          else batch.update(doc(db, name, op.id), op.data)
        })
        await batch.commit()
        done += chunk.length
        onProgress(done, total)
      }
      afterCloudWrite(name)
      return { created: creates.length, updated: updates.length, storage: 'cloud' }
    } catch (error) {
      console.warn(`[GJIMT LMS] Firestore import failed after ${done} rows, saving the rest locally:`, error)
    }
  }

  const remaining = ops.slice(done)
  const updateMap = new Map(remaining.filter((op) => op.type === 'update').map((op) => [op.id, op.data]))
  const records = readLocal(name).map((item) => (updateMap.has(item.id) ? { ...item, ...updateMap.get(item.id) } : item))
  const added = remaining.filter((op) => op.type === 'create').map((op) => ({ id: makeId(), ...op.data }))
  writeLocal(name, [...added, ...records])
  onProgress(total, total)
  return { created: creates.length, updated: updates.length, storage: done ? 'mixed' : 'local' }
}

export function resetLocalData() {
  Object.keys(seedData).forEach((name) => localStorage.removeItem(`${LOCAL_PREFIX}${name}`))
  announceChange('*')
  return true
}

export function exportRows(name) {
  return readLocal(name)
}

/* ---------- Login-page Quick Stats ---------- */

/** Records as the app will show them, without creating sample rows — safe before sign-in. */
export function peekLocal(name) {
  try {
    const raw = localStorage.getItem(`${LOCAL_PREFIX}${name}`)
    if (raw) return JSON.parse(raw)
  } catch { /* unreadable → same samples the app would start with */ }
  return seedData[name] || []
}

export const localLoginStats = () => computeLoginStats(Object.fromEntries(STATS_SOURCES.map((name) => [name, peekLocal(name)])))

export function readCachedStats() {
  try { return JSON.parse(localStorage.getItem(STATS_CACHE_KEY) || 'null') } catch { return null }
}
export function cacheStats(stats) {
  try { localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(stats)) } catch { /* storage full or blocked */ }
}

/** Firebase mode: recount from the cloud records and publish the three numbers (no personal data) for the login page. */
export async function refreshPublicStats() {
  if (!isFirebaseConfigured) return localLoginStats()
  const lists = await Promise.all(STATS_SOURCES.map(async (name) => {
    const snapshot = await getDocs(collection(db, name))
    return [name, snapshot.docs.map((item) => item.data())]
  }))
  const stats = computeLoginStats(Object.fromEntries(lists))
  cacheStats(stats)
  await setDoc(doc(db, ...PUBLIC_STATS_PATH), stats)
  return stats
}

let refreshTimer = null
/** Debounced refresh so a burst of edits or a big import publishes once. */
export function schedulePublicStatsRefresh(delay = 1500) {
  if (!isFirebaseConfigured) return
  clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => {
    refreshPublicStats().catch((error) => console.warn('[GJIMT LMS] Login-page stats were not refreshed:', error))
  }, delay)
}

function afterCloudWrite(name) {
  if (STATS_SOURCES.includes(name)) schedulePublicStatsRefresh()
}
