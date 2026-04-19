import { useNavigate } from "react-router-dom"
import { 
  WhatsappLogo, 
  TrendUp, 
  Wallet, 
  ArrowUpRight, 
  Briefcase, 
  Swap,
  ShieldCheck,
  Info
} from "@phosphor-icons/react"

const WHATSAPP_MANAGER = "https://wa.me/244928270636"

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 pb-32 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10">
            <img src="/logo.png" className="w-full h-full object-cover"/>
          </div>

          <div>
            <p className="text-[10px] text-gray-500">Bem-vindo</p>
            <h1 className="text-lg font-semibold">EMATEA</h1>
          </div>
        </div>

        <button
          onClick={() => window.open(WHATSAPP_MANAGER, "_blank")}
          className="flex items-center gap-2 bg-emerald-500 text-black px-4 py-2 rounded-xl text-xs font-semibold"
        >
          <WhatsappLogo size={16} />
          Suporte
        </button>

      </div>

      {/* HERO */}
      <div 
        onClick={() => navigate("/tasks")}
        className="glass-card p-6 rounded-2xl space-y-4 cursor-pointer"
      >

        <div className="flex items-center gap-2 text-emerald-500 text-xs">
          <TrendUp size={16}/>
          Oportunidade ativa
        </div>

        <h2 className="text-2xl font-semibold leading-tight">
          Ganhe dinheiro diariamente
        </h2>

        <p className="text-sm text-gray-500">
          Complete tarefas simples e receba recompensas.
        </p>

        <button className="mt-2 bg-white text-black px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
          Começar
          <ArrowUpRight size={14}/>
        </button>

      </div>

      {/* AÇÕES PRINCIPAIS */}
      <div className="grid grid-cols-4 gap-3">

        <Action icon={<Briefcase size={18}/>} label="Tarefas" onClick={() => navigate("/tasks")} />
        <Action icon={<TrendUp size={18}/>} label="Investir" onClick={() => navigate("/applications")} />
        <Action icon={<Wallet size={18}/>} label="Depositar" onClick={() => navigate("/deposit")} />
        <Action icon={<ArrowUpRight size={18}/>} label="Sacar" onClick={() => navigate("/withdraw")} />

      </div>

      {/* SERVIÇOS */}
      <div className="space-y-3">

        <p className="text-xs text-gray-500">Serviços</p>

        <ServiceCard
          title="Mercado OTC"
          subtitle="Compra e venda direta"
          icon={<Swap size={20}/>}
          onClick={() => navigate("/otc")}
        />

        <ServiceCard
          title="Kixikila"
          subtitle="Poupança em grupo"
          icon={<Wallet size={20}/>}
          onClick={() => navigate("/kixikila")}
        />

        {/* 🔥 NOVO: ABOUT INTEGRADO */}
        <ServiceCard
          title="Sobre a EMATEA"
          subtitle="Informações institucionais"
          icon={<Info size={20}/>}
          onClick={() => navigate("/about")}
        />

      </div>

      {/* SEGURANÇA */}
      <div className="glass-card p-4 rounded-xl flex gap-3 text-xs text-gray-500">
        <ShieldCheck size={18} className="text-emerald-500"/>
        Sistema protegido e monitorado em tempo real
      </div>

    </div>
  )
}

/* ================= COMPONENTES ================= */

function Action({ icon, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="glass-card h-16 rounded-xl flex flex-col items-center justify-center gap-1 text-xs"
    >
      <div className="text-emerald-500">{icon}</div>
      <span>{label}</span>
    </button>
  )
}

function ServiceCard({ title, subtitle, icon, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="glass-card p-4 rounded-xl flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
        {icon}
      </div>

      <div className="flex-1 text-left">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-[10px] text-gray-500">{subtitle}</p>
      </div>
    </button>
  )
}