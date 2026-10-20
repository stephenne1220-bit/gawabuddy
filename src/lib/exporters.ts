export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function cell(v: string | number): string {
  let s = String(v)
  if (typeof v === 'string' && /^[=+\-@\t\r]/.test(s)) s = `'${s}`
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function toCsv(header: string[], rows: (string | number)[][]) {
  const lines = [header, ...rows].map((r) => r.map(cell).join(','))
  return `\uFEFF${lines.join('\r\n')}\r\n`
}

export function downloadCsv(csv: string, filename: string) {
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), filename)
}