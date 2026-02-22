import { useEffect, useState } from 'react'

export function ConfirmPurchaseModal({
  open,
  onClose,
  onConfirm,
  serviceName,
  loading = false,
}: {
  open: boolean
  onClose: () => void
  onConfirm: (amount: number) => void
  serviceName: string
  loading?: boolean
}) {
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    if (open) {
      setAmount(0)
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[400px] rounded-2xl p-6 space-y-4">

        <h2 className="text-lg font-semibold">
          Confirmar Compra
        </h2>

        <p className="text-sm text-gray-500">
          Serviço: {serviceName}
        </p>

        <input
          type="number"
          placeholder="Valor"
          value={amount}
          disabled={loading}
          onChange={(e) =>
            setAmount(Number(e.target.value))
          }
          className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-100"
        />

        <div className="flex justify-end gap-3">

          <button
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            disabled={amount <= 0 || loading}
            onClick={() => onConfirm(amount)}
            className={`px-4 py-2 rounded-lg text-white transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {loading ? 'Processando...' : 'Confirmar'}
          </button>

        </div>
      </div>
    </div>
  )
}
