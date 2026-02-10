export default function About() {
  return (
    <div className="p-4 space-y-8 bg-gray-50">

      {/* HERO / BANNER */}
      <div className="relative rounded-3xl overflow-hidden shadow-card">
        <img
          src="/images/recycling-banner.jpg"
          alt="ACTECO – Reciclagem Sustentável"
          className="w-full h-52 object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-2xl font-semibold tracking-wide">
            ACTECO S.A
          </h1>
          <p className="text-white/90 text-sm mt-1">
            Soluções sustentáveis. Valor económico real.
          </p>
        </div>
      </div>

      {/* INTRODUÇÃO INSTITUCIONAL */}
      <section className="space-y-4">
        <p className="text-gray-800 text-sm leading-relaxed">
          A <strong>ACTECO S.A</strong> é uma empresa angolana especializada
          em <strong>reciclagem sustentável de resíduos plásticos</strong>,
          atuando de forma estratégica na transformação de desafios ambientais
          em oportunidades económicas estruturadas.
        </p>

        <p className="text-gray-700 text-sm leading-relaxed">
          Através de processos industriais modernos e modelos de economia
          circular, a ACTECO contribui para a redução do impacto ambiental,
          geração de valor social e desenvolvimento sustentável.
        </p>

        <p className="text-gray-700 text-sm leading-relaxed">
          O plástico, quando mal gerido, representa um dos maiores riscos
          ambientais da atualidade. A ACTECO posiciona-se como parte ativa
          da solução, com foco em eficiência, escala e impacto mensurável.
        </p>
      </section>

      {/* MISSÃO / VISÃO / VALORES */}
      <section className="grid grid-cols-1 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <h2 className="font-semibold text-emerald-600 mb-2">Missão</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Reduzir o impacto ambiental dos resíduos plásticos através de
            processos de reciclagem eficientes, responsáveis e economicamente
            sustentáveis.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <h2 className="font-semibold text-emerald-600 mb-2">Visão</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Tornar-se referência nacional e regional em reciclagem e economia
            circular, liderando iniciativas sustentáveis com impacto real.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <h2 className="font-semibold text-emerald-600 mb-2">Valores</h2>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Sustentabilidade ambiental</li>
            <li>Transparência institucional</li>
            <li>Inovação tecnológica</li>
            <li>Impacto económico positivo</li>
          </ul>
        </div>
      </section>

      {/* ========================= */}
      {/* TABELA CORPORATIVA ACTECO */}
      {/* ========================= */}

      <section className="space-y-4">

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Planos de Rendimentos ACTECO
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed">
            De acordo com os modelos operacionais da ACTECO S.A, os planos
            abaixo representam oportunidades estruturadas ligadas à cadeia
            de valorização de materiais recicláveis e economia circular.
          </p>
        </div>

        {/* CARD TABELA PREMIUM */}
        <div className="bg-white rounded-3xl shadow-card overflow-hidden">

          <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 px-4 py-3">
            <h3 className="text-white font-semibold text-sm tracking-wide">
              Tabela Oficial de Rendimentos
            </h3>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-emerald-50">
                <tr className="text-emerald-900 text-left">
                  <th className="p-3 font-semibold">Produto</th>
                  <th className="p-3 font-semibold">Preço</th>
                  <th className="p-3 font-semibold">Rendimento Diário</th>
                  <th className="p-3 font-semibold">Duração</th>
                </tr>
              </thead>

              <tbody className="divide-y">

                <tr className="hover:bg-emerald-50/50 transition">
                  <td className="p-3 font-medium">PET - Etileno</td>
                  <td className="p-3">6 000 Kz</td>
                  <td className="p-3 text-emerald-600 font-medium">210 Kz</td>
                  <td className="p-3">180 dias</td>
                </tr>

                <tr className="hover:bg-emerald-50/50 transition">
                  <td className="p-3 font-medium">PEAD - Polietileno</td>
                  <td className="p-3">15 000 Kz</td>
                  <td className="p-3 text-emerald-600 font-medium">525 Kz</td>
                  <td className="p-3">180 dias</td>
                </tr>

                <tr className="hover:bg-emerald-50/50 transition">
                  <td className="p-3 font-medium">PVC - Policlorreto</td>
                  <td className="p-3">30 000 Kz</td>
                  <td className="p-3 text-emerald-600 font-medium">1 050 Kz</td>
                  <td className="p-3">180 dias</td>
                </tr>

                <tr className="hover:bg-emerald-50/50 transition">
                  <td className="p-3 font-medium">PBD - Polietileno BD</td>
                  <td className="p-3">50 000 Kz</td>
                  <td className="p-3 text-emerald-600 font-medium">1 750 Kz</td>
                  <td className="p-3">200 dias</td>
                </tr>

                <tr className="hover:bg-emerald-50/50 transition">
                  <td className="p-3 font-medium">PS - Poliestireno Pro</td>
                  <td className="p-3">100 000 Kz</td>
                  <td className="p-3 text-emerald-600 font-medium">3 500 Kz</td>
                  <td className="p-3">200 dias</td>
                </tr>

                <tr className="hover:bg-emerald-50/50 transition">
                  <td className="p-3 font-medium">PLA - Ácido Polilático</td>
                  <td className="p-3">250 000 Kz</td>
                  <td className="p-3 text-emerald-600 font-medium">8 750 Kz</td>
                  <td className="p-3">210 dias</td>
                </tr>

              </tbody>
            </table>

          </div>
        </div>

      </section>

      {/* ========================= */}
      {/* TABELA COMISSÕES ACTECO */}
      {/* ========================= */}

      <section className="space-y-4">

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Estrutura de Comissões ACTECO
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed">
            A ACTECO S.A opera com sistema de bonificação multinível baseado
            em aquisição de produtos e execução de tarefas operacionais.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-card overflow-hidden">

          <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 px-4 py-3">
            <h3 className="text-white font-semibold text-sm tracking-wide">
              Tabela Oficial de Comissões
            </h3>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-emerald-50">
                <tr className="text-emerald-900 text-left">
                  <th className="p-3 font-semibold">Nível</th>
                  <th className="p-3 font-semibold">Comissão por Compra</th>
                  <th className="p-3 font-semibold">Comissão por Tarefa</th>
                </tr>
              </thead>

              <tbody className="divide-y">

                <tr className="hover:bg-emerald-50/50 transition">
                  <td className="p-3 font-medium">1º Nível</td>
                  <td className="p-3 text-emerald-600 font-medium">8%</td>
                  <td className="p-3 text-emerald-600 font-medium">4%</td>
                </tr>

                <tr className="hover:bg-emerald-50/50 transition">
                  <td className="p-3 font-medium">2º Nível</td>
                  <td className="p-3 text-emerald-600 font-medium">4%</td>
                  <td className="p-3 text-emerald-600 font-medium">2%</td>
                </tr>

                <tr className="hover:bg-emerald-50/50 transition">
                  <td className="p-3 font-medium">3º Nível</td>
                  <td className="p-3 text-emerald-600 font-medium">2%</td>
                  <td className="p-3 text-emerald-600 font-medium">1%</td>
                </tr>

              </tbody>

            </table>

          </div>
        </div>

      </section>

      {/* IMAGEM INSTITUCIONAL */}
      <div className="rounded-2xl overflow-hidden shadow-soft">
        <img
          src="/images/plastic-process.jpg"
          alt="Processo industrial de reciclagem"
          className="w-full h-44 object-cover"
        />
      </div>

      {/* NOTA FINAL */}
      <section className="bg-white rounded-2xl p-5 shadow-soft space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Compromisso institucional
        </h2>

        <p className="text-sm text-gray-700 leading-relaxed">
          A ACTECO acredita que sustentabilidade e crescimento económico
          não são objetivos opostos, mas complementares.
        </p>
      </section>

    </div>
  )
}
