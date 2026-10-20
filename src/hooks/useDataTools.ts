import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useHasDemo() {
  return useQuery({
    queryKey: ['demo', 'has'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('has_demo_data')
      if (error) throw error
      return Boolean(data)
    },
  })
}

export function useHasTransactions() {
  return useQuery({
    queryKey: ['demo', 'has-transactions'],
    staleTime: 0,
    queryFn: async () => {
      const { count, error } = await supabase.from('transactions').select('id', { count: 'exact', head: true })
      if (error) throw error
      return (count ?? 0) > 0
    },
  })
}

export function useLoadDemo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('load_demo_data')
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries(),
  })
}

export function useClearDemo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('clear_demo_data')
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries(),
  })
}

export function useResetData() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('reset_my_data')
      if (error) throw error
    },
    onSuccess: async () => {
      qc.removeQueries({ predicate: (q) => q.queryKey[0] !== 'settings' })
      await qc.invalidateQueries()
    },
  })
}