import { NavLink } from "react-router-dom"
import {
  House,                 // Home limpa e moderna
  UserCircle,           // Perfil com silhueta corporativa/bancária
  DeviceMobile,         // Recargas (muito mais intuitivo para telemóvel/serviços)
  ClockCounterClockwise, // Transações (focado em histórico/movimentos)
  SquaresFour,          // Dashboard / Visão Geral em grelha
} from "@phosphor-icons/react"

const links = [
  { to: "/home", label: "Home", icon: House },
  { to: "/recharges", label: "Recargas", icon: DeviceMobile },
  { to: "/transactions", label: "Histórico", icon: ClockCounterClockwise },
  { to: "/dashboard", label: "Painel", icon: SquaresFour },
  { to: "/profile", label: "Perfil", icon: UserCircle },
]

export default function BottomNav() {
  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-[100]
        w-screen
        bg-[#0a2533]/95
        border-t border-cyan-500/20
        h-[68px] flex items-center shadow-2xl backdrop-blur-xl
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
              transition-all duration-200 group
              ${isActive ? "text-cyan-300" : "text-cyan-200/50 hover:text-cyan-200/80"}
              `
            }
          >
            {({ isActive }) => (
              <>
                {/* CONTAINER DO ÍCONE - ESTILO FINTECH */}
                <div
                  className={`
                    flex items-center justify-center
                    w-11 h-7 rounded-full transition-all duration-300
                    ${isActive 
                      ? "bg-[#144863] text-cyan-300 scale-105 shadow-lg shadow-cyan-950/40 border border-cyan-500/30" 
                      : "bg-transparent text-cyan-200/50 group-hover:text-cyan-200"}
                  `}
                >
                  <Icon 
                    size={21} 
                    weight={isActive ? "fill" : "regular"} 
                  />
                </div>

                {/* TEXTO DA LABEL */}
                <span
                  className={`
                    transition-all duration-200 tracking-wider text-[8px]
                    ${isActive ? "font-extrabold text-cyan-300" : "font-medium text-cyan-200/50"}
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