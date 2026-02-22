import { NavLink, useLocation } from "react-router-dom"
import {
  Home,
  User,
  ShoppingBag,
  Repeat
} from "lucide-react"

const links = [
  { to: "/home", label: "Início", icon: Home },
  { to: "/services", label: "Serviços", icon: ShoppingBag },
  { to: "/otc", label: "OTC", icon: Repeat },
  { to: "/profile", label: "Perfil", icon: User },
]

export default function BottomNav() {

  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0F172A] border-t border-white/10">
      <div className="flex justify-around items-center py-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `
              flex flex-col items-center gap-1 text-xs transition
              ${isActive ? "text-emerald-400" : "text-gray-400"}
              `
            }
          >
            <div
              className={`
                p-2 rounded-xl transition
                ${location.pathname.startsWith(to)
                  ? "bg-emerald-500/10"
                  : ""}
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
  )
}