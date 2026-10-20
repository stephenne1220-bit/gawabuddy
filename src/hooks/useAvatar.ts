import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

export function useAvatarUrl() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['avatar', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.storage.from('avatars').list(user!.id)
      if (error || !data || data.length === 0) return null
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(`${user!.id}/${data[0].name}`)
      return urlData.publicUrl
    },
  })
}

export function useUploadAvatar() {
  const { user } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('Not signed in')
      const ext = file.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (uploadError) throw uploadError
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['avatar'] }),
  })
}

export function useDeleteAvatar() {
  const { user } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      if (!user) return
      const { data } = await supabase.storage.from('avatars').list(user.id)
      if (data) {
        await Promise.all(data.map((f) => supabase.storage.from('avatars').remove([`${user.id}/${f.name}`])))
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['avatar'] }),
  })
}