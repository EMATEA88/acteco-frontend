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
          <h2 className="font-semibold text-emerald-600 mb-2">
            Missão
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Reduzir o impacto ambiental dos resíduos plásticos através de
            processos de reciclagem eficientes, responsáveis e economicamente
            sustentáveis, promovendo valor ambiental e financeiro.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <h2 className="font-semibold text-emerald-600 mb-2">
            Visão
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Tornar-se uma referência nacional e regional em reciclagem e
            economia circular, liderando iniciativas sustentáveis com
            impacto real e duradouro.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <h2 className="font-semibold text-emerald-600 mb-2">
            Valores
          </h2>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Sustentabilidade e responsabilidade ambiental</li>
            <li>Transparência e integridade institucional</li>
            <li>Inovação aplicada à economia circular</li>
            <li>Impacto económico e social positivo</li>
          </ul>
        </div>
      </section>

      {/* O QUE FAZEMOS */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Atuação da ACTECO
        </h2>

        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1 leading-relaxed">
          <li>Reciclagem e reaproveitamento de plásticos PET, PEAD, PVC e PS</li>
          <li>Processamento industrial de resíduos plásticos</li>
          <li>Implementação de modelos de economia circular</li>
          <li>Geração de oportunidades económicas sustentáveis</li>
        </ul>
      </section>

      {/* IMAGEM INSTITUCIONAL */}
      <div className="rounded-2xl overflow-hidden shadow-soft">
        <img
          src="/images/plastic-process.jpg"
          alt="Processo industrial de reciclagem"
          className="w-full h-44 object-cover"
        />
      </div>

      {/* NOTA INSTITUCIONAL FINAL */}
      <section className="bg-white rounded-2xl p-5 shadow-soft space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Compromisso institucional
        </h2>

        <p className="text-sm text-gray-700 leading-relaxed">
          A ACTECO acredita que sustentabilidade e crescimento económico
          não são objetivos opostos, mas complementares. Investir em
          reciclagem é investir no futuro — ambiental, social e económico.
        </p>

        <p className="text-sm text-gray-700 leading-relaxed">
          A combinação entre tecnologia, gestão responsável e envolvimento
          comunitário permite construir soluções sólidas, escaláveis e
          alinhadas com as exigências do mercado moderno.
        </p>
      </section>
    </div>
  )
}
