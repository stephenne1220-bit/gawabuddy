import { ArrowLeftRight, CalendarClock, Gift, Landmark, PiggyBank, TrendingDown, TrendingUp } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export type TransactionAddType = 'expense' | 'income' | 'transfer'
export type AddType = TransactionAddType | 'bill' | 'debt' | 'savings_goal' | 'future_item'

const OPTIONS: { type: AddType; label: string; hint: string; Icon: typeof TrendingDown }[] = [
  { type: 'expense', label: 'Add Expense', hint: 'Money you spent', Icon: TrendingDown },
  { type: 'income', label: 'Add Income', hint: 'Money you received', Icon: TrendingUp },
  { type: 'transfer', label: 'Add Transfer', hint: 'Move money between your accounts', Icon: ArrowLeftRight },
  { type: 'bill', label: 'Add Bill', hint: 'A payment that repeats', Icon: CalendarClock },
  { type: 'debt', label: 'Add Debt', hint: 'A loan or balance you owe', Icon: Landmark },
  { type: 'savings_goal', label: 'Add Savings Goal', hint: 'Save towards something', Icon: PiggyBank },
  { type: 'future_item', label: 'Add Future Item', hint: 'Something you plan to buy', Icon: Gift },
]

type Props = { open: boolean; onOpenChange: (open: boolean) => void; onPick: (type: AddType) => void }

export function AddMenuSheet({ open, onOpenChange, onPick }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-3xl bg-[#F8F5EC] pb-8">
        <SheetHeader><SheetTitle className="text-[#0B3D2E]">Add</SheetTitle></SheetHeader>
        <div className="mt-4 space-y-2">
          {OPTIONS.map(({ type, label, hint, Icon }) => (
            <button key={type} type="button" onClick={() => onPick(type)} className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm active:scale-[0.99]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B3D2E]/10 text-[#0B3D2E]"><Icon size={20} /></span>
              <span><span className="block text-sm font-semibold text-[#1F2937]">{label}</span><span className="block text-xs text-[#6B7280]">{hint}</span></span>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}