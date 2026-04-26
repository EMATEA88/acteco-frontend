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

  /* ================= ROUTE DETECTION ================= */
  const isOtcPage = pathname.startsWith("/otc")
  // Detecta se o usuário está especificamente na tela de chat
  const isChatting = pathname.includes("/otc/chat")

  /* ================= UI ================= */
  return (
    <div className="min-h-screen w-full bg-[#0B0E11] text-[#EAECEF] flex flex-col">

      {/* TOP BACK BUTTON (OTC) 
          Só renderiza se for uma página OTC, mas NÃO for a tela de chat,
          pois o componente OtcChat já possui seu próprio Header.
      */}
      {isOtcPage && !isChatting && (
        <div className="fixed top-0 left-0 right-0 h-14 bg-[#0B0E11] flex items-center px-4 z-50 border-b border-gray-800">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft size={22} />
          </button>
          <span className="ml-4 font-medium">Voltar</span>
        </div>
      )}

      {/* ================= MAIN ================= */}
      <main
        className={`flex-1 flex flex-col ${
          // Se for chat, removemos o padding superior (pt-0) para o Header do chat encostar no topo.
          // Se for outra página OTC, mantemos pt-14 para não cobrir o conteúdo com o botão de voltar.
          isOtcPage && !isChatting 
            ? "pt-14" 
            : isChatting 
              ? "pt-0" 
              : "pb-20 overflow-y-auto"
        }`}
      >
        <Outlet />
      </main>

      {/* ================= FOOTER ================= */
      /* Oculta o menu inferior e notificações flutuantes durante o OTC */}
      {!isOtcPage && <BottomNav />}

      {/* ================= FLOATING NOTIFICATION ================= */}
      {!isOtcPage && (
        <button
          onClick={() => navigate("/notifications")}
          className="
            fixed
            bottom-24
            right-5
            z-40
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