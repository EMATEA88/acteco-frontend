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
  { to: "/tasks", label: "Tarefas", icon: Megaphone },
  { to: "/applications", label: "Aplicações", icon: ChartPieSlice },
  { to: "/profile", label: "Perfil", icon: User },
]

export default function BottomNav() {
  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-[100]
        w-screen
        bg-[#0B0E11]/95 backdrop-blur-xl
        border-t border-[#2B3139]
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
            onTouchStart={(e) => e.preventDefault()}
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
                    transition-all duration-300
                    ${isActive ? "opacity-100" : "opacity-60"}
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