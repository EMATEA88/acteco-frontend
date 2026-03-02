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
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] pb-24">

      {/* ================= TOP MARQUEE ================= */}
      <div className="w-full overflow-hidden bg-[#0F1419] border-b border-[#1E2329]">
        <div className="whitespace-nowrap animate-marquee py-2 text-emerald-400 text-[12px] tracking-wide font-medium">
          <span className="mx-8">
            A empresa EMATEA tem a missão de oferecer soluções tecnológicas, financeiras e comerciais inovadoras, promovendo crescimento sustentável e confiança no mercado.
          </span>
          <span className="mx-8">
            A empresa EMATEA tem a missão de oferecer soluções tecnológicas, financeiras e comerciais inovadoras, promovendo crescimento sustentável e confiança no mercado.
          </span>
        </div>
      </div>

      {/* ================= PROFILE CARD ================= */}
      <div className="bg-[#1E2329] px-6 py-6 rounded-3xl mt-3 shadow-[0_15px_40px_rgba(0,0,0,0.45)]">

        <div className="flex items-center gap-4">

          {/* LOGO + LINK KYC */}
          <div className="flex flex-col items-center">

            <div className="w-14 h-14 rounded-full overflow-hidden border border-[#2B3139]">
              <img src="/logo.png" className="w-full h-full object-cover" />
            </div>

            {showVerifyLink && (
              <>
                {user.kycStatus === 'PENDING' ? (
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
                )}
              </>
            )}

          </div>

          <div className="flex-1 min-w-0">

            <div className="flex items-center gap-2 min-w-0">
              <p className="text-lg font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis">
                {user.fullName || user.phone}
              </p>

              {user.isVerified && (
                <span className="bg-emerald-600 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-white" />
                </span>
              )}
            </div>

            <p className="text-xs text-[#848E9C] mt-1 truncate">
              {user.email}
            </p>

            <div className="flex items-center gap-2 text-xs text-[#848E9C] mt-1">
              <span>ID: {shortId}</span>
              <button onClick={() => copyText(user.publicId)}>
                {copiedId ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            <p className="text-[11px] text-[#848E9C] mt-1">
              Criada em {new Date(user.createdAt).toLocaleDateString('pt-AO')}
            </p>

          </div>

        </div>

        {/* SALDO + BOTÕES REORDENADOS */}
        <div className="mt-6 border-t border-[#2B3139] pt-4 flex flex-col gap-4">

          <div>
            <p className="text-[11px] text-[#848E9C]">
              Saldo disponível
            </p>

            <p className="text-2xl font-semibold mt-1 whitespace-nowrap">
              {formatCurrencyAOA(user.balance)}
            </p>
          </div>

          {/* BOTÕES AGORA VÊM ANTES DO NÍVEL/LIMITE */}
          <div className="flex gap-2 flex-wrap">

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

          {/* NÍVEL E LIMITE AGORA ABAIXO DOS BOTÕES */}
          <div className="text-[11px] text-[#848E9C] space-y-1">
            <p>Nível: <span className="text-white">{accountLevel}</span></p>
            <p>Limite: <span className="text-white">{accountLimit}</span></p>
          </div>

        </div>

      </div>

      {/* ================= SESSÕES ================= */}
      <div className="px-6 mt-10">

        <p className="text-sm text-[#848E9C] mb-6 tracking-wide">
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
          className="text-xs text-[#848E9C] hover:text-white transition"
        >
          Encerrar sessão
        </button>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          display: inline-block;
          animation: marquee 22s linear infinite;
        }
      `}</style>

    </div>
  )
}

/* ================= COMPONENTES ================= */

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
      className="bg-[#1E2329] border border-[#2B3139] hover:bg-[#2B3139] px-3 py-1.5 rounded-lg text-[11px] flex items-center gap-1.5 transition"
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
      className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-[#2B3139] transition"
    >
      <div className="w-9 h-9 rounded-full bg-[#0B0E11] flex items-center justify-center text-[#FCD535]">
        {icon}
      </div>

      <span className="text-[11px] text-[#EAECEF]">
        {label}
      </span>
    </button>
  )
}