import { Skeleton } from '@/components/ui/skeleton'
export function FullScreenLoader() {
  return (
    <div role="status" className="flex min-h-screen items-center justify-center bg-[#F8F5EC] p-6">
      <div className="w-full max-w-sm space-y-3">
        <Skeleton className="h-8 w-1/2 bg-[#E9E4D4]" />
        <Skeleton className="h-24 w-full bg-[#E9E4D4]" />
        <Skeleton className="h-24 w-full bg-[#E9E4D4]" />
      </div>
    </div>
  )
}
