import { NavLink } from "react-router-dom"
import {
  House,
  User,
  UsersThree,
  ArrowsLeftRight,
  Megaphone,
  ChartPieSlice
} from "@phosphor-icons/react"

const links = [
  { to: "/home", label: "Início", icon: House },
  { to: "/kixikila", label: "Kixikila", icon: UsersThree },
  { to: "/otc", label: "OTC", icon: ArrowsLeftRight },
  { to: "/tasks", label: "Marketing", icon: Megaphone },
  { to: "/applications", label: "Investir", icon: ChartPieSlice },
  { to: "/profile", label: "Perfil", icon: User },
]

export default function BottomNav() {
  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0
        z-[100]
        bg-[#0a0a0a]/80
        backdrop-blur-xl
        border-t border-white/5
        shadow-[0_-10px_40px_rgba(0,0,0,0.5)]
      "
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex justify-around items-center h-16 max-w-2xl mx-auto px-2">

        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `
              flex flex-col items-center justify-center gap-1.5 
              w-full h-full transition-all duration-300 relative
              ${isActive ? "text-green-500" : "text-gray-600 hover:text-gray-400"}
              `
            }
          >
            {({ isActive }) => (
              <>
                {/* INDICADOR DE LUZ PARA ITEM ATIVO */}
                {isActive && (
                  <div className="absolute -top-[1px] w-8 h-[2px] bg-green-500 shadow-[0_0_15px_#22c55e] rounded-full animate-pulse" />
                )}
                
                <Icon 
                  size={22} 
                  weight={isActive ? "fill" : "duotone"} 
                  className={`transition-transform duration-300 ${isActive ? "scale-110" : "scale-100"}`}
                />
                
                <span className={`
                  text-[9px] font-black uppercase tracking-widest leading-none
                  ${isActive ? "opacity-100" : "opacity-60 font-bold"}
                `}>
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