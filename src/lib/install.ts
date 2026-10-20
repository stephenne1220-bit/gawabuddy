import { useSyncExternalStore } from 'react'
type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }
let deferred: InstallEvent | null = null
const subscribers = new Set<() => void>()
const emit = () => subscribers.forEach((f) => f())
export function initInstallCapture() {
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e as InstallEvent; emit() })
  window.addEventListener('appinstalled', () => { deferred = null; emit() })
}
export const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true
export const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent)
export async function promptInstall() { if (!deferred) return; const event = deferred; await event.prompt(); await event.userChoice; deferred = null; emit() }
export function useCanInstall() { return useSyncExternalStore((cb) => { subscribers.add(cb); return () => { subscribers.delete(cb) } }, () => deferred !== null, () => false) }