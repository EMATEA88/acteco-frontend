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
  Wallet,
  SealCheck,
  PaperPlaneTilt,
} from '@phosphor-icons/react'

import AgentDrawer from "../components/agent/AgentDrawer";
import AgentSidebar from "../components/agent/AgentSidebar";
import AgentMenuButton from "../components/agent/AgentMenuButton";

type User = {
  fullName?: string
  phone: string
  email: string
  publicId: string
  balance: number
  role: "USER" | "AGENT" | "SUB_AGENT" | "ADMIN"
}

type KYCState = {
  status: string
  isVerified: boolean
  canSubmit: boolean
}

const ROLE_BADGES = {
  USER: { label: "Cliente", className: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
  AGENT: { label: "Agente", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  SUB_AGENT: { label: "Sub-Agente", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  ADMIN: { label: "Admin", className: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
}

export default function Profile() {
  const navigate = useNavigate()
  const [kyc, setKyc] = useState<KYCState | null>(null)
  const [agentMenuOpen, setAgentMenuOpen] = useState(false);

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
    <div className="min-h-screen w-screen text-[#EAECEF] flex flex-col bg-[#0B0E11] antialiased">
      <div className="flex-1 px-5 pt-8 pb-32 flex flex-col gap-6">

        {/* 1. CARD CENTRAL (HEADER) */}
        {isLoading ? (
          <div className="bg-[#161A1E] py-5 px-6 rounded-[2rem] border border-white/[0.04] animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-800 rounded w-1/2" />
                <div className="h-3 bg-gray-800/60 rounded w-1/3" />
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-white/[0.04] flex justify-between">
               <div className="space-y-2"><div className="h-3 bg-gray-800 rounded w-12"/><div className="h-6 bg-gray-700 rounded w-24"/></div>
               <div className="flex gap-3"><div className="w-10 h-10 rounded-full bg-gray-800"/><div className="w-10 h-10 rounded-full bg-gray-800"/></div>
            </div>
          </div>
        ) : (
          <div className="bg-[#161A1E] py-5 px-6 rounded-[2rem] relative border border-white/[0.04] shadow-2xl">
            
            {/* CONTAINER SUPERIOR DIREITO REFORMULADO */}
            <div className="absolute top-5 right-5 flex flex-col items-end gap-2.5">
              
              {/* Se for AGENT ou ADMIN, renderiza o botão do menu de forma discreta */}
              {(user?.role === "AGENT" || user?.role === "ADMIN") ? (
                <div className="scale-90 origin-top-right">
                  <AgentMenuButton onClick={() => setAgentMenuOpen(true)} />
                </div>
              ) : null}
              
              {/* Emblema de Nível de Acesso (Badge) */}
              {user?.role && ROLE_BADGES[user.role] && (
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${ROLE_BADGES[user.role].className}`}>
                  {ROLE_BADGES[user.role].label}
                </span>
              )}
            </div>

            {/* Layout Principal Organizado e Seguro para Telas Pequenas */}
            <div className="flex items-center gap-4 pr-20">
              <div className="w-14 h-14 rounded-full border border-white/[0.08] overflow-hidden bg-white/[0.02] p-1 flex-shrink-0">
                <img src="/logo.png" className="w-full h-full object-contain rounded-full" alt="Logo" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-bold tracking-tight text-white capitalize truncate">
                    {user?.fullName?.toLowerCase() ?? user?.phone}
                  </h1>
                  {kyc?.isVerified && <SealCheck size={16} weight="fill" className="text-blue-400 flex-shrink-0" />}
                </div>
                <p className="text-gray-400 text-[11px] font-medium mt-0.5 truncate">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-gray-500 font-mono font-bold tracking-wider uppercase">ID: {user?.publicId}</span>
                  <button onClick={() => navigator.clipboard.writeText(user?.publicId ?? '')} className="text-gray-500 hover:text-emerald-400 transition-colors">
                    <Copy size={13} weight="bold" />
                  </button>
                </div>
              </div>
            </div>

            {/* Seção inferior de Saldo e Botões Rápidos */}
            <div className="mt-5 pt-4 border-t border-white/[0.04] flex items-center justify-between">
              <div>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-0.5">Saldo Disponível</p>
                <span className="text-2xl font-black tracking-tight text-emerald-400">{formatCurrencyAOA(user?.balance ?? 0)}</span>
              </div>

              <div className="flex items-center gap-3">
                {user?.role !== "SUB_AGENT" && (
                  <>
                    <button
                      onClick={() => navigate("/deposit")}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.05] text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <Wallet size={18} weight="bold" />
                      </div>
                      <span className="text-[8px] font-black uppercase text-gray-500 tracking-wide">
                        Depósito
                      </span>
                    </button>

                    <button
                      onClick={() => navigate("/withdraw")}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.05] text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all">
                        <ArrowDown size={18} weight="bold" />
                      </div>
                      <span className="text-[8px] font-black uppercase text-gray-500 tracking-wide">
                        Saque
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. TERMINAL DE OPERAÇÕES */}
        <div>
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-2 font-mono">
            Terminal de Operações
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-[#161A1E] h-20 rounded-2xl border border-white/[0.05] animate-pulse p-4 flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-800" />
                  <div className="flex-1 space-y-2"><div className="h-3 bg-gray-800 rounded w-3/4"/><div className="h-2 bg-gray-800 rounded w-1/2"/></div>
                </div>
              ))
            ) : (
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
            className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 mt-6 transition-colors self-center bg-white/[0.02] border border-white/[0.05] px-5 py-2.5 rounded-xl shadow-sm"
          >
            <SignOut size={16} weight="bold" /> Sair da conta
          </button>
        )}

      </div>

      {/* 4. DRAWER DE AGENTE */}
      <AgentDrawer open={agentMenuOpen} onClose={() => setAgentMenuOpen(false)}>
        <AgentSidebar />
      </AgentDrawer>
    </div>
  )
}

function SessionCard({ label, sub, icon, to }: any) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(to)}
      className="bg-[#161A1E] flex items-center gap-3 p-4 rounded-2xl border border-white/[0.02] hover:border-blue-500/30 hover:bg-[#1c2127] transition-all duration-200 group text-left shadow-lg"
    >
      <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/[0.04] text-blue-400 group-hover:text-blue-300 group-hover:bg-white/[0.06] transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold tracking-tight text-white">{label}</p>
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{sub}</p>
      </div>
    </button>
  )
}