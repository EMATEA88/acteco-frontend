import {
  Leaf,
  ShieldCheck,
  TrendingUp,
  Clock,
  Users,
  Wallet,
} from 'lucide-react'

const items = [
  { icon: Leaf, label: 'Eco-friendly', desc: '100% recycling projects' },
  { icon: TrendingUp, label: 'Daily income', desc: 'Consistent returns' },
  { icon: ShieldCheck, label: 'Secure', desc: 'Protected investments' },
  { icon: Clock, label: 'Long-term', desc: '180 days plans' },
  { icon: Users, label: 'Community', desc: 'Growing investor base' },
  { icon: Wallet, label: 'Easy withdraw', desc: 'Fast & simple payouts' },
]

export default function HomeHighlights() {
  return (
    <section className="px-4 pb-8">
      <div className="grid grid-cols-2 gap-4">
        {items.map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl"
          >
            <Icon size={20} className="text-emerald-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">
                {label}
              </p>
              <p className="text-xs text-gray-400">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}