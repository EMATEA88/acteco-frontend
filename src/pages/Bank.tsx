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

      toast.success('Dados bancários salvos com sucesso')

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
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] px-6 pt-16 pb-28">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-[#1E2329] flex items-center justify-center border border-[#2B3139]">
          <Landmark size={20} className="text-[#FCD535]" />
        </div>

        <h1 className="text-lg font-semibold tracking-wide">
          Dados Bancários
        </h1>
      </div>

      {/* CARD */}
      <div className="
        bg-[#1E2329]
        border border-[#2B3139]
        rounded-3xl
        p-8
        space-y-6
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
            bg-[#FCD535] text-black
            hover:brightness-110 transition
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
/* INPUT BINANCE */
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
      <label className="text-xs text-[#848E9C] tracking-wide">
        {label}
      </label>

      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="
          w-full h-12 rounded-xl
          bg-[#1E2329]
          border border-[#2B3139]
          px-4 text-sm text-[#EAECEF]
          focus:border-[#FCD535]
          outline-none
          transition
        "
      />
    </div>
  )
}