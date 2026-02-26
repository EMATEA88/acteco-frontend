import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import NotificationBell from '../components/NotificationBell'
import { ArrowLeft, Home } from 'lucide-react'

export default function AppLayout() {

  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  const immersiveRoutes = [
    '/otc',
    '/services',
    '/profile',
    '/applications',
    '/deposit',
    '/marketing'
  ]

  const hideFooterRoutes = [
    '/applications',
    '/marketing'
  ]

  const isImmersive = immersiveRoutes.some(route =>
    pathname.startsWith(route)
  )

  const hideFooter = hideFooterRoutes.some(route =>
    pathname.startsWith(route)
  )

  const isHome = pathname === '/home'

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate('/home')
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF]">

      {!isImmersive && (
        <header
          className="
            fixed top-0 left-0 right-0 z-50
            h-12
            flex items-center justify-between
            px-4
            bg-[#0B0E11]
            border-b border-[#2B3139]
          "
        >

          <div>
            {!isHome && (
              <button onClick={handleBack}>
                <ArrowLeft size={20} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="binance-button-dark p-1.5"
            >
              <Home size={16} />
            </button>

            <NotificationBell />
          </div>

        </header>
      )}

      <main className={`${!isImmersive ? 'pt-12 pb-16' : ''}`}>
        <Outlet />
      </main>

      {!isImmersive && !hideFooter && <BottomNav />}

    </div>
  )
}