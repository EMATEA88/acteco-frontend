
import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import {
  CheckCircle,
  CreditCard,
  PencilSimple,
  User,
  X,
} from "@phosphor-icons/react"
import { api } from "../services/api"
import Toast from "../components/ui/Toast"

type BankForm = {
  name: string
  bank: string
  iban: string
}

type ToastType = "success" | "error"

type ToastState = {
  visible: boolean
  message: string
  type: ToastType
}

const CACHE_KEY = "bank-cache"

const EMPTY_BANK: BankForm = {
  name: "",
  bank: "",
  iban: "",
}

const inputClass =
  "w-full h-12 rounded-xl bg-[#0A2533] border border-[#24566A] px-4 text-sm text-white outline-none transition-all placeholder:text-[#7696A5] focus:border-[#19C5CE] focus:ring-1 focus:ring-[#19C5CE]"

const primaryButtonClass =
  "w-full h-12 rounded-xl bg-[#079CB3] text-white text-sm font-semibold transition-all hover:bg-[#0BACC2] active:scale-[0.99] disabled:bg-[#315365] disabled:text-[#91A9B4] disabled:cursor-not-allowed flex items-center justify-center gap-2"

function readCachedBank(): BankForm {
  try {
    const cached = localStorage.getItem(CACHE_KEY)

    if (!cached) return { ...EMPTY_BANK }

    const parsed = JSON.parse(cached)

    return {
      name: parsed?.name ?? "",
      bank: parsed?.bank ?? "",
      iban: parsed?.iban ?? "",
    }
  } catch {
    return { ...EMPTY_BANK }
  }
}

export default function BankPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState<BankForm>(readCachedBank)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)

  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: "",
    type: "success",
  })

  const hasBankData = Boolean(
    form.name.trim() || form.bank.trim() || form.iban.trim()
  )

  // Toast
  useEffect(() => {
    if (!toast.visible) return

    const timer = window.setTimeout(() => {
      setToast(previous => ({
        ...previous,
        visible: false,
      }))
    }, 3500)

    return () => window.clearTimeout(timer)
  }, [toast.visible, toast.message])

  // Carregar dados bancários
  useEffect(() => {
    let mounted = true

    async function loadBankDetails() {
      try {
        const response = await api.get("/user-bank")

        const data = response?.data?.data ?? response?.data

        if (!mounted || !data) return

        const bankData: BankForm = {
          name: data.name ?? "",
          bank: data.bank ?? "",
          iban: data.iban ?? "",
        }

        setForm(bankData)

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify(bankData)
        )
      } catch {
        // Preserva os dados em cache se a API estiver indisponível.
      } finally {
        if (mounted) setLoading(false)
      }
    }

    void loadBankDetails()

    return () => {
      mounted = false
    }
  }, [])

  function notify(
    message: string,
    type: ToastType = "error"
  ) {
    setToast({
      visible: true,
      message,
      type,
    })
  }

  function updateField(
    field: keyof BankForm,
    value: string
  ) {
    setForm(previous => ({
      ...previous,
      [field]: value,
    }))
  }

  function cancelEditing() {
    setForm(readCachedBank())
    setEditing(false)
  }

  // Guardar dados bancários
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (saving) return

    const payload: BankForm = {
      name: form.name.trim(),
      bank: form.bank.trim(),
      iban: form.iban.replace(/\s+/g, "").toUpperCase(),
    }

    if (!payload.name || !payload.bank || !payload.iban) {
      notify("Preencha todos os dados bancários.")
      return
    }

    try {
      setSaving(true)

      await api.post("/user-bank", payload)

      setForm(payload)

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify(payload)
      )

      setEditing(false)

      notify(
        "Dados bancários atualizados com sucesso.",
        "success"
      )

      window.setTimeout(() => {
        navigate("/profile", { replace: true })
      }, 1200)

    } catch (error: any) {
      notify(
        error?.response?.data?.error ??
        error?.response?.data?.message ??
        "Não foi possível guardar os dados bancários."
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0A2533] text-[#E0F2FE]">

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast(previous => ({
            ...previous,
            visible: false,
          }))
        }
      />

      <section className="
        mx-auto flex min-h-screen w-full max-w-lg
        flex-col justify-center
        px-4 py-8
        sm:px-6
      ">

        {/* CARD PRINCIPAL */}

        {loading ? (

          <div className="animate-pulse space-y-4">

            <div className="
              h-16 rounded-2xl
              border border-cyan-500/15
              bg-[#0E364A]
            " />

            <div className="
              h-56 rounded-2xl
              border border-cyan-500/15
              bg-[#0E364A]
            " />

          </div>

        ) : (

          <div className="
            overflow-hidden
            rounded-2xl
            border border-cyan-500/20
            bg-[#0E364A]
            shadow-2xl shadow-black/20
          ">

            {/* CARD HEADER */}

            <div className="
              flex items-center justify-between
              border-b border-cyan-500/10
              px-4 py-4
              sm:px-5
            ">

              <div className="flex min-w-0 items-center gap-3">

                <div className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-cyan-500/10
                  text-cyan-300
                ">
                  <CreditCard
                    size={22}
                    weight="duotone"
                  />
                </div>

                <div className="min-w-0">

                  <h2 className="text-sm font-bold text-white">
                    Dados bancários
                  </h2>

                  <p className="mt-0.5 text-[11px] text-cyan-100/50">
                    {hasBankData
                      ? "Conta associada"
                      : "Sem conta registada"}
                  </p>

                </div>

              </div>

              {hasBankData && !editing && (

                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="
                    inline-flex h-9 shrink-0
                    items-center justify-center gap-2
                    rounded-lg
                    border border-cyan-500/20
                    bg-[#0A2533]
                    px-3
                    text-xs font-semibold
                    text-cyan-200
                    transition-all
                    hover:border-cyan-400/50
                    hover:bg-[#124158]
                    active:scale-[0.97]
                  "
                >
                  <PencilSimple
                    size={15}
                    weight="bold"
                  />
                  Editar
                </button>

              )}

            </div>

            {/* CARD CONTENT */}

            <div className="p-4 sm:p-5">

              {editing ? (

                <form
                  onSubmit={save}
                  className="space-y-4"
                >

                  <BankInput
                    label="Titular da conta"
                    value={form.name}
                    onChange={value =>
                      updateField("name", value)
                    }
                    icon={<User size={17} />}
                    autoComplete="name"
                  />

                  <BankInput
                    label="Banco"
                    value={form.bank}
                    onChange={value =>
                      updateField("bank", value)
                    }
                    icon={<CreditCard size={17} />}
                    autoComplete="off"
                  />

                  <BankInput
                    label="IBAN"
                    value={form.iban}
                    onChange={value =>
                      updateField("iban", value)
                    }
                    icon={<CreditCard size={17} />}
                    autoComplete="off"
                    spellCheck={false}
                  />

                  <div className="grid grid-cols-2 gap-3 pt-2">

                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={saving}
                      className="
                        flex h-12 items-center justify-center gap-2
                        rounded-xl
                        border border-[#315D70]
                        bg-[#0A2533]
                        text-sm font-semibold
                        text-cyan-100/80
                        transition-all
                        hover:bg-[#12394B]
                        disabled:opacity-50
                      "
                    >
                      <X size={17} />
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className={primaryButtonClass}
                    >
                      {saving ? (

                        <>
                          <span className="
                            h-4 w-4 animate-spin
                            rounded-full border-2
                            border-white/25 border-t-white
                          " />
                          A guardar...
                        </>

                      ) : (

                        <>
                          Guardar
                          <CheckCircle
                            size={17}
                            weight="bold"
                          />
                        </>

                      )}
                    </button>

                  </div>

                </form>

              ) : hasBankData ? (

                <div className="divide-y divide-cyan-500/10">

                  <BankDetail
                    label="Titular"
                    value={form.name}
                    icon={<User size={19} />}
                  />

                  <BankDetail
                    label="Banco"
                    value={form.bank}
                    icon={<CreditCard size={19} />}
                  />

                  <BankDetail
                    label="IBAN"
                    value={form.iban}
                    icon={<CreditCard size={19} />}
                    mono
                  />

                </div>

              ) : (

                <div className="py-5 text-center">

                  <p className="text-sm font-semibold text-white">
                    Nenhuma conta bancária registada
                  </p>

                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className={`${primaryButtonClass} mt-5`}
                  >
                    Adicionar conta bancária
                  </button>

                </div>

              )}

            </div>

          </div>

        )}

        {/* BOTÃO VOLTAR */}

        <button
  type="button"
  onClick={() => navigate(-1)}
  className="
    mt-4
    flex h-14 w-full
    items-center justify-center
    rounded-xl
    bg-[#079CB3]
    text-sm font-bold
    text-white
    shadow-lg shadow-cyan-950/20
    transition-all
    hover:bg-[#0BACC2]
    active:scale-[0.99]
  "
>
  Voltar
</button>

      </section>

    </main>
  )
}

/* =========================================
   COMPONENTE: DADOS BANCÁRIOS
========================================= */

function BankDetail({
  label,
  value,
  icon,
  mono = false,
}: {
  label: string
  value: string
  icon: ReactNode
  mono?: boolean
}) {
  return (

    <div className="
      flex items-center gap-3
      py-4 first:pt-1 last:pb-1
    ">

      <div className="
        flex h-10 w-10 shrink-0
        items-center justify-center
        rounded-xl
        bg-[#0A2533]
        text-cyan-300
      ">
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <p className="
          text-[10px] font-semibold
          uppercase tracking-wider
          text-cyan-200/50
        ">
          {label}
        </p>

        <p className={`
          mt-1 break-all text-sm font-semibold text-white
          ${mono ? "font-mono tracking-wide" : ""}
        `}>
          {value || "—"}
        </p>

      </div>

    </div>

  )
}

/* =========================================
   COMPONENTE: INPUT BANCÁRIO
========================================= */

function BankInput({
  label,
  value,
  onChange,
  icon,
  autoComplete,
  spellCheck,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  icon: ReactNode
  autoComplete: string
  spellCheck?: boolean
}) {
  return (

    <label className="block space-y-2">

      <span className="
        text-xs font-semibold
        text-cyan-100/80
      ">
        {label}
      </span>

      <span className="relative block">

        <span className="
          pointer-events-none
          absolute left-4 top-1/2
          -translate-y-1/2
          text-cyan-200/50
        ">
          {icon}
        </span>

        <input
          value={value}
          onChange={event =>
            onChange(event.target.value)
          }
          autoComplete={autoComplete}
          spellCheck={spellCheck}
          className={`${inputClass} pl-11`}
        />

      </span>

    </label>

  )
}
