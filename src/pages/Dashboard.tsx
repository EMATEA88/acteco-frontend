import { useEffect, useState } from 'react'
import { api } from '../services/api'

interface Summary {
  balance: number
  totalInvested: number
  totalEarnings: number
}

const CACHE_KEY = 'dashboard-summary-v1'

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 1️⃣ Render imediato via cache
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        setSummary(JSON.parse(cached))
      } catch {}
    }

    // 2️⃣ Atualização em background
    async function load() {
      try {
        const response = await api.get('/dashboard/summary')
        setSummary(response.data)
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify(response.data)
        )
      } catch {
        setError('Erro ao carregar dashboard')
      }
    }

    load()
  }, [])

  if (!summary && !error) {
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
        <p className="text-danger">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted px-5 pt-6 pb-28 animate-fadeZoom">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-surface rounded-2xl p-5 shadow-card">
          <p className="text-sm text-gray-500 mb-1">
            Saldo disponível
          </p>
          <p className="text-3xl font-semibold text-primary">
            {summary.balance.toLocaleString()} Kz
          </p>
        </div>

        <div className="bg-surface rounded-2xl p-5 shadow-soft">
          <p className="text-sm text-gray-500 mb-1">
            Total investido
          </p>
          <p className="text-2xl font-medium text-gray-900">
            {summary.totalInvested.toLocaleString()} Kz
          </p>
        </div>

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
