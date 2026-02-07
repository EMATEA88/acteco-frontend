import { useState } from 'react'

type Props = {
  inviteLink: string
}

export default function InviteBox({ inviteLink }: Props) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="
        fixed bottom-24 right-4 z-40
        flex flex-col items-center gap-1
      "
    >
      {/* BOTÃO PRINCIPAL */}
      <button
        onClick={copy}
        className="
          w-16 h-16 rounded-full
          bg-emerald-600
          shadow-card
          flex items-center justify-center
          active:scale-95 transition
        "
      >
        {/* CÍRCULO INTERNO */}
        <div className="w-10 h-10 rounded-full bg-white overflow-hidden flex items-center justify-center">
  <img
    src="/logo.png"
    alt="ACTECO"
    className="w-full h-full object-cover"
  />
</div>
      </button>

      {/* TEXTO */}
      <span className="text-xs font-medium text-gray-700">
        {copied ? 'Copiado' : 'Copiar link'}
      </span>
    </div>
  )
}
