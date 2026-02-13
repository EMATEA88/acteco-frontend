export default function About() {
  return (
    <div className="p-4 space-y-10 bg-gradient-to-br from-blue-50 to-blue-100">

      {/* HERO INSTITUCIONAL */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-400 to-blue-200 p-8 text-center">
        <h1 className="text-3xl font-bold text-blue-900 tracking-wide">
          EMATEA
        </h1>
        <p className="text-blue-800 mt-2 text-sm">
          Tecnologia • Criptomoedas • Soluções Digitais • Comércio
        </p>
        <p className="text-blue-900 mt-3 text-xs">
          Fundada em 04 de março de 2023 — Malanje, Controlo nº1
        </p>
      </div>

      {/* DESENVOLVIMENTO INSTITUCIONAL */}
      <section className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-xl space-y-4">
        <p className="text-gray-800 text-sm leading-relaxed">
          A <strong>EMATEA</strong> é uma empresa angolana fundada em 04 de março de 2023,
          sediada em Malanje – Controlo nº1, atuando de forma estratégica nos
          setores de tecnologia, ativos digitais e comércio diversificado.
          Atualmente é permitido apenas fazer um investimento apenas membros membros registrados na base de dados da empresa.
        </p>

        <p className="text-gray-700 text-sm leading-relaxed">
          Desde a sua criação, a empresa posiciona-se como uma organização moderna,
          estruturada e orientada para inovação, oferecendo soluções que combinam
          segurança, crescimento sustentável e impacto económico real.
        </p>

        <p className="text-gray-700 text-sm leading-relaxed">
          A EMATEA atua nas áreas de compra e venda de criptomoedas, desenvolvimento
          de websites e aplicações, criação de logotipos empresariais, concessão
          de empréstimos estruturados e comercialização de roupas e acessórios.
        </p>

        <p className="text-gray-700 text-sm leading-relaxed">
          Com visão estratégica e compromisso com a excelência operacional,
          a empresa busca expandir sua presença nacional consolidando-se como
          referência em inovação digital em Angola.
        </p>
      </section>

      {/* MISSÃO / VISÃO / VALORES */}
      <section className="grid gap-5">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-blue-200">
          <h2 className="text-blue-700 font-semibold mb-2">Missão</h2>
          <p className="text-sm text-gray-700">
            Oferecer soluções tecnológicas, financeiras e comerciais inovadoras,
            promovendo crescimento sustentável e confiança no mercado.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl border border-blue-200">
          <h2 className="text-blue-700 font-semibold mb-2">Visão</h2>
          <p className="text-sm text-gray-700">
            Tornar-se referência regional em tecnologia e ativos digitais,
            expandindo a atuação da EMATEA para todo território nacional.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl border border-blue-200">
          <h2 className="text-blue-700 font-semibold mb-2">Valores</h2>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Transparência</li>
            <li>Inovação</li>
            <li>Responsabilidade</li>
            <li>Compromisso com o cliente</li>
            <li>Crescimento sustentável</li>
          </ul>
        </div>
      </section>

      {/* ======================= */}
      {/* TABELA RENDIMENTOS 3D */}
      {/* ======================= */}

      <section className="space-y-4">

        <h2 className="text-lg font-semibold text-blue-900">
          Tabela Oficial de Rendimentos
        </h2>

        <div className="bg-gradient-to-br from-blue-200 to-blue-100 rounded-3xl shadow-2xl border border-blue-300 overflow-hidden">

          <div className="bg-blue-400 text-white px-6 py-4 font-semibold shadow-inner">
            Planos com rendimento fixo diário de 1.8%
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-100 text-blue-900">
                <tr>
                  <th className="p-4 text-left">Produto</th>
                  <th className="p-4 text-left">Preço</th>
                  <th className="p-4 text-left">Rendimento Diário</th>
                  <th className="p-4 text-left">Duração</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-blue-200">

                {[
                  ["USDT", "6 000 Kz", "108 Kz", "180 dias"],
                  ["USDC", "15 000 Kz", "270 Kz", "180 dias"],
                  ["TRX", "30 000 Kz", "540 Kz", "180 dias"],
                  ["EUR", "50 000 Kz", "900 Kz", "200 dias"],
                  ["BNB", "100 000 Kz", "1 800 Kz", "200 dias"],
                  ["BTC", "250 000 Kz", "4 500 Kz", "210 dias"],
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-blue-50 transition">
                    <td className="p-4 font-semibold text-blue-900">{row[0]}</td>
                    <td className="p-4">{row[1]}</td>
                    <td className="p-4 text-blue-700 font-semibold">{row[2]}</td>
                    <td className="p-4">{row[3]}</td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ======================= */}
      {/* TABELA COMISSÕES 3D */}
      {/* ======================= */}

      <section className="space-y-4">

        <h2 className="text-lg font-semibold text-blue-900">
          Estrutura Oficial de Comissões
        </h2>

        <div className="bg-gradient-to-br from-blue-200 to-blue-100 rounded-3xl shadow-2xl border border-blue-300 overflow-hidden">

          <div className="bg-blue-400 text-white px-6 py-4 font-semibold shadow-inner">
            Sistema multinível baseado em compra e tarefas
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-100 text-blue-900">
                <tr>
                  <th className="p-4 text-left">Nível</th>
                  <th className="p-4 text-left">Comissão por Compra</th>
                  <th className="p-4 text-left">Comissão por Tarefa</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-blue-200">

                <tr className="hover:bg-blue-50 transition">
                  <td className="p-4 font-semibold text-blue-900">1º Nível</td>
                  <td className="p-4 text-blue-700 font-semibold">6%</td>
                  <td className="p-4 text-blue-700 font-semibold">5%</td>
                </tr>

                <tr className="hover:bg-blue-50 transition">
                  <td className="p-4 font-semibold text-blue-900">2º Nível</td>
                  <td className="p-4">3%</td>
                  <td className="p-4">3%</td>
                </tr>

                <tr className="hover:bg-blue-50 transition">
                  <td className="p-4 font-semibold text-blue-900">3º Nível</td>
                  <td className="p-4">1%</td>
                  <td className="p-4">1%</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* NOTA FINAL */}
      <section className="bg-white rounded-3xl p-6 shadow-xl border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">
          Compromisso Institucional
        </h2>

        <p className="text-sm text-gray-700 leading-relaxed">
          A EMATEA acredita que inovação tecnológica, ativos digitais e comércio
          estruturado podem caminhar juntos. Nosso compromisso é oferecer
          transparência, segurança e crescimento sustentável para nossos
          clientes e parceiros.
        </p>
      </section>

    </div>
  )
}
