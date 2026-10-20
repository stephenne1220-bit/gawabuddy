import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatMoney } from '@/lib/money'
import { shortMoney, type Bar as BarDatum } from '@/lib/reportMath'
type Props = { bars: BarDatum[]; selectedKey: string; onSelect: (key: string) => void; loading: boolean }
export function IncomeExpenseChart({ bars, selectedKey, onSelect, loading }: Props) {
  const empty = bars.every((b) => b.income === 0 && b.expense === 0)
  const pick = (entry: unknown) => { const key = (entry as { payload?: { key?: string } })?.payload?.key; if (key) onSelect(key) }
  return (
    <div className="rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-[#0B3D2E]">Income vs expenses</h3><p className="text-xs text-[#6B7280]">Tap a bar to see that period below.</p>
      {loading ? (<div className="mt-3 h-56 animate-pulse rounded-xl bg-[#F8F5EC]" />) : (
        <div className="mt-3">
          <ResponsiveContainer width="100%" height={224}>
            <BarChart data={bars} margin={{ top: 8, right: 4, left: -8, bottom: 0 }} barGap={2}>
              <CartesianGrid vertical={false} stroke="#EFEAD8" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis tickFormatter={shortMoney} tickLine={false} axisLine={false} width={44} tick={{ fontSize: 11, fill: '#6B7280' }} />
              <Tooltip cursor={{ fill: '#F8F5EC' }} formatter={(value, name) => [formatMoney(Number(value)), String(name)]} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="income" name="Income" fill="#0B3D2E" radius={[4, 4, 0, 0]} onClick={pick}>{bars.map((b) => (<Cell key={b.key} fillOpacity={b.key === selectedKey ? 1 : 0.45} cursor="pointer" />))}</Bar>
              <Bar dataKey="expense" name="Expenses" fill="#D4A017" radius={[4, 4, 0, 0]} onClick={pick}>{bars.map((b) => (<Cell key={b.key} fillOpacity={b.key === selectedKey ? 1 : 0.45} cursor="pointer" />))}</Bar>
            </BarChart>
          </ResponsiveContainer>
          {empty && (<p className="mt-1 text-center text-xs text-[#9CA3AF]">No income or expenses recorded in this range yet.</p>)}
        </div>
      )}
    </div>
  )
}