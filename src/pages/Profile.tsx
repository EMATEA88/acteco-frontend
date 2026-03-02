import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserService } from '../services/user.service'
import { ChartLineUp } from '@phosphor-icons/react'
import { formatCurrencyAOA } from "../utils/formatCurrency"

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
  fullName?: string
  phone: string
  email: string
  publicId: string
  balance: number
  isVerified: boolean
  kycStatus?: 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED'
  createdAt: string
}

export default function Profile() {

  const navigate = useNavigate()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [copiedId, setCopiedId] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const userRes = await UserService.me()
        setUser(userRes.data)
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
    <div className="h-screen overflow-hidden bg-[#0B0E11] text-[#EAECEF] flex flex-col">

      {/* CONTAINER PRINCIPAL FIXO */}
      <div className="flex-1 flex flex-col px-4 pt-4 gap-4">

        {/* PROFILE CARD */}
        <div className="bg-[#1E2329] rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">

          {/* HEADER HORIZONTAL */}
          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-full overflow-hidden border border-[#2B3139] flex-shrink-0">
              <img src="/logo.png" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold truncate">
                  {user.fullName || user.phone}
                </p>

                {user.isVerified && (
                  <span className="bg-emerald-600 w-4 h-4 rounded-full flex items-center justify-center">
                    <Check size={10} className="text-white" />
                  </span>
                )}
              </div>

              <p className="text-[11px] text-[#848E9C] truncate">
                {user.email}
              </p>

              <div className="flex items-center gap-2 text-[11px] text-[#848E9C]">
                <span>ID: {shortId}</span>
                <button onClick={() => copyText(user.publicId)}>
                  {copiedId ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
            </div>

          </div>

          {/* SALDO + BOTÕES */}
          <div className="mt-4 border-t border-[#2B3139] pt-4 flex items-center justify-between gap-4">

            {/* SALDO */}
            <div>
              <p className="text-[11px] text-[#848E9C]">
                Saldo disponível
              </p>

              <p className="text-lg font-semibold mt-1 whitespace-nowrap">
                {formatCurrencyAOA(user.balance)}
              </p>

              <p className="text-[11px] text-[#848E9C] mt-1">
                {accountLevel} • {accountLimit}
              </p>
            </div>

            {/* BOTÕES EMPILHADOS (SOLUÇÃO ESTÁVEL) */}
            <div className="flex flex-col gap-2 w-[110px]">

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

        {/* SESSÕES */}
        <div className="flex-1 flex flex-col">

          <p className="text-sm text-[#848E9C] mb-4">
            MINHAS SESSÕES
          </p>

          <div className="grid grid-cols-3 gap-3 flex-1">

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

        {/* LOGOUT FIXO */}
        <div className="flex justify-center pb-2">
          <button
            onClick={handleLogout}
            className="text-xs text-[#848E9C] hover:text-white transition"
          >
            Encerrar sessão
          </button>
        </div>

      </div>

    </div>
  )
}

/* COMPONENTES */

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
      className="w-full bg-[#0F1419] border border-[#2B3139] hover:bg-[#2B3139] px-2 py-1.5 rounded-lg text-[11px] flex items-center justify-center gap-1 transition"
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
      className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:bg-[#2B3139] transition"
    >
      <div className="w-8 h-8 rounded-full bg-[#0B0E11] flex items-center justify-center text-[#FCD535]">
        {icon}
      </div>

      <span className="text-[11px] text-[#EAECEF] text-center">
        {label}
      </span>
    </button>
  )
}