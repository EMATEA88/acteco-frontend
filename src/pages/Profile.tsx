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
  CaretRight,
  UserCircleGear,
  SealCheck,
  WarningCircle,
  CircleNotch // Certifique-se que @phosphor-icons/react está na v2.0+
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

  // 🟢 FEEDBACK VISUAL DE CARREGAMENTO PADRONIZADO
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

        {/* PROFILE HEADER */}
        <div className="flex flex-col gap-5 bg-[#111] p-6 rounded-[2.5rem] border border-white/5 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-white/5 overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  className="w-full h-full object-cover rounded-full" 
                  alt="Profile" 
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-black tracking-tight truncate">
                  {user.fullName || user.phone}
                </h1>
                {user.isVerified && (
                  <SealCheck size={22} weight="fill" className="text-[#0084ff] flex-shrink-0" />
                )}
              </div>
              
              <div className="flex items-center gap-2 text-gray-500 text-xs mt-0.5">
                <span className="font-mono tracking-tighter">ID: {shortId}</span>
                <button onClick={() => copyText(user.publicId)} className="text-green-500 hover:text-green-400 transition-colors p-1 active:scale-90">
                   <Copy size={16} />
                </button>
              </div>
            </div>
            
            <button 
                onClick={() => navigate('/settings')} 
                className="p-2.5 bg-white/5 rounded-full text-gray-400 hover:text-green-500 hover:bg-green-500/10 transition-all active:scale-90 border border-transparent hover:border-green-500/20 shadow-lg"
            >
              <UserCircleGear size={26} weight="duotone" />
            </button>
          </div>

          {!user.isVerified && (
            <button 
              onClick={() => navigate('/kyc')}
              className="flex items-center justify-between w-full bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl group hover:bg-orange-500/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <WarningCircle size={28} weight="fill" className="text-orange-500" />
                <div className="text-left">
                  <p className="text-xs font-black text-orange-500 uppercase tracking-wider">Conta não verificada</p>
                  <p className="text-[10px] font-bold text-gray-400">Verifique agora para remover limites</p>
                </div>
              </div>
              <CaretRight size={18} weight="bold" className="text-orange-500 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* WALLET CARD */}
        <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-1 italic">Capital Total</p>
            <h2 className="text-4xl font-black tracking-tighter italic mb-8">
              {formatCurrencyAOA(user.balance)}
            </h2>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Nível de Acesso</span>
                <span className={`text-xs font-black uppercase tracking-tighter ${user.isVerified ? 'text-blue-500' : 'text-gray-500'}`}>
                  {accountLevel}
                </span>
              </div>
              
              <div className="flex gap-3">
                <button onClick={() => navigate('/deposit')} className="bg-white text-black h-12 w-12 rounded-2xl hover:bg-green-500 hover:text-white transition-all flex items-center justify-center shadow-lg active:scale-90">
                  <Wallet size={26} weight="fill" />
                </button>
                <button onClick={() => navigate('/withdraw')} className="bg-[#1a1a1a] text-white h-12 w-12 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex items-center justify-center active:scale-90">
                  <ArrowDown size={26} weight="fill" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SESSÕES GRID */}
        <div className="space-y-4">
          <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] ml-2 font-mono">Operations Console</p>
          
          <div className="grid grid-cols-2 gap-3">
            <SessionCard label="Bancos" sub="Saques & Dados" icon={<Bank size={28} weight="duotone" />} onClick={() => navigate('/bank')} />
            <SessionCard label="Histórico" sub="Movimentos" icon={<ArrowsLeftRight size={28} weight="duotone" />} onClick={() => navigate('/transactions')} />
            <SessionCard label="Brindes" sub="Ganhar Bónus" icon={<Gift size={28} weight="duotone" />} onClick={() => navigate('/gift')} />
            <SessionCard label="Segurança" sub="Proteger Conta" icon={<ShieldCheck size={28} weight="duotone" />} onClick={() => navigate('/security')} />
            <SessionCard label="Acesso" sub="Alterar Senha" icon={<LockKey size={28} weight="duotone" />} onClick={() => navigate('/password')} />
            <SessionCard label="Apps" sub="Ecossistema" icon={<DownloadSimple size={28} weight="duotone" />} onClick={() => navigate('/applications')} />
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full py-4 mt-4 flex items-center justify-center gap-2 text-[10px] font-black tracking-[0.3em] text-red-500 hover:text-white transition-all border border-red-500/10 rounded-[1.8rem] bg-red-500/5 hover:bg-red-500 shadow-xl"
        >
          <SignOut size={20} weight="bold" />
          ENCERRAR SESSÃO NO TERMINAL
        </button>

      </div>
    </div>
  )
}

function SessionCard({ label, sub, icon, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-4 p-6 rounded-[2.2rem] bg-[#111] border border-white/5 hover:border-green-500/20 transition-all group active:scale-[0.96] shadow-xl"
    >
      <div className="w-14 h-14 rounded-2xl bg-[#0a0a0a] flex items-center justify-center text-green-500 border border-white/5 group-hover:bg-green-500/10 transition-all">
        {icon}
      </div>

      <div className="text-left">
        <p className="text-[14px] font-black text-white tracking-tight italic uppercase">{label}</p>
        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter opacity-70 leading-none">{sub}</p>
      </div>
    </button>
  )
}