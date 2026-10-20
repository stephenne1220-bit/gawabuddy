import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { CurrencyCode } from '@/lib/money'
export type Settings = { currency: CurrencyCode; month_start_day: number }
export const DEFAULT_SETTINGS: Settings = { currency: 'KES', month_start_day: 1 }
export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async (): Promise<Settings> => {
      const { data, error } = await supabase.from('user_settings').select('currency, month_start_day').maybeSingle()
      if (error) throw error
      return data ? { currency: data.currency as CurrencyCode, month_start_day: Number(data.month_start_day) } : DEFAULT_SETTINGS
    },
  })
}
export function useSaveSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (s: Settings) => {
      const { error } = await supabase.from('user_settings').upsert({ ...s, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
      if (error) throw error
    },
    onSuccess: async () => {
      qc.removeQueries({ predicate: (q) => q.queryKey[0] !== 'settings' })
      await qc.invalidateQueries({ queryKey: ['settings'] })
    },
  })
}