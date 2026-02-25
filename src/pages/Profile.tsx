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
  email: string
  publicId: string
  balance: number
  isVerified: boolean
  createdAt: string
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
      } catch {}
    }
    load()
  }, [])

  if (!user) return null

  const shortId = user.publicId?.slice(0, 8)

  const accountLevel = user.isVerified ? 'Premium' : 'Basic'
  const accountLimit = user.isVerified ? 'Ilimitado' : '50.000 Kz / dia'

  async function copyText(value: string) {
    await navigator.clipboard.writeText(value)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  function handleLogout() {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-white pb-24">

      {/* CARD SUPERIOR FULL WIDTH */}
      <div className="pt-14">

        <div className="bg-[#111827] border-y border-white/10 shadow-xl px-6 py-5">

          <StatusBadge
            isVerified={user.isVerified}
            kycStatus={kycStatus}
            onVerify={() => navigate('/kyc')}
          />

          {/* LINHA PRINCIPAL HORIZONTAL */}
          <div className="flex items-center gap-4 mt-5">

            <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10">
              <img src="/logo.png" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1">

              <p className="text-xs text-gray-400">
                {user.email}
              </p>

              <p className="text-base font-medium mt-1">
                {user.phone}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <span>ID: {shortId}</span>
                <button onClick={() => copyText(user.publicId)}>
                  {copiedId ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>

              <p className="text-[11px] text-gray-500 mt-1">
                Criada em {new Date(user.createdAt).toLocaleDateString('pt-AO')}
              </p>

            </div>

          </div>

          {/* SALDO + AÇÕES */}
          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">

            <div>
              <p className="text-[11px] text-gray-400">
                Saldo disponível
              </p>

              <p className="text-xl font-semibold mt-1">
                {user.balance?.toLocaleString()} Kz
              </p>

              <div className="mt-2 text-[11px] text-gray-500 space-y-1">
                <p>Nível: <span className="text-white">{accountLevel}</span></p>
                <p>Limite: <span className="text-white">{accountLimit}</span></p>
              </div>
            </div>

            <div className="flex gap-2">

              <SmallAction
                label="Recarregar"
                icon={<Wallet size={14} weight="fill" />}
                onClick={() => navigate('/deposit')}
              />

              <SmallAction
                label="Retirar"
                icon={<ArrowDown size={14} weight="fill" />}
                onClick={() => navigate('/withdraw')}
              />

            </div>

          </div>

        </div>
      </div>

      {/* SESSÕES */}
      <div className="px-6 mt-10">

        <p className="text-sm text-gray-400 mb-6 tracking-wide">
          MINHAS SESSÕES
        </p>

        <div className="grid grid-cols-3 gap-4">

          <Item label="Banco" icon={<Bank size={18} weight="fill" />} onClick={() => navigate('/bank')} />
          <Item label="Transações" icon={<ArrowsLeftRight size={18} weight="fill" />} onClick={() => navigate('/transactions')} />
          <Item label="Presente" icon={<Gift size={18} weight="fill" />} onClick={() => navigate('/gift')} />
          <Item label="Segurança" icon={<ShieldCheck size={18} weight="fill" />} onClick={() => navigate('/security')} />
          <Item label="Senha" icon={<LockKey size={18} weight="fill" />} onClick={() => navigate('/password')} />
          <Item label="Verificação" icon={<ShieldCheck size={18} weight="fill" />} onClick={() => navigate('/kyc')} />
          <Item label="Sobre" icon={<Info size={18} weight="fill" />} onClick={() => navigate('/about')} />
          <Item label="Aplicações" icon={<ChartLineUp size={18} weight="fill" />} onClick={() => navigate('/applications')} />
          <Item label="Download" icon={<DownloadSimple size={18} weight="fill" />} onClick={() => window.dispatchEvent(new Event('beforeinstallprompt'))} />

        </div>

      </div>

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

/* COMPONENTES */

function StatusBadge({
  isVerified,
  onVerify
}: {
  isVerified: boolean
  kycStatus: string
  onVerify: () => void
}) {

  if (isVerified) {
    return (
      <div className="border border-emerald-500/30 bg-emerald-500/10 rounded-lg px-4 py-3 text-emerald-400">
        <p className="text-sm font-medium">Conta verificada</p>
        <p className="text-xs opacity-70 mt-1">
          Sua conta está totalmente ativa.
        </p>
      </div>
    )
  }

  return (
    <div className="border border-yellow-500/30 bg-yellow-500/10 rounded-lg px-4 py-3">

      <p className="text-sm font-medium text-yellow-400">
        Conta não verificada
      </p>

      <button
        onClick={onVerify}
        className="mt-3 text-xs bg-yellow-500 text-black px-3 py-1 rounded-md hover:opacity-90 transition"
      >
        Verificar Conta
      </button>

    </div>
  )
}

function SmallAction({
  label,
  icon,
  onClick
}: {
  label: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="
        bg-white/5
        border border-white/10
        hover:bg-white/10
        px-3 py-1.5
        rounded-lg
        text-[11px]
        flex items-center gap-1.5
        transition
      "
    >
      {icon}
      {label}
    </button>
  )
}

function Item({
  label,
  icon,
  onClick
}: {
  label: string
  icon: React.ReactNode
  onClick: () => void
}) {

  return (
    <button
      onClick={onClick}
      className="
        bg-white/5
        border border-white/10
        rounded-xl
        p-4
        flex flex-col
        items-center
        gap-2
        hover:bg-white/10
        transition
      "
    >
      <div className="w-9 h-9 rounded-full bg-emerald-600/20 flex items-center justify-center text-emerald-400">
        {icon}
      </div>

      <span className="text-[11px] text-gray-300">
        {label}
      </span>
    </button>
  )
}