import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-emerald-500 to-emerald-700 flex flex-col">
      
      {/* HEADER */}
      <div className="flex flex-col items-center justify-center px-6 pt-12 pb-8 text-white">
        {/* LOGO */}
        <div className="h-20 w-20 rounded-full bg-white shadow-md overflow-hidden flex items-center justify-center mb-4">
          <img
            src="/logo.png"
            alt="ACTECO S.A"
            className="h-full w-full object-cover"
          />
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-semibold">
          {title}
        </h1>

        {/* SUBTITLE */}
        {subtitle && (
          <p className="mt-1 text-sm text-white/80 text-center">
            {subtitle}
          </p>
        )}
      </div>

      {/* CARD */}
      <div className="flex-1 bg-white rounded-t-3xl px-6 py-8">
        <div className="mx-auto w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
