import { Navigate, Route, Routes } from 'react-router-dom'
import { PublicOnly } from '@/components/routing/PublicOnly'
import { RequireAuth } from '@/components/routing/RequireAuth'
import { RequireOnboarded } from '@/components/routing/RequireOnboarded'
import AppShell from '@/components/layout/AppShell'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Onboarding from '@/pages/Onboarding'
import Dashboard from '@/pages/Dashboard'
import Transactions from '@/pages/Transactions'
import Budgets from '@/pages/Budget'
import Goals from '@/pages/Goals'
import More from '@/pages/More'
import Bills from '@/pages/Bills'
import Reports from '@/pages/Reports'
import Settings from '@/pages/Settings'
import Planner from '@/pages/Planner'
import Profile from '@/pages/Profile'
import ManageCategories from '@/pages/ManageCategories'
import ManageAccounts from '@/pages/ManageAccounts'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicOnly />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<RequireOnboarded />}>
          <Route element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="goals" element={<Goals />} />
            <Route path="planner" element={<Planner />} />
            <Route path="bills" element={<Bills />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="settings/categories" element={<ManageCategories />} />
            <Route path="settings/accounts" element={<ManageAccounts />} />
            <Route path="profile" element={<Profile />} />
            <Route path="more" element={<More />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}