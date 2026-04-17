import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserService } from '../services/user.service'
import { formatCurrencyAOA } from "../utils/formatCurrency"
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
  SealCheck,
  WarningCircle,
  CircleNotch,
  ArrowUp
} from '@phosphor-icons/react'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    let isMounted = true
    async function load() {
      try {
        setLoading(true)
        const userRes = await UserService.me()
        if (isMounted) {
          setUser(userRes.data)
        }
      } catch (err) {
        console.error("Erro ao carregar perfil", err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => { isMounted = false }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <CircleNotch size={40} weight="bold" className="text-green-500 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
          Sincronizando Protocolo...
        </p>
      </div>
    )
  }

  if (!user) return null

  const shortId = user.publicId?.slice(0, 8)
  const accountLevel = user.isVerified ? 'Premium' : 'Basic'

  async function copyText(value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2500)
    } catch (err) {
      console.error("Erro ao copiar", err)
    }
  }

  function handleLogout() {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-green-500/30 overflow-x-hidden">
      
      {/* TOAST PREMIUM */}
      <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
        <div className="bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <SealCheck size={24} weight="fill" className="text-blue-500" />
          <span className="text-sm font-bold tracking-tight">ID copiado com sucesso!</span>
        </div>
      </div>

      <div className="flex-1 px-5 pt-8 pb-32 flex flex-col gap-6 max-w-xl mx-auto w-full">

        {/* PROFILE HEADER - NOME COMPLETO AJUSTADO */}
        <div className="flex flex-col gap-5 bg-[#111] p-6 rounded-[2.5rem] border border-white/5 shadow-xl relative overflow-hidden">
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-16 h-16 rounded-full border-2 border-white/5 overflow-hidden bg-[#0a0a0a] flex items-center justify-center shrink-0">
              <img 
                src="/logo.png" 
                className="w-full h-full object-cover" 
                alt="Profile" 
              />
            </div>

            <div className="flex-1 pt-1">
              <div className="flex items-start gap-1.5 flex-wrap">
                <h1 className="text-xl font-black tracking-tight leading-tight uppercase italic break-words">
                  {user.fullName || user.phone}
                </h1>
                {user.isVerified && (
                  <SealCheck size={20} weight="fill" className="text-[#0084ff] mt-0.5" />
                )}
              </div>
              
              <div className="flex items-center gap-2 text-gray-500 text-[10px] mt-1.5">
                <span className="font-mono tracking-widest bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">ID: {shortId}</span>
                <button onClick={() => copyText(user.publicId)} className="text-green-500 hover:text-green-400 p-1 active:scale-90">
                   <Copy size={16} />
                </button>
              </div>
            </div>
            
            <button 
                onClick={() => navigate('/settings')} 
                className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-green-500 border border-white/5 shadow-lg active:scale-90"
            >
              <UserCircleGear size={24} weight="duotone" />
            </button>
          </div>

          {!user.isVerified && (
            <button 
              onClick={() => navigate('/kyc')}
              className="flex items-center justify-between w-full bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl group hover:bg-orange-500/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <WarningCircle size={24} weight="fill" className="text-orange-500" />
                <div className="text-left">
                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-wider">Verificação de Identidade Pendente</p>
                  <p className="text-[9px] font-bold text-gray-500 uppercase">Remova os limites da sua conta agora</p>
                </div>
              </div>
              <CaretRight size={18} weight="bold" className="text-orange-500" />
            </button>
          )}
        </div>

        {/* WALLET CARD - NOVOS BOTÕES PROFISSIONAIS */}
        <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] rounded-[2.8rem] p-8 border border-white/5 shadow-2xl">
          <div className="text-center mb-8">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 mb-2 italic">Saldo Disponível</p>
            <h2 className="text-4xl font-black tracking-tighter italic text-white">
              {formatCurrencyAOA(user.balance)}
            </h2>
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
              <div className={`w-1.5 h-1.5 rounded-full ${user.isVerified ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 'bg-gray-500'}`} />
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{accountLevel} ACCOUNT</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/deposit')} 
              className="flex flex-col items-center justify-center gap-2 bg-white text-black h-20 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5"
            >
              <ArrowUp size={24} weight="bold" />
              Depositar
            </button>

            <button 
              onClick={() => navigate('/withdraw')} 
              className="flex flex-col items-center justify-center gap-2 bg-[#1a1a1a] text-white h-20 rounded-3xl border border-white/10 font-black text-[10px] uppercase tracking-widest hover:border-green-500/50 transition-all active:scale-95"
            >
              <ArrowDown size={24} weight="bold" />
              Levantar
            </button>
          </div>
        </div>

        {/* SESSÕES GRID */}
        <div className="space-y-4">
          <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] ml-2 font-mono">Terminal de Operações</p>
          
          <div className="grid grid-cols-2 gap-3">
            <SessionCard label="Bancos" sub="Meios de Saque" icon={<Bank size={28} weight="duotone" />} onClick={() => navigate('/bank')} />
            <SessionCard label="Histórico" sub="Relatórios" icon={<ArrowsLeftRight size={28} weight="duotone" />} onClick={() => navigate('/transactions')} />
            <SessionCard label="Brindes" sub="Recompensas" icon={<Gift size={28} weight="duotone" />} onClick={() => navigate('/gift')} />
            <SessionCard label="Segurança" sub="Central de Risco" icon={<ShieldCheck size={28} weight="duotone" />} onClick={() => navigate('/security')} />
            <SessionCard label="Acesso" sub="Credenciais" icon={<LockKey size={28} weight="duotone" />} onClick={() => navigate('/password')} />
            <SessionCard label="Apps" sub="Download Mobile" icon={<DownloadSimple size={28} weight="duotone" />} onClick={() => navigate('/applications')} />
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full py-5 mt-4 flex items-center justify-center gap-3 text-[10px] font-black tracking-[0.3em] text-red-500 hover:text-white transition-all border border-red-500/20 rounded-[2rem] bg-red-500/5 hover:bg-red-500 shadow-xl"
        >
          <SignOut size={20} weight="bold" />
          TERMINAR SESSÃO NO SISTEMA
        </button>

      </div>
    </div>
  )
}

function SessionCard({ label, sub, icon, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-4 p-6 rounded-[2.5rem] bg-[#111] border border-white/5 hover:border-green-500/20 transition-all group active:scale-[0.96] shadow-xl"
    >
      <div className="w-14 h-14 rounded-2xl bg-[#0a0a0a] flex items-center justify-center text-green-500 border border-white/5 group-hover:bg-green-500/10 transition-all">
        {icon}
      </div>

      <div className="text-left">
        <p className="text-[14px] font-black text-white tracking-tight italic uppercase leading-none mb-1">{label}</p>
        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter opacity-70">{sub}</p>
      </div>
    </button>
  )
}