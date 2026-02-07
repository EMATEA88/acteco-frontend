import { Outlet, useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import NotificationBell from '../components/NotificationBell'

export default function AppLayout() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* 🔔 TOPO FIXO (SINO) */}
      <div className="h-12 bg-white shadow-sm flex items-center justify-end px-4">
        <button
          onClick={() => navigate('/notifications')}
          className="relative"
        >
          <NotificationBell />
        </button>
      </div>

      {/* CONTEÚDO */}
      <main className="flex-1 pb-16">
        <Outlet />
      </main>

      {/* RODAPÉ FIXO */}
      <BottomNav />
    </div>
  )
}
