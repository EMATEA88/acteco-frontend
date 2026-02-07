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
    <div className="px-4 py-3 space-y-4">

      {/* 🔔 BANNER INFORMATIVO (COMPACTO) */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-emerald-700 animate-marquee-fast">
          <Megaphone size={14} />
          <span>
            ACTECO S.A — Sustainable recycling investments with daily income
          </span>
        </div>
      </div>

      {/* 🎯 AÇÕES — DESIGN COMPACTO */}
      <div className="grid grid-cols-2 gap-3 bg-emerald-100 p-3 rounded-xl">
        {actions.map(({ label, icon: Icon, to }) => (
          <button
            key={label}
            onClick={() => navigate(to)}
            className="
              bg-white rounded-xl px-4 py-3
              flex items-center gap-3
              shadow-sm
              transition
              hover:shadow-md
              active:scale-[0.98]
            "
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Icon size={18} className="text-emerald-600" />
            </div>

            <span className="text-sm font-medium text-gray-800">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* 🎞️ ANIMAÇÃO */}
      <style>{`
        @keyframes marqueeFast {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee-fast {
          white-space: nowrap;
          animation: marqueeFast 16s linear infinite;
        }
      `}</style>
    </div>
  )
}
