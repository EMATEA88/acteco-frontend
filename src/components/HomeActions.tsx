import { useNavigate } from 'react-router-dom'
import {
  UserPlus,
  Store,
  Wallet,
  ArrowDownCircle,
  Info,
  Bell,
  Megaphone,
} from 'lucide-react'

const actions = [
  { label: 'Invite', icon: UserPlus, to: '/team' },
  { label: 'Shop', icon: Store, to: '/shop' },
  { label: 'Deposit', icon: Wallet, to: '/deposit' },
  { label: 'Withdraw', icon: ArrowDownCircle, to: '/withdraw' },
  { label: 'About', icon: Info, to: '/about' },
  { label: 'Notifications', icon: Bell, to: '/notifications' },
]

export default function HomeActions() {
  const navigate = useNavigate()

  return (
    <div className="p-4 space-y-4 animate-fadeZoom">

      {/* 🔔 BANNER INFORMATIVO */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 text-sm text-emerald-700 whitespace-nowrap animate-marquee-fast">
          <Megaphone size={16} />
          <span>
            ACTECO S.A — Sustainable recycling investments with daily income and secure returns
          </span>
        </div>
      </div>

      {/* 🎯 AÇÕES */}
      <div className="grid grid-cols-3 gap-4 bg-emerald-100 p-4 rounded-2xl">
        {actions.map(({ label, icon: Icon, to }) => (
          <button
            key={label}
            onClick={() => navigate(to)}
            className="
              bg-white rounded-2xl p-4 shadow-soft
              flex flex-col items-center gap-2
              transition
              hover:shadow-card
              active:scale-95
            "
          >
            {/* ÍCONE PROFISSIONAL */}
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
              <Icon size={24} className="text-emerald-600" />
            </div>

            <span className="text-xs font-medium text-gray-800">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* 🎞️ ANIMAÇÕES LOCAIS */}
      <style>{`
        @keyframes marqueeFast {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee-fast {
          animation: marqueeFast 14s linear infinite;
        }
      `}</style>
    </div>
  )
}
