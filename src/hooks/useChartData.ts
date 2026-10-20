import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { shiftMonth, currentMonthKey } from '@/lib/budgetMath'

export function useChartData() {
  const { user } = useAuth()
  const nowKey = currentMonthKey()
  const startKey = shiftMonth(nowKey, -5)

  return useQuery({
    queryKey: ['chart-data', startKey],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('date, amount_cents, type')
        .gte('date', startKey)
        .lte('date', nowKey + '-31')
      
      if (error) throw error
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const result = new Map<string, { income: number, spending: number }>()
      
      for (let i = 5; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        const name = months[d.getMonth()]
        result.set(name, { income: 0, spending: 0 })
      }

      for (const tx of data ?? []) {
        const date = new Date(tx.date)
        const name = months[date.getMonth()]
        const existing = result.get(name) ?? { income: 0, spending: 0 }
        
        if (tx.type === 'income') existing.income += Number(tx.amount_cents)
        else if (tx.type === 'expense') existing.spending += Number(tx.amount_cents)
        
        result.set(name, existing)
      }

      return Array.from(result.entries()).map(([name, vals]) => ({
        name,
        income: vals.income / 100,
        spending: vals.spending / 100,
      }))
    },
  })
}