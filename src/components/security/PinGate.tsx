import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Delete } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import {
  PIN_EVENT, clearFailures, clearPin, hasPin, lockoutRemainingMs, pinLength, registerFailure, verifyPin,
} from '@/lib/pin'

const RELOCK_MS = 60_000

export function PinGate({ children }: { children: ReactNode }) {
  const [locked, setLocked] = useState(() => hasPin())

  useEffect(() => {
    let hiddenAt = 0
    const onVisibility = () => {
      if (document.hidden) hiddenAt = Date.now()
      else if (hiddenAt && hasPin() && Date.now() - hiddenAt > RELOCK_MS) setLocked(true)
    }
    const onPinChange = () => setLocked(false)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener(PIN_EVENT, onPinChange)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener(PIN_EVENT, onPinChange)
    }
  }, [])

  if (locked) return <LockScreen onUnlock={() => setLocked(false)} />
  return <>{children}</>
}

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const len = pinLength()
  const [value, setValue] = useState('')
  const [msg, setMsg] = useState('')
  const [wait, setWait] = useState(() => Math.ceil(lockoutRemainingMs() / 1000))
  const valueRef = useRef('')
  const busy = useRef(false)
  const waiting = wait > 0

  useEffect(() => {
    if (!waiting) return
    const id = setInterval(() => setWait(Math.ceil(lockoutRemainingMs() / 1000)), 500)
    return () => clearInterval(id)
  }, [waiting])

  async function submit(pin: string) {
    busy.current = true
    const ok = await verifyPin(pin)
    busy.current = false
    if (ok) { clearFailures(); onUnlock(); return }
    const f = registerFailure()
    valueRef.current = ''
    setValue('')
    if (f.lockedMs) { setWait(Math.ceil(f.lockedMs / 1000)); setMsg('Too many wrong tries.') }
    else setMsg(`Wrong PIN. ${f.left} ${f.left === 1 ? 'try' : 'tries'} left.`)
  }

  function press(d: string) {
    if (waiting || busy.current || valueRef.current.length >= len) return
    setMsg('')
    const next = valueRef.current + d
    valueRef.current = next
    setValue(next)
    if (next.length === len) void submit(next)
  }

  function back() {
    if (busy.current) return
    valueRef.current = valueRef.current.slice(0, -1)
    setValue(valueRef.current)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) press(e.key)
      else if (e.key === 'Backspace') back()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [waiting])

  async function forgot() {
    if (!confirm('Sign out and remove the PIN on this device?')) return
    await supabase.auth.signOut()
    clearPin()
    onUnlock()
  }

  const key = 'h-16 rounded-2xl bg-white text-xl font-semibold text-[#1F2937] shadow-sm active:scale-95 disabled:opacity-40'

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F8F5EC] p-6">
      <p className="text-sm font-semibold text-[#8A6A00]">Gawa App</p>
      <h1 className="mt-1 text-lg font-semibold text-[#0B3D2E]">Enter your PIN</h1>
      <div className="mt-6 flex gap-3" aria-hidden="true">
        {Array.from({ length: len }).map((_, i) => (
          <span key={i} className={`h-3.5 w-3.5 rounded-full border-2 ${i < value.length ? 'border-[#D4A017] bg-[#D4A017]' : 'border-[#CFC8B0]'}`} />
        ))}
      </div>
      <p role="alert" className="mt-3 h-5 text-xs font-medium text-[#C0392B]">{waiting ? `Try again in ${wait}s` : msg}</p>
      <div className="mt-4 grid w-full max-w-[17rem] grid-cols-3 gap-3">
        {DIGITS.map((d) => (<button key={d} type="button" disabled={waiting} onClick={() => press(d)} className={key}>{d}</button>))}
        <span />
        <button type="button" disabled={waiting} onClick={() => press('0')} className={key}>0</button>
        <button type="button" aria-label="Delete last digit" disabled={waiting} onClick={back} className={`${key} flex items-center justify-center`}><Delete size={22} /></button>
      </div>
      <button type="button" onClick={forgot} className="mt-8 text-xs font-medium text-[#6B7280] underline">Forgot PIN? Sign out</button>
    </div>
  )
}