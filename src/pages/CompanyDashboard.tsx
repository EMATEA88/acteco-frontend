import { useEffect, useState } from 'react'
import { getCompanyDashboard } from '../services/dashboard'

export default function CompanyDashboard() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    getCompanyDashboard().then(res => setData(res.data))
  }, [])

  if (!data) return <p>Carregando...</p>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Dashboard Empresa</h1>

      <p>Total campanhas: {data.totalCampaigns}</p>
      <p>Total tasks: {data.totalTasks}</p>
      <p>Completadas: {data.totalCompleted}</p>
      <p>Total gasto: {data.totalSpent} Kz</p>

      <div className="mt-4">
        {data.campaigns.map((c: any) => (
          <div key={c.id} className="border p-3 mb-2 rounded">
            <p>{c.title}</p>
            <p>Progresso: {c.progress}%</p>
            <p>Gasto: {c.spent} Kz</p>
          </div>
        ))}
      </div>
    </div>
  )
}