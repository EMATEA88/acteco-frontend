import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserService } from '../services/user.service'
import { 
  ArrowLeft, 
  DeviceMobile, 
  MapPin, 
  Envelope, 
  ShieldCheck, 
  CheckCircle,
  IdentificationCard,
  PaperPlaneTilt,
  CircleNotch
} from '@phosphor-icons/react'
import { toast } from 'sonner'

export default function Settings() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [showOtpField, setShowOtpField] = useState(false)
  const [originalEmail, setOriginalEmail] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    country: 'Angola',
    province: '',
    neighborhood: '',
    bio: '',
    otp: ''
  })

  useEffect(() => {
    async function load() {
      try {
        const res = await UserService.me()
        const userData = res.data
        setForm({
          fullName: userData.fullName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          country: userData.country || 'Angola',
          province: userData.province || '',
          neighborhood: userData.neighborhood || '',
          bio: userData.bio || '',
          otp: ''
        })
        setOriginalEmail(userData.email)
      } catch {
        toast.error('Erro ao sincronizar dados do protocolo')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleRequestOTP() {
    try {
      setSendingOtp(true)
      await UserService.requestEmailChangeOTP()
      toast.success('Código de segurança enviado para o seu e-mail atual')
      setShowOtpField(true)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Falha ao enviar código')
    } finally {
      setSendingOtp(false)
    }
  }

  async function handleSave() {
    try {
      setSaving(true)
      const emailChanged = form.email !== originalEmail

      if (emailChanged && !form.otp) {
        toast.error('Deve validar a alteração de e-mail com o código OTP')
        setShowOtpField(true)
        return
      }

      await UserService.updateProfile(form)
      toast.success('Protocolo de identidade atualizado')
      if (emailChanged) toast.info('Lockdown de segurança de 24h ativado', { duration: 6000 })
      navigate('/profile')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao guardar definições')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
      <CircleNotch size={40} weight="bold" className="text-green-500 animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Acessando Arquivos...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 pt-12 pb-28 font-sans selection:bg-green-500/30">
      
      <div className="flex items-center gap-4 mb-10 max-w-xl mx-auto">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all active:scale-90">
          <ArrowLeft size={20} weight="bold" />
        </button>
        <div>
          <h1 className="text-xl font-black tracking-tight uppercase italic">Definições</h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Protocolo de Identidade</p>
        </div>
      </div>

      <div className="space-y-6 max-w-xl mx-auto">
        <div className="bg-orange-500/5 border border-orange-500/20 p-5 rounded-[2rem] flex items-start gap-4">
          <ShieldCheck size={28} weight="duotone" className="text-orange-500 shrink-0" />
          <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
            <span className="text-orange-500 font-bold uppercase tracking-wider">Aviso de Lockdown:</span> Alterar o e-mail suspende movimentações financeiras por <span className="text-white">24 horas</span>.
          </p>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 mb-4 border-b border-white/5 pb-2">Identidade Civil</h2>
          
          <SettingsInput 
            icon={<IdentificationCard size={20} weight="duotone" />} 
            label="Nome Completo" 
            value={form.fullName} 
            onChange={(v: string) => setForm({...form, fullName: v})} 
          />

          <div className="space-y-3">
            <div className="relative">
                <SettingsInput 
                icon={<Envelope size={20} weight="duotone" />} 
                label="Endereço de E-mail" 
                value={form.email} 
                onChange={(v: string) => setForm({...form, email: v})} 
                />
                {form.email !== originalEmail && (
                    <button 
                        onClick={handleRequestOTP}
                        disabled={sendingOtp}
                        className="absolute right-4 bottom-3 text-[10px] font-black uppercase text-green-500 hover:text-white transition-all flex items-center gap-1.5"
                    >
                        {sendingOtp ? 'Enviando...' : 'Pedir OTP'}
                        <PaperPlaneTilt size={14} weight="bold" />
                    </button>
                )}
            </div>

            {showOtpField && (
              <div className="animate-in fade-in slide-in-from-top-2">
                 <input 
                  placeholder="DIGITE O CÓDIGO DE 6 DÍGITOS" 
                  className="w-full h-14 bg-green-500/5 border border-green-500/20 rounded-2xl px-6 text-xs font-black tracking-[0.3em] text-green-500 outline-none placeholder:text-green-900/50 text-center"
                  value={form.otp}
                  maxLength={6}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, otp: e.target.value})}
                />
              </div>
            )}
          </div>

          <SettingsInput 
            icon={<DeviceMobile size={20} weight="duotone" />} 
            label="Telefone Contacto" 
            value={form.phone} 
            onChange={(v: string) => setForm({...form, phone: v})} 
          />
        </div>

        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 mb-4 border-b border-white/5 pb-2">Residência & Social</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <SettingsInput label="País" value={form.country} onChange={(v: string) => setForm({...form, country: v})} />
            <SettingsInput label="Província" value={form.province} onChange={(v: string) => setForm({...form, province: v})} />
          </div>

          <SettingsInput label="Bairro" value={form.neighborhood} onChange={(v: string) => setForm({...form, neighborhood: v})} />
          <SettingsInput icon={<MapPin size={20} weight="duotone" />} label="Morada Completa" value={form.address} onChange={(v: string) => setForm({...form, address: v})} />
          
          <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Biografia Profissional</label>
            <textarea 
              value={form.bio}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({...form, bio: e.target.value})}
              className="w-full bg-[#0a0a0a] border border-white/5 rounded-[1.5rem] p-5 text-xs font-medium text-white min-h-[120px] outline-none focus:border-green-500/30 transition-all resize-none shadow-inner"
              placeholder="Escreva sobre a sua trajetória..."
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-16 rounded-[2rem] bg-white text-black font-black text-sm uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all active:scale-95 disabled:opacity-20 flex items-center justify-center gap-3 shadow-2xl mb-10"
        >
          {saving ? <CircleNotch size={24} className="animate-spin" /> : <>Guardar Protocolo <CheckCircle size={22} weight="fill" /></>}
        </button>
      </div>
    </div>
  )
}

// 🟢 Tipando o componente interno para aceitar o v como string
function SettingsInput({ label, value, onChange, icon }: { label: string, value: string, onChange: (v: string) => void, icon?: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1 flex items-center gap-2">
        {icon} {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="w-full h-14 bg-[#0a0a0a] border border-white/5 rounded-2xl px-6 text-sm font-medium text-white outline-none focus:border-green-500/30 transition-all shadow-inner"
      />
    </div>
  )
}