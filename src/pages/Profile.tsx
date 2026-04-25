import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { UserService } from '../services/user.service'
import { KYCService } from '../services/kyc'
import { formatCurrencyAOA } from "../utils/formatCurrency"
import { SkeletonPage } from "../components/ui/Skeleton"

import {
  ArrowDown,
  Bank,
  ArrowsLeftRight,
  Gift,
  ShieldCheck,
  LockKey,
  Copy,
  DownloadSimple,
  SignOut,
  CaretRight,
  UserCircleGear,
  Wallet,
  SealCheck,
  PaperPlaneTilt,
  UsersThree,
  Info // Ícone para o About
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

  if (isLoading) return <SkeletonPage title="Carregando perfil..." />
  if (!user) return null

  return (
    <div className="min-h-screen w-screen text-white flex flex-col bg-[#0B0E11]">
      <div className="flex-1 px-5 pt-10 pb-32 flex flex-col gap-6 font-normal">

        {/* HEADER */}
        <div className="bg-[#161A1F] py-4 px-6 rounded-[2rem] relative border border-white/5 shadow-2xl">
          <button 
            onClick={() => navigate('/settings')}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 border border-white/10 text-emerald-500 hover:scale-110 transition-transform"
          >
            <UserCircleGear size={20} weight="fill" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border-2 border-white/10 overflow-hidden bg-[#0B0E11] p-1 shadow-inner">
              <img src="/logo.png" className="w-full h-full object-contain rounded-full" alt="Logo" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-base font-semibold tracking-normal capitalize">
                  {user.fullName?.toLowerCase() ?? user.phone}
                </h1>
                {kyc?.isVerified && (
                  <SealCheck size={16} weight="fill" className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                )}
              </div>
              <p className="text-gray-500 text-[10px] font-medium">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-gray-600 font-mono tracking-wider">ID: {user.publicId}</span>
                <button onClick={() => navigator.clipboard.writeText(user.publicId)} className="hover:opacity-70 transition-opacity">
                  <Copy size={12} className="text-emerald-500" />
                </button>
              </div>
            </div>
          </div>

          {kyc?.canSubmit && (
            <button onClick={() => navigate('/kyc')} className="mt-3 text-[11px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400">
              Verificar
            </button>
          )}

          <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Saldo Disponível</p>
              <span className="text-xl font-normal tracking-tight text-emerald-500">{formatCurrencyAOA(user.balance)}</span>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/deposit')} className="flex flex-col items-center gap-1 group">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-all shadow-inner">
                  <Wallet size={16} />
                </div>
                <span className="text-[8px] font-bold uppercase text-gray-500 group-hover:text-gray-300">Depósito</span>
              </button>

              <button onClick={() => navigate('/withdraw')} className="flex flex-col items-center gap-1 group">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white group-hover:bg-red-500/20 group-hover:text-red-400 transition-all shadow-inner">
                  <ArrowDown size={16} />
                </div>
                <span className="text-[8px] font-bold uppercase text-gray-500 group-hover:text-gray-300">Saque</span>
              </button>
            </div>
          </div>
        </div>

        {/* TERMINAL DE OPERAÇÕES */}
        <div>
          <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-4 ml-2 font-mono">
            Terminal de Operações
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <SessionCard label="Transferir" sub="Envio Interno" icon={<PaperPlaneTilt size={20} />} to="/transfer" />
            <SessionCard label="Kixikila" sub="Poupança" icon={<UsersThree size={20} />} to="/kixikila" />
            <SessionCard label="Banco" sub="Conta & Dados" icon={<Bank size={20} />} to="/bank" />
            <SessionCard label="Transações" sub="Histórico" icon={<ArrowsLeftRight size={20} />} to="/transactions" />
            <SessionCard label="Presente" sub="Bônus" icon={<Gift size={20} />} to="/gift" />
            <SessionCard label="Segurança" sub="Proteção" icon={<ShieldCheck size={20} />} to="/security" />
            <SessionCard label="Senha" sub="Alterar" icon={<LockKey size={20} />} to="/password" />
            <SessionCard label="Aplicações" sub="Ferramentas" icon={<DownloadSimple size={20} />} to="/applications" />
            
            {/* 🟢 NOVOS CARDS PARA FECHAR O GRID PAR */}
            <SessionCard label="Carteira" sub="USDT TRC20" icon={<Wallet size={20} />} to="/wallet" />
            <SessionCard label="Sobre" sub="EMATEA v1.0" icon={<Info size={20} />} to="/about" />
          </div>
        </div>

        <button
          onClick={() => { 
            localStorage.clear()
            navigate('/login')
          }}
          className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-500/60 hover:text-red-500 mt-6 transition-colors"
        >
          <SignOut size={16} weight="bold" /> Sair da conta
        </button>

      </div>
    </div>
  )
}

function SessionCard({ label, sub, icon, to }: any) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(to)}
      className="bg-[#161A1F] flex items-center gap-3 p-4 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-[#1c2127] transition-all duration-300 group shadow-lg"
    >
      <div className="w-10 h-10 rounded-full bg-[#0B0E11] flex items-center justify-center border border-white/5 text-gray-400 group-hover:text-cyan-500 transition-colors shadow-inner">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className="text-[13px] font-medium tracking-tight text-gray-200">{label}</p>
        <p className="text-[9px] text-gray-600 font-medium">{sub}</p>
      </div>
      <CaretRight size={14} className="text-gray-700 group-hover:text-gray-400 transition-colors" />
    </button>
  )
}