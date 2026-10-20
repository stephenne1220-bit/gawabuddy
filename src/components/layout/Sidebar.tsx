import { LogOut, ChevronRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { signOut } from '@/lib/auth'
import { NAV_ITEMS } from './navItems'

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-[#1f362b] bg-[#08130E] p-4 md:flex">
      {/* Logo Area */}
      <div className="flex items-center gap-3 px-4 py-6 mb-2">
        <img 
          src="/gawa-icon.svg" 
          alt="GawaBuddy Icon" 
          className="h-10 w-10 object-contain" 
        />
        <span className="text-2xl font-bold text-white tracking-tight">GawaBuddy</span>
      </div>

      {/* Navigation */}
      <nav aria-label="Main" className="mt-4 flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        <ul className="space-y-2">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#0B3D2E] text-[#4ADE80]'
                      : 'text-[#8A9C92] hover:bg-[#0F241A] hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon size={18} aria-hidden="true" className={isActive ? 'text-[#4ADE80]' : ''} />
                      {label}
                    </div>
                    {label === 'More' && (
                      <ChevronRight size={16} className={isActive ? 'text-[#4ADE80]' : 'text-[#8A9C92]'} />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sign out */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => void signOut()}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-[#8A9C92] hover:bg-[#0F241A] hover:text-white"
        >
          <LogOut size={18} aria-hidden="true" /> Sign out
        </button>
      </div>

      {/* Decorative Footer */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0B3D2E] p-6 mt-auto">
        <svg className="absolute -bottom-10 -left-10 h-40 w-40 opacity-20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="#4ADE80" strokeWidth="2" />
          <circle cx="50" cy="50" r="30" stroke="#4ADE80" strokeWidth="2" />
          <circle cx="50" cy="50" r="20" stroke="#4ADE80" strokeWidth="2" />
        </svg>
        
        <div className="relative z-10">
          <p className="text-sm font-medium text-white">Better Money.</p>
          <p className="text-sm font-medium text-[#4ADE80]">Bigger Dreams.</p>
        </div>
      </div>
    </aside>
  )
}