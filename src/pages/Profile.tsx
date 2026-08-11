import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
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
  Gear,
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
  role: "USER" | "AGENT" | "SUB_AGENT" | "ADMIN" | string
}

type KYCState = {
  status: string
  isVerified: boolean
  canSubmit: boolean
}

const ROLE_BADGES: Record<string, { label: string; className: string }> = {
  USER: { label: "Cliente", className: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30" },
  AGENT: { label: "Agente", className: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" },
  SUB_AGENT: { label: "Sub-Agente", className: "bg-amber-500/10 text-amber-300 border-amber-500/30" },
  ADMIN: { label: "Admin", className: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
}

export default function Profile() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const [kyc, setKyc] = useState<KYCState | null>(null)
  const [agentMenuOpen, setAgentMenuOpen] = useState(false)

  useEffect(() => {
    setAgentMenuOpen(false)
  }, [location.pathname])

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['me'],
    queryFn: async () => {
      const res: any = await UserService.me()
      return (res?.data || res) as User
    },
    staleTime: 0,
    gcTime: 0,
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

  // Força detecção segura da role em maiúsculas, assumindo USER se não vier nada
  const rawRole = user?.role ? String(user.role).toUpperCase().trim() : "USER";
  const currentRoleBadge = ROLE_BADGES[rawRole] || ROLE_BADGES["USER"];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0a2533] text-[#e0f2fe] flex flex-col fixed inset-0 font-sans antialiased">
      
      {/* ÁREA COM SCROLL REAL E ESTÁVEL */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 pt-8 pb-32 flex flex-col gap-6">

        {/* 1. CARD CENTRAL (HEADER) */}
        {isLoading ? (
          <div className="bg-[#0e364a] py-5 px-6 rounded-[2rem] border border-cyan-500/20 animate-pulse shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#144863]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[#144863] rounded w-1/2" />
                <div className="h-3 bg-[#144863]/60 rounded w-1/3" />
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-cyan-500/10 flex justify-between">
               <div className="space-y-2"><div className="h-3 bg-[#144863] rounded w-12"/><div className="h-6 bg-[#144863] rounded w-24"/></div>
               <div className="flex gap-3"><div className="w-10 h-10 rounded-full bg-[#144863]"/><div className="w-10 h-10 rounded-full bg-[#144863]"/></div>
            </div>
          </div>
        ) : (
          <div className="bg-[#0e364a] py-5 px-6 rounded-[2rem] relative border border-cyan-500/25 shadow-2xl shadow-cyan-950/40">
            
            {/* BOTÕES E BADGE DO CANTO SUPERIOR DIREITO */}
            <div className="absolute top-5 right-5 flex flex-col items-end gap-2.5 z-10">
              <div className="flex items-center gap-2">
                {/* Botão de Configurações visível para USER, SUB_AGENT ou qualquer role que não seja estritamente Agent/Admin puro */}
                {(rawRole === "USER" || rawRole === "SUB_AGENT" || !["AGENT", "ADMIN"].includes(rawRole)) && (
                  <button 
                    onClick={() => navigate('/settings')} 
                    className="p-2 rounded-full bg-[#144863] border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-600 transition-all cursor-pointer shadow-md"
                    title="Configurações"
                  >
                    <Gear size={20} weight="bold" />
                  </button>
                )}

                {/* Menu de agente visível para AGENT e ADMIN */}
                {(rawRole === "AGENT" || rawRole === "ADMIN") && (
                  <div className="scale-90 origin-right">
                    <AgentMenuButton onClick={() => setAgentMenuOpen(true)} />
                  </div>
                )}
              </div>
              
              {/* Badge de Identificação Obrigatório */}
              <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${currentRoleBadge.className}`}>
                {currentRoleBadge.label}
              </span>
            </div>

            <div className="flex items-center gap-4 pr-16">
              {/* LOGÓTIPO + BOTÃO DE VERIFICAÇÃO ABAIXO */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-14 h-14 rounded-full border border-cyan-500/30 overflow-hidden bg-[#144863] p-1 shadow-md">
                  <img src="/logo.png" className="w-full h-full object-contain rounded-full" alt="Logo" />
                </div>

                {(!kyc || !kyc.isVerified) && (
                  <button
                    onClick={() => navigate('/kyc')}
                    className="text-[9px] font-black uppercase tracking-tight text-rose-400 hover:text-rose-300 underline decoration-rose-500/50 hover:decoration-rose-300 transition-colors whitespace-nowrap text-center"
                  >
                    {kyc?.status === "PENDING" ? "Em Análise" : "Verificar Conta"}
                  </button>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-bold tracking-tight text-white uppercase truncate">
                    {user?.fullName?.toUpperCase() ?? user?.phone}
                  </h1>
                  {kyc?.isVerified && <SealCheck size={16} weight="fill" className="text-cyan-400 flex-shrink-0" />}
                </div>
                <p className="text-cyan-200/70 text-[11px] font-medium mt-0.5 truncate">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-cyan-300/60 font-mono font-bold tracking-wider uppercase">ID: {user?.publicId}</span>
                  <button onClick={() => navigator.clipboard.writeText(user?.publicId ?? '')} className="text-cyan-300/60 hover:text-cyan-200 transition-colors">
                    <Copy size={13} weight="bold" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-cyan-500/15 flex items-center justify-between">
              <div>
                <p className="text-[9px] text-cyan-300/60 uppercase tracking-widest font-black mb-0.5">Saldo Disponível</p>
                <span className="text-2xl font-black tracking-tight text-cyan-300">{formatCurrencyAOA(user?.balance ?? 0)}</span>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => navigate("/deposit")} className="flex flex-col items-center gap-1 group">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#144863] border border-cyan-500/30 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-md">
                    <Wallet size={18} weight="bold" />
                  </div>
                  <span className="text-[8px] font-black uppercase text-cyan-200/70 tracking-wide">Depósito</span>
                </button>
                <button onClick={() => navigate("/withdraw")} className="flex flex-col items-center gap-1 group">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#144863] border border-cyan-500/30 text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-md">
                    <ArrowDown size={18} weight="bold" />
                  </div>
                  <span className="text-[8px] font-black uppercase text-cyan-200/70 tracking-wide">Saque</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-[10px] font-black text-cyan-300/60 uppercase tracking-[0.2em] mb-4 ml-2 font-mono">
            Terminal de Operações
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-[#0e364a] h-20 rounded-2xl border border-cyan-500/20 animate-pulse p-4 flex gap-3 items-center shadow-md">
                  <div className="w-10 h-10 rounded-full bg-[#144863]" />
                  <div className="flex-1 space-y-2"><div className="h-3 bg-[#144863] rounded w-3/4"/><div className="h-2 bg-[#144863] rounded w-1/2"/></div>
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

        {!isLoading && (
          <div className="flex justify-center mt-2 mb-4">
            <button
              onClick={() => { 
                queryClient.clear();
                localStorage.clear(); 
                navigate('/login'); 
              }}
              className="
                group relative flex items-center justify-center gap-2.5 
                w-44 h-12 rounded-full 
                bg-rose-500/10 border-2 border-rose-500/40 
                hover:bg-rose-500 hover:border-rose-500 
                text-rose-400 hover:text-white 
                text-[11px] font-black uppercase tracking-wider 
                shadow-[0_4px_15px_rgba(244,63,94,0.2)] 
                hover:shadow-[0_6px_20px_rgba(244,63,94,0.4)] 
                transition-all duration-300 active:scale-95 cursor-pointer
              "
            >
              <div className="w-7 h-7 rounded-full bg-rose-500/20 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                <SignOut size={15} weight="bold" />
              </div>
              <span>Sair da Conta</span>
            </button>
          </div>
        )}
      </div>

      <AgentDrawer open={agentMenuOpen} onClose={() => setAgentMenuOpen(false)}>
        <AgentSidebar
          onClose={() => setAgentMenuOpen(false)}
        />
      </AgentDrawer>
    </div>
  )
}

function SessionCard({ label, sub, icon, to }: any) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(to)}
      className="bg-[#0e364a] flex items-center gap-3 p-4 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/50 hover:bg-[#124158] transition-all duration-200 group text-left shadow-lg shadow-cyan-950/20 cursor-pointer"
    >
      <div className="w-10 h-10 rounded-xl bg-[#144863] flex items-center justify-center border border-cyan-500/30 text-cyan-300 group-hover:text-white group-hover:bg-cyan-600 transition-colors shadow-md">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold tracking-tight text-white">{label}</p>
        <p className="text-[9px] text-cyan-200/70 font-bold uppercase tracking-wider mt-0.5">{sub}</p>
      </div>
    </button>
  )
}