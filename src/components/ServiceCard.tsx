import ServiceStatusBadge from './ServiceStatusBadge'

interface Props {
  partnerName: string
  planName: string
  amount: number
  status: string
  createdAt: string
}

export default function ServiceCard({
  partnerName,
  planName,
  amount,
  status,
  createdAt
}: Props) {

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center">
      <div>
        <div className="font-medium text-white">
          {partnerName}
        </div>

        <div className="text-sm text-gray-400">
          {planName}
        </div>

        <div className="text-sm mt-1 text-white">
          {amount.toLocaleString()} Kz
        </div>

        <div className="text-xs text-gray-500 mt-1">
          {new Date(createdAt).toLocaleString()}
        </div>
      </div>

      <ServiceStatusBadge status={status} />
    </div>
  )
}