import { useSyncExternalStore } from 'react'
export type Theme = 'light' | 'dark'
const KEY = 'gawa-theme'
const EVENT = 'gawa-theme-change'
const root = () => document.documentElement
export const currentTheme = (): Theme => root().classList.contains('dark') ? 'dark' : 'light'
function apply(t: Theme) { root().classList.toggle('dark', t === 'dark'); root().style.colorScheme = t; window.dispatchEvent(new Event(EVENT)) }
export function setTheme(t: Theme) { try { localStorage.setItem(KEY, t) } catch {} apply(t) }
export function initTheme() { const mq = window.matchMedia('(prefers-color-scheme: dark)'); mq.addEventListener('change', (e) => { let stored: string | null = null; try { stored = localStorage.getItem(KEY) } catch {} if (!stored) apply(e.matches ? 'dark' : 'light') }) }
export function useIsDark() { return useSyncExternalStore((cb) => { window.addEventListener(EVENT, cb); return () => window.removeEventListener(EVENT, cb) }, () => currentTheme() === 'dark', () => false) }