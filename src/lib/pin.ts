import { useSyncExternalStore } from 'react'
export const PIN_EVENT = 'gawa-pin-change'
const KEY = 'gawa-pin'
const TRIES_KEY = 'gawa-pin-tries'
const MAX_TRIES = 5
const LOCK_MS = 30_000
const ITERATIONS = 150_000
type Stored = { salt: string; hash: string; len: number }
type Tries = { count: number; until: number }
function read<T>(key: string): T | null { try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : null } catch { return null } }
function write(key: string, value: unknown) { try { localStorage.setItem(key, JSON.stringify(value)) } catch {} }
const toHex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('')
const fromHex = (h: string) => new Uint8Array((h.match(/.{2}/g) ?? []).map((x) => parseInt(x, 16)))
async function derive(pin: string, salt: Uint8Array) { const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']); const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: salt as BufferSource, iterations: ITERATIONS, hash: 'SHA-256' }, key, 256); return toHex(bits) }
export const hasPin = () => read<Stored>(KEY) !== null
export const pinLength = () => read<Stored>(KEY)?.len ?? 4
export async function setPin(pin: string): Promise<boolean> { const salt = crypto.getRandomValues(new Uint8Array(16)); write(KEY, { salt: toHex(salt.buffer), hash: await derive(pin, salt), len: pin.length }); const saved = hasPin(); clearFailures(); window.dispatchEvent(new Event(PIN_EVENT)); return saved }
export async function verifyPin(pin: string): Promise<boolean> { const s = read<Stored>(KEY); if (!s) return false; return (await derive(pin, fromHex(s.salt))) === s.hash }
export function clearPin() { try { localStorage.removeItem(KEY) } catch {} clearFailures(); window.dispatchEvent(new Event(PIN_EVENT)) }
export function lockoutRemainingMs() { const t = read<Tries>(TRIES_KEY); return t ? Math.max(0, t.until - Date.now()) : 0 }
export function registerFailure(): { left: number; lockedMs: number } { const count = (read<Tries>(TRIES_KEY)?.count ?? 0) + 1; if (count >= MAX_TRIES) { write(TRIES_KEY, { count: 0, until: Date.now() + LOCK_MS }); return { left: 0, lockedMs: LOCK_MS } } write(TRIES_KEY, { count, until: 0 }); return { left: MAX_TRIES - count, lockedMs: 0 } }
export function clearFailures() { try { localStorage.removeItem(TRIES_KEY) } catch {} }
export function usePinEnabled() { return useSyncExternalStore((cb) => { window.addEventListener(PIN_EVENT, cb); window.addEventListener('storage', cb); return () => { window.removeEventListener(PIN_EVENT, cb); window.removeEventListener('storage', cb) } }, hasPin, () => false) }