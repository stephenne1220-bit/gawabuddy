import { useState } from 'react'
import { ClipboardPaste } from 'lucide-react'
import { mpesaCodeExists } from '@/hooks/useTransactions'
import { parseMpesa, type MpesaParse } from '@/lib/mpesa'

type Props = {
  onApply: (result: MpesaParse, duplicate: boolean) => void
  onClose: () => void
}

export function MpesaPanel({ onApply, onClose }: Props) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function pasteFromClipboard() {
    try {
      setText(await navigator.clipboard.readText())
      setError('')
    } catch {
      setError('Your browser did not allow pasting. Press and hold in the box, then choose Paste.')
    }
  }

  async function read() {
    const result = parseMpesa(text)
    if (!result) {
      setError('That does not look like an M-Pesa confirmation. Paste the whole message.')
      return
    }
    setBusy(true)
    const duplicate = result.code ? await mpesaCodeExists(result.code) : false
    setBusy(false)
    onApply(result, duplicate)
  }

  return (
    <div className="space-y-3 rounded-2xl border border-[#D4A017] bg-white p-3">
      <label htmlFor="mpesa-text" className="block text-xs font-semibold text-[#0B3D2E]">
        Paste your M-Pesa message
      </label>
      <textarea
        id="mpesa-text"
        rows={4}
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setError('')
        }}
        placeholder="QJ12ABC3DE Confirmed. Ksh500.00 paid to…"
        className="w-full rounded-lg border border-[#CFC8B0] bg-white p-2 text-base text-[#1F2937] outline-none focus:border-[#D4A017]"
      />
      {error && (
        <p role="alert" className="text-xs font-medium text-[#C0392B]">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => void pasteFromClipboard()}
          className="flex items-center gap-1 rounded-xl border border-[#CFC8B0] px-3 py-2 text-sm font-semibold text-[#374151]"
        >
          <ClipboardPaste size={16} aria-hidden="true" /> Paste
        </button>
        <button
          type="button"
          disabled={!text.trim() || busy}
          onClick={() => void read()}
          className="flex-1 rounded-xl bg-[#0B3D2E] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? 'Reading…' : 'Read message'}
        </button>
        <button type="button" onClick={onClose} className="px-2 text-sm font-medium text-[#6B7280]">
          Cancel
        </button>
      </div>
    </div>
  )
}