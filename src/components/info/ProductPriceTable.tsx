export default function ProductPriceTable() {
  const products = [
    {
      name: "PET - Etileno",
      price: 6000,
      daily: 210,
      duration: "180 dias",
    },
    {
      name: "PEAD - Polietileno",
      price: 15000,
      daily: 525,
      duration: "180 dias",
    },
    {
      name: "PVC - Policloreto",
      price: 30000,
      daily: 1050,
      duration: "180 dias",
    },
    {
      name: "PBD - Polietileno BD",
      price: 50000,
      daily: 1750,
      duration: "200 dias",
    },
    {
      name: "PS - Poliestireno Pro",
      price: 100000,
      daily: 3500,
      duration: "200 dias",
    },
    {
      name: "PLA - Ácido Polilático",
      price: 250000,
      daily: 8750,
      duration: "210 dias",
    },
  ]

  return (
    <div className="mt-8 bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4 text-emerald-700">
        Tabela de Investimentos
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-emerald-600 rounded-xl overflow-hidden">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="p-3 text-left">Produto</th>
              <th className="p-3 text-center">Preço</th>
              <th className="p-3 text-center">Rendimento Diário</th>
              <th className="p-3 text-center">Validade</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p, i) => (
              <tr
                key={i}
                className="border-b last:border-none hover:bg-emerald-50 transition"
              >
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-center font-semibold text-emerald-700">
                  {p.price.toLocaleString()} Kz
                </td>
                <td className="p-3 text-center">
                  {p.daily.toLocaleString()} Kz
                </td>
                <td className="p-3 text-center">{p.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
