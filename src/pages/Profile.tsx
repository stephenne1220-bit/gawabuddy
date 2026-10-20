import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/app/PageHeader'
import { Avatar } from '@/components/app/Avatar'
import { useAuth } from '@/context/AuthContext'
import { useProfile, useUpdateProfile } from '@/hooks/useProfile'
import { useUploadAvatar, useDeleteAvatar, useAvatarUrl } from '@/hooks/useAvatar'

export default function Profile() {
  const { user } = useAuth()
  const { data: profile } = useProfile()
  const update = useUpdateProfile()
  const upload = useUploadAvatar()
  const remove = useDeleteAvatar()
  const { data: avatarUrl } = useAvatarUrl()
  
  const [fullName, setFullName] = useState(profile?.full_name || '')

  function handleSave() {
    update.mutate({ full_name: fullName }, {
      onSuccess: () => toast.success('Profile updated'),
      onError: () => toast.error('Could not update profile'),
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 pb-28">
      <PageHeader title="Profile" />

      <div className="rounded-2xl border border-[#EFEAD8] bg-white p-6 text-center shadow-sm dark:border-[#243b30] dark:bg-[#14291f]">
        <div className="mx-auto mb-4 flex justify-center">
          <Avatar size={96} />
        </div>
        
        <div className="flex justify-center gap-2">
          <label className="cursor-pointer rounded-xl border border-[#CFC8B0] px-4 py-2 text-sm font-semibold text-[#374151] dark:border-[#243b30] dark:text-[#f1ecdc]">
            Upload Photo
            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) upload.mutate(f, { onSuccess: () => toast.success('Photo updated') })
            }} />
          </label>
          {avatarUrl && (
            <button onClick={() => remove.mutate(undefined, { onSuccess: () => toast.success('Photo removed') })} className="rounded-xl border border-[#C0392B]/30 px-4 py-2 text-sm font-semibold text-[#C0392B]">
              Remove
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-[#EFEAD8] bg-white p-6 shadow-sm dark:border-[#243b30] dark:bg-[#14291f]">
        <h2 className="mb-4 text-sm font-bold text-[#0B3D2E] dark:text-white">Personal Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#6B7280] dark:text-[#A9B8AF]">Full Name</label>
            <input 
              type="text" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#CFC8B0] bg-white px-3 py-2 text-sm text-[#1F2937] outline-none focus:border-[#D4A017] dark:border-[#243b30] dark:bg-[#0c1b16] dark:text-white" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] dark:text-[#A9B8AF]">Email Address</label>
            <input 
              type="email" 
              value={user?.email || ''} 
              disabled
              className="mt-1 w-full rounded-lg border border-[#CFC8B0] bg-gray-100 px-3 py-2 text-sm text-[#6B7280] dark:border-[#243b30] dark:bg-[#1f362b] dark:text-[#8a9c92]" 
            />
          </div>
          <button 
            onClick={handleSave}
            disabled={update.isPending || fullName === profile?.full_name}
            className="w-full rounded-xl bg-[#0B3D2E] py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            {update.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}