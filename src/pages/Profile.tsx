import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserService } from '../services/user.service'
import { formatCurrencyAOA } from "../utils/formatCurrency"

import {
  Wallet,
  ArrowDown,
  Bank,
  ArrowsLeftRight,
  Gift,
  ShieldCheck,
  LockKey,
  Copy,
  DownloadSimple,
  SignOut,
  CaretRight
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

  const showVerifyLink =
    !user.isVerified && user.kycStatus !== 'APPROVED'

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

      <div className="flex-1 px-5 pt-4 flex flex-col gap-5">

        {/* ================= PROFILE CARD (ANTIGO INTEGRADO) ================= */}
        <div className="
          rounded-3xl
          p-5
          bg-gradient-to-br from-[#1E2329] to-[#14181D]
          border border-[#2B3139]
          shadow-[0_12px_30px_rgba(0,0,0,0.6)]
        ">

          <div className="flex items-center gap-4">

            <div className="flex flex-col items-center">

              <div className="
                w-14 h-14
                rounded-full
                overflow-hidden
                border border-[#2B3139]
                transition duration-300
                hover:scale-105
                hover:shadow-[0_0_10px_rgba(252,213,53,0.35)]
              ">
                <img src="/logo.png" className="w-full h-full object-cover" />
              </div>

              {showVerifyLink && (
                user.kycStatus === 'PENDING' ? (
                  <span className="text-[11px] text-[#FCD535] mt-1">
                    Em análise
                  </span>
                ) : (
                  <button
                    onClick={() => navigate('/kyc')}
                    className="text-[11px] text-[#FCD535] mt-1 hover:underline"
                  >
                    Verificar
                  </button>
                )
              )}

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

          {/* SALDO + BOTÕES (ORIGINAL) */}
          <div className="mt-5 border-t border-[#2B3139] pt-4 flex justify-between items-center gap-4">

            <div>
              <p className="text-[11px] text-[#848E9C] uppercase tracking-widest">
                Saldo disponível
              </p>
              <p className="text-xl font-semibold mt-1 whitespace-nowrap">
                {formatCurrencyAOA(user.balance)}
              </p>
              <p className="text-[11px] text-[#848E9C] mt-1">
                {accountLevel} • {accountLimit}
              </p>
            </div>

            <div className="flex flex-col gap-2 w-[120px]">
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

        {/* ================= SESSÕES PREMIUM ================= */}
        <div className="flex-1 flex flex-col">

          <p className="text-sm text-[#848E9C] mb-4 tracking-wide">
            MINHAS SESSÕES
          </p>

          <div className="grid grid-cols-2 gap-4">

            <SessionItem label="Banco" sub="Conta & Dados" icon={<Bank size={18} weight="fill" />} onClick={() => navigate('/bank')} />
            <SessionItem label="Transações" sub="Histórico geral" icon={<ArrowsLeftRight size={18} weight="fill" />} onClick={() => navigate('/transactions')} />
            <SessionItem label="Presente" sub="Bônus & Prêmios" icon={<Gift size={18} weight="fill" />} onClick={() => navigate('/gift')} />
            <SessionItem label="Segurança" sub="Proteção da conta" icon={<ShieldCheck size={18} weight="fill" />} onClick={() => navigate('/security')} />
            <SessionItem label="Senha" sub="Alterar acesso" icon={<LockKey size={18} weight="fill" />} onClick={() => navigate('/password')} />
            <SessionItem label="Aplicações" sub="Ferramentas" icon={<DownloadSimple size={18} weight="fill" />} onClick={() => navigate('/applications')} />

          </div>

        </div>

        {/* LOGOUT */}
        <div className="flex justify-center pb-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-red-400 hover:text-red-500 transition"
          >
            <SignOut size={14} weight="bold" />
            Sair da conta
          </button>
        </div>

      </div>
    </div>
  )
}

/* COMPONENTES */

function SmallAction({ label, icon, onClick }: any) {
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

function SessionItem({ label, sub, icon, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="
        flex items-center gap-3
        p-4
        rounded-2xl
        bg-gradient-to-br from-[#1E2329] to-[#14181D]
        border border-[#2B3139]
        shadow-[0_6px_18px_rgba(0,0,0,0.6)]
        hover:-translate-y-1
        transition-all
      "
    >
      <div className="w-10 h-10 rounded-xl bg-[#0B0E11] flex items-center justify-center text-[#FCD535]">
        {icon}
      </div>

      <div className="flex-1 text-left">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-[11px] text-[#848E9C]">{sub}</p>
      </div>

      <CaretRight size={16} className="text-[#848E9C]" />
    </button>
  )
}