import { PlusCircle } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { EmptyState } from '@/components/app/EmptyState'

export function AddSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl bg-[#F8F5EC] pb-8">
        <SheetHeader>
          <SheetTitle className="text-[#0B3D2E]">Add</SheetTitle>
          <SheetDescription>Quick add is coming soon.</SheetDescription>
        </SheetHeader>
        <div className="mt-4 px-4">
          <EmptyState icon={PlusCircle} title="Nothing to add yet" text="You will log expenses, income and transfers here." />
        </div>
      </SheetContent>
    </Sheet>
  )
}