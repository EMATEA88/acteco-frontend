import { useNavigate } from 'react-router-dom'
import { Wallet, ArrowDownCircle } from 'lucide-react'

export default function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="px-6 mt-6 grid grid-cols-2 gap-4">
      <button
        onClick={() => navigate('/deposit')}
        className="bg-green-100 rounded-2xl p-4 flex items-center gap-3 font-medium"
      >
        <Wallet className="text-green-600" />
        Recarregar
      </button>

      <button
        onClick={() => navigate('/withdraw')}
        className="bg-green-100 rounded-2xl p-4 flex items-center gap-3 font-medium"
      >
        <ArrowDownCircle className="text-green-600" />
        Retirar
      </button>
    </div>
  )
}
