import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Copy, 
  CheckCircle, 
  Bank, 
  User,  
  ArrowLeft,
  ShieldCheck 
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
    api.get('/bank').then(res => setBanks(res.data))
  }, [])

  function copyIban(id: number, iban: string) {
    navigator.clipboard.writeText(iban)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 pt-12 pb-24 font-sans selection:bg-green-500/30">
      
      {/* HEADER PREMIUM */}
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={() => navigate(-1)}
          className="p-2.5 bg-[#111] border border-white/5 rounded-full hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={20} weight="bold" />
        </button>
        <div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">Contas EMATEA</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Selecione uma conta para transferência</p>
        </div>
      </div>

      {/* INFO DE SEGURANÇA */}
      <div className="mb-8 p-5 rounded-[2rem] bg-green-500/5 border border-green-500/10 flex items-start gap-4">
        <ShieldCheck size={28} weight="duotone" className="text-green-500 flex-shrink-0" />
        <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
          Transfira o valor exato para uma das contas abaixo. O saldo será creditado após a verificação do comprovativo.
        </p>
      </div>

      {/* LISTA DE CARTÕES BANCÁRIOS */}
      <div className="space-y-6">
        {banks.map(b => (
          <div
            key={b.id}
            className="relative overflow-hidden rounded-[2.5rem] p-8 bg-[#111] border border-white/5 shadow-2xl transition-all duration-300 hover:border-green-500/20 group"
          >
            {/* ÍCONE DE FUNDO DECORATIVO */}
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Bank size={80} weight="thin" />
            </div>

            <div className="relative z-10 flex flex-col gap-6">
              
              <div className="space-y-4">
                {/* TITULAR */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0a0a0a] flex items-center justify-center text-gray-500 group-hover:text-green-500 transition-colors">
                    <User size={20} weight="bold" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Titular da Conta</p>
                    <p className="text-sm font-bold text-white tracking-tight uppercase">{b.name}</p>
                  </div>
                </div>

                {/* BANCO */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0a0a0a] flex items-center justify-center text-gray-500 group-hover:text-green-500 transition-colors">
                    <Bank size={20} weight="bold" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Instituição</p>
                    <p className="text-sm font-bold text-white tracking-tight">{b.bank}</p>
                  </div>
                </div>
              </div>

              {/* IBAN CARD SECTION */}
              <div className="mt-2 space-y-2">
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">IBAN para Cópia</p>
                <div className="flex items-center justify-between bg-[#0a0a0a] p-5 rounded-2xl border border-white/5">
                  <span className="text-sm font-black tracking-widest text-white font-mono break-all leading-relaxed mr-4">
                    {b.iban}
                  </span>
                  
                  <button
                    onClick={() => copyIban(b.id, b.iban)}
                    className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                      copied === b.id 
                      ? 'bg-green-500 text-black' 
                      : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    {copied === b.id
                      ? <CheckCircle size={24} weight="fill" />
                      : <Copy size={24} weight="bold" />}
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* FOOTER DISCRETO */}
      <div className="mt-12 text-center opacity-20">
        <p className="text-[9px] font-bold uppercase tracking-[0.5em]">EMATEA Banking Protocol 2026</p>
      </div>

    </div>
  )
}