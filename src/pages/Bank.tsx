import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { Landmark } from 'lucide-react'
import { toast } from 'sonner'

type BankForm = {
  name: string
  bank: string
  iban: string
}

const CACHE_KEY = 'bank-cache'

export default function Bank() {

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
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify(res.data)
        )
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

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify(form)
      )

      // 🔔 Toast verde profissional
      toast.success('Dados bancários salvos com sucesso')

      // 🔄 Pequeno delay para UX
      setTimeout(() => {
        navigate('/profile')
      }, 800)

    } catch (err: any) {
      toast.error(
        err?.response?.data?.error ||
        'Erro ao salvar dados'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1220] to-[#0F172A] text-white px-6 pt-16 pb-28">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-emerald-600/20 flex items-center justify-center">
          <Landmark size={20} className="text-emerald-400" />
        </div>

        <h1 className="text-lg font-semibold tracking-wide">
          Dados Bancários
        </h1>
      </div>

      {/* CARD */}
      <div className="
        bg-white/5
        backdrop-blur-xl
        border border-white/10
        rounded-3xl
        p-8
        space-y-6
        shadow-2xl
      ">

        <Input
          label="Nome do titular"
          value={form.name}
          onChange={v =>
            setForm({ ...form, name: v })
          }
        />

        <Input
          label="Banco"
          value={form.bank}
          onChange={v =>
            setForm({ ...form, bank: v })
          }
        />

        <Input
          label="IBAN"
          value={form.iban}
          onChange={v =>
            setForm({ ...form, iban: v })
          }
        />

        <button
          onClick={save}
          disabled={saving}
          className="
            w-full h-12 rounded-xl font-semibold
            bg-emerald-600 text-white
            hover:bg-emerald-700 transition
            active:scale-95 disabled:opacity-50
          "
        >
          {saving ? 'A guardar…' : 'Salvar dados'}
        </button>

      </div>

    </div>
  )
}

/* ============================= */
/* INPUT PROFISSIONAL */
/* ============================= */

function Input({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs text-gray-400 tracking-wide">
        {label}
      </label>

      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="
          w-full h-12 rounded-xl
          bg-white/5
          border border-white/10
          px-4 text-sm text-white
          focus:ring-2 focus:ring-emerald-500
          focus:border-emerald-500
          outline-none
          transition
        "
      />
    </div>
  )
}