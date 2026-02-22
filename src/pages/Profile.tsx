import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserService } from '../services/user.service'
import { KYCService } from '../services/kyc'
import { ChartLineUp } from '@phosphor-icons/react'

import {
  Wallet,
  ArrowDown,
  Bank,
  ArrowsLeftRight,
  Gift,
  ShieldCheck,
  LockKey,
  Info,
  Copy,
  DownloadSimple,
} from '@phosphor-icons/react'

import { Check } from 'lucide-react'

type UserProfile = {
  phone: string
  publicId: string
  balance: number
}

export default function Profile() {

  const navigate = useNavigate()

  const [user, setUser] = useState<UserProfile | null>(null)
  const [kycStatus, setKycStatus] = useState<
    'LOADING' | 'NOT_SUBMITTED' | 'PENDING' | 'VERIFIED' | 'REJECTED'
  >('LOADING')

  const [copiedId, setCopiedId] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [userRes, kycRes] = await Promise.all([
          UserService.me(),
          KYCService.status(),
        ])

        setUser(userRes.data)
        setKycStatus(kycRes.data.status)
      } catch (err) {
        console.error(err)
      }
    }

    load()
  }, [])

  if (!user) return null

  const shortId = user.publicId?.slice(0, 8)

  async function copyText(value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2000)
    } catch {}
  }

  function handleLogout() {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1220] to-[#0F172A] text-white pb-32">

      {/* HEADER */}
      <div className="px-6 pt-14 pb-10 relative">

        <div className="absolute inset-0 bg-emerald-600/20 blur-3xl opacity-30" />

        <div className="relative flex items-center gap-5">

          <div className="w-20 h-20 rounded-full overflow-hidden border border-white/10 shadow-xl">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">

            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold tracking-wide">
                {user.phone}
              </p>

              {kycStatus === 'VERIFIED' && (
                <ShieldCheck size={18} weight="fill" className="text-emerald-400" />
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
              <span>ID: {shortId}</span>
              <button onClick={() => copyText(user.publicId)}>
                {copiedId ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            {kycStatus === 'PENDING' && (
              <p className="text-xs mt-2 text-yellow-400">
                Verificação em análise
              </p>
            )}

            {kycStatus === 'REJECTED' && (
              <p className="text-xs mt-2 text-red-400">
                Verificação rejeitada
              </p>
            )}

          </div>
        </div>
      </div>

      {/* SALDO */}
      <div className="px-6">
        <div className="rounded-3xl p-7 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <p className="text-sm text-gray-400 mb-2">
            Saldo disponível
          </p>
          <p className="text-4xl font-bold tracking-tight">
            {user.balance?.toLocaleString()} Kz
          </p>
        </div>
      </div>

      {/* AÇÕES PRINCIPAIS */}
      <div className="px-6 mt-8 grid grid-cols-2 gap-4">

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

      {/* MINHA CONTA */}
      <div className="px-6 mt-12">
        <p className="font-semibold mb-6 text-gray-400 tracking-wide">
          MINHAS SESSÕES
        </p>

        <div className="grid grid-cols-3 gap-5">

  <Item label="Banco" icon={<Bank size={20} weight="fill" />} onClick={() => navigate('/bank')} />
  <Item label="Transações" icon={<ArrowsLeftRight size={20} weight="fill" />} onClick={() => navigate('/transactions')} />
  <Item label="Presente" icon={<Gift size={20} weight="fill" />} onClick={() => navigate('/gift')} />
  <Item label="Segurança" icon={<ShieldCheck size={20} weight="fill" />} onClick={() => navigate('/security')} />
  <Item label="Senha" icon={<LockKey size={20} weight="fill" />} onClick={() => navigate('/password')} />
  <Item label="Verificação" icon={<ShieldCheck size={20} weight="fill" />} onClick={() => navigate('/kyc')} />
  <Item label="Sobre" icon={<Info size={20} weight="fill" />} onClick={() => navigate('/about')} />

  <Item
    label="Aplicações"
    icon={<ChartLineUp size={20} weight="fill" />}
    onClick={() => navigate('/applications')}
  />

  <Item
    label="Download APP"
    icon={<DownloadSimple size={20} weight="fill" />}
    onClick={() => window.dispatchEvent(new Event('beforeinstallprompt'))}
    highlight
  />

</div>
      </div>

      {/* LOGOUT */}
      <div className="px-6 mt-12 flex justify-center">
        <button
          onClick={handleLogout}
          className="text-xs text-gray-500 hover:text-white transition"
        >
          Encerrar sessão
        </button>
      </div>

    </div>
  )
}

/* ============================= */
/* COMPONENTES */
/* ============================= */

function ActionButton({
  label,
  icon,
  color,
  onClick,
}: {
  label: string
  icon: React.ReactNode
  color: 'emerald' | 'red'
  onClick: () => void
}) {

  const colors = {
    emerald: 'bg-emerald-600 hover:bg-emerald-700',
    red: 'bg-red-600 hover:bg-red-700',
  }

  return (
    <button
      onClick={onClick}
      className={`
        ${colors[color]}
        rounded-2xl
        p-6
        flex flex-col
        items-center
        gap-3
        shadow-xl
        transition
        active:scale-95
      `}
    >
      {icon}
      <span className="text-sm font-medium">
        {label}
      </span>
    </button>
  )
}

function Item({
  label,
  icon,
  onClick,
  highlight = false
}: {
  label: string
  icon: React.ReactNode
  onClick: () => void
  highlight?: boolean
}) {

  return (
    <button
      onClick={onClick}
      className={`
        ${highlight ? 'bg-emerald-600/20 border-emerald-500/30' : 'bg-white/5 border-white/10'}
        backdrop-blur-lg
        border
        rounded-2xl
        p-5
        flex flex-col
        items-center
        gap-3
        hover:bg-white/10
        transition
      `}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center 
        ${highlight ? 'bg-emerald-600 text-white' : 'bg-emerald-600/20 text-emerald-400'}
      `}>
        {icon}
      </div>

      <span className={`text-xs ${highlight ? 'text-emerald-300' : 'text-gray-300'}`}>
        {label}
      </span>
    </button>
  )
}