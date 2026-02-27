import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useEffect } from "react"
import BottomNav from "../components/BottomNav"
import { Bell } from "lucide-react"
import { connectSocket } from "../services/socket"
import { useNotification } from "../contexts/NotificationContext"

export default function AppLayout() {

  const { unread } = useNotification()

  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  /* ================= SOCKET ================= */

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    connectSocket(token)
  }, [])

  /* ================= ROUTE CONFIG ================= */

  /**
   * Todas as rotas aqui NÃO terão footer.
   * Para adicionar novas no futuro, apenas inclua no array.
   */
  const routesWithoutFooter = [
    "/otc",
    "/deposit",
    // "/withdraw",
    // "/admin",
    // "/fullscreen-page"
  ]

  const hideFooter = routesWithoutFooter.some(route =>
    pathname.startsWith(route)
  )

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] relative">

      {/* ================= MAIN ================= */}
      <main className={!hideFooter ? "pb-20" : ""}>
        <Outlet />
      </main>

      {/* ================= FOOTER ================= */}
      {!hideFooter && <BottomNav />}

      {/* ================= FLOATING NOTIFICATION BUTTON ================= */}
      <button
        onClick={() => navigate("/notifications")}
        className="
          fixed
          bottom-24
          right-5
          z-[9999]
          w-11
          h-11
          rounded-full
          bg-emerald-500/15
          border border-emerald-500/40
          text-emerald-400
          flex
          items-center
          justify-center
          transition-all
          duration-300
          hover:bg-emerald-500/25
          hover:scale-105
          shadow-[0_0_20px_rgba(16,185,129,0.25)]
          backdrop-blur-lg
          float-soft
        "
      >
        <Bell
          size={18}
          strokeWidth={2}
          className="text-emerald-500"
        />

        {unread > 0 && (
          <span
            className="
              absolute
              -top-1
              -right-1
              bg-red-500
              text-white
              text-[10px]
              font-semibold
              w-5
              h-5
              flex
              items-center
              justify-center
              rounded-full
              shadow-md
            "
          >
            {unread}
          </span>
        )}
      </button>

    </div>
  )
}