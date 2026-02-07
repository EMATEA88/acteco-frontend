type Props = {
  summary: {
    level1?: number
    level2?: number
    level3?: number
    total?: number
  } | null
}

type StatItem = {
  key: keyof NonNullable<Props['summary']>
  label: string
  highlight?: boolean
}

export default function TeamStats({ summary }: Props) {
  const items: StatItem[] = [
    { key: 'level1', label: 'Nível 1' },
    { key: 'level2', label: 'Nível 2' },
    { key: 'level3', label: 'Nível 3' },
    { key: 'total', label: 'Total', highlight: true },
  ]

  return (
    <div className="grid grid-cols-4 gap-3">
      {items.map(i => {
        const value = summary?.[i.key] ?? 0

        return (
          <div
            key={i.key}
            className={`
              rounded-xl p-4 text-center shadow-sm
              ${
                i.highlight
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-900'
              }
            `}
          >
            <p
              className={`
                text-[11px] uppercase tracking-wide
                ${
                  i.highlight
                    ? 'text-white/80'
                    : 'text-gray-500'
                }
              `}
            >
              {i.label}
            </p>

            <p className="text-2xl font-semibold mt-1">
              {value}
            </p>
          </div>
        )
      })}
    </div>
  )
}
