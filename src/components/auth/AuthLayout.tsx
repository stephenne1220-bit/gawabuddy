import type { ReactNode } from 'react'

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#0B3D2E] p-4">
      {/* Full-screen background image */}
      <img
        src="/login-bg.png"
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      
      {/* Green Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B3D2E] via-[#0B3D2E]/90 to-transparent" />

      {/* The Glass Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-transparent p-8 shadow-2xl backdrop-blur-md">
        
        {/* Centered Logo */}
        <div className="mb-10 flex flex-col items-center justify-center gap-3">
          {/* Using the JPG with rounded corners to make it look like an app icon */}
          <img
            src="/gawa-icon.jpg"
            alt="Gawa Icon"
            className="h-20 w-20 rounded-2xl object-cover shadow-lg"
          />
          <span className="text-3xl font-bold text-white tracking-tight">
            Gawa
          </span>
        </div>

        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="mt-2 text-sm text-[#A9B8AF]">{subtitle}</p>

        <div className="mt-8">{children}</div>

        <div className="mt-8 text-center text-sm text-[#A9B8AF]">{footer}</div>
      </div>
    </div>
  )
}