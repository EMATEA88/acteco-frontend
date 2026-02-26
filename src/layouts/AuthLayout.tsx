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
      bg-[#0B0E11]
      text-[#EAECEF]
      flex flex-col
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
          bg-[#1E2329]
          border border-[#2B3139]
          shadow-md
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
          <p className="mt-2 text-sm text-[#848E9C] text-center">
            {subtitle}
          </p>
        )}

      </div>

      {/* CARD */}
      <div className="
        flex-1
        bg-[#1E2329]
        border-t border-[#2B3139]
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