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
  Wallet,
  SealCheck,
  WarningCircle,
  Clock
} from '@phosphor-icons/react'

type User = {
  fullName?: string
  phone: string
  email: string
  publicId: string
  balance: number
  kycStatus: 'NONE' | 'PENDING' | 'VERIFIED' | 'REJECTED' 
}

export default function Profile() {
  const navigate = useNavigate()

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await UserService.me()
      // Ajuste de tipagem para evitar erro de verificação do TS
      return res.data as any as User
    },
    staleTime: 1000 * 60 * 5
  })

  if (isLoading) return <SkeletonPage title="Carregando perfil..." />
  if (!user) return null

  const isVerified = user.kycStatus === 'VERIFIED'

  return (
    <div className="min-h-screen w-screen text-white flex flex-col bg-[#0B0E11]">
      <div className="flex-1 px-5 pt-10 pb-32 flex flex-col gap-6 font-normal">

        {/* HEADER */}
        <div className="bg-[#161A1F] p-6 rounded-[2.5rem] relative border border-white/5 shadow-2xl">
          
          <button 
            onClick={() => navigate('/settings')}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 border border-white/10 text-emerald-500 hover:scale-110 transition-transform"
          >
            <UserCircleGear size={22} weight="fill" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-white/10 overflow-hidden bg-[#0B0E11] p-1 shadow-inner">
              <img 
                src="/logo.png" 
                className="w-full h-full object-contain rounded-full" 
                alt="Logo" 
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-lg font-medium tracking-tight uppercase">
                  {user.fullName ?? user.phone}
                </h1>

                {isVerified && (
                  <SealCheck 
                    size={18} 
                    weight="fill" 
                    className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]" 
                  />
                )}
              </div>
              
              <p className="text-gray-500 text-xs font-medium">{user.email}</p>

              {/* LINK DE VERIFICAÇÃO */}
              <div className="mt-2">
                {user.kycStatus !== 'VERIFIED' && user.kycStatus !== 'PENDING' ? (
                  <button 
                    onClick={() => navigate('/kyc')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500/20 transition-all active:scale-95 shadow-sm"
                  >
                    <WarningCircle size={14} weight="fill" />
                    Verificar Agora
                  </button>
                ) : user.kycStatus === 'PENDING' && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[10px] font-black text-yellow-500 uppercase tracking-widest animate-pulse">
                    <Clock size={14} weight="fill" />
                    Em Auditoria
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-3">
                <span className="text-[10px] text-gray-600 font-mono tracking-wider">
                  ID: {user.publicId}
                </span>
                <button 
                  onClick={() => navigator.clipboard.writeText(user.publicId)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <Copy size={14} className="text-emerald-500" />
                </button>
              </div>
            </div>
          </div>

          {/* ÁREA DE SALDO */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">
                Saldo Disponível
              </p>
              <span className="text-2xl font-normal tracking-tight text-emerald-500">
                {formatCurrencyAOA(user.balance)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/deposit')} className="flex flex-col items-center gap-1 group">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-all shadow-inner">
                  <Wallet size={18} />
                </div>
                <span className="text-[9px] font-bold uppercase text-gray-500 group-hover:text-gray-300">Depósito</span>
              </button>

              <button onClick={() => navigate('/withdraw')} className="flex flex-col items-center gap-1 group">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white group-hover:bg-red-500/20 group-hover:text-red-400 transition-all shadow-inner">
                  <ArrowDown size={18} />
                </div>
                <span className="text-[9px] font-bold uppercase text-gray-500 group-hover:text-gray-300">Saque</span>
              </button>
            </div>
          </div>
        </div>

        {/* TERMINAL DE OPERAÇÕES */}
        <div>
          <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-4 ml-2 font-mono">
            Terminal de Operações
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <SessionCard label="Banco" sub="Conta & Dados" icon={<Bank size={20} />} to="/bank" />
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
          className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-500/60 hover:text-red-500 mt-6 transition-colors"
        >
          <SignOut size={16} weight="bold" /> Sair da conta
        </button>

      </div>
    </div>
  )
}

function SessionCard({ label, sub, icon, to }: any) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(to)}
      className="bg-[#161A1F] flex items-center gap-3 p-4 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-[#1c2127] transition-all duration-300 group shadow-lg"
    >
      <div className="w-10 h-10 rounded-full bg-[#0B0E11] flex items-center justify-center border border-white/5 text-gray-400 group-hover:text-emerald-500 transition-colors shadow-inner">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className="text-[13px] font-medium tracking-tight text-gray-200">{label}</p>
        <p className="text-[9px] text-gray-600 font-medium">{sub}</p>
      </div>
      <CaretRight size={14} className="text-gray-700 group-hover:text-gray-400 transition-colors" />
    </button>
  )
}