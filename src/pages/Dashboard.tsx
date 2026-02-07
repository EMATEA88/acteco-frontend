import { useEffect, useState } from 'react'
import { api } from '../services/api'

interface Summary {
  balance: number
  totalInvested: number
  totalEarnings: number
}

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        const response = await api.get('/dashboard/summary')
        setSummary(response.data)
      } catch {
        setError('Erro ao carregar dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <p className="text-gray-500">
          A carregar dashboard…
        </p>
      </div>
    )
  }

  if (error || !summary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <p className="text-danger">
          {error}
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted px-5 pt-6 pb-28 animate-fadeZoom">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">
        Dashboard
      </h1>

      {/* ================= CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* SALDO */}
        <div className="bg-surface rounded-2xl p-5 shadow-card">
          <p className="text-sm text-gray-500 mb-1">
            Saldo disponível
          </p>
          <p className="text-3xl font-semibold text-primary">
            {summary.balance.toLocaleString()} Kz
          </p>
        </div>

        {/* INVESTIDO */}
        <div className="bg-surface rounded-2xl p-5 shadow-soft">
          <p className="text-sm text-gray-500 mb-1">
            Total investido
          </p>
          <p className="text-2xl font-medium text-gray-900">
            {summary.totalInvested.toLocaleString()} Kz
          </p>
        </div>

        {/* GANHOS */}
        <div className="bg-surface rounded-2xl p-5 shadow-soft">
          <p className="text-sm text-gray-500 mb-1">
            Ganhos totais
          </p>
          <p className="text-2xl font-medium text-emerald-600">
            {summary.totalEarnings.toLocaleString()} Kz
          </p>
        </div>
      </div>
    </div>
  )
}
