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
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 pt-5 pb-28">
        {/* CABEÇALHO DA CONTA */}
        {isLoading ? (
          <div className="py-5 border-b border-cyan-500/10 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#144863]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[#144863] rounded w-1/2" />
                <div className="h-2.5 bg-[#144863]/70 rounded w-1/3" />
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-cyan-500/10">
              <div className="h-2.5 bg-[#144863] rounded w-24 mb-2" />
              <div className="h-7 bg-[#144863] rounded w-32" />
            </div>
          </div>
        ) : (
          <section className="border-b border-cyan-500/10 pb-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-full border border-cyan-500/20 overflow-hidden bg-[#144863] p-1 shrink-0">
                  <img
                    src="/logo.png"
                    className="w-full h-full object-contain rounded-full"
                    alt="Logo"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-sm font-bold text-white uppercase truncate">
                      {user?.fullName?.toUpperCase() ?? user?.phone}
                    </h1>
                    {kyc?.isVerified && (
                      <SealCheck
                        size={15}
                        weight="fill"
                        className="text-cyan-400 shrink-0"
                      />
                    )}
                  </div>

                  <p className="text-[10px] text-cyan-200/55 truncate mt-0.5">
                    {user?.email}
                  </p>

                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] text-cyan-300/55 font-mono">
                      ID: {user?.publicId}
                    </span>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(user?.publicId ?? "")
                      }
                      className="text-cyan-300/45 hover:text-cyan-200 transition-colors cursor-pointer"
                      aria-label="Copiar ID"
                    >
                      <Copy size={12} weight="bold" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                {(rawRole === "USER" ||
                  rawRole === "SUB_AGENT" ||
                  !["AGENT", "ADMIN"].includes(rawRole)) && (
                  <button
                    onClick={() => navigate("/settings")}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-cyan-500/15 text-cyan-300 hover:text-white hover:bg-[#0e364a] transition-colors cursor-pointer"
                    title="Configurações"
                    aria-label="Configurações"
                  >
                    <Gear size={16} weight="bold" />
                  </button>
                )}

                {(rawRole === "AGENT" || rawRole === "ADMIN") && (
                  <div className="scale-90 origin-right">
                    <AgentMenuButton
                      onClick={() => setAgentMenuOpen(true)}
                    />
                  </div>
                )}

                <span
                  className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${currentRoleBadge.className}`}
                >
                  {currentRoleBadge.label}
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-cyan-500/10 flex items-end justify-between gap-4">
              <div>
                <p className="text-[8px] text-cyan-300/55 uppercase tracking-[0.16em] font-bold">
                  Saldo disponível
                </p>
                <p className="text-2xl font-bold tracking-tight text-cyan-300 mt-1">
                  {formatCurrencyAOA(user?.balance ?? 0)}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/deposit")}
                  className="flex flex-col items-center gap-1 text-cyan-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Wallet size={18} weight="bold" />
                  <span className="text-[8px] uppercase tracking-wider">
                    Depósito
                  </span>
                </button>

                <button
                  onClick={() => navigate("/withdraw")}
                  className="flex flex-col items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <ArrowDown size={18} weight="bold" />
                  <span className="text-[8px] uppercase tracking-wider">
                    Saque
                  </span>
                </button>
              </div>
            </div>

            {!kyc?.isVerified && (
              <button
                onClick={() => navigate("/kyc")}
                className="mt-4 text-[9px] font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 cursor-pointer"
              >
                {kyc?.status === "PENDING"
                  ? "Conta em análise"
                  : "Verificar conta"}
              </button>
            )}
          </section>
        )}

        {/* OPERAÇÕES DA CONTA */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-cyan-400">
                Conta
              </p>
              <h2 className="text-sm font-semibold text-white mt-1">
                Operações
              </h2>
            </div>
          </div>

          {isLoading ? (
            <div className="divide-y divide-cyan-500/10 border-y border-cyan-500/10">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="py-4 flex items-center gap-3 animate-pulse"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#144863]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-[#144863] rounded w-1/3" />
                    <div className="h-2 bg-[#144863]/70 rounded w-1/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-cyan-500/10 border-y border-cyan-500/10">
              <SessionCard
                label="Transferir"
                sub="Envio interno"
                icon={<PaperPlaneTilt size={17} weight="bold" />}
                to="/transfer"
              />
              <SessionCard
                label="Banco"
                sub="Conta e dados"
                icon={<Bank size={17} weight="bold" />}
                to="/bank"
              />
              <SessionCard
                label="Transações"
                sub="Histórico"
                icon={<ArrowsLeftRight size={17} weight="bold" />}
                to="/transactions"
              />
              <SessionCard
                label="Presente"
                sub="Bônus"
                icon={<Gift size={17} weight="bold" />}
                to="/gift"
              />
              <SessionCard
                label="Segurança"
                sub="Proteção"
                icon={<ShieldCheck size={17} weight="bold" />}
                to="/security"
              />
              <SessionCard
                label="Senha"
                sub="Alterar senha"
                icon={<LockKey size={17} weight="bold" />}
                to="/password"
              />
            </div>
          )}
        </section>

        {!isLoading && (
          <section className="mt-8 border-t border-cyan-500/10 pt-5">
            <button
              onClick={() => {
                queryClient.clear()
                localStorage.clear()
                navigate("/login")
              }}
              className="w-full py-3 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-rose-400 hover:text-white border border-rose-500/20 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <SignOut size={15} weight="bold" />
              Sair da conta
            </button>
          </section>
        )}
      </div>

      <AgentDrawer
        open={agentMenuOpen}
        onClose={() => setAgentMenuOpen(false)}
      >
        <AgentSidebar onClose={() => setAgentMenuOpen(false)} />
      </AgentDrawer>
    </div>
  )
}

function SessionCard({ label, sub, icon, to }: any) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(to)}
      className="w-full py-3.5 flex items-center gap-3 text-left hover:bg-[#0e364a]/55 transition-colors cursor-pointer"
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-cyan-300 bg-cyan-500/5 border border-cyan-500/10">
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white">
          {label}
        </p>
        <p className="text-[9px] text-cyan-200/45 uppercase tracking-wider mt-0.5">
          {sub}
        </p>
      </div>

      <span className="text-cyan-300/35 text-sm">›</span>
    </button>
  )
}
