import { NavLink } from "react-router-dom"
import {
  Home,
  User,
  Users,
  Repeat,
  Megaphone,
  Wallet
} from "lucide-react"

const links = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/kixikila", label: "Kixikila", icon: Users },
  { to: "/otc", label: "OTC", icon: Repeat },
  { to: "/marketing", label: "Marketing", icon: Megaphone },
  { to: "/applications", label: "Aplicações", icon: Wallet },
  { to: "/profile", label: "Perfil", icon: User },
]

export default function BottomNav() {

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50
        bg-[#0B0E11]
        border-t border-[#2B3139]
      "
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex justify-around items-center py-2">

        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `
              flex flex-col items-center gap-1 text-[10px] transition
              ${isActive ? "text-[#FCD535]" : "text-[#848E9C]"}
              `
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}

      </div>
    </nav>
  )
}