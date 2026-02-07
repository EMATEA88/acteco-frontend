import { useEffect, useState } from 'react'
import { TaskService } from '../services/task.service'
import Toast from '../components/ui/Toast'
import { CheckCircle, Clock } from 'lucide-react'

export default function Task() {
  const [loading, setLoading] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] =
    useState<'success' | 'error'>('error')

  async function handleExecuteTask() {
    if (loading) return

    try {
      setLoading(true)

      await TaskService.execute()

      // ✅ SUCESSO
      setToastType('success')
      setToastMessage('Tarefa diária executada com sucesso')
      setToastVisible(true)
    } catch (err: any) {
      const error = err?.response?.data?.error

      // ❌ ERROS CONTROLADOS
      setToastType('error')

      if (error === 'TASK_ALREADY_DONE_TODAY') {
        setToastMessage('A tarefa de hoje já foi executada')
      } else if (error === 'NO_ACTIVE_PRODUCT') {
        setToastMessage('É necessário possuir um produto ativo')
      } else {
        setToastMessage('A tarefa só pode ser executada uma vez por dia')
      }

      setToastVisible(true)
    } finally {
      setLoading(false)
    }
  }

  /* AUTO-HIDE TOAST */
  useEffect(() => {
    if (!toastVisible) return
    const timer = setTimeout(() => {
      setToastVisible(false)
    }, 2200)
    return () => clearTimeout(timer)
  }, [toastVisible])

  return (
    <div className="min-h-screen px-5 pt-8 pb-28 bg-gradient-to-b from-emerald-50 to-white animate-fadeZoom">
      {/* TOAST */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
      />

      {/* CONTAINER CENTRAL */}
      <div className="flex items-center justify-center">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-card p-8 text-center relative overflow-hidden">
          
          {/* DECOR GRADIENT */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-200 rounded-full blur-3xl opacity-40" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-300 rounded-full blur-3xl opacity-30" />

          {/* HEADER */}
          <h2 className="relative text-xl font-semibold text-gray-900 mb-2">
            Tarefa diária
          </h2>

          <p className="relative text-sm text-gray-600 mb-6">
            Execute esta tarefa uma vez a cada 24 horas para gerar rendimento.
          </p>

          {/* INFO */}
          <div className="relative flex items-center justify-center gap-2 text-xs text-gray-500 mb-8">
            <Clock size={14} />
            Disponível a cada 24h
          </div>

          {/* BOTÃO PRINCIPAL */}
          <div className="relative flex flex-col items-center gap-3">
            <button
              onClick={handleExecuteTask}
              disabled={loading}
              className="
                w-24 h-24 rounded-full
                bg-gradient-to-br from-emerald-600 to-emerald-500
                shadow-xl
                flex items-center justify-center
                transition
                active:scale-95
                disabled:opacity-60
                animate-pulse-slow
              "
            >
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden">
                {loading ? (
                  <span className="text-xs font-semibold text-emerald-600">
                    ...
                  </span>
                ) : (
                  <img
                    src="/logo.png"
                    alt="ACTECO"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </button>

            <span className="text-sm font-medium text-gray-800">
              {loading ? 'Processando tarefa…' : 'Executar tarefa'}
            </span>

            {!loading && (
              <div className="flex items-center gap-1 text-xs text-emerald-600">
                <CheckCircle size={14} />
                Seguro • Automático • Diário
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
