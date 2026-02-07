export default function CommissionCards({
  today,
  yesterday,
}: {
  today: number
  yesterday: number
}) {
  return (
    <div className="px-6 -mt-14 grid grid-cols-2 gap-4 relative z-10">
      <div className="bg-white rounded-2xl p-4 shadow">
        <p className="text-xs text-gray-500">Comissão hoje</p>
        <p className="text-xl font-bold text-green-600">
          {today.toLocaleString()} Kz
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow">
        <p className="text-xs text-gray-500">Comissão ontem</p>
        <p className="text-xl font-bold">
          {yesterday.toLocaleString()} Kz
        </p>
      </div>
    </div>
  )
}
