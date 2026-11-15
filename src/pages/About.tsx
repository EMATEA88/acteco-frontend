import type { ComponentType } from "react"
import {
  Briefcase,
  Buildings,
  Cpu,
  DeviceMobile,
  Globe,
  Megaphone,
  Package,
  PlugsConnected,
  ShieldCheck,
  Storefront,
} from "@phosphor-icons/react"

type IconComponent = ComponentType<{
  size?: number
  weight?: "regular" | "bold" | "duotone" | "fill" | "light" | "thin"
  className?: string
}>

type BusinessArea = {
  title: string
  description: string
  icon: IconComponent
}

const businessAreas: BusinessArea[] = [
  {
    title: "Comércio geral",
    description:
      "Comercialização de bens alimentares, bebidas e outros produtos abrangidos pelo objeto social.",
    icon: Storefront,
  },
  {
    title: "Tecnologia e equipamentos",
    description:
      "Equipamentos informáticos e eletrónicos, computadores, telemóveis, acessórios e material de escritório.",
    icon: Cpu,
  },
  {
    title: "Software e plataformas digitais",
    description:
      "Desenvolvimento de software, aplicações móveis, websites e sistemas informáticos.",
    icon: DeviceMobile,
  },
  {
    title: "Telecomunicações e serviços digitais",
    description:
      "Soluções tecnológicas e serviços digitais, incluindo comercialização de saldos e recargas eletrónicas.",
    icon: PlugsConnected,
  },
  {
    title: "Marketing e comunicação",
    description:
      "Marketing digital, publicidade, comunicação, design gráfico e produção multimédia.",
    icon: Megaphone,
  },
  {
    title: "Serviços empresariais",
    description:
      "Serviços administrativos, apoio operacional e consultoria tecnológica.",
    icon: Briefcase,
  },
  {
    title: "Representação comercial",
    description:
      "Representação e intermediação comercial a nível nacional e internacional.",
    icon: Globe,
  },
  {
    title: "Comércio internacional",
    description:
      "Importação e exportação de bens e serviços, nos termos aplicáveis.",
    icon: Package,
  },
]

const companyDetails = [
  { label: "Firma", value: "EMATEA – Comércio Geral e Prestação de Serviços, (SU), LDA" },
  { label: "NIF", value: "5002577666" },
  { label: "Data de constituição", value: "07.07.2025" },
  { label: "Capital social", value: "1.000.000,00 Kz" },
  {
    label: "Sede",
    value: "Malanje, Município de Malanje, Bairro Cangambo Ocidental",
  },
  { label: "Forma de obrigar", value: "Intervenção do gerente único" },
]

const values = [
  "Integridade",
  "Transparência",
  "Inovação",
  "Responsabilidade",
  "Eficiência",
  "Compromisso",
]

export default function About() {
  return (
    <main className="min-h-screen bg-[#0A2533] px-4 py-5 pb-28 text-[#E0F2FE] sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-5xl space-y-5 sm:space-y-6">
        {/* Identificação institucional */}
        <section className="overflow-hidden rounded-2xl border border-[#24566A] bg-[#103647] p-5 shadow-[0_14px_36px_rgba(0,0,0,0.16)] sm:p-7">
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src="/logo.png"
              alt="EMATEA"
              className="h-16 w-16 shrink-0 rounded-full border border-[#2B7185] bg-[#0A2533] object-contain p-1 sm:h-20 sm:w-20"
            />

            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#19C5CE]">
                Perfil institucional
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                EMATEA
              </h1>
              <p className="mt-1 text-xs leading-5 text-[#A9C4CF] sm:text-sm">
                Comércio Geral e Prestação de Serviços, (SU), LDA
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-6 text-[#C2D7DF]">
            Sociedade constituída em Angola, com sede em Malanje. A sua
            atividade abrange comércio, tecnologia, soluções digitais,
            telecomunicações, serviços empresariais e operações comerciais
            nacionais e internacionais, nos termos do seu objeto social.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <SummaryItem label="NIF" value="5002577666" />
            <SummaryItem label="Constituição" value="07.07.2025" />
            <SummaryItem
              label="Capital social"
              value="1.000.000 Kz"
              className="col-span-2 sm:col-span-1"
            />
          </div>
        </section>

        {/* Áreas de atividade */}
        <section>
          <SectionTitle
            eyebrow="Atividade empresarial"
            title="Áreas de atuação"
          />

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {businessAreas.map(area => {
              const Icon = area.icon

              return (
                <article
                  key={area.title}
                  className="flex gap-3 rounded-xl border border-[#24566A] bg-[#103647] p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#079CB3]/15 text-[#19C5CE]">
                    <Icon size={21} weight="regular" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white">
                      {area.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-[#A9C4CF]">
                      {area.description}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>

          <p className="mt-3 text-[11px] leading-5 text-[#7899A7]">
          </p>
        </section>

        {/* Identificação legal */}
        <section className="rounded-2xl border border-[#24566A] bg-[#103647] p-5 shadow-[0_14px_36px_rgba(0,0,0,0.12)] sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#079CB3]/15 text-[#19C5CE]">
              <Buildings size={21} weight="regular" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#19C5CE]">
                Registo da sociedade
              </p>
              <h2 className="text-lg font-semibold text-white">
                Dados empresariais
              </h2>
            </div>
          </div>

          <dl className="mt-4 divide-y divide-[#24566A]/70">
            {companyDetails.map(detail => (
              <div
                key={detail.label}
                className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[180px_1fr] sm:gap-4"
              >
                <dt className="text-xs font-medium text-[#86AAB8]">
                  {detail.label}
                </dt>
                <dd className="break-words text-sm leading-5 text-[#E0F2FE]">
                  {detail.value}
                </dd>
              </div>
            ))}
            <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[180px_1fr] sm:gap-4">
              <dt className="text-xs font-medium text-[#86AAB8]">
                Endereço
              </dt>
              <dd className="break-words text-sm leading-5 text-[#E0F2FE]">
                Rua Sem Nome, casa s/n.º, junto ao controlo n.º 1
              </dd>
            </div>
          </dl>
        </section>

        {/* Princípios */}
        <section className="rounded-2xl border border-[#24566A] bg-[#103647] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#079CB3]/15 text-[#19C5CE]">
              <ShieldCheck size={21} weight="regular" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#19C5CE]">
                Cultura empresarial
              </p>
              <h2 className="text-lg font-semibold text-white">
                Princípios
              </h2>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {values.map(value => (
              <span
                key={value}
                className="rounded-lg border border-[#2A6073] bg-[#0A2533] px-3 py-2 text-xs font-medium text-[#C2D7DF]"
              >
                {value}
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

function SummaryItem({
  label,
  value,
  className = "",
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div
      className={`min-w-0 rounded-xl border border-[#24566A] bg-[#0A2533]/70 px-3 py-3 ${className}`}
    >
      <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#86AAB8]">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  )
}

function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string
  title: string
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#19C5CE]">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
        {title}
      </h2>
    </div>
  )
}
