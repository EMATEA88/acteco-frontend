import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import NotificationBell from '../components/NotificationBell'
import { ArrowLeft, Home } from 'lucide-react'

export default function AppLayout() {

  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  /* =========================
     ROTAS ESPECIAIS
  ========================= */

  const immersiveRoutes = [
    '/otc',
    '/services',
    '/profile',
    '/applications' // ✅ ADICIONADO
  ]

  const lightRoutes = [
    '/deposit'
  ]

  const hideFooterRoutes = [
    '/deposit',
    '/applications' // ✅ ADICIONADO
  ]

  const isImmersive = immersiveRoutes.some(route =>
    pathname.startsWith(route)
  )

  const isLight = lightRoutes.some(route =>
    pathname.startsWith(route)
  )

  const hideFooter = hideFooterRoutes.some(route =>
    pathname.startsWith(route)
  )

  const isHome = pathname === '/home'

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/home')
    }
  }

  return (
    <div
      className={`
        min-h-screen
        ${isLight
          ? 'bg-gray-50 text-gray-900'
          : 'bg-[#0B1220] text-white'}
      `}
    >

      {/* 🔝 HEADER FIXO */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          h-12
          flex items-center justify-between
          px-4
          ${isLight
            ? 'bg-white border-b border-gray-200'
            : 'bg-[#0B1220] border-b border-white/10'}
        `}
      >

        {/* ESQUERDA */}
        {isImmersive ? (
          <button
            onClick={handleBack}
            className="hover:opacity-80 transition"
          >
            <ArrowLeft size={22} />
          </button>
        ) : (
          <div />
        )}

        {/* DIREITA */}
        <div className="flex items-center gap-3">

          {!isHome && (
            <button
              onClick={() => navigate('/home')}
              className={`
                p-1.5 rounded-md transition
                ${isLight
                  ? 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10 opacity-60 hover:opacity-100'}
              `}
            >
              <Home size={16} />
            </button>
          )}

          {!isImmersive && (
            <button
              onClick={() => navigate('/notifications')}
              className="hover:opacity-80 transition"
            >
              <NotificationBell />
            </button>
          )}

        </div>

      </header>

      {/* 📄 CONTEÚDO */}
      <main
        className={`
          pt-12
          ${isImmersive || hideFooter ? '' : 'pb-16'}
        `}
      >
        <Outlet />
      </main>

      {/* ⬇ RODAPÉ */}
      {!isImmersive && !hideFooter && <BottomNav />}

    </div>
  )
}