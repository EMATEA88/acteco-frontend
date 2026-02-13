import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  ShoppingBag,
  CheckSquare,
  Users,
  User,
  MessageCircle,
} from 'lucide-react'

const links = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/products', label: 'Produtos', icon: ShoppingBag },
  { to: '/tasks', label: 'Task', icon: CheckSquare },
  { to: '/team', label: 'Team', icon: Users },
  { to: '/profile', label: 'Perfil', icon: User },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <>
      {/* Botão flutuante de suporte */}
      <button
        onClick={() => navigate('/support')}
        className="
          fixed 
          bottom-20 
          right-5 
          z-[60]
          bg-emerald-600 
          hover:bg-emerald-700
          text-white 
          p-4 
          rounded-full 
          shadow-lg 
          transition 
          animate-bounce
        "
      >
        <MessageCircle size={24} />
      </button>

      {/* Barra inferior */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
        <div className="flex justify-around items-center py-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `
                  flex flex-col items-center gap-1 text-xs transition
                  ${
                    isActive
                      ? 'text-emerald-600'
                      : 'text-gray-400'
                  }
                `
              }
            >
              <div
                className={`
                  p-2 rounded-xl transition
                  ${
                    location.pathname === to
                      ? 'bg-emerald-50'
                      : ''
                  }
                `}
              >
                <Icon size={22} />
              </div>
              <span className="text-[11px]">
                {label}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
