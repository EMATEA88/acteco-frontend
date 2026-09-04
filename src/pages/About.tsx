import {
  Info,
  Storefront,
  Cpu,
  DeviceMobile,
  Globe,
  Megaphone,
  Briefcase,
  MapPin,
  ShieldCheck,
  ArrowUpRight,
  Buildings,
  Package,
  PlugsConnected,
} from '@phosphor-icons/react'

const businessAreas = [
  {
    title: 'Comércio Geral',
    description:
      'Comércio a grosso e a retalho de bens alimentares, bebidas diversas e outros produtos abrangidos pelo objeto social da empresa.',
    icon: Storefront,
  },
  {
    title: 'Tecnologia e Equipamentos',
    description:
      'Comércio de equipamentos informáticos e eletrónicos, acessórios tecnológicos, telemóveis, computadores, impressoras, material de escritório e produtos de telecomunicações.',
    icon: Cpu,
  },
  {
    title: 'Software e Plataformas Digitais',
    description:
      'Desenvolvimento de software, aplicações móveis, websites, sistemas informáticos, plataformas digitais e outras soluções tecnológicas e plataformas eletrónicas.',
    icon: DeviceMobile,
  },
  {
    title: 'Telecomunicações e Serviços Digitais',
    description:
      'Prestação de serviços de telecomunicações, serviços tecnológicos e digitais, incluindo a comercialização de saldos e recargas eletrónicas.',
    icon: PlugsConnected,
  },
  {
    title: 'Marketing, Publicidade e Design',
    description:
      'Marketing digital, publicidade, comunicação, design gráfico e produção multimédia para empresas, marcas e projetos.',
    icon: Megaphone,
  },
  {
    title: 'Serviços Empresariais',
    description:
      'Prestação de serviços administrativos, empresariais e operacionais, apoio ao comércio e consultoria tecnológica.',
    icon: Briefcase,
  },
  {
    title: 'Representação e Intermediação',
    description:
      'Representação comercial e intermediação comercial a nível nacional e internacional.',
    icon: Globe,
  },
  {
    title: 'Comércio Internacional',
    description:
      'Importação e exportação de bens e serviços, bem como apoio às operações de comércio nacional e internacional.',
    icon: Package,
  },
]

const values = [
  'Integridade',
  'Transparência',
  'Inovação',
  'Responsabilidade',
  'Eficiência',
  'Compromisso',
]

export default function About() {
  return (
    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe] p-4 md:p-6 space-y-6 md:space-y-8 animate-fadeZoom selection:bg-cyan-500/30 pb-28">

      {/* =========================================================
          HEADER INSTITUCIONAL
      ========================================================== */}
      <section className="relative overflow-hidden bg-[#0e364a] border border-cyan-500/20 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-cyan-950/20">

        <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-500/[0.07] rounded-full blur-[90px]" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400/[0.04] rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300 font-mono">
                Perfil Institucional
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white font-mono">
              EMATEA
            </h1>

            <p className="mt-3 text-sm md:text-base text-cyan-200/80 leading-relaxed max-w-2xl">
              <span className="text-white font-semibold">
                EMATEA – Comércio Geral e Prestação de Serviços, (SU), LDA
              </span>{' '}
              é uma sociedade constituída em Angola, com sede em Malanje,
              cuja atividade abrange comércio, tecnologia, telecomunicações,
              serviços digitais e empresariais, comunicação e operações de
              comércio nacional e internacional.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7">

              <InstitutionalData
                label="NIF"
                value="5002577666"
              />

              <InstitutionalData
                label="Fundação"
                value="07.07.2025"
              />

              <InstitutionalData
                label="Capital Social"
                value="1.000.000 Kz"
              />

            </div>
          </div>

          {/* LOGOTIPO */}
          <div className="flex justify-center lg:justify-end shrink-0">

            <div className="relative group">

              <div className="absolute inset-0 bg-cyan-500 rounded-full blur-2xl opacity-20 group-hover:opacity-35 transition-opacity" />

              <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full border-2 border-cyan-400/30 overflow-hidden bg-[#0a2533] flex items-center justify-center shadow-2xl">

                <img
                  src="/logo.png"
                  alt="Logotipo da EMATEA"
                  className="w-full h-full object-cover rounded-full"
                />

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          SOBRE A EMPRESA
      ========================================================== */}
      <section className="bg-[#0e364a] border border-cyan-500/20 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-cyan-950/20">

        <SectionHeader
          icon={<Info size={22} weight="bold" />}
          eyebrow="Quem somos"
          title="Uma empresa de comércio, tecnologia e serviços"
        />

        <div className="mt-6 max-w-4xl space-y-4 text-sm md:text-base text-cyan-100/80 leading-relaxed">

          <p>
            A <strong className="text-white">EMATEA</strong> atua através de
            uma estrutura empresarial multidisciplinar, combinando atividades
            comerciais, tecnológicas e de prestação de serviços.
          </p>

          <p>
            O seu objeto social contempla desde o comércio de bens,
            equipamentos informáticos e eletrónicos até ao desenvolvimento
            de software, aplicações móveis, websites, sistemas informáticos
            e plataformas digitais.
          </p>

          <p>
            A empresa possui igualmente enquadramento para a prestação de
            serviços de telecomunicações, serviços tecnológicos e digitais,
            consultoria tecnológica, marketing, publicidade, comunicação,
            design gráfico, produção multimédia e serviços empresariais.
          </p>

          <p>
            A sua atividade inclui ainda representação e intermediação
            comercial nacional e internacional, importação e exportação de
            bens e serviços e apoio às operações de comércio.
          </p>

        </div>
      </section>


      {/* =========================================================
          ÁREAS DE ATUAÇÃO
      ========================================================== */}
      <section>

        <SectionHeader
          icon={<Buildings size={22} weight="bold" />}
          eyebrow="Objeto e áreas de atuação"
          title="O que a EMATEA faz"
        />

        <p className="text-sm text-cyan-200/60 mt-2 mb-5 max-w-3xl">
          As áreas abaixo refletem as atividades previstas no objeto social
          registado da empresa, incluindo a alteração do objeto social
          averbada em 2026.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          {businessAreas.map((area) => {
            const Icon = area.icon

            return (
              <div
                key={area.title}
                className="group bg-[#0e364a] border border-cyan-500/15 hover:border-cyan-400/40 rounded-2xl p-5 transition-all duration-300 shadow-lg shadow-cyan-950/10"
              >

                <div className="flex items-start justify-between gap-3">

                  <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                    <Icon size={23} weight="duotone" />
                  </div>

                  <ArrowUpRight
                    size={17}
                    className="text-cyan-500/30 group-hover:text-cyan-400 transition-colors"
                  />

                </div>

                <h3 className="text-sm font-bold text-white mt-5 font-mono">
                  {area.title}
                </h3>

                <p className="text-xs text-cyan-200/65 leading-relaxed mt-2">
                  {area.description}
                </p>

              </div>
            )
          })}

        </div>
      </section>


      {/* =========================================================
          TECNOLOGIA
      ========================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0e364a] to-[#0a2533] border border-cyan-500/20 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-cyan-950/20">

        <div className="absolute right-0 top-0 w-72 h-72 bg-cyan-500/[0.04] rounded-full blur-[90px]" />

        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-center">

          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Cpu size={29} weight="duotone" />
          </div>

          <div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold font-mono">
              Tecnologia
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
              Desenvolvimento de soluções digitais
            </h2>

            <p className="text-sm text-cyan-200/70 leading-relaxed mt-2 max-w-4xl">
              Entre as atividades registadas encontram-se o desenvolvimento
              de software e aplicações móveis, gestão e exploração de websites,
              sistemas informáticos e plataformas digitais, além da criação e
              exploração de soluções tecnológicas e plataformas eletrónicas.
            </p>

          </div>

        </div>
      </section>


      {/* =========================================================
          POSICIONAMENTO
      ========================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        <div className="bg-[#0e364a] border border-cyan-500/20 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-cyan-950/10">

          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
            <ShieldCheck size={23} weight="duotone" />
          </div>

          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold font-mono">
            Posicionamento
          </p>

          <h2 className="text-xl font-bold text-white mt-2">
            Estrutura multidisciplinar
          </h2>

          <p className="text-sm text-cyan-200/70 leading-relaxed mt-3">
            A amplitude do objeto social permite à EMATEA operar em diferentes
            segmentos de atividade, estabelecendo uma base empresarial para
            soluções comerciais, tecnológicas, digitais e de apoio empresarial.
          </p>

        </div>


        <div className="bg-[#0e364a] border border-cyan-500/20 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-cyan-950/10">

          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
            <Globe size={23} weight="duotone" />
          </div>

          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold font-mono">
            Alcance
          </p>

          <h2 className="text-xl font-bold text-white mt-2">
            Mercado nacional e internacional
          </h2>

          <p className="text-sm text-cyan-200/70 leading-relaxed mt-3">
            O objeto social contempla representação e intermediação comercial
            nacional e internacional, importação e exportação de bens e
            serviços e apoio ao comércio nacional e internacional.
          </p>

        </div>

      </section>


      {/* =========================================================
          VALORES
      ========================================================== */}
      <section className="bg-[#0e364a]/70 border border-cyan-500/20 rounded-[2rem] p-6 md:p-8">

        <div className="flex items-center gap-3 mb-5">

          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <ShieldCheck size={21} weight="bold" />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold font-mono">
              Cultura empresarial
            </p>

            <h2 className="text-lg font-bold text-white">
              Princípios
            </h2>
          </div>

        </div>

        <div className="flex flex-wrap gap-2">

          {values.map((value) => (
            <span
              key={value}
              className="px-3 py-2 rounded-full bg-[#0a2533] border border-cyan-500/20 text-xs text-cyan-200 font-medium"
            >
              {value}
            </span>
          ))}

        </div>

        <p className="text-[11px] text-cyan-200/40 mt-4">
          Estes princípios representam o posicionamento institucional da
          empresa e não constituem transcrição do objeto social.
        </p>

      </section>


      {/* =========================================================
          DADOS LEGAIS / EMPRESARIAIS
      ========================================================== */}
      <section className="bg-[#0e364a] border border-cyan-500/20 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-cyan-950/20">

        <SectionHeader
          icon={<Buildings size={22} weight="bold" />}
          eyebrow="Informação empresarial"
          title="Dados de identificação"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 mt-6">

          <LegalData
            label="Firma"
            value="EMATEA – COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS, (SU), LDA"
          />

          <LegalData
            label="NIF"
            value="5002577666"
          />

          <LegalData
            label="Fundação"
            value="07.07.2025"
          />

          <LegalData
            label="Capital social"
            value="1.000.000,00 Kz"
          />

          <LegalData
            label="Sede"
            value="Malanje, Município de Malanje, Bairro Cangambo Ocidental"
          />

          <LegalData
            label="Forma de obrigar"
            value="Intervenção do gerente único"
          />

        </div>

      </section>


      {/* =========================================================
          LOCALIZAÇÃO / FOOTER
      ========================================================== */}
      <section className="bg-[#0e364a] border border-cyan-500/20 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xl shadow-cyan-950/20">

        <div className="flex items-start gap-4">

          <div className="w-11 h-11 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <MapPin size={22} weight="duotone" />
          </div>

          <div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold font-mono">
              Sede
            </p>

            <p className="text-sm text-cyan-100 mt-1">
              Malanje, Município de Malanje, Bairro Cangambo Ocidental
            </p>

            <p className="text-xs text-cyan-200/50 mt-1">
              Rua Sem Nome, casa s/nº, junto ao control nº 1
            </p>

          </div>

        </div>

        <div className="text-left md:text-right">

          <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-200/40 font-mono">
            EMATEA
          </p>

          <p className="text-xs text-cyan-200/50 mt-1">
            Comércio Geral e Prestação de Serviços
          </p>

          <p className="text-[10px] text-cyan-200/30 mt-2">
            NIF 5002577666
          </p>

        </div>

      </section>

    </div>
  )
}


/* =========================================================
   COMPONENTES AUXILIARES
========================================================= */

function InstitutionalData({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="bg-[#0a2533]/60 border border-cyan-500/15 rounded-xl px-4 py-3">

      <p className="text-[9px] uppercase tracking-widest text-cyan-300/50 font-bold font-mono">
        {label}
      </p>

      <p className="text-xs text-cyan-100 font-semibold mt-1 font-mono break-words">
        {value}
      </p>

    </div>
  )
}


function SectionHeader({
  icon,
  eyebrow,
  title,
}: {
  icon: React.ReactNode
  eyebrow: string
  title: string
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
        {icon}
      </div>

      <div>

        <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold font-mono">
          {eyebrow}
        </p>

        <h2 className="text-xl md:text-2xl font-bold text-white mt-0.5">
          {title}
        </h2>

      </div>

    </div>
  )
}


function LegalData({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="border-b border-cyan-500/10 pb-4">

      <p className="text-[9px] uppercase tracking-widest text-cyan-300/50 font-bold font-mono">
        {label}
      </p>

      <p className="text-sm text-cyan-100 mt-1 leading-relaxed">
        {value}
      </p>

    </div>
  )
}