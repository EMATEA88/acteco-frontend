import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { UserService } from '../services/user.service'
import { formatCurrencyAOA } from "../utils/formatCurrency"
import { SkeletonPage } from "../components/ui/Skeleton"

import {
  ArrowDown,
  Bank,
  ArrowsLeftRight,
  Gift,
  ShieldCheck,
  LockKey,
  Copy,
  DownloadSimple,
  SignOut,
  CaretRight,
  UserCircleGear,
  Wallet
} from '@phosphor-icons/react'

type User = {
  fullName?: string
  phone: string
  email: string
  publicId: string
  balance: number
}

export default function Profile() {
  const navigate = useNavigate()

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await UserService.me()
      return res.data as User
    },
    staleTime: 1000 * 60 * 5
  })

  if (isLoading) return <SkeletonPage title="Carregando perfil..." />
  if (!user) return null

  return (
    <div className="min-h-screen w-screen text-white flex flex-col bg-[#0B0E11]">
      
      <div className="flex-1 px-5 pt-10 pb-32 flex flex-col gap-6">

        {/* HEADER */}
        <div className="glass-card p-6 rounded-[2rem] relative">
          
          <button 
            onClick={() => navigate('/settings')}
            className="absolute top-6 right-6 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500"
          >
            <UserCircleGear size={24} weight="fill" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border border-white/20 overflow-hidden bg-white/10">
              <img src="/logo.png" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1">
              <h1 className="text-lg font-semibold">
                {user.fullName ?? user.phone}
              </h1>

              <p className="text-gray-400 text-xs">{user.email}</p>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-gray-500 font-mono">
                  ID: {user.publicId}
                </span>
                <Copy
                  size={14}
                  className="text-emerald-500 cursor-pointer"
                  onClick={() => navigator.clipboard.writeText(user.publicId)}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-500 mb-1">
                Saldo Disponível
              </p>
              <span className="text-2xl font-semibold">
                {formatCurrencyAOA(user.balance)}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <button 
                onClick={() => navigate('/deposit')} 
                className="glass-button px-6 py-2 text-xs flex items-center gap-2 bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
              >
                <Wallet size={16} /> Recarregar
              </button>

              <button 
                onClick={() => navigate('/withdraw')} 
                className="glass-button px-6 py-2 text-xs flex items-center gap-2 bg-rose-500/10 border-rose-500/20 text-rose-400"
              >
                <ArrowDown size={16} /> Retirar
              </button>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div>
          <h3 className="text-[11px] font-semibold text-gray-500 uppercase mb-4">
            Terminal
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <SessionCard label="Banco" sub="Conta" icon={<Bank size={20} />} to="/bank" />
            <SessionCard label="Transações" sub="Histórico" icon={<ArrowsLeftRight size={20} />} to="/transactions" />
            <SessionCard label="Presente" sub="Bônus" icon={<Gift size={20} />} to="/gift" />
            <SessionCard label="Segurança" sub="Proteção" icon={<ShieldCheck size={20} />} to="/security" />
            <SessionCard label="Senha" sub="Alterar" icon={<LockKey size={20} />} to="/password" />
            <SessionCard label="Aplicações" sub="Ferramentas" icon={<DownloadSimple size={20} />} to="/applications" />
          </div>
        </div>

        <button
          onClick={() => { 
            localStorage.clear()
            navigate('/login')
          }}
          className="flex items-center justify-center gap-2 text-xs text-red-400 mt-6"
        >
          <SignOut size={18} /> Sair da conta
        </button>

      </div>
    </div>
  )
}

/* =========================
   CARD
========================= */
function SessionCard({ label, sub, icon, to }: any) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(to)}
      className="glass-card flex items-center gap-3 p-4 rounded-xl border border-white/5 hover:border-white/10 transition"
    >
      <div className="w-10 h-10 rounded-xl bg-[#0B0E11] flex items-center justify-center border border-white/5">
        {icon}
      </div>

      <div className="flex-1 text-left">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-[10px] text-gray-500">{sub}</p>
      </div>

      <CaretRight size={14} className="text-gray-600" />
    </button>
  )
}