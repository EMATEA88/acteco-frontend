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
    <div className="w-full min-h-screen bg-[#0B0E11] text-[#EAECEF] overflow-y-auto">

      {/* CONTAINER CENTRAL */}
      <div className="max-w-md mx-auto">

        {/* HEADER */}
        <div className="flex flex-col items-center px-6 pt-16 pb-10">

          {/* LOGO REALMENTE CIRCULAR */}
          <img
            src="/logo.png"
            alt="ACTECO S.A"
            className="w-20 h-20 rounded-full object-cover border-4 border-[#2B3139] shadow-lg mb-6"
          />

          {/* TITLE */}
          <h1 className="text-2xl font-semibold tracking-wide">
            {title}
          </h1>

          {/* SUBTITLE */}
          {subtitle && (
            <p className="mt-2 text-sm text-[#848E9C] text-center">
              {subtitle}
            </p>
          )}

        </div>

        {/* CARD */}
        <div className="
          bg-[#1E2329]
          border border-[#2B3139]
          rounded-2xl
          px-6
          py-8
          mb-10
        ">
          {children}
        </div>

      </div>

    </div>
  )
}