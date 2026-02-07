import { useEffect, useState } from 'react'
import { api } from '../services/api'

const CACHE_KEY = 'dashboard-summary'

export default function Dashboard() {
  const cached = localStorage.getItem(CACHE_KEY)
  const [summary, setSummary] = useState<any>(cached ? JSON.parse(cached) : null)

  useEffect(() => {
    api.get('/dashboard/summary')
      .then(res => {
        setSummary(res.data)
        localStorage.setItem(CACHE_KEY, JSON.stringify(res.data))
      })
      .catch(() => {})
  }, [])

  if (!summary) return null

  return (
    <div className="min-h-screen bg-muted px-5 pt-6 pb-28">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card label="Saldo disponível" value={`${summary.balance} Kz`} />
        <Card label="Total investido" value={`${summary.totalInvested} Kz`} />
        <Card label="Ganhos totais" value={`${summary.totalEarnings} Kz`} highlight />
      </div>
    </div>
  )
}

function Card({ label, value, highlight }: any) {
  return (
    <div className={`rounded-2xl p-5 shadow-card ${highlight ? 'bg-emerald-50' : 'bg-white'}`}>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  )
}
