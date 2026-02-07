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

export default function Profile() {
  const navigate = useNavigate()

  const [user, setUser] = useState<UserProfile | null>(null)
  const [commission, setCommission] =
    useState<CommissionProfile>({
      today: 0,
      yesterday: 0,
    })
  const [teamSize, setTeamSize] = useState(0)

  const [copiedId, setCopiedId] = useState(false)
  const [copiedInvite, setCopiedInvite] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const userRes = await UserService.me()
        setUser(userRes.data)

        const { data } =
          await CommissionService.getDailySummary()

        setCommission({
          today: Number(data.today ?? 0),
          yesterday: Number(data.yesterday ?? 0),
        })

        const teamRes = await TeamService.getSummary()
        const {
          level1 = 0,
          level2 = 0,
          level3 = 0,
        } = teamRes.data

        setTeamSize(level1 + level2 + level3)
      } catch (e) {
        console.error('Profile load error', e)
      }
    }

    load()
  }, [])

  if (!user) return null

  const shortId = user.publicId.slice(0, 8)

  async function copyText(
    value: string,
    setter: (v: boolean) => void
  ) {
    try {
      await navigator.clipboard.writeText(value)
      setter(true)
      setTimeout(() => setter(false), 2000)
    } catch {}
  }

  return (
    <div className="pb-28 bg-gray-50">
      {/* ================= HEADER ================= */}
      <div className="bg-emerald-600 px-5 pt-6 pb-14">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden shadow">
            <img
              src="/logo.png"
              alt="ACTECO"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-white text-sm leading-5 flex-1">
            <p className="font-semibold text-base">
              {user.phone}
            </p>

            {/* ID */}
            <div className="flex items-center gap-2 text-xs mt-1">
              <span>ID: {shortId}</span>
              <button
                onClick={() =>
                  copyText(user.publicId, setCopiedId)
                }
                className="opacity-80 hover:opacity-100"
              >
                {copiedId ? (
                  <Check size={14} />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>

            {/* INVITE */}
            <div className="flex items-center gap-2 text-xs mt-1">
              <span className="px-2 py-0.5 bg-white/20 rounded-full">
                Convite: {user.inviteCode}
              </span>
              <button
                onClick={() =>
                  copyText(
                    user.inviteCode,
                    setCopiedInvite
                  )
                }
                className="opacity-80 hover:opacity-100"
              >
                {copiedInvite ? (
                  <Check size={14} />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MÉTRICAS ================= */}
      <div className="-mt-10 px-5">
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <p className="font-semibold mb-4">
            Resumo financeiro
          </p>

          <div className="grid grid-cols-4 gap-3">
            <Stat
              icon={
                <Wallet
                  size={22}
                  weight="fill"
                  className="text-emerald-600"
                />
              }
              value={`${commission.today.toFixed(2)} Kz`}
              label="Hoje"
            />
            <Stat
              icon={
                <TrendUp
                  size={22}
                  weight="fill"
                  className="text-blue-600"
                />
              }
              value={`${commission.yesterday.toFixed(2)} Kz`}
              label="Ontem"
            />
            <Stat
              icon={
                <Users
                  size={22}
                  weight="fill"
                  className="text-indigo-600"
                />
              }
              value={String(teamSize)}
              label="Equipa"
            />
            <Stat
              icon={
                <ChartLineUp
                  size={22}
                  weight="fill"
                  className="text-orange-500"
                />
              }
              value={`${user.balance.toFixed(2)} Kz`}
              label="Saldo"
              highlight
            />
          </div>
        </div>
      </div>

      {/* ================= AÇÕES ================= */}
      <div className="px-5 mt-6 grid grid-cols-2 gap-4">
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

      {/* ================= MINHA CONTA ================= */}
      <div className="px-5 mt-8">
        <p className="font-semibold mb-4">
          Minha conta
        </p>

        <div className="grid grid-cols-4 gap-4">
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

      {/* ================= INSTALL APP ================= */}
<div className="px-5 mt-10">
  <InstallAppButton />
</div>

{/* ================= LOGOUT ================= */}
<div className="px-5 mt-6 flex justify-center">
        <button
          onClick={() => {
            localStorage.clear()
            navigate('/login')
          }}
          className="group flex flex-col items-center gap-2"
        >
          <div className="relative w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center shadow-card animate-pulse-slow">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition">
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

type StatProps = {
  icon: React.ReactNode
  value: string
  label: string
  highlight?: boolean
}

function Stat({ icon, value, label, highlight }: StatProps) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      {icon}
      <p
        className={`font-semibold ${
          highlight
            ? 'text-gray-900'
            : 'text-gray-800'
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}

type ActionButtonProps = {
  label: string
  icon: React.ReactNode
  color: 'emerald' | 'red'
  onClick: () => void
}

function ActionButton({
  label,
  icon,
  color,
  onClick,
}: ActionButtonProps) {
  const colors = {
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

type ItemProps = {
  label: string
  icon: React.ReactNode
  onClick: () => void
}

function Item({ label, icon, onClick }: ItemProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition"
    >
      <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
        {icon}
      </div>
      <span className="text-xs text-gray-700">{label}</span>
    </button>
  )
}
