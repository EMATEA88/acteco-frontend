import { NavLink } from "react-router-dom"
import {
  House,
  User,
  Lightning,      // Ícone para Recargas Rápidas
  CreditCard,     // Ícone para Faturas/Pagamentos
  Receipt,        // Ícone para Transações
  ChartPieSlice,  // Ícone para o Dashboard
} from "@phosphor-icons/react"

// Ordem corrigida: Recargas colocada na terceira posição
const links = [
  { to: "/home", label: "Home", icon: House },

  { to: "/payments", label: "Pagamentos", icon: CreditCard },

  { to: "/recharges", label: "Recargas", icon: Lightning }, // Fica no meio/terceiro card

  { to: "/transactions", label: "Transações", icon: Receipt },

  { to: "/dashboard", label: "Dashboard", icon: ChartPieSlice },

  { to: "/profile", label: "Perfil", icon: User },
]

export default function BottomNav() {
  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-[100]
        w-screen
        bg-white/95 backdrop-blur-xl
        border-t border-gray-100
        h-[65px] flex items-center
      "
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex justify-around items-center w-full px-2">

        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onMouseDown={(e) => e.preventDefault()}
            className={({ isActive }) =>
              `
              flex flex-col items-center gap-1 text-[9px] font-bold uppercase tracking-tighter
              transition-all duration-200
              ${isActive ? "text-gray-900" : "text-gray-400"}
              `
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`
                    flex items-center justify-center
                    w-9 h-7 rounded-lg transition-all duration-300
                    ${isActive 
                      ? "bg-gray-100 scale-105 text-emerald-600" 
                      : "bg-transparent text-gray-400"}
                  `}
                >
                  <Icon 
                    size={20} 
                    weight={isActive ? "fill" : "regular"} 
                  />
                </div>

                <span
                  className={`
                    transition-all duration-300 tracking-wider text-[8px]
                    ${isActive ? "opacity-100 font-black text-gray-900" : "opacity-60 font-medium"}
                  `}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}

      </div>
    </nav>
  )
}