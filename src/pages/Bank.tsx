import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { Landmark, CheckCircle2 } from 'lucide-react'

type BankForm = {
  name: string
  bank: string
  iban: string
}

const CACHE_KEY = 'bank-cache'

export default function Bank() {
  const cached = localStorage.getItem(CACHE_KEY)
  const initial = cached
    ? JSON.parse(cached)
    : { name: '', bank: '', iban: '' }

  const [form, setForm] = useState<BankForm>(initial)

  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

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
      .catch(() => {
        // totalmente silencioso
      })

    return () => {
      mounted = false
    }
  }, [])

  async function save() {
    try {
      setSaving(true)
      await api.post('/user-bank', form)

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify(form)
      )

      setSuccess(true)
      setTimeout(() => setSuccess(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 space-y-6 pb-24 animate-fadeZoom">
      <div className="flex items-center gap-2">
        <Landmark className="text-emerald-600" />
        <h1 className="text-lg font-semibold">
          Dados Bancários
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-4 space-y-4">
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
            active:scale-95 disabled:opacity-60
          "
        >
          {saving ? 'A guardar…' : 'Salvar'}
        </button>

        {success && (
          <div className="flex items-center justify-center gap-2 text-sm text-emerald-600">
            <CheckCircle2 size={16} />
            Dados salvos com sucesso
          </div>
        )}
      </div>
    </div>
  )
}

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
    <div className="space-y-1">
      <label className="text-xs text-gray-500">
        {label}
      </label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="
          w-full h-12 rounded-xl border px-4 text-sm
          focus:ring-2 focus:ring-emerald-500 outline-none
        "
      />
    </div>
  )
}
