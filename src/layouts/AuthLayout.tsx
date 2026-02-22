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
    <div className="
      min-h-screen
      w-full
      bg-gradient-to-b
      from-[#0B1220]
      to-[#0F172A]
      flex flex-col
      text-white
    ">

      {/* HEADER */}
      <div className="
        flex flex-col
        items-center
        justify-center
        px-6
        pt-16
        pb-10
      ">

        {/* LOGO */}
        <div className="
          h-20 w-20
          rounded-full
          bg-white/10
          backdrop-blur-lg
          border border-white/10
          shadow-xl
          overflow-hidden
          flex items-center justify-center
          mb-6
        ">
          <img
            src="/logo.png"
            alt="ACTECO S.A"
            className="h-full w-full object-cover"
          />
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-semibold tracking-wide">
          {title}
        </h1>

        {/* SUBTITLE */}
        {subtitle && (
          <p className="mt-2 text-sm text-gray-400 text-center">
            {subtitle}
          </p>
        )}

      </div>

      {/* CARD */}
      <div className="
        flex-1
        bg-white/5
        backdrop-blur-2xl
        border-t border-white/10
        rounded-t-3xl
        px-6
        py-10
      ">
        <div className="mx-auto w-full max-w-md">
          {children}
        </div>
      </div>

    </div>
  )
}