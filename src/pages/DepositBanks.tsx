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
        bg-gradient-to-b from-blue-50 via-blue-100 to-blue-50
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
              rounded-3xl p-6
              bg-blue-400
              text-white
              shadow-[0_15px_40px_rgba(59,130,246,0.35)]
              transition-all duration-300
              hover:scale-[1.02]
              hover:shadow-[0_20px_50px_rgba(59,130,246,0.45)]
              animate-fadeZoom
            "
          >

            <div className="flex items-center justify-between gap-4">

              {/* INFO */}
              <div className="space-y-2 text-sm">

                <p>
                  <span className="opacity-80">Titular:</span>{' '}
                  <span className="font-semibold">{b.name}</span>
                </p>

                <p>
                  <span className="opacity-80">Banco:</span>{' '}
                  <span className="font-semibold">{b.bank}</span>
                </p>

                <p className="font-mono tracking-wide text-white/95">
                  <span className="not-italic font-sans mr-1 opacity-80">
                    IBAN:
                  </span>
                  {b.iban}
                </p>

              </div>

              {/* COPY BUTTON */}
              <button
                onClick={() => copyIban(b.id, b.iban)}
                className="
                  w-11 h-11 shrink-0
                  rounded-full
                  bg-white/90
                  text-blue-600
                  flex items-center justify-center
                  transition-all
                  active:scale-95
                  hover:bg-white
                  shadow-md
                "
              >
                {copied === b.id
                  ? <Check size={18} />
                  : <Copy size={18} />}
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  )
}