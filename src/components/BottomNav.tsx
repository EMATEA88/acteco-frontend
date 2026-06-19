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
        bg-[#0B0E11]
        border-t border-white/[0.05]
        h-[65px] flex items-center shadow-2xl backdrop-blur-md bg-opacity-95
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
              flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-wider
              transition-all duration-200
              ${isActive ? "text-white" : "text-gray-500 hover:text-gray-300"}
              `
            }
          >
            {({ isActive }) => (
              <>
                {/* CONTAINER DO ÍCONE - CALIBRADO PARA MODO ESCURO */}
                <div
                  className={`
                    flex items-center justify-center
                    w-10 h-7 rounded-lg border transition-all duration-300
                    ${isActive 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 scale-105" 
                      : "bg-transparent border-transparent text-gray-500"}
                  `}
                >
                  <Icon 
                    size={20} 
                    weight={isActive ? "fill" : "bold"} 
                  />
                </div>

                {/* TEXTO DA LABEL */}
                <span
                  className={`
                    transition-all duration-200 tracking-wider text-[8px]
                    ${isActive ? "font-black text-emerald-400" : "font-extrabold text-gray-500"}
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