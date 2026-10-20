import { useState } from 'react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { clearPin, setPin, verifyPin } from '@/lib/pin'

export type PinMode = 'set' | 'change' | 'disable'
type Props = { mode: PinMode | null; onOpenChange: (open: boolean) => void }

const TITLE: Record<PinMode, string> = { set: 'Turn on PIN lock', change: 'Change PIN', disable: 'Turn off PIN lock' }

export function PinSheet({ mode, onOpenChange }: Props) {
  return (
    <Sheet open={mode !== null} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-3xl bg-[#F8F5EC] pb-8">
        <SheetHeader><SheetTitle className="text-[#0B3D2E]">{mode ? TITLE[mode] : ''}</SheetTitle></SheetHeader>
        {mode && <PinFlow mode={mode} onDone={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  )
}

type Step = 'current' | 'new' | 'confirm'
const STEPS: Record<PinMode, Step[]> = { set: ['new', 'confirm'], change: ['current', 'new', 'confirm'], disable: ['current'] }
const LABEL: Record<Step, string> = { current: 'Enter your current PIN', new: 'Choose a PIN (4 to 6 digits)', confirm: 'Enter the new PIN again' }

function PinFlow({ mode, onDone }: { mode: PinMode; onDone: () => void }) {
  const steps = STEPS[mode]
  const [index, setIndex] = useState(0)
  const [value, setValue] = useState('')
  const [first, setFirst] = useState('')
  const [busy, setBusy] = useState(false)
  const step = steps[index]

  async function next() {
    setBusy(true)
    try {
      if (step === 'current') {
        if (!(await verifyPin(value))) { toast.error('That is not your current PIN.'); setValue(''); return }
        if (mode === 'disable') { clearPin(); toast.success('PIN lock turned off'); onDone(); return }
      } else if (step === 'new') {
        if (!/^\d{4,6}$/.test(value)) { toast.error('Use 4 to 6 digits.'); return }
        setFirst(value)
      } else {
        if (value !== first) { toast.error('The PINs did not match. Start again.'); setIndex(steps.indexOf('new')); setValue(''); setFirst(''); return }
        if (!(await setPin(value))) { toast.error('Could not save the PIN on this device.'); return }
        toast.success(mode === 'set' ? 'PIN lock turned on' : 'PIN changed')
        onDone()
        return
      }
      setIndex(index + 1)
      setValue('')
    } finally { setBusy(false) }
  }

  return (
    <div className="mt-4 space-y-4">
      <label className="block text-xs font-medium text-[#6B7280]">{LABEL[step]}<input autoFocus type="password" inputMode="numeric" autoComplete="off" maxLength={6} value={value} onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))} onKeyDown={(e) => e.key === 'Enter' && value && void next()} className="mt-1 w-full rounded-lg border border-[#CFC8B0] bg-white px-3 py-3 text-center text-2xl tracking-[0.5em] text-[#1F2937] outline-none focus:border-[#D4A017]" /></label>
      <button type="button" disabled={busy || value.length < (step === 'current' ? 1 : 4)} onClick={() => void next()} className="w-full rounded-xl bg-[#0B3D2E] py-3 text-sm font-semibold text-white disabled:opacity-50">{step === 'confirm' || (step === 'current' && mode === 'disable') ? 'Save' : 'Continue'}</button>
    </div>
  )
}