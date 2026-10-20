import { useMemo, useState } from 'react'
import { currentMonthKey, shiftMonth } from '@/lib/budgetMath'
import { Mode, buildBars, buildCategoryRows, chartRange, periodRange, savingsRate, selectedBarKey } from '@/lib/reportMath'
import { useCategories } from '@/hooks/useCategories'
import { useNetWorth } from '@/hooks/useNetWorth'
import { useCategoryBreakdown, useIncomeExpense } from '@/hooks/useReports'
import type { SummaryPdfData } from '@/lib/reportPdf'
import { CategoryBreakdown } from '@/components/reports/CategoryBreakdown'
import { ExportCard } from '@/components/reports/ExportCard'
import { IncomeExpenseChart } from '@/components/reports/IncomeExpenseChart'
import { NetWorthCard } from '@/components/reports/NetWorthCard'
import { PeriodBar } from '@/components/reports/PeriodBar'
import { SavingsRateCard } from '@/components/reports/SavingsRateCard'

export default function Reports() {
  const [mode, setMode] = useState<Mode>('month')
  const [anchor, setAnchor] = useState(currentMonthKey())

  const period = periodRange(mode, anchor)
  const range = chartRange(mode, anchor)
  const selectedKey = selectedBarKey(mode, anchor)

  const ie = useIncomeExpense(range.from, range.to)
  const cat = useCategoryBreakdown(period.from, period.to)
  const categories = useCategories()
  const nw = useNetWorth()

  const bars = useMemo(() => buildBars(mode, anchor, ie.data ?? []), [mode, anchor, ie.data])
  const selected = bars.find((b) => b.key === selectedKey)
  const income = selected?.income ?? 0
  const expense = selected?.expense ?? 0
  const rate = savingsRate(income, expense)

  const catRows = useMemo(() => {
    const names = new Map(
      ((categories.data ?? []) as { id: string; name: string }[]).map((c) => [c.id, c.name]),
    )
    return buildCategoryRows(cat.data ?? [], names)
  }, [cat.data, categories.data])

  const pdfData: SummaryPdfData = {
    label: period.label,
    income,
    expense,
    rate,
    bars,
    categories: catRows,
    netWorth: nw.isLoading
      ? null
      : { accounts: nw.accounts, savings: nw.savings, debts: nw.debts, total: nw.total },
  }

  const step = mode === 'month' ? 1 : 12

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 pb-28">
      <h1 className="text-base font-semibold text-[#0B3D2E]">Reports</h1>

      <PeriodBar
        mode={mode}
        onMode={setMode}
        label={period.label}
        onPrev={() => setAnchor((a) => shiftMonth(a, -step))}
        onNext={() => setAnchor((a) => shiftMonth(a, step))}
      />

      {(ie.error || cat.error) && (
        <p className="rounded-xl bg-[#C0392B]/10 p-3 text-sm text-[#C0392B]">
          Could not load your report data.
        </p>
      )}

      <IncomeExpenseChart
        bars={bars}
        selectedKey={selectedKey}
        onSelect={setAnchor}
        loading={ie.isLoading}
      />

      <SavingsRateCard
        income={income}
        expense={expense}
        rate={rate}
        label={period.label}
        loading={ie.isLoading}
      />

      <CategoryBreakdown rows={catRows} loading={cat.isLoading} label={period.label} />

      <NetWorthCard />

      <ExportCard period={period} pdfData={pdfData} />
    </div>
  )
}