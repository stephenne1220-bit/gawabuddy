export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header>
      <h1 className="text-xl font-bold text-[#0B3D2E]">{title}</h1>
      {subtitle && <p className="mt-0.5 text-sm text-[#6B7280]">{subtitle}</p>}
    </header>
  )
}