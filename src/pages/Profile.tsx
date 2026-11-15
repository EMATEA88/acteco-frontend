
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { UserService } from '../services/user.service'
import { KYCService } from '../services/kyc'
import { AgentService } from '../services/agent.service'
import { formatCurrencyAOA } from '../utils/formatCurrency'

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
  PencilSimple,
  CheckCircle,
  UserCircle,
} from '@phosphor-icons/react'

import AgentDrawer from '../components/agent/AgentDrawer'
import AgentSidebar from '../components/agent/AgentSidebar'
import AgentMenuButton from '../components/agent/AgentMenuButton'
import Toast from '../components/ui/Toast'

type User = {
  id?: number
  fullName?: string
  phone: string
  email: string
  publicId: string
  balance: number
  role: 'USER' | 'AGENT' | 'SUB_AGENT' | 'ADMIN' | string
}

type KYCState = {
  status: string
  isVerified: boolean
  canSubmit: boolean
}

type ToastType = 'success' | 'error'

const ROLE_BADGES: Record<string, {
  label: string
  className: string
}> = {
  USER: {
    label: 'Cliente',
    className: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20',
  },
  AGENT: {
    label: 'Agente',
    className: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
  },
  SUB_AGENT: {
    label: 'Sub-agente',
    className: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
  },
  ADMIN: {
    label: 'Administrador',
    className: 'bg-rose-400/10 text-rose-300 border-rose-400/20',
  },
}

export default function Profile() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  const [kyc, setKyc] = useState<KYCState | null>(null)
  const [agentMenuOpen, setAgentMenuOpen] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<ToastType>('success')

  useEffect(() => {
    setAgentMenuOpen(false)
  }, [location.pathname])

  // TOAST
  useEffect(() => {
    if (!toastVisible) return

    const timer = setTimeout(() => {
      setToastVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [toastVisible])

  function showToast(message: string, type: ToastType = 'success') {
    setToastMessage(message)
    setToastType(type)
    setToastVisible(true)
  }

  // UTILIZADOR
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['me'],
    queryFn: async () => {
      const res: any = await UserService.me()
      return (res?.data || res) as User
    },
    staleTime: 0,
    gcTime: 0,
  })

  const rawRole = user?.role
    ? String(user.role).toUpperCase().trim()
    : 'USER'

  const currentRoleBadge =
    ROLE_BADGES[rawRole] || ROLE_BADGES.USER

  // ESTATÍSTICAS DO AGENTE
  const { data: agentStats } = useQuery({
    queryKey: ['agent-premium-statistics'],
    queryFn: () => AgentService.getPremiumStatistics(),
    enabled: rawRole === 'AGENT',
  })

  // VERIFICAÇÃO KYC
  useEffect(() => {
    let mounted = true

    async function loadKYC() {
      try {
        const res = await KYCService.status()
        const data = res.data

        if (!mounted) return

        setKyc({
          status: data.status,
          isVerified: data.isVerified ?? data.status === 'VERIFIED',
          canSubmit: data.canSubmit ?? (
            data.status === 'NOT_SUBMITTED' ||
            data.status === 'REJECTED'
          ),
        })
      } catch (error) {
        console.error('KYC ERROR:', error)
      }
    }

    loadKYC()

    return () => {
      mounted = false
    }
  }, [])

  // COPIAR IDENTIFICAÇÃO
  async function copyPublicId() {
    try {
      await navigator.clipboard.writeText(user?.publicId ?? '')
      showToast('Identificação copiada com sucesso')
    } catch {
      showToast('Não foi possível copiar a identificação', 'error')
    }
  }

  // TERMINAR SESSÃO
  function handleLogout() {
    queryClient.clear()
    localStorage.clear()
    navigate('/login', { replace: true })
  }

  const isAgent = rawRole === 'AGENT'
  const isAdmin = rawRole === 'ADMIN'

  return (
    <div className="
      fixed inset-0 z-40
      flex h-screen w-screen flex-col
      overflow-hidden
      bg-[#071c29]
      text-[#e0f2fe]
      font-sans antialiased
    ">

      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
      />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="
        flex-1 min-h-0
        overflow-y-auto overflow-x-hidden
        px-4 sm:px-6
        pt-5 pb-28
        scrollbar-thin
      ">

        <div className="mx-auto w-full max-w-xl space-y-5">

          {/* CABEÇALHO DO PERFIL */}
          {isLoading ? (
            <div className="
              flex items-center gap-3
              rounded-2xl border border-white/[0.06]
              bg-[#0e3041] p-4 animate-pulse
            ">
              <div className="h-14 w-14 rounded-full bg-white/10" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-36 rounded bg-white/10" />
                <div className="h-3 w-48 rounded bg-white/10" />
              </div>
            </div>
          ) : (
            <section className="
              flex items-center justify-between gap-3
              rounded-2xl
              border border-cyan-400/10
              bg-[#0e3041]
              p-4
            ">

              <div className="flex min-w-0 items-center gap-3">

                <div className="
                  h-14 w-14 shrink-0 overflow-hidden
                  rounded-full
                  border border-cyan-400/20
                  bg-[#123c50] p-1
                ">
                  <img
                    src="/logo.png"
                    alt="EMATEA"
                    className="h-full w-full rounded-full object-contain"
                  />
                </div>

                <div className="min-w-0">

                  <div className="flex items-center gap-1.5">

                    <h1 className="
                      truncate text-sm font-bold
                      text-white
                    ">
                      {user?.fullName || user?.phone}
                    </h1>

                    {kyc?.isVerified && (
                      <SealCheck
                        size={17}
                        weight="fill"
                        className="shrink-0 text-cyan-400"
                      />
                    )}

                  </div>

                  <p className="
                    mt-1 truncate text-xs
                    text-cyan-100/50
                  ">
                    {user?.email || user?.phone}
                  </p>

                  <button
                    type="button"
                    onClick={copyPublicId}
                    className="
                      mt-1.5 flex items-center gap-1.5
                      text-[10px] font-medium
                      text-cyan-300/70
                      transition-colors
                      hover:text-cyan-200
                    "
                  >
                    ID: {user?.publicId || '---'}
                    <Copy size={12} />
                  </button>

                </div>

              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">

                {!isAgent && !isAdmin ? (
                  <button
                    type="button"
                    onClick={() => navigate('/settings')}
                    aria-label="Configurações"
                    className="
                      flex h-9 w-9 items-center justify-center
                      rounded-xl
                      border border-white/10
                      bg-white/[0.04]
                      text-cyan-200
                      transition-colors
                      hover:bg-white/10
                    "
                  >
                    <Gear size={19} weight="bold" />
                  </button>
                ) : (
                  <AgentMenuButton
                    onClick={() => setAgentMenuOpen(true)}
                  />
                )}

                <span className={`
                  rounded-full border px-2.5 py-1
                  text-[9px] font-bold
                  ${currentRoleBadge.className}
                `}>
                  {currentRoleBadge.label}
                </span>

              </div>

            </section>
          )}

          {/* CARTÃO FINANCEIRO */}
          {!isLoading && (
            <section className="
              relative overflow-hidden
              rounded-2xl
              border border-cyan-400/15
              bg-gradient-to-br
              from-[#12465a]
              via-[#10374a]
              to-[#0c293b]
              p-5
              shadow-xl shadow-black/10
            ">

              <div className="
                pointer-events-none absolute
                -right-16 -top-20
                h-52 w-52 rounded-full
                bg-cyan-400/[0.07] blur-3xl
              " />

              <div className="relative">

                <div className="flex items-center gap-2">
                  <Wallet
                    size={17}
                    weight="duotone"
                    className="text-cyan-300"
                  />

                  <span className="
                    text-[11px] font-semibold
                    text-cyan-100/70
                  ">
                    Saldo disponível
                  </span>
                </div>

                <div className="
                  mt-3 flex items-center justify-between gap-2
                ">

                  <h2 className="
                    text-3xl sm:text-4xl
                    font-bold tracking-tight
                    text-white
                  ">
                    {formatCurrencyAOA(user?.balance ?? 0)}
                  </h2>

                  {kyc?.isVerified && (
                    <span className="
                      flex items-center gap-1
                      rounded-full bg-emerald-400/10
                      px-2 py-1
                      text-[9px] font-semibold
                      text-emerald-300
                    ">
                      <CheckCircle size={12} weight="fill" />
                      Verificada
                    </span>
                  )}

                </div>

                {/* COMISSÕES DO AGENTE */}
                {isAgent && (
                  <div className="
                    mt-5 rounded-xl
                    border border-emerald-400/15
                    bg-emerald-400/[0.06]
                    p-3
                  ">

                    <p className="
                      text-[10px] font-semibold
                      text-emerald-300/80
                    ">
                      Comissão acumulada
                    </p>

                    <p className="
                      mt-1 text-xl font-bold
                      text-emerald-300
                    ">
                      {formatCurrencyAOA(
                        agentStats?.overview?.totalCommission ?? 0
                      )}
                    </p>

                  </div>
                )}

                {/* AÇÕES FINANCEIRAS */}
                <div className="
                  mt-5 grid grid-cols-2 gap-3
                ">

                  <button
                    type="button"
                    onClick={() => navigate('/deposit')}
                    className="
                      flex h-12 items-center justify-center gap-2
                      rounded-xl
                      bg-cyan-500
                      text-sm font-bold text-white
                      shadow-lg shadow-cyan-950/20
                      transition-all
                      hover:bg-cyan-400
                      active:scale-[0.98]
                    "
                  >
                    <Wallet size={18} weight="bold" />
                    Depositar
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/withdraw')}
                    className="
                      flex h-12 items-center justify-center gap-2
                      rounded-xl
                      border border-white/15
                      bg-white/[0.06]
                      text-sm font-bold text-white
                      transition-all
                      hover:bg-white/10
                      active:scale-[0.98]
                    "
                  >
                    <ArrowDown size={18} weight="bold" />
                    Levantar
                  </button>

                </div>

              </div>

            </section>
          )}

          {/* VERIFICAÇÃO DE CONTA */}
          {!isLoading && !kyc?.isVerified && (
            <button
              type="button"
              onClick={() => navigate('/kyc')}
              className="
                flex w-full items-center gap-3
                rounded-xl
                border border-amber-400/20
                bg-amber-400/[0.06]
                p-3.5
                text-left
                transition-colors
                hover:bg-amber-400/10
              "
            >

              <div className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl bg-amber-400/10
                text-amber-300
              ">
                <ShieldCheck size={21} weight="duotone" />
              </div>

              <div className="min-w-0 flex-1">

                <p className="
                  text-xs font-bold text-amber-200
                ">
                  {kyc?.status === 'PENDING'
                    ? 'Verificação em análise'
                    : 'Verificar identidade'}
                </p>

                <p className="
                  mt-1 text-[10px]
                  text-amber-100/50
                ">
                  {kyc?.status === 'PENDING'
                    ? 'Aguardando validação dos documentos'
                    : 'Conclua a verificação da sua conta'}
                </p>

              </div>

              <ShieldCheck
                size={18}
                className="shrink-0 text-amber-300"
              />

            </button>
          )}

          {/* MENU DE OPERAÇÕES */}
          <section>

            <div className="mb-3 flex items-center justify-between">

              <h2 className="
                text-base font-bold text-white
              ">
                Minha conta
              </h2>

              <span className="
                text-[10px] text-cyan-200/40
              ">
                EMATEA
              </span>

            </div>

            {isLoading ? (
              <div className="
                grid grid-cols-2 gap-3
              ">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="
                      h-24 animate-pulse
                      rounded-2xl
                      border border-white/[0.05]
                      bg-[#0e3041]
                    "
                  />
                ))}
              </div>
            ) : (
              <div className="
                grid grid-cols-2 gap-3
              ">

                <ProfileAction
                  label="Transferir"
                  description="Envio interno"
                  icon={<PaperPlaneTilt size={22} weight="duotone" />}
                  onClick={() => navigate('/transfer')}
                  accent="cyan"
                />

                <ProfileAction
                  label="Banco"
                  description="Dados bancários"
                  icon={<Bank size={22} weight="duotone" />}
                  onClick={() => navigate('/bank')}
                  accent="blue"
                />

                <ProfileAction
                  label="Transações"
                  description="Movimentos"
                  icon={<ArrowsLeftRight size={22} weight="duotone" />}
                  onClick={() => navigate('/transactions')}
                  accent="violet"
                />

                <ProfileAction
                  label="Presentes"
                  description="Bónus"
                  icon={<Gift size={22} weight="duotone" />}
                  onClick={() => navigate('/gift')}
                  accent="amber"
                />

                <ProfileAction
                  label="Segurança"
                  description="Proteção da conta"
                  icon={<ShieldCheck size={22} weight="duotone" />}
                  onClick={() => navigate('/security')}
                  accent="emerald"
                />

                <ProfileAction
                  label="Palavra-passe"
                  description="Alterar senha"
                  icon={<LockKey size={22} weight="duotone" />}
                  onClick={() => navigate('/password')}
                  accent="blue"
                />

                <ProfileAction
                  label="EMATEA"
                  description="Informações"
                  icon={<Info size={22} weight="duotone" />}
                  onClick={() => navigate('/about')}
                  accent="cyan"
                />

                <ProfileAction
                  label="Definições"
                  description="Preferências"
                  icon={<Gear size={22} weight="duotone" />}
                  onClick={() => navigate('/settings')}
                  accent="slate"
                />

              </div>
            )}

          </section>

          {/* TERMINAR SESSÃO */}
          {!isLoading && (
            <section className="pt-2 pb-4">

              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex h-12 w-full
                  items-center justify-center gap-2
                  rounded-xl
                  border border-rose-400/15
                  bg-rose-400/[0.05]
                  text-xs font-bold
                  text-rose-300
                  transition-all
                  hover:border-rose-400/30
                  hover:bg-rose-400/10
                  active:scale-[0.99]
                "
              >
                <SignOut size={17} weight="bold" />
                Terminar sessão
              </button>

            </section>
          )}

        </div>

      </main>

      {/* MENU DO AGENTE */}
      <AgentDrawer
        open={agentMenuOpen}
        onClose={() => setAgentMenuOpen(false)}
      >
        <AgentSidebar
          onClose={() => setAgentMenuOpen(false)}
        />
      </AgentDrawer>

    </div>
  )
}

// =====================================================
// COMPONENTE DE OPERAÇÃO
// =====================================================

function ProfileAction({
  label,
  description,
  icon,
  onClick,
  accent = 'cyan',
}: {
  label: string
  description: string
  icon: React.ReactNode
  onClick: () => void
  accent?: string
}) {

  const accentClasses: Record<string, string> = {
    cyan: 'text-cyan-300 bg-cyan-400/10 border-cyan-400/10',
    blue: 'text-sky-300 bg-sky-400/10 border-sky-400/10',
    violet: 'text-violet-300 bg-violet-400/10 border-violet-400/10',
    amber: 'text-amber-300 bg-amber-400/10 border-amber-400/10',
    emerald: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/10',
    slate: 'text-slate-300 bg-slate-400/10 border-slate-400/10',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex min-h-[104px] flex-col
        items-start justify-between
        rounded-2xl
        border border-white/[0.07]
        bg-[#0e3041]
        p-3.5
        text-left
        transition-all
        hover:border-cyan-400/20
        hover:bg-[#123b4f]
        active:scale-[0.98]
      "
    >

      <div className={`
        flex h-10 w-10
        items-center justify-center
        rounded-xl border
        ${accentClasses[accent] || accentClasses.cyan}
      `}>
        {icon}
      </div>

      <div className="mt-3 min-w-0">

        <p className="
          truncate text-xs font-bold
          text-white
        ">
          {label}
        </p>

        <p className="
          mt-1 truncate text-[10px]
          text-cyan-100/45
        ">
          {description}
        </p>

      </div>

    </button>
  )
}
