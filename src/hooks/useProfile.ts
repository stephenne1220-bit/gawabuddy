import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import type { Profile } from '@/lib/types'

async function fetchProfile(): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').maybeSingle()
  if (error) throw error
  return data ? ({ ...data, monthly_income: Number(data.monthly_income) } as Profile) : null
}

export function useProfile() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['profile'],
    enabled: !!user,
    queryFn: async (): Promise<Profile> => {
      let profile = await fetchProfile()
      if (!profile) {
        const { error } = await supabase.rpc('ensure_my_profile')
        if (error) throw error
        profile = await fetchProfile()
      }
      if (!profile) throw new Error('Could not load profile')
      return profile
    },
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: async (patch: Partial<Profile>) => {
      const { error } = await supabase.from('profiles').update(patch).eq('user_id', user!.id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  })
}