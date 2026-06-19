import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { UserService } from '../services/user.service'
import { KYCService } from '../services/kyc'
import { formatCurrencyAOA } from "../utils/formatCurrency"

import {
  ArrowDown,
  Bank,
  ArrowsLeftRight,
  Gift,
  ShieldCheck,
  LockKey,
  Copy,
  SignOut,
  CaretRight,
  UserCircleGear,
  Wallet,
  SealCheck,
  PaperPlaneTilt
} from '@phosphor-icons/react'

type User = {
  fullName?: string
  phone: string
  email: string
  publicId: string
  balance: number
}

type KYCState = {
  status: string
  isVerified: boolean
  canSubmit: boolean
}

export default function Profile() {
  const navigate = useNavigate()
  const [kyc, setKyc] = useState<KYCState | null>(null)

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await UserService.me()
      return res as User
    },
    staleTime: 1000 * 60 * 5
  })

  useEffect(() => {
    async function loadKYC() {
      try {
        const res = await KYCService.status()
        const data = res.data
        const normalized: KYCState = {
          status: data.status,
          isVerified: data.isVerified ?? data.status === "VERIFIED",
          canSubmit: data.canSubmit ?? (
            data.status === "NOT_SUBMITTED" || data.status === "REJECTED"
          )
        }
        setKyc(normalized)
      } catch (err) {
        console.error("KYC ERROR:", err)
      }
    }
    loadKYC()
  }, [])

  return (
    <div className="min-h-screen w-screen text-[#111827] flex flex-col bg-[#F2F4F7] antialiased">
      <div className="flex-1 px-5 pt-8 pb-32 flex flex-col gap-6">

        {/* 1. HEADER (DADOS OU SKELETON) */}
        {isLoading ? (
          /* SKELETON DO CABEÇALHO - CONTRASTE MELHORADO */
          <div className="bg-[#FCFCFD] py-5 px-6 rounded-[2rem] border border-[#E4E7EB] animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200/60 rounded w-1/3" />
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-gray-200 flex justify-between">
               <div className="space-y-2"><div className="h-3 bg-gray-200 rounded w-12"/><div className="h-6 bg-gray-300 rounded w-24"/></div>
               <div className="flex gap-3"><div className="w-10 h-10 rounded-full bg-gray-200"/><div className="w-10 h-10 rounded-full bg-gray-200"/></div>
            </div>
          </div>
        ) : (
          /* CONTEÚDO REAL DO CABEÇALHO COM MÁXIMA LEITURA */
          <div className="bg-[#FCFCFD] py-5 px-6 rounded-[2rem] relative border border-[#E4E7EB] shadow-sm">
            <button 
              onClick={() => navigate('/settings')}
              className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <UserCircleGear size={20} weight="fill" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border border-gray-200 overflow-hidden bg-gray-50 p-1">
                <img src="/logo.png" className="w-full h-full object-contain rounded-full" alt="Logo" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-black tracking-tight text-gray-950 capitalize">
                    {user?.fullName?.toLowerCase() ?? user?.phone}
                  </h1>
                  {kyc?.isVerified && <SealCheck size={16} weight="fill" className="text-blue-600" />}
                </div>
                <p className="text-gray-700 text-[11px] font-bold mt-0.5">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-gray-600 font-mono font-bold tracking-wider uppercase">ID: {user?.publicId}</span>
                  <button onClick={() => navigator.clipboard.writeText(user?.publicId ?? '')} className="text-gray-500 hover:text-emerald-600 transition-colors">
                    <Copy size={13} weight="bold" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-0.5">Saldo Disponível</p>
                <span className="text-2xl font-black tracking-tight text-emerald-700">{formatCurrencyAOA(user?.balance ?? 0)}</span>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/deposit')} className="flex flex-col items-center gap-1 group">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Wallet size={18} weight="bold" />
                  </div>
                  <span className="text-[8px] font-black uppercase text-gray-500 tracking-wide">Depósito</span>
                </button>
                <button onClick={() => navigate('/withdraw')} className="flex flex-col items-center gap-1 group">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-rose-50 border border-rose-200 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all">
                    <ArrowDown size={18} weight="bold" />
                  </div>
                  <span className="text-[8px] font-black uppercase text-gray-500 tracking-wide">Saque</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. TERMINAL DE OPERAÇÕES */}
        <div>
          <h3 className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] mb-4 ml-2 font-mono">
            Terminal de Operações
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {isLoading ? (
              /* SKELETON DOS CARDS DE OPERAÇÃO */
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-[#FCFCFD] h-20 rounded-2xl border border-[#E4E7EB] animate-pulse p-4 flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2"><div className="h-3 bg-gray-200 rounded w-3/4"/><div className="h-2 bg-gray-100 rounded w-1/2"/></div>
                </div>
              ))
            ) : (
              /* CARDS REAIS */
              <>
                <SessionCard label="Transferir" sub="Envio Interno" icon={<PaperPlaneTilt size={18} weight="bold" />} to="/transfer" />
                <SessionCard label="Banco" sub="Conta & Dados" icon={<Bank size={18} weight="bold" />} to="/bank" />
                <SessionCard label="Transações" sub="Histórico" icon={<ArrowsLeftRight size={18} weight="bold" />} to="/transactions" />
                <SessionCard label="Presente" sub="Bônus" icon={<Gift size={18} weight="bold" />} to="/gift" />
                <SessionCard label="Segurança" sub="Proteção" icon={<ShieldCheck size={18} weight="bold" />} to="/security" />
                <SessionCard label="Senha" sub="Alterar" icon={<LockKey size={18} weight="bold" />} to="/password" />
              </>
            )}
          </div>
        </div>

        {/* 3. BOTÃO SAIR DA CONTA */}
        {!isLoading && (
          <button
            onClick={() => { 
              localStorage.clear()
              navigate('/login')
            }}
            className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-600 hover:text-rose-700 mt-6 transition-colors self-center bg-white border border-rose-200 px-4 py-2.5 rounded-xl shadow-sm"
          >
            <SignOut size={16} weight="bold" /> Sair da conta
          </button>
        )}

      </div>
    </div>
  )
}

function SessionCard({ label, sub, icon, to }: any) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(to)}
      className="bg-[#FCFCFD] flex items-center gap-3 p-4 rounded-2xl border border-[#E4E7EB] hover:border-emerald-300 hover:bg-emerald-50/40 transition-all duration-200 group text-left shadow-sm"
    >
      <div className="w-10 h-10 rounded-xl bg-gray-100/80 flex items-center justify-center border border-gray-200 text-gray-700 group-hover:text-emerald-700 group-hover:bg-emerald-50 transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-black tracking-tight text-gray-900">{label}</p>
        <p className="text-[9px] text-gray-600 font-extrabold uppercase tracking-wider mt-0.5">{sub}</p>
      </div>
      <CaretRight size={14} weight="bold" className="text-gray-400 group-hover:text-emerald-600 transition-all" />
    </button>
  )
}