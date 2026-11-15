
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { UserService } from '../services/user.service'
import { KYCService } from '../services/kyc'
import { formatCurrencyAOA } from "../utils/formatCurrency"
import { AgentService } from '../services/agent.service'
import { supportSettingsService } from '../services/supportSettings.service'

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
  Info,
  ChatCircle,
  Users,
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

  const { data: agentStats } = useQuery({
    queryKey: ['agent-premium-statistics'],
    queryFn: () => AgentService.getPremiumStatistics(),
    enabled: user?.role?.toUpperCase() === 'AGENT',
  })

  // CONTACTOS DINÂMICOS DE SUPORTE
  const { data: supportSettings, isLoading: supportLoading, isError: supportError } = useQuery({
    queryKey: ['support-settings'],
    queryFn: async () => {
      const response = await supportSettingsService.getSettings()

      if (!response.success || !response.settings) {
        throw new Error("Não foi possível carregar os contactos de suporte.")
      }

      return response.settings
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
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

  const whatsappNumber = supportSettings?.whatsappNumber?.replace(/\D/g, '') ?? ''
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : ''

  const whatsappGroupUrl = supportSettings?.whatsappGroupUrl?.trim() ?? ''

  return (
    <div className="min-h-screen w-full bg-[#0a2533] text-[#e0f2fe] flex flex-col font-sans antialiased">
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 pt-6 pb-32">

        {/* CABEÇALHO DA CONTA */}
        {isLoading ? (
          <div className="py-5 border-b border-cyan-500/10 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#144863]" />
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
                <div className="w-14 h-14 rounded-full border border-cyan-500/20 overflow-hidden bg-[#144863] p-1 shrink-0">
                  <img
                    src="/logo.png"
                    className="w-full h-full object-contain rounded-full"
                    alt="Logo"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-base font-bold text-white uppercase truncate">
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

                  <p className="text-[11px] text-cyan-200/60 truncate mt-0.5">
                    {user?.email}
                  </p>

                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] text-cyan-300/60 font-mono">
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

                <p className="text-3xl font-bold tracking-tight text-cyan-300 mt-1">
                  {formatCurrencyAOA(user?.balance ?? 0)}
                </p>

                {rawRole === "AGENT" && (
                  <div className="mt-3">
                    <p className="text-[8px] text-emerald-300/70 uppercase tracking-[0.16em] font-bold">
                      Comissão Acumulada
                    </p>

                    <p className="text-xl font-bold tracking-tight text-emerald-300 mt-1">
                      {formatCurrencyAOA(agentStats?.overview?.totalCommission ?? 0)}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/deposit")}
                  className="flex flex-col items-center gap-1 text-cyan-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Wallet size={20} weight="bold" />
                  <span className="text-[9px] uppercase tracking-wider">
                    Depósito
                  </span>
                </button>

                <button
                  onClick={() => navigate("/withdraw")}
                  className="flex flex-col items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <ArrowDown size={20} weight="bold" />
                  <span className="text-[9px] uppercase tracking-wider">
                    Saque
                  </span>
                </button>
              </div>
            </div>

            {!kyc?.isVerified && (
              <button
                onClick={() => navigate("/kyc")}
                className="mt-4 text-[11px] font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 cursor-pointer"
              >
                {kyc?.status === "PENDING"
                  ? "Conta em análise"
                  : "Verificar conta"}
              </button>
            )}
          </section>
        )}

        {/* OPERAÇÕES DA CONTA */}
        <section className="mt-7">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-400">
                Conta
              </p>

              <h2 className="text-base font-semibold text-white mt-1">
                Operações
              </h2>
            </div>
          </div>

          {isLoading ? (
            <div className="divide-y divide-cyan-500/10 border-y border-cyan-500/10">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="py-5 flex items-center gap-4 animate-pulse"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#144863]" />

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
                icon={<PaperPlaneTilt size={19} weight="bold" />}
                to="/transfer"
              />

              <SessionCard
                label="Banco"
                sub="Conta e dados"
                icon={<Bank size={19} weight="bold" />}
                to="/bank"
              />

              <SessionCard
                label="Transações"
                sub="Histórico"
                icon={<ArrowsLeftRight size={19} weight="bold" />}
                to="/transactions"
              />

              <SessionCard
                label="Presente"
                sub="Bônus"
                icon={<Gift size={19} weight="bold" />}
                to="/gift"
              />

              <SessionCard
                label="Segurança"
                sub="Proteção"
                icon={<ShieldCheck size={19} weight="bold" />}
                to="/security"
              />

              <SessionCard
                label="Senha"
                sub="Alterar senha"
                icon={<LockKey size={19} weight="bold" />}
                to="/password"
              />

              <SessionCard
                label="EMATEA"
                sub="Informações institucionais"
                icon={<Info size={19} weight="bold" />}
                to="/about"
              />
            </div>
          )}
        </section>

        {/* AJUDA E SUPORTE */}
        <section className="mt-8">
          <div className="mb-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-400">
              Atendimento
            </p>

            <h2 className="text-base font-semibold text-white mt-1">
              Ajuda e suporte
            </h2>

            <p className="text-[11px] text-cyan-200/55 mt-1">
              Entre em contacto com a equipa EMATEA.
            </p>
          </div>

          <div className="divide-y divide-cyan-500/10 border-y border-cyan-500/10">
            {supportLoading ? (
              <div className="py-5 flex items-center gap-3 text-cyan-200/50 text-xs">
                <div className="w-4 h-4 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
                A carregar contactos de suporte...
              </div>
            ) : supportError ? (
              <p className="py-5 text-xs text-rose-300">
                Não foi possível carregar os contactos de suporte.
              </p>
            ) : (
              <>
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-4 flex items-center gap-4 hover:bg-[#0e364a]/55 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-emerald-400 bg-emerald-500/5 border border-emerald-500/10">
                      <ChatCircle size={20} weight="bold" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">
                        Atendimento WhatsApp
                      </p>

                      <p className="text-[10px] text-cyan-200/55 uppercase tracking-wider mt-0.5">
                        Fale diretamente com o suporte
                      </p>
                    </div>

                    <span className="text-cyan-300/35 text-sm">↗</span>
                  </a>
                )}

                {whatsappGroupUrl && (
                  <a
                    href={whatsappGroupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-4 flex items-center gap-4 hover:bg-[#0e364a]/55 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-cyan-300 bg-cyan-500/5 border border-cyan-500/10">
                      <Users size={20} weight="bold" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">
                        Comunidade EMATEA
                      </p>

                      <p className="text-[10px] text-cyan-200/55 uppercase tracking-wider mt-0.5">
                        Entre no nosso grupo oficial
                      </p>
                    </div>

                    <span className="text-cyan-300/35 text-sm">↗</span>
                  </a>
                )}

                {!whatsappUrl && !whatsappGroupUrl && (
                  <p className="py-5 text-xs text-cyan-200/50">
                    Os contactos de suporte ainda não estão disponíveis.
                  </p>
                )}
              </>
            )}
          </div>
        </section>

        {/* TERMINAR SESSÃO */}
        {!isLoading && (
          <section className="mt-8 border-t border-cyan-500/10 pt-5">
            <button
              onClick={() => {
                queryClient.clear()
                localStorage.clear()
                navigate("/login")
              }}
              className="w-full py-4 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-wider text-rose-400 hover:text-white border border-rose-500/20 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
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
      className="w-full py-4 flex items-center gap-4 text-left hover:bg-[#0e364a]/55 transition-colors cursor-pointer"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-cyan-300 bg-cyan-500/5 border border-cyan-500/10">
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">
          {label}
        </p>

        <p className="text-[10px] text-cyan-200/55 uppercase tracking-wider mt-0.5">
          {sub}
        </p>
      </div>

      <span className="text-cyan-300/35 text-sm">›</span>
    </button>
  )
}
