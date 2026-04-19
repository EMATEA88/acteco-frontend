import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Copy,
  CheckCircle,
  Bank,
  User,
  ArrowLeft
} from '@phosphor-icons/react'
import { api } from '../services/api'

type BankType = {
  id: number
  name: string
  bank: string
  iban: string
}

export default function DepositBanks() {
  const navigate = useNavigate()
  const [banks, setBanks] = useState<BankType[]>([])
  const [copied, setCopied] = useState<number | null>(null)

  useEffect(() => {
    api.get('/bank').then(res => setBanks(res.data)).catch(() => {})
  }, [])

  function copyIban(id: number, iban: string) {
    navigator.clipboard.writeText(iban)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 py-6">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white/5 rounded-full"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-sm font-semibold">Contas Bancárias</h1>
      </div>

      {/* INFO */}
      <div className="bg-[#111318] border border-white/5 rounded-xl p-4 mb-4 text-xs text-gray-400">
        Transfira para uma das contas abaixo. O saldo será creditado após validação.
      </div>

      {/* LISTA */}
      <div className="space-y-3">
        {banks.map(b => (
          <div
            key={b.id}
            className="bg-[#111318] border border-white/5 rounded-xl p-4"
          >
            {/* TITULAR */}
            <div className="flex items-center gap-3 mb-3">
              <User size={16} className="text-gray-500" />
              <div>
                <p className="text-[10px] text-gray-500">Titular</p>
                <p className="text-sm">{b.name}</p>
              </div>
            </div>

            {/* BANCO */}
            <div className="flex items-center gap-3 mb-3">
              <Bank size={16} className="text-gray-500" />
              <div>
                <p className="text-[10px] text-gray-500">Banco</p>
                <p className="text-sm">{b.bank}</p>
              </div>
            </div>

            {/* IBAN */}
            <div className="flex items-center justify-between bg-[#0B0E11] border border-white/5 rounded-lg px-3 py-2">
              <span className="text-xs font-mono break-all">
                {b.iban}
              </span>

              <button
                onClick={() => copyIban(b.id, b.iban)}
                className="ml-3"
              >
                {copied === b.id
                  ? <CheckCircle size={18} className="text-emerald-500" />
                  : <Copy size={18} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}