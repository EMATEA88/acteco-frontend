import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Copy,
  CheckCircle,
  Wallet,
} from 'lucide-react'
import { RechargeService } from '../services/recharge.service'
import { UserService } from '../services/user.service'

const QUICK_AMOUNTS = [
  6000,
  15000,
  30000,
  50000,
  100000,
  250000,
]

const USDT_ADDRESS =
  'TVtMdPLsFtBbA89URvzose6ZLoFeL4uGAZ'

type Method = 'AOA' | 'USDT' | null

export default function Deposit() {
  const [method, setMethod] =
    useState<Method>(null)

  if (!method) {
    return <SelectMethod onSelect={setMethod} />
  }

  if (method === 'USDT') {
    return (
      <DepositUSDT onBack={() => setMethod(null)} />
    )
  }

  return (
    <DepositAOA onBack={() => setMethod(null)} />
  )
}

/* =========================
   SELECT METHOD
========================= */

function SelectMethod({
  onSelect,
}: {
  onSelect: (m: Method) => void
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-6 flex flex-col justify-center">
      {/* LOGO */}
      <div className="flex justify-center mb-10">
  <div
    className="
      w-24 h-24
      rounded-full
      overflow-hidden
      shadow-xl
      ring-4 ring-emerald-500/30
      bg-white
    "
  >
    <img
      src="/logo.png"
      alt="ACTECO"
      className="
        w-full h-full
        object-cover
        rounded-full
      "
    />
  </div>
</div>
      <h1 className="text-2xl font-semibold text-center mb-3">
        Depósito de Fundos
      </h1>

      <p className="text-sm text-gray-600 text-center mb-8">
        Selecione um método de depósito.
      </p>

      <div className="space-y-4">
        {/* AOA */}
        <button
          onClick={() => onSelect('AOA')}
          className="
            w-full rounded-3xl p-5
            bg-emerald-600 text-white
            flex items-center gap-4
            hover:bg-emerald-700 transition
            shadow-lg
          "
        >
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Wallet />
          </div>

          <div className="text-left">
            <p className="font-semibold text-lg">
              Depósito em AOA
            </p>
            <p className="text-sm opacity-90">
              Transferência bancária nacional.
            </p>
          </div>
        </button>

        {/* USDT */}
        <button
          onClick={() => onSelect('USDT')}
          className="
            w-full rounded-3xl p-5
            bg-black text-white
            flex items-center gap-4
            hover:bg-gray-900 transition
            shadow-lg
          "
        >
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <Copy />
          </div>

          <div className="text-left">
            <p className="font-semibold text-lg">
              Depósito em USDT
            </p>
            <p className="text-sm opacity-80">
              Criptomoeda via rede TRON (TRC20)
            </p>
          </div>
        </button>
      </div>
    </div>
  )
}

/* =========================
   AOA
========================= */

function DepositAOA({
  onBack,
}: {
  onBack: () => void
}) {
  const navigate = useNavigate()

  const [amount, setAmount] =
    useState<number | ''>('')

  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] =
    useState<number | null>(null)
  const [message, setMessage] =
    useState<string | null>(null)

  useEffect(() => {
    UserService.me()
      .then(res => setBalance(res.data.balance))
      .catch(() => setBalance(0))
  }, [])

  function selectAmount(value: number) {
    setSelected(value)
    setAmount(value)
  }

  async function handleSubmit() {
    if (!amount || amount <= 0) return

    try {
      setLoading(true)
      setMessage(null)

      const recharge =
        await RechargeService.create(
          Number(amount)
        )

      navigate(`/deposit/banks/${recharge.id}`)
    } catch {
      setMessage(
        'Erro ao criar pedido de depósito'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack}>
          <ArrowLeft />
        </button>
        <h1 className="text-lg font-semibold">
          Depósito em AOA
        </h1>
      </div>

      <div className="bg-emerald-600 text-white rounded-3xl p-6 mb-6 shadow-lg">
        <p className="text-sm opacity-90">
          Saldo atual disponível
        </p>
        <p className="text-3xl font-bold mt-1">
          Kz {balance.toLocaleString()}
        </p>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Selecione um valor ou introduza o montante
        que deseja depositar. O processamento ocorre dentro do horário indicado.
      </p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {QUICK_AMOUNTS.map(v => (
          <button
            key={v}
            onClick={() => selectAmount(v)}
            className={`
              h-12 rounded-xl text-sm font-medium transition
              ${
                selected === v
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }
            `}
          >
            {v.toLocaleString()}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Digite o valor"
        value={amount}
        onChange={e => {
          setAmount(Number(e.target.value) || '')
          setSelected(null)
        }}
        className="w-full h-12 rounded-xl border px-4 mb-6"
      />

      {message && (
        <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-700 text-sm">
          {message}
        </div>
      )}

      <button
        disabled={!amount || loading}
        onClick={handleSubmit}
        className="
          w-full h-12 rounded-xl
          bg-emerald-600 text-white font-semibold
          disabled:opacity-50
          active:scale-95 transition
        "
      >
        {loading ? 'Processando…' : 'Confirmar depósito'}
      </button>

      <div className="mt-6 bg-white rounded-2xl p-5 shadow-card text-sm space-y-2">
        <p className="font-medium text-gray-900">
          Informações importantes
        </p>
        <p>• Processamento: 10h00 às 22h00;</p>
        <p>• Confirmação de depósitos no horário habitual;</p>
        <p>
          • Envie o comprovativo apenas ao
          apoio ao cliente e administradores de grupo local Acteco;
        </p>
        <p className="text-red-600 font-medium">
          A ACTECO não se responsabiliza por
          envios fora do horário e em pessoas não autorizadas.
        </p>
      </div>
    </div>
  )
}

/* =========================
   USDT / TRON
========================= */

function DepositUSDT({
  onBack,
}: {
  onBack: () => void
}) {
  const [toast, setToast] =
    useState(false)

  function copy() {
    navigator.clipboard.writeText(
      USDT_ADDRESS
    )
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack}>
          <ArrowLeft />
        </button>
        <h1 className="text-lg font-semibold">
          Depósito em USDT
        </h1>
      </div>

      <div className="bg-black text-white rounded-3xl p-6 mb-6 shadow-lg">
        <p className="text-sm text-emerald-400 font-medium mb-1">
          Rede obrigatória
        </p>
        <p className="text-2xl font-bold">
          TRON · TRC20
        </p>
        <p className="text-sm opacity-80 mt-2">
          Utilize exclusivamente esta rede.
          Envios por outras redes resultarão em
          perda permanente dos fundos.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-card space-y-4">
        <p className="text-sm text-gray-700">
          Envie USDT para o endereço abaixo.
          Após o envio, aguarde a confirmação da nossa equipa financeira.
        </p>

        <div className="bg-gray-100 rounded-xl p-4 text-sm font-mono break-all">
          {USDT_ADDRESS}
        </div>

        <button
          onClick={copy}
          className="
            w-full h-12 rounded-xl
            bg-emerald-600 text-white font-semibold
            flex items-center justify-center gap-2
            hover:bg-emerald-700 transition
          "
        >
          <Copy size={16} />
          Copiar endereço TRON
        </button>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Confirmação imediata;</p>
          <p>• Envie comprovativo apenas ao apoio e membros autorizadas da empresa;</p>
          <p>
            • Rede incorreta resulta em perda
            irreversível de fundos.
          </p>
        </div>
      </div>

      {toast && (
        <div
          className="
            fixed top-6 left-1/2 -translate-x-1/2
            z-50
            bg-emerald-600 text-white
            px-6 py-3 rounded-2xl
            shadow-lg
            flex items-center gap-2
            animate-toastIn
          "
        >
          <CheckCircle size={18} />
          Endereço TRON copiado com sucesso
        </div>
      )}
    </div>
  )
}
