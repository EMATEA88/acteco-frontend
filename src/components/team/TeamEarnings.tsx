type Props = {
  earnings: {
    level1?: number
    level2?: number
    level3?: number
    total?: number
  } | null
}

export default function TeamEarnings({ earnings }: Props) {
  const rows = [
    { key: 'level1', label: 'Nível 1' },
    { key: 'level2', label: 'Nível 2' },
    { key: 'level3', label: 'Nível 3' },
  ] as const

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <p className="font-semibold text-gray-900 mb-4">
        Comissões da equipa
      </p>

      <div className="space-y-3 text-sm">
        {rows.map(r => (
          <div
            key={r.key}
            className="flex items-center justify-between"
          >
            <span className="text-gray-500">
              {r.label}
            </span>
            <span className="font-medium text-gray-900">
              {earnings?.[r.key] ?? 0} Kz
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">
          Total
        </span>
        <span className="text-xl font-semibold text-emerald-600">
          {earnings?.total ?? 0} Kz
        </span>
      </div>
    </div>
  )
}
