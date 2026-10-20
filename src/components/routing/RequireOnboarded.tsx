import { Navigate, Outlet } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { setCurrency } from '@/lib/money'
import { signOut } from '@/lib/auth'
import { useProfile } from '@/hooks/useProfile'
import { FullScreenLoader } from './FullScreenLoader'

export function RequireOnboarded() {
  const profile = useProfile()
  if (profile.isLoading) return <FullScreenLoader />
  if (profile.isError || !profile.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F5EC] p-6">
        <div className="w-full max-w-sm rounded-2xl border border-[#EFEAD8] bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#0B3D2E]">We could not load your profile</p>
          <div className="mt-4 flex gap-2">
            <Button className="flex-1 rounded-xl" onClick={() => void profile.refetch()}>Try again</Button>
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => void signOut()}>Sign out</Button>
          </div>
        </div>
      </div>
    )
  }
  setCurrency(profile.data.currency)
  if (!profile.data.onboarded) return <Navigate to="/onboarding" replace />
  return <Outlet />
}