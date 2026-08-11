import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import {
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true

    api.get('/user-bank')
      .then(res => {
        if (!mounted || !res.data) return
        setForm(res.data)
        localStorage.setItem(CACHE_KEY, JSON.stringify(res.data))
      })
      .catch(() => {})
      .finally(() => setLoading(false))

    return () => { mounted = false }
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
      toast.error(err?.response?.data?.error || 'Erro ao guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe]">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0a2533]/90 backdrop-blur border-b border-cyan-500/10">
        <div className="max-w-xl mx-auto flex items-center gap-4 px-5 py-4">

          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-[#0e364a] border border-cyan-500/20 rounded-full text-cyan-300 hover:bg-[#124158] hover:text-white transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-base font-bold text-white font-mono uppercase tracking-wider">Conta Bancária</h1>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-5 py-6 pb-28">

        {loading ? (
          <div className="space-y-4 animate-pulse">

            <div className="bg-[#0e364a] border border-cyan-500/15 rounded-2xl p-4 h-16" />

            <div className="bg-[#0e364a] border border-cyan-500/15 rounded-2xl p-4 space-y-3">
              <div className="h-11 bg-[#0a2533] border border-cyan-500/10 rounded-xl" />
              <div className="h-11 bg-[#0a2533] border border-cyan-500/10 rounded-xl" />
              <div className="h-11 bg-[#0a2533] border border-cyan-500/10 rounded-xl" />
              <div className="h-12 bg-[#0a2533] border border-cyan-500/10 rounded-xl" />
            </div>

          </div>
        ) : (
          <div className="space-y-6">

            {/* INFO */}
            <div className="bg-[#0e364a] border border-cyan-500/20 rounded-2xl p-4 flex gap-3 shadow-lg shadow-cyan-950/20">
              <ShieldCheck size={18} className="text-cyan-400 mt-0.5 shrink-0" />

              <p className="text-[11px] text-cyan-200/80 font-mono">
                O IBAN deve coincidir com o titular para evitar rejeições.
              </p>
            </div>

            {/* FORM */}
            <div className="bg-[#0e364a] border border-cyan-500/20 rounded-2xl p-4 space-y-4 shadow-xl shadow-cyan-950/20">

              <BankInput
                label="Titular"
                value={form.name}
                onChange={v => setForm({ ...form, name: v })}
              />

              <BankInput
                label="Banco"
                value={form.bank}
                onChange={v => setForm({ ...form, bank: v })}
              />

              <BankInput
                label="IBAN"
                value={form.iban}
                onChange={v => setForm({ ...form, iban: v })}
              />

            </div>

            {/* BUTTON */}
            <button
              onClick={save}
              disabled={saving}
              className={`w-full h-12 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg
                ${saving
                  ? 'bg-[#0e364a] border border-cyan-500/20 text-cyan-200/50'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-950/20'
                }
              `}
            >
              {saving ? 'A guardar...' : (
                <>
                  Guardar
                  <CheckCircle size={16} />
                </>
              )}
            </button>

          </div>
        )}

      </main>
    </div>
  )
}

/* INPUT PADRÃO */

function BankInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-1">

      <label className="text-[10px] text-cyan-200/70 font-mono uppercase font-bold block">
        {label}
      </label>

      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="
          w-full h-11 rounded-xl
          bg-[#0a2533]
          border border-cyan-500/20
          px-4 text-sm font-mono text-white
          outline-none
          focus:border-cyan-400
          placeholder:text-cyan-200/30
          transition-all
        "
      />
    </div>
  )
}