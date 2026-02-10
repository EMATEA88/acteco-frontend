export default function CommissionTable() {

  const commissionTable = [
    {
      label: "Comissão por Compra / Recarga",
      levels: [
        { level: "1º Nível", percent: "8%" },
        { level: "2º Nível", percent: "4%" },
        { level: "3º Nível", percent: "2%" },
      ],
    },
    {
      label: "Comissão por Tarefa",
      levels: [
        { level: "1º Nível", percent: "4%" },
        { level: "2º Nível", percent: "2%" },
        { level: "3º Nível", percent: "1%" },
      ],
    },
  ]

  return (
    <div className="bg-white rounded-3xl shadow-card overflow-hidden">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 px-4 py-3">
        <h3 className="text-white font-semibold text-sm tracking-wide">
          Tabela Oficial de Comissão
        </h3>
      </div>

      <div className="grid grid-cols-2">

        {commissionTable.map((type, i) => (
          <div key={i} className="p-4 border-r last:border-r-0">

            <h4 className="font-semibold text-emerald-700 mb-3 text-sm">
              {type.label}
            </h4>

            <div className="space-y-2">
              {type.levels.map((lvl, j) => (
                <div
                  key={j}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-600">{lvl.level}</span>
                  <span className="font-semibold text-emerald-700">
                    {lvl.percent}
                  </span>
                </div>
              ))}
            </div>

          </div>
        ))}

      </div>
    </div>
  )
}
