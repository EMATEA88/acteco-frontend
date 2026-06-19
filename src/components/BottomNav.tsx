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
        bg-white
        border-t border-gray-300
        h-[65px] flex items-center shadow-md
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
              ${isActive ? "text-gray-950" : "text-gray-700 hover:text-gray-950"}
              `
            }
          >
            {({ isActive }) => (
              <>
                {/* CONTAINER DO ÍCONE - COM VERDE DISCRETO SE ATIVO */}
                <div
                  className={`
                    flex items-center justify-center
                    w-10 h-7 rounded-lg border transition-all duration-300
                    ${isActive 
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700 scale-105" 
                      : "bg-transparent border-transparent text-gray-700"}
                  `}
                >
                  <Icon 
                    size={20} 
                    weight={isActive ? "fill" : "bold"} 
                  />
                </div>

                {/* TEXTO DA LABEL - REMOVIDA QUALQUER OPACIDADE APAGADA */}
                <span
                  className={`
                    transition-all duration-200 tracking-wider text-[8px]
                    ${isActive ? "font-black text-gray-950" : "font-extrabold text-gray-700"}
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