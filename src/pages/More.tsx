import { Link } from 'react-router-dom'
import { CalendarClock, BarChart3, Settings as SettingsIcon, LogOut, CreditCard, Sparkles, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/app/PageHeader'
import { AccountBalances } from '@/components/accounts/AccountBalances'
import { signOut } from '@/lib/auth'
import { useAuth } from '@/context/AuthContext'
import { useProfile } from '@/hooks/useProfile'

export default function More() {
  const { user } = useAuth()
  const { data: profile } = useProfile()

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 pb-28">
      <PageHeader title="More" />

      <section className="rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm dark:border-[#243b30] dark:bg-[#14291f]">
        <p className="text-sm font-semibold text-[#1F2937] dark:text-white">{profile?.full_name || 'Your account'}</p>
        <p className="text-xs text-[#6B7280] dark:text-[#A9B8AF]">{user?.email}</p>
      </section>

      <AccountBalances />

      {/* Secondary Navigation */}
      <section className="divide-y divide-[#F1ECDC] rounded-2xl border border-[#EFEAD8] bg-white px-4 shadow-sm dark:divide-[#243b30] dark:border-[#243b30] dark:bg-[#14291f]">
        <Link to="/goals?tab=savings" className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0B3D2E]/10 text-[#0B3D2E] dark:bg-[#1b6b50]/20 dark:text-[#8fd3b1]">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1F2937] dark:text-white">Savings & Debts</p>
              <p className="text-xs text-[#6B7280] dark:text-[#A9B8AF]">Goals, emergency fund, and payoff plans</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#9CA3AF]" />
        </Link>

        <Link to="/bills" className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0B3D2E]/10 text-[#0B3D2E] dark:bg-[#1b6b50]/20 dark:text-[#8fd3b1]">
              <CalendarClock size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1F2937] dark:text-white">Upcoming Bills</p>
              <p className="text-xs text-[#6B7280] dark:text-[#A9B8AF]">Recurring expenses and income</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#9CA3AF]" />
        </Link>

        <Link to="/reports" className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0B3D2E]/10 text-[#0B3D2E] dark:bg-[#1b6b50]/20 dark:text-[#8fd3b1]">
              <BarChart3 size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1F2937] dark:text-white">Reports</p>
              <p className="text-xs text-[#6B7280] dark:text-[#A9B8AF]">Charts, exports, and net worth</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#9CA3AF]" />
        </Link>

        <Link to="/settings" className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0B3D2E]/10 text-[#0B3D2E] dark:bg-[#1b6b50]/20 dark:text-[#8fd3b1]">
              <SettingsIcon size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1F2937] dark:text-white">Settings</p>
              <p className="text-xs text-[#6B7280] dark:text-[#A9B8AF]">Profile, accounts, categories, and data</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#9CA3AF]" />
        </Link>
      </section>

      <section className="divide-y divide-[#F1ECDC] rounded-2xl border border-[#EFEAD8] bg-white px-4 shadow-sm dark:divide-[#243b30] dark:border-[#243b30] dark:bg-[#14291f]">
        <button
          type="button"
          onClick={() => { void signOut().then(() => toast.success('Signed out')) }}
          className="flex w-full items-center gap-3 py-3 text-left text-sm font-medium text-[#C0392B]"
        >
          <LogOut size={18} aria-hidden="true" /> Sign out
        </button>
      </section>
    </div>
  )
}