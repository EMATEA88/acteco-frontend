import { useEffect, useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { api } from '../services/api'

type Bank = {
  id: number
  name: string
  bank: string
  iban: string
}

export default function DepositBanks() {
  const [banks, setBanks] = useState<Bank[]>([])
  const [copied, setCopied] = useState<number | null>(null)

  useEffect(() => {
    api.get('/bank').then(res => setBanks(res.data))
  }, [])

  function copyIban(id: number, iban: string) {
    navigator.clipboard.writeText(iban)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div
      className="
        min-h-screen px-5 pt-6 pb-24
        bg-gradient-to-b from-green-100 via-green-50 to-blue-100
        animate-fadeZoom
      "
    >
      {/* HEADER */}
      <h1 className="text-lg font-semibold text-gray-800 mb-6">
        Contas para compra
      </h1>

      {/* BANK CARDS */}
      <div className="space-y-5">
        {banks.map(b => (
          <div
            key={b.id}
            className="
              rounded-3xl p-5
              bg-green-500/90
              text-white
              shadow-[0_10px_30px_rgba(0,0,0,0.15)]
              transition-transform
              hover:scale-[1.01]
            "
          >
            <div className="flex items-center justify-between gap-4">
              {/* LEFT — INFO */}
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium opacity-90">Titular:</span>{' '}
                  <span className="font-semibold">{b.name}</span>
                </p>

                <p>
                  <span className="font-medium opacity-90">Bank:</span>{' '}
                  <span className="font-semibold">{b.bank}</span>
                </p>

                <p className="font-mono tracking-wide text-white/90">
                  <span className="font-medium not-italic font-sans mr-1 opacity-90">
                    IBAN:
                  </span>
                  {b.iban}
                </p>
              </div>

              {/* RIGHT — COPY BUTTON */}
              <button
                onClick={() => copyIban(b.id, b.iban)}
                className="
                  w-11 h-11 shrink-0
                  rounded-full bg-white
                  text-green-700
                  flex items-center justify-center
                  active:scale-95 transition
                "
              >
                {copied === b.id ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
