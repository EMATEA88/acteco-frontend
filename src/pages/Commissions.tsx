import { useEffect, useState } from 'react'
import { api } from '../services/api'

type CommissionSummary = {
  level1: number
  level2: number
  level3: number
  total: number
}

export default function Commissions() {
  const [data, setData] = useState<CommissionSummary | null>(null)

  useEffect(() => {
    api.get('/commission/summary').then(res => setData(res.data))
  }, [])

  if (!data) return null

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-xl font-semibold text-blue-900 mb-6">
        Commission Details
      </h1>

      <div className="bg-white rounded-2xl shadow p-6 space-y-3">
        <Row label="Level 1 Commission" value={`${data.level1} Kz`} />
        <Row label="Level 2 Commission" value={`${data.level2} Kz`} />
        <Row label="Level 3 Commission" value={`${data.level3} Kz`} />
        <hr />
        <Row
          label="Total Commission"
          value={`${data.total} Kz`}
          strong
        />
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  strong,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}</span>
      <span className={strong ? 'font-semibold' : ''}>{value}</span>
    </div>
  )
}
