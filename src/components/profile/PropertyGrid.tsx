import { useNavigate } from 'react-router-dom'
import { CreditCard, BarChart3, FileText, Gift } from 'lucide-react'

const items = [
  { label: 'Banco', icon: CreditCard, path: '/bank' },
  { label: 'Transações', icon: BarChart3, path: '/transactions' },
  { label: 'Fatura', icon: FileText, path: '/invoice' },
  { label: 'Presente', icon: Gift, path: '/gift' },
]

export default function PropertyGrid() {
  const navigate = useNavigate()

  return (
    <div className="px-6 mt-8">
      <h3 className="text-sm font-medium mb-4 text-gray-700">
        Minhas propriedades
      </h3>

      <div className="grid grid-cols-4 gap-4">
        {items.map(({ label, icon: Icon, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="bg-green-50 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm"
          >
            <Icon className="text-green-600" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
