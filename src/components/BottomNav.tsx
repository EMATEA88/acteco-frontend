import { NavLink } from "react-router-dom"
import {
  House,
  User,
  Lightning,      // Ícone elétrico e ágil perfeito para Recargas Rápidas
  CreditCard,     // Ícone ideal para faturas, referências e Pagamentos
  Receipt,        // Ícone perfeito de extrato/fatura para Transações
  ChartPieSlice,  // Ícone ideal de gráficos para o Dashboard/Visão Geral
} from "@phosphor-icons/react"

const links = [
  { to: "/home", label: "Home", icon: House },

  { to: "/recharges", label: "Recargas", icon: Lightning },

  { to: "/payments", label: "Pagamentos", icon: CreditCard },

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
        bg-[#0B0E11]/95 backdrop-blur-xl
        border-t border-white/[0.04]
        h-[65px] flex items-center
      "
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex justify-around items-center w-full px-2">

        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            // Removido o preventDefault do TouchStart para não quebrar o clique nativo no mobile
            onMouseDown={(e) => e.preventDefault()}
            className={({ isActive }) =>
              `
              flex flex-col items-center gap-1 text-[9px] font-bold uppercase tracking-tighter
              transition-all duration-200
              ${isActive ? "text-white" : "text-[#848E9C]"}
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
                      ? "bg-white/10 scale-105" 
                      : "bg-transparent"}
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
                    ${isActive ? "opacity-100 font-black" : "opacity-60 font-medium"}
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