import { useAvatarUrl } from '@/hooks/useAvatar'
import { useProfile } from '@/hooks/useProfile'

export function Avatar({ size = 40 }: { size?: number }) {
  const { data: url } = useAvatarUrl()
  const { data: profile } = useProfile()
  const initial = profile?.full_name?.charAt(0).toUpperCase() || 'U'

  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0B3D2E] text-white shadow-sm"
      style={{ width: size, height: size }}
    >
      {url ? (
        <img src={url} alt="Profile" className="h-full w-full object-cover" />
      ) : (
        <span style={{ fontSize: size * 0.45 }} className="font-bold">{initial}</span>
      )}
    </div>
  )
}