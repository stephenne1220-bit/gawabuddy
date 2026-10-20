import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export type Priority = 'high' | 'medium' | 'low'
export type WishStatus = 'planned' | 'saving' | 'bought'

export type WishItem = {
  id: string
  name: string
  estimated_cost_cents: number
  priority: Priority
  target_date: string | null
  category: string | null
  notes: string | null
  link: string | null
  photo_url: string | null
  status: WishStatus
  saved_cents: number
  savings_goal_id: string | null
  created_at: string
}

export function useWishlist() {
  return useQuery({
    queryKey: ['wishlist', 'list'],
    queryFn: async (): Promise<WishItem[]> => {
      const { data, error } = await supabase.from('wishlist_items').select('*').order('created_at', { ascending: true })
      if (error) throw error
      return (data ?? []).map((i) => ({ ...i, estimated_cost_cents: Number(i.estimated_cost_cents), saved_cents: Number(i.saved_cents) }))
    },
  })
}

function useRefreshWishlist() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: ['wishlist'] })
}

export function useAddWishItem() {
  const refresh = useRefreshWishlist()
  return useMutation({
    mutationFn: async (item: { name: string; estimated_cost_cents: number; priority: Priority; target_date: string | null; category: string | null; notes: string | null; link: string | null; photo_url: string | null; status: WishStatus; saved_cents: number }) => {
      const { error } = await supabase.from('wishlist_items').insert(item)
      if (error) throw error
    },
    onSuccess: refresh,
  })
}

export function useDeleteWishItem() {
  const refresh = useRefreshWishlist()
  return useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('wishlist_items').delete().eq('id', id); if (error) throw error },
    onSuccess: refresh,
  })
}

export function useSetWishStatus() {
  const refresh = useRefreshWishlist()
  return useMutation({
    mutationFn: async (args: { id: string; status: WishStatus }) => {
      const { error } = await supabase.from('wishlist_items').update({ status: args.status }).eq('id', args.id)
      if (error) throw error
    },
    onSuccess: refresh,
  })
}

export function useAddWishSaved() {
  const refresh = useRefreshWishlist()
  return useMutation({
    mutationFn: async (args: { id: string; delta: number }) => {
      const { error } = await supabase.rpc('wishlist_add_saved', { p_item: args.id, p_delta: args.delta })
      if (error) throw error
    },
    onSuccess: refresh,
  })
}

export function useMoveToGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc('wishlist_move_to_goal', { p_item: id })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlist'] })
      qc.invalidateQueries({ queryKey: ['savings'] })
    },
  })
}