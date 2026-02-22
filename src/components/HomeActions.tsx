import { useNavigate } from 'react-router-dom'
import {
  Wallet,
  ArrowDownCircle,
  Info,
  Bell,
  Megaphone,
} from 'lucide-react'

const actions = [
  { label: 'Depósito', icon: Wallet, to: '/deposit' },
  { label: 'Levantamento', icon: ArrowDownCircle, to: '/withdraw' },
  { label: 'Sobre', icon: Info, to: '/about' },
  { label: 'Notificações', icon: Bell, to: '/notifications' },
]

export default function HomeActions() {
  const navigate = useNavigate()

  return (
    <div className="px-4 py-4 space-y-6">

      {/* 🔔 Banner */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 text-xs text-emerald-400 animate-marquee-fast">
          <Megaphone size={14} />
          <span>
            A EMATEA é uma empresa angolana fundada em 04 de março de 2023, sediada em Malanje – Controlo nº1, atuando de forma estratégica nos setores de tecnologia, ativos digitais e comércio diversificado. 
          </span>
        </div>
      </div>

      {/* 🎯 Ações */}
      <div className="grid grid-cols-2 gap-4">
        {actions.map(({ label, icon: Icon, to }) => (
          <button
            key={label}
            onClick={() => navigate(to)}
            className="
              bg-white/5 border border-white/10
              rounded-2xl px-4 py-4
              flex items-center gap-3
              transition
              hover:bg-white/10
              active:scale-[0.98]
            "
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Icon size={18} className="text-emerald-400" />
            </div>

            <span className="text-sm font-medium text-white">
              {label}
            </span>
          </button>
        ))}
      </div>

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