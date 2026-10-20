import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { toast } from 'sonner'

export default function Signup() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (password.length < 8) return toast.error('Use a password with at least 8 characters.')
    setBusy(true)
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: fullName.trim() } },
    })
    setBusy(false)
    if (error) return toast.error(error.message)
    if (data.session) {
      navigate('/onboarding', { replace: true })
      return
    }
    toast.success('Check your email to confirm your account, then log in.')
    navigate('/login', { replace: true })
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It takes about a minute."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#D4A017] hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1.5">Your name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Stephen Kuta"
              className="w-full rounded-xl border border-white/20 bg-black/20 py-3 pl-10 pr-4 text-white placeholder-white/40 outline-none focus:border-[#D4A017]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/20 bg-black/20 py-3 pl-10 pr-4 text-white placeholder-white/40 outline-none focus:border-[#D4A017]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-white/20 bg-black/20 py-3 pl-10 pr-10 text-white placeholder-white/40 outline-none focus:border-[#D4A017]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="mt-4 w-full rounded-xl bg-[#D4A017] py-3 text-sm font-bold text-[#0B3D2E] transition hover:bg-[#E6B333] disabled:opacity-50"
        >
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}