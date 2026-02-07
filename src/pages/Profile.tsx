import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { UserService } from '../services/user.service'
import { CommissionService } from '../services/commission.service'
import { TeamService } from '../services/team.service'

import {
  Wallet,
  ArrowDown,
  Bank,
  ArrowsLeftRight,
  Receipt,
  Gift,
  Users,
  TrendUp,
  ShieldCheck,
  LockKey,
  Info,
  UserPlus,
  ChartLineUp,
  Copy,
} from '@phosphor-icons/react'
import { Power, Check } from 'lucide-react'
import InstallAppButton from '../components/InstallAppButton'

type CommissionProfile = {
  today: number
  yesterday: number
}

type UserProfile = {
  phone: string
  publicId: string
  inviteCode: string
  balance: number
}

const CACHE_KEY = 'profile-cache'

export default function Profile() {
  const navigate = useNavigate()

  const cached = localStorage.getItem(CACHE_KEY)
  const initial = cached ? JSON.parse(cached) : null

  const [user, setUser] = useState<UserProfile | null>(initial?.user ?? null)
  const [commission, setCommission] = useState<CommissionProfile>(
    initial?.commission ?? { today: 0, yesterday: 0 }
  )
  const [teamSize, setTeamSize] = useState<number>(initial?.teamSize ?? 0)

  const [copiedId, setCopiedId] = useState(false)
  const [copiedInvite, setCopiedInvite] = useState(false)

  useEffect(() => {
    let mounted = true

    Promise.all([
      UserService.me(),
      CommissionService.getDailySummary(),
      TeamService.getSummary(),
    ])
      .then(([userRes, commissionRes, teamRes]) => {
        if (!mounted) return

        const commissionData = {
          today: Number(commissionRes.data.today ?? 0),
          yesterday: Number(commissionRes.data.yesterday ?? 0),
        }

        const { level1 = 0, level2 = 0, level3 = 0 } = teamRes.data
        const size = level1 + level2 + level3

        setUser(userRes.data)
        setCommission(commissionData)
        setTeamSize(size)

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            user: userRes.data,
            commission: commissionData,
            teamSize: size,
          })
        )
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  if (!user) return null

  const shortId = user.publicId.slice(0, 8)

  async function copyText(value: string, setter: (v: boolean) => void) {
    try {
      await navigator.clipboard.writeText(value)
      setter(true)
      setTimeout(() => setter(false), 2000)
    } catch {}
  }

  return (
    <div className="pb-28 bg-gray-50">
      {/* HEADER */}
      <div className="bg-emerald-600 px-5 pt-6 pb-16">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden shadow">
            <img src="/logo.png" alt="ACTECO" className="w-full h-full object-cover" />
          </div>

          <div className="text-white text-sm flex-1">
            <p className="font-semibold text-base">{user.phone}</p>

            <div className="flex items-center gap-2 text-xs mt-1">
              <span>ID: {shortId}</span>
              <button onClick={() => copyText(user.publicId, setCopiedId)}>
                {copiedId ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs mt-1">
              <span className="px-2 py-0.5 bg-white/20 rounded-full">
                Convite: {user.inviteCode}
              </span>
              <button onClick={() => copyText(user.inviteCode, setCopiedInvite)}>
                {copiedInvite ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="-mt-12 px-5">
        <div className="bg-emerald-50 rounded-2xl p-5 shadow-card space-y-6">
          {/* RESUMO FINANCEIRO (NOVO DESIGN) */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="font-semibold text-base mb-5">
              Resumo financeiro
            </p>

            <div className="grid grid-cols-2 gap-4">
              <FinanceCard
                icon={<Wallet size={24} className="text-emerald-600" />}
                value={`${commission.today.toFixed(2)} Kz`}
                label="Hoje"
              />

              <FinanceCard
                icon={<TrendUp size={24} className="text-blue-600" />}
                value={`${commission.yesterday.toFixed(2)} Kz`}
                label="Ontem"
              />

              <FinanceCard
                icon={<Users size={24} className="text-indigo-600" />}
                value={String(teamSize)}
                label="Equipa"
              />

              <FinanceCard
                icon={<ChartLineUp size={24} className="text-orange-500" />}
                value={`${user.balance.toFixed(2)} Kz`}
                label="Saldo"
                highlight
              />
            </div>
          </div>

          {/* AÇÕES */}
          <div className="grid grid-cols-2 gap-4">
            <ActionButton
              label="Recarregar"
              color="emerald"
              icon={<Wallet size={20} weight="fill" />}
              onClick={() => navigate('/deposit')}
            />
            <ActionButton
              label="Retirar"
              color="red"
              icon={<ArrowDown size={20} weight="fill" />}
              onClick={() => navigate('/withdraw')}
            />
          </div>
        </div>
      </div>

      {/* MINHA CONTA */}
      <div className="px-5 mt-8">
        <p className="font-semibold mb-4">Minha conta</p>

        <div className="grid grid-cols-4 gap-3">
          <Item label="Banco" icon={<Bank size={22} weight="fill" />} onClick={() => navigate('/bank')} />
          <Item label="Transações" icon={<ArrowsLeftRight size={22} weight="fill" />} onClick={() => navigate('/transactions')} />
          <Item label="Fatura" icon={<Receipt size={22} weight="fill" />} onClick={() => navigate('/invoice')} />
          <Item label="Presente" icon={<Gift size={22} weight="fill" />} onClick={() => navigate('/gift')} />
          <Item label="Segurança" icon={<ShieldCheck size={22} weight="fill" />} onClick={() => navigate('/security')} />
          <Item label="Senha" icon={<LockKey size={22} weight="fill" />} onClick={() => navigate('/password')} />
          <Item label="Sobre" icon={<Info size={22} weight="fill" />} onClick={() => navigate('/about')} />
          <Item label="Invite" icon={<UserPlus size={22} weight="fill" />} onClick={() => navigate('/team')} />
        </div>
      </div>

      {/* INSTALL APP */}
      <div className="px-5 mt-10">
        <InstallAppButton />
      </div>

      {/* LOGOUT */}
      <div className="px-5 mt-6 flex justify-center">
        <button
          onClick={() => {
            localStorage.clear()
            navigate('/login')
          }}
          className="group flex flex-col items-center gap-2"
        >
          <div className="relative w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center shadow-card animate-pulse-slow">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
              <Power size={18} className="text-white" />
            </div>
          </div>
          <span className="text-xs text-gray-600 font-medium">
            Logout
          </span>
        </button>
      </div>
    </div>
  )
}

/* ================= COMPONENTES ================= */

function FinanceCard({
  icon,
  value,
  label,
  highlight,
}: {
  icon: React.ReactNode
  value: string
  label: string
  highlight?: boolean
}) {
  return (
    <div
      className={`
        rounded-2xl p-4 flex items-center gap-4
        ${highlight ? 'bg-emerald-600 text-white' : 'bg-emerald-50'}
      `}
    >
      <div
        className={`
          w-12 h-12 rounded-full flex items-center justify-center
          ${highlight ? 'bg-white/20' : 'bg-white'}
        `}
      >
        {icon}
      </div>

      <div>
        <p
          className={`
            text-lg font-semibold leading-tight
            ${highlight ? 'text-white' : 'text-gray-900'}
          `}
        >
          {value}
        </p>
        <p
          className={`
            text-xs mt-1
            ${highlight ? 'text-white/80' : 'text-gray-500'}
          `}
        >
          {label}
        </p>
      </div>
    </div>
  )
}

function ActionButton({ label, icon, color, onClick }: any) {
  const colors: any = {
    emerald: 'bg-emerald-600 hover:bg-emerald-700',
    red: 'bg-red-500 hover:bg-red-600',
  }

  return (
    <button
      onClick={onClick}
      className={`${colors[color]} text-white rounded-2xl p-5 flex items-center justify-between font-medium shadow-sm active:scale-95 transition`}
    >
      {label}
      {icon}
    </button>
  )
}

function Item({ label, icon, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl p-4 flex flex-col items-center gap-2 bg-emerald-50 hover:bg-emerald-100 transition"
    >
      <div className="w-11 h-11 rounded-full bg-emerald-600/10 flex items-center justify-center text-emerald-700">
        {icon}
      </div>
      <span className="text-xs font-medium text-emerald-900">
        {label}
      </span>
    </button>
  )
}
