import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { 
  Bank, 
  ArrowLeft, 
  CheckCircle, 
  ShieldCheck 
} from '@phosphor-icons/react' 
import { toast } from 'sonner'

type BankForm = {
  name: string
  bank: string
  iban: string
}

const CACHE_KEY = 'bank-cache'

export default function BankPage() {
  const navigate = useNavigate()

  const cached = localStorage.getItem(CACHE_KEY)
  const initial = cached
    ? JSON.parse(cached)
    : { name: '', bank: '', iban: '' }

  const [form, setForm] = useState<BankForm>(initial)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    api
      .get('/user-bank')
      .then(res => {
        if (!mounted || !res.data) return
        setForm(res.data)
        localStorage.setItem(CACHE_KEY, JSON.stringify(res.data))
      })
      .catch(() => {})

    return () => {
      mounted = false
    }
  }, [])

  async function save() {
    if (saving) return
    try {
      setSaving(true)
      await api.post('/user-bank', form)
      localStorage.setItem(CACHE_KEY, JSON.stringify(form))
      
      toast.success('Dados bancários atualizados')
      setTimeout(() => navigate('/profile'), 800)
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Erro ao guardar dados')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 pt-12 pb-28 font-sans selection:bg-green-500/30">
      
      {/* BOTÃO VOLTAR */}
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
      >
        <ArrowLeft size={20} weight="bold" className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Voltar</span>
      </button>

      {/* HEADER INSTITUCIONAL */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
          <Bank size={28} weight="duotone" className="text-green-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase italic">Conta Bancária</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Configuração de Saque</p>
        </div>
      </div>

      {/* CARD DE FORMULÁRIO */}
      <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden">
        
        {/* INFO BOX SUTIL */}
        <div className="bg-green-500/5 border border-green-500/10 p-5 rounded-2xl flex items-start gap-4">
          <ShieldCheck size={28} weight="duotone" className="text-green-500 flex-shrink-0" />
          <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
            Certifique-se de que o <span className="text-white font-bold">IBAN</span> e o <span className="text-white font-bold">Titular</span> coincidem com o seu documento de identidade para evitar rejeições.
          </p>
        </div>

        <div className="space-y-6">
          <BankInput
            label="Titular da Conta"
            placeholder="Nome completo do titular"
            value={form.name}
            onChange={v => setForm({ ...form, name: v })}
          />

          <BankInput
            label="Instituição Bancária"
            placeholder="Ex: BAI, BFA, BIC..."
            value={form.bank}
            onChange={v => setForm({ ...form, bank: v })}
          />

          <BankInput
            label="Número IBAN (21 Dígitos)"
            placeholder="AO06.0000.0000..."
            value={form.iban}
            onChange={v => setForm({ ...form, iban: v })}
          />
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest bg-white text-black hover:bg-green-500 hover:text-white transition-all active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-3 shadow-xl"
        >
          {saving ? (
             <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              Guardar Protocolo
              <CheckCircle size={22} weight="fill" />
            </>
          )}
        </button>
      </div>

      {/* FOOTER */}
      <div className="mt-12 text-center opacity-20">
        <p className="text-[9px] font-bold uppercase tracking-[0.5em]">Segurança Certificada • EMATEA 2026</p>
      </div>
    </div>
  )
}

/* ============================= */
/* INPUT COMPONENT PREMIUM */
/* ============================= */

function BankInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  placeholder: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 ml-1">
        {label}
      </label>

      <input
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="
          w-full h-14 rounded-2xl
          bg-[#0a0a0a]
          border border-white/5
          px-6 text-sm font-medium text-white
          placeholder:text-gray-800
          focus:border-green-500/40
          focus:ring-4 focus:ring-green-500/5
          outline-none
          transition-all
        "
      />
    </div>
  )
}