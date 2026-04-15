import { useNavigate } from "react-router-dom"
import { MessageCircle, Users, TrendingUp, Wallet, Briefcase } from "lucide-react"

const WHATSAPP_MANAGER = "https://wa.me/244928270636"

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] px-5 pt-6 pb-24">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-[#848E9C]">Bem-vindo</p>
          <h1 className="text-xl font-bold">EMATEA</h1>
        </div>

        <button
          onClick={() => window.open(WHATSAPP_MANAGER, "_blank")}
          className="bg-emerald-500 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <MessageCircle size={16} />
          Suporte
        </button>
      </div>

      {/* HERO */}
      <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-[#1E2329] to-[#14181D] border border-[#2B3139]">
        <h2 className="text-lg font-semibold mb-2">
          Ganhe dinheiro diariamente 🚀
        </h2>

        <p className="text-sm text-[#848E9C] mb-4">
          Complete tarefas simples e receba recompensas direto na sua conta.
        </p>

        <button
          onClick={() => navigate("/tasks")}
          className="w-full bg-emerald-500 py-3 rounded-xl font-semibold"
        >
          Começar agora
        </button>
      </div>

      {/* PRINCIPAL */}
      <div className="grid grid-cols-2 gap-4 mb-10">

        <Card
          icon={<Briefcase size={20} />}
          title="Tarefas"
          subtitle="Ganhe dinheiro"
          onClick={() => navigate("/tasks")}
        />

        <Card
          icon={<TrendingUp size={20} />}
          title="Investimentos"
          subtitle="Ganhos por prazo"
          onClick={() => navigate("/applications")}
        />

        <Card
          icon={<Wallet size={20} />}
          title="Depósito"
          subtitle="Adicionar saldo"
          onClick={() => navigate("/deposit")}
        />

        <Card
          icon={<Wallet size={20} />}
          title="Levantamento"
          subtitle="Retirar fundos"
          onClick={() => navigate("/withdraw")}
        />

      </div>

      {/* EXTRA */}
      <SectionTitle title="OUTROS SERVIÇOS" />

      <div className="grid grid-cols-2 gap-4 mb-10">

        <Card
          icon={<TrendingUp size={20} />}
          title="Cripto OTC"
          subtitle="Compra e venda"
          onClick={() => navigate("/otc")}
        />

        <Card
          icon={<Users size={20} />}
          title="Equipa"
          subtitle="Convide e ganhe"
          onClick={() => navigate("/team")}
        />

      </div>

      {/* INFO */}
      <div className="p-5 rounded-2xl bg-[#14181D] border border-[#2B3139]">
        <h3 className="text-sm font-semibold mb-3">Plataforma Segura</h3>

        <p className="text-xs text-[#848E9C]">
          Sistema com proteção antifraude, pagamentos automáticos e total transparência nas operações.
        </p>
      </div>

    </div>
  )
}

/* COMPONENTES */

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-xs text-[#848E9C] mb-4 tracking-widest">
      {title}
    </h2>
  )
}

function Card({
  icon,
  title,
  subtitle,
  onClick
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="p-4 rounded-2xl bg-[#14181D] border border-[#2B3139] hover:bg-[#1E2329] transition text-left"
    >
      <div className="mb-2 text-emerald-400">
        {icon}
      </div>

      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-xs text-[#848E9C]">{subtitle}</p>
    </button>
  )
}