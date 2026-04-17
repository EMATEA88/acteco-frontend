import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  LockKey, 
  CheckCircle, 
  WarningCircle, 
  ShieldCheck, 
  ShieldPlus,
  Key
} from '@phosphor-icons/react'
import { PasswordService } from '../services/password.service'

export default function Password() {
  const navigate = useNavigate()

  const [loginCurrent, setLoginCurrent] = useState('')
  const [loginNew, setLoginNew] = useState('')
  const [loginOtp, setLoginOtp] = useState('')

  const [withdrawCurrent, setWithdrawCurrent] = useState('')
  const [withdrawNew, setWithdrawNew] = useState('')
  const [withdrawOtp, setWithdrawOtp] = useState('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  function showError(text: string) { setMessage({ type: 'error', text }) }
  function showSuccess(text: string) { setMessage({ type: 'success', text }) }

  async function handleLoginPasswordChange() {
    setMessage(null)
    if (!loginCurrent || !loginNew || !loginOtp) return showError('Preencha todos os campos e o OTP')
    if (loginNew.length < 6) return showError('A nova senha deve ter pelo menos 6 caracteres')

    try {
      setLoading(true)
      await PasswordService.changeLoginPassword({
        currentPassword: loginCurrent,
        newPassword: loginNew,
        otp: loginOtp
      })
      showSuccess('Senha de login atualizada')
      setLoginCurrent(''); setLoginNew(''); setLoginOtp('')
    } catch (err: any) {
      showError(err?.response?.data?.error ?? 'Erro ao alterar senha')
    } finally { setLoading(false) }
  }

  async function handleWithdrawPasswordChange() {
    setMessage(null)
    if (!withdrawNew || !withdrawOtp) return showError('Informe a nova senha e o OTP')
    
    try {
      setLoading(true)
      await PasswordService.changeWithdrawPassword({
        currentWithdrawPassword: withdrawCurrent || undefined,
        newWithdrawPassword: withdrawNew,
        otp: withdrawOtp
      })
      showSuccess('Senha de levantamento definida')
      setWithdrawCurrent(''); setWithdrawNew(''); setWithdrawOtp('')
    } catch (err: any) {
      showError(err?.response?.data?.error ?? 'Erro ao definir senha')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-green-500/30">
      
      {/* HEADER PREMIUM */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all">
            <ArrowLeft size={20} weight="bold" />
          </button>
          <h1 className="text-xl font-black tracking-tighter uppercase">Credenciais</h1>
        </div>
        <ShieldCheck size={24} weight="fill" className="text-green-500" />
      </header>

      <main className="max-w-xl mx-auto px-6 py-8 pb-32 space-y-8 relative z-10">
        
        {/* FEEDBACK TOAST INTERNO */}
        {message && (
          <div className={`flex items-center gap-3 text-xs font-bold uppercase tracking-wider rounded-2xl p-4 border animate-in fade-in slide-in-from-top-4 ${
            message.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
          }`}>
            {message.type === 'success' ? <CheckCircle size={20} weight="fill" /> : <WarningCircle size={20} weight="fill" />}
            {message.text}
          </div>
        )}

        {/* LOGIN PASSWORD CARD */}
        <section className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldPlus size={80} weight="thin" />
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20 text-green-500">
              <LockKey size={28} weight="duotone" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">Senha de Login</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Acesso à Plataforma</p>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <AuthInput type="password" placeholder="Senha Atual" value={loginCurrent} onChange={setLoginCurrent} />
            <AuthInput type="password" placeholder="Nova Senha" value={loginNew} onChange={setLoginNew} />
            <AuthInput type="text" placeholder="Código OTP (E-mail)" value={loginOtp} onChange={setLoginOtp} />
            
            <PrimaryButton onClick={handleLoginPasswordChange} loading={loading}>
              Atualizar Senha de Acesso
            </PrimaryButton>
          </div>
        </section>

        {/* WITHDRAW PASSWORD CARD */}
        <section className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Key size={80} weight="thin" />
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-500">
              <Key size={28} weight="duotone" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">Senha de Levantamento</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Segurança de Saques</p>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <AuthInput type="password" placeholder="Senha de Saque Atual" value={withdrawCurrent} onChange={setWithdrawCurrent} />
            <AuthInput type="password" placeholder="Nova Senha de Saque" value={withdrawNew} onChange={setWithdrawNew} />
            <AuthInput type="text" placeholder="Código OTP" value={withdrawOtp} onChange={setWithdrawOtp} />
            
            <PrimaryButton onClick={handleWithdrawPasswordChange} loading={loading}>
              Definir Senha de Saque
            </PrimaryButton>
          </div>
        </section>

      </main>
    </div>
  )
}

/* ================= COMPONENTES AUXILIARES ================= */

function AuthInput({ type, placeholder, value, onChange }: any) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full h-14 rounded-2xl bg-[#0a0a0a] border border-white/5 px-6 text-sm text-white placeholder:text-gray-700 focus:border-green-500/40 focus:ring-4 focus:ring-green-500/5 outline-none transition-all font-medium"
    />
  )
}

function PrimaryButton({ children, onClick, loading }: any) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full h-14 rounded-2xl font-bold bg-white text-black hover:bg-green-500 hover:text-white transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl mt-2"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : children}
    </button>
  )
}