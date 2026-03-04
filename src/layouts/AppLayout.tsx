import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useEffect } from "react"
import BottomNav from "../components/BottomNav"
import { Bell, ArrowLeft } from "lucide-react"
import { connectSocket } from "../services/socket"
import { useNotification } from "../contexts/NotificationContext"

export default function AppLayout() {

  const { unread } = useNotification()
  const navigate = useNavigate()
  const location = useLocation()

  const pathname = location.pathname || ""

  /* ================= SOCKET ================= */

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    connectSocket(token)
  }, [])

  /* ================= ROUTE CONFIG ================= */

  const isChatPage = pathname.startsWith("/otc/chat")

  /* ================= UI ================= */

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0B0E11] text-[#EAECEF] flex flex-col">

      {/* ================= TOP BACK BUTTON (CHAT ONLY) ================= */}
      {isChatPage && (
        <div className="fixed top-0 left-0 right-0 h-14 bg-[#0B0E11] flex items-center px-4 z-[9999] border-b border-gray-800">
          <button
            onClick={() => navigate(-1)}
            className="text-white"
          >
            <ArrowLeft size={22} />
          </button>
        </div>
      )}

      {/* ================= MAIN ================= */}
      <main
        className={`flex-1 overflow-y-auto ${
          isChatPage ? "pt-14" : "pb-20"
        }`}
      >
        <Outlet />
      </main>

      {/* ================= FOOTER ================= */}
      {!isChatPage && <BottomNav />}

      {/* ================= FLOATING NOTIFICATION BUTTON ================= */}
      {!isChatPage && (
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
            animate-float
          "
        >
          <Bell size={18} strokeWidth={2} />

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
              "
            >
              {unread}
            </span>
          )}
        </button>
      )}

    </div>
  )
}