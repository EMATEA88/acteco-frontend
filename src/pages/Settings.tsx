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
      await UserService.requestEmailChangeOTP()
      toast.success('Código enviado')
      setShowOtpField(true)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao enviar código')
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

  {loading ? (
  <div className="space-y-4 animate-pulse">

    {/* CARD 1 */}
    <div className="bg-[#111318] rounded-xl p-4 space-y-3">
      <div className="h-4 w-24 bg-white/5 rounded"></div>
      <div className="h-11 bg-white/5 rounded-xl"></div>
      <div className="h-11 bg-white/5 rounded-xl"></div>
      <div className="h-11 bg-white/5 rounded-xl"></div>
    </div>

    {/* CARD 2 */}
    <div className="bg-[#111318] rounded-xl p-4 space-y-3">
      <div className="h-4 w-24 bg-white/5 rounded"></div>
      <div className="h-11 bg-white/5 rounded-xl"></div>
      <div className="h-11 bg-white/5 rounded-xl"></div>
      <div className="h-20 bg-white/5 rounded-xl"></div>
    </div>

  </div>
) : (
  <>
    {/* TODO O TEU FORM NORMAL AQUI */}
  </>
)}

  return (
    <div className="min-h-screen bg-[#0f1115] text-white px-4 pt-10 pb-28 font-sans">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6 max-w-xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white/5 rounded-full"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-lg font-bold">Definições</h1>
          <p className="text-[10px] text-gray-500 uppercase">Perfil</p>
        </div>
      </div>

      <div className="space-y-5 max-w-xl mx-auto">

        {/* ALERTA */}
        <div className="bg-orange-500/5 border border-orange-500/20 p-4 rounded-xl flex gap-3">
          <ShieldCheck size={20} className="text-orange-500" />
          <p className="text-xs text-gray-400">
            Alterar e-mail bloqueia levantamentos por 24h
          </p>
        </div>

        {/* CARD IDENTIDADE */}
        <div className="bg-[#111318] border border-white/5 rounded-xl p-4 space-y-4">

          <SettingsInput
            label="Nome"
            icon={<IdentificationCard size={16} />}
            value={form.fullName}
            onChange={(v) => setForm({ ...form, fullName: v })}
          />

          {/* EMAIL */}
          <div className="space-y-2">
            <SettingsInput
              label="Email"
              icon={<Envelope size={16} />}
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
            />

            {form.email !== originalEmail && (
              <button
                onClick={handleRequestOTP}
                disabled={sendingOtp}
                className="text-[10px] text-green-500 flex items-center gap-1"
              >
                {sendingOtp ? 'Enviando...' : 'Pedir OTP'}
                <PaperPlaneTilt size={12} />
              </button>
            )}

            {showOtpField && (
              <input
                placeholder="OTP"
                maxLength={6}
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value })}
                className="w-full h-11 bg-black border border-green-500/20 rounded-xl px-4 text-xs text-green-500 text-center tracking-widest"
              />
            )}
          </div>

          <SettingsInput
            label="Telefone"
            icon={<DeviceMobile size={16} />}
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />
        </div>

        {/* CARD LOCALIZAÇÃO */}
        <div className="bg-[#111318] border border-white/5 rounded-xl p-4 space-y-4">

          <div className="grid grid-cols-2 gap-3">
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
            icon={<MapPin size={16} />}
            value={form.address}
            onChange={(v) => setForm({ ...form, address: v })}
          />

          <textarea
            placeholder="Biografia"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full bg-black border border-white/5 rounded-xl p-3 text-xs text-white min-h-[80px]"
          />
        </div>

        {/* BOTÃO */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-12 rounded-xl bg-white text-black text-sm font-semibold flex items-center justify-center gap-2"
        >
          {saving ? (
            <CircleNotch size={18} className="animate-spin" />
          ) : (
            <>
              Guardar
              <CheckCircle size={18} />
            </>
          )}
        </button>

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
      <label className="text-[10px] text-gray-500 flex items-center gap-1">
        {icon} {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 bg-black border border-white/5 rounded-xl px-4 text-xs text-white outline-none"
      />
    </div>
  )
}