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
        const user = res

        setForm({
          fullName: user.fullName || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          country: user.country || 'Angola',
          province: user.province || '',
          neighborhood: user.neighborhood || '',
          bio: user.bio || '',
          otp: ''
        })

        setOriginalEmail(user.email)
      } catch {
        toast.error('Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  async function handleRequestOTP() {
    try {
      setSendingOtp(true)

      if (!form.email) {
        return toast.error("Email inválido")
      }

      await UserService.sendOtp('WITHDRAW', form.email)

      toast.success('Código enviado')
      setShowOtpField(true)

    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao enviar código')
    } finally {
      setSendingOtp(false)
    }
  }

  async function handleSave() {
    try {
      setSaving(true)

      const emailChanged = form.email !== originalEmail

      if (emailChanged && !form.otp) {
        toast.error('Código OTP obrigatório')
        setShowOtpField(true)
        return
      }

      await UserService.updateProfile(form)

      toast.success('Perfil atualizado')

      if (emailChanged) {
        toast.info('Movimentos bloqueados por 24h')
      }

      navigate('/profile')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe] px-6 pt-10 pb-32 font-sans selection:bg-cyan-500/30">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8 max-w-xl mx-auto relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-[#0e364a] border border-cyan-500/25 rounded-full text-cyan-300 hover:bg-[#124158] hover:text-white transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft size={20} weight="bold" />
        </button>

        <div>
          <h1 className="text-xl font-black tracking-tighter uppercase font-mono text-white">Definições</h1>
          <p className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] text-cyan-200/70">Perfil</p>
        </div>
      </div>

      <div className="space-y-6 max-w-xl mx-auto relative z-10">

        {loading ? (
          <div className="space-y-4 animate-pulse">

            {/* CARD 1 */}
            <div className="bg-[#0e364a] border border-cyan-500/20 rounded-[2.5rem] p-8 space-y-4">
              <div className="h-4 w-24 bg-cyan-500/10 rounded"></div>
              <div className="h-12 bg-cyan-500/10 rounded-2xl"></div>
              <div className="h-12 bg-cyan-500/10 rounded-2xl"></div>
              <div className="h-12 bg-cyan-500/10 rounded-2xl"></div>
            </div>

            {/* CARD 2 */}
            <div className="bg-[#0e364a] border border-cyan-500/20 rounded-[2.5rem] p-8 space-y-4">
              <div className="h-4 w-24 bg-cyan-500/10 rounded"></div>
              <div className="h-12 bg-cyan-500/10 rounded-2xl"></div>
              <div className="h-12 bg-cyan-500/10 rounded-2xl"></div>
              <div className="h-24 bg-cyan-500/10 rounded-2xl"></div>
            </div>

          </div>
        ) : (
          <>
            {/* ALERTA */}
            <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-[2rem] flex gap-4 shadow-xl shadow-orange-950/20">
              <ShieldCheck size={22} weight="fill" className="text-orange-400 shrink-0 mt-0.5" />
              <p className="text-xs text-orange-200/80 font-mono leading-relaxed">
                Alterar e-mail bloqueia levantamentos por 24h
              </p>
            </div>

            {/* CARD IDENTIDADE */}
            <div className="bg-[#0e364a] border border-cyan-500/20 rounded-[2.5rem] p-8 space-y-6 shadow-2xl shadow-cyan-950/20">

              <SettingsInput
                label="Nome"
                icon={<IdentificationCard size={18} weight="duotone" />}
                value={form.fullName}
                onChange={(v) => setForm({ ...form, fullName: v })}
              />

              {/* EMAIL */}
              <div className="space-y-2">
                <SettingsInput
                  label="Email"
                  icon={<Envelope size={18} weight="duotone" />}
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                />

                {form.email !== originalEmail && (
                  <button
                    type="button"
                    onClick={handleRequestOTP}
                    disabled={sendingOtp}
                    className="text-[10px] font-bold font-mono uppercase tracking-wider text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 ml-1 transition-colors cursor-pointer"
                  >
                    {sendingOtp ? 'Enviando...' : 'Pedir OTP'}
                    <PaperPlaneTilt size={14} weight="bold" />
                  </button>
                )}

                {showOtpField && (
                  <input
                    placeholder="OTP"
                    maxLength={6}
                    value={form.otp}
                    onChange={(e) => setForm({ ...form, otp: e.target.value })}
                    className="w-full h-12 bg-[#0a2533] border border-cyan-500/30 focus:border-cyan-400 rounded-2xl px-4 text-sm font-mono text-cyan-300 text-center tracking-[0.5em] font-bold outline-none shadow-inner placeholder:text-cyan-200/30 placeholder:tracking-normal placeholder:font-normal"
                  />
                )}
              </div>

              <SettingsInput
                label="Telefone"
                icon={<DeviceMobile size={18} weight="duotone" />}
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
              />
            </div>

            {/* CARD LOCALIZAÇÃO */}
            <div className="bg-[#0e364a] border border-cyan-500/20 rounded-[2.5rem] p-8 space-y-6 shadow-2xl shadow-cyan-950/20">

              <div className="grid grid-cols-2 gap-4">
                <SettingsInput
                  label="País"
                  value={form.country}
                  onChange={(v) => setForm({ ...form, country: v })}
                />

                <SettingsInput
                  label="Província"
                  value={form.province}
                  onChange={(v) => setForm({ ...form, province: v })}
                />
              </div>

              <SettingsInput
                label="Bairro"
                value={form.neighborhood}
                onChange={(v) => setForm({ ...form, neighborhood: v })}
              />

              <SettingsInput
                label="Morada"
                icon={<MapPin size={18} weight="duotone" />}
                value={form.address}
                onChange={(v) => setForm({ ...form, address: v })}
              />

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono text-cyan-200/70 ml-1">
                  Biografia
                </label>
                <textarea
                  placeholder="Conte um pouco sobre si..."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full bg-[#0a2533] border border-cyan-500/20 focus:border-cyan-400 rounded-2xl p-4 text-sm font-mono text-white outline-none min-h-[100px] transition-all placeholder:text-cyan-200/30 resize-none shadow-inner"
                />
              </div>
            </div>

            {/* BOTÃO */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-14 rounded-2xl bg-cyan-600 text-white hover:bg-cyan-500 font-black font-mono text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-cyan-950/30 hover:shadow-cyan-950/50 active:scale-[0.98] cursor-pointer"
            >
              {saving ? (
                <CircleNotch size={20} className="animate-spin text-white" />
              ) : (
                <>
                  Guardar
                  <CheckCircle size={20} weight="fill" className="text-cyan-200" />
                </>
              )}
            </button>
          </>
        )}

      </div>
    </div>
  )
}

/* COMPONENT INPUT */

function SettingsInput({
  label,
  value,
  onChange,
  icon
}: {
  label: string
  value: string
  onChange: (v: string) => void
  icon?: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono text-cyan-200/70 ml-1 flex items-center gap-1.5">
        {icon} {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 bg-[#0a2533] border border-cyan-500/20 focus:border-cyan-400 rounded-2xl px-4 text-sm font-mono text-white outline-none transition-all shadow-inner placeholder:text-cyan-200/30"
      />
    </div>
  )
}