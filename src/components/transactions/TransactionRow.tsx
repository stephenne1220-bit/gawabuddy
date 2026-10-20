import { MoreVertical } from 'lucide-react'
import { CategoryIcon } from '@/components/app/CategoryIcon'
import { formatShort } from '@/lib/dates'
import { formatMoney } from '@/lib/money'
import type { Category, Transaction } from '@/lib/types'

type Props = {
  tx: Transaction
  category?: Category
  accountName: string
  toAccountName?: string
  onMenu?: (tx: Transaction) => void
}

export function TransactionRow({ tx, category, accountName, toAccountName, onMenu }: Props) {
  const transfer = tx.type === 'transfer'
  const income = tx.type === 'income'

  const title = transfer
    ? 'Transfer'
    : tx.merchant || category?.name || (income ? 'Income' : 'Expense')
  const subtitle = transfer
    ? `${accountName} → ${toAccountName ?? 'account'}`
    : `${category?.name ?? 'Uncategorized'} · ${accountName}`

  return (
    <li className="flex items-center gap-3 py-3">
      <CategoryIcon
        icon={transfer ? 'transfer' : category?.icon}
        color={transfer ? '#6B7280' : category?.color}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[#1F2937]">{title}</p>
        <p className="truncate text-xs text-[#6B7280]">
          {subtitle} · {formatShort(tx.date)}
        </p>
      </div>
      <p
        className={`shrink-0 text-sm font-bold tabular-nums ${
          income ? 'text-[#1E8E3E]' : transfer ? 'text-[#6B7280]' : 'text-[#1F2937]'
        }`}
      >
        {income ? '+' : transfer ? '' : '−'}
        {formatMoney(tx.amount_cents)}
      </p>
      {onMenu && (
        <button
          type="button"
          aria-label={`Actions for ${title}`}
          onClick={() => onMenu(tx)}
          className="-mr-2 shrink-0 rounded-full p-2 text-[#6B7280] hover:bg-[#0B3D2E]/10"
        >
          <MoreVertical size={18} aria-hidden="true" />
        </button>
      )}
    </li>
  )
}