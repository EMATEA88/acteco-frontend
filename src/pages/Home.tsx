import { useNavigate } from "react-router-dom"
import { 
  WhatsappLogo, 
  TrendUp, 
  Briefcase, 
  ArrowUpRight, 
  Wallet, 
  Info, // Ícone para o About
  Swap, 
  ShieldCheck
} from "@phosphor-icons/react"

const WHATSAPP_MANAGER = "https://wa.me/244928270636"

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-green-500/30">
      
      {/* HEADER PREMIUM */}
      <header className="px-6 py-6 flex items-center justify-between sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-white/10 p-0.5 bg-[#111]">
            <img src="/logo.png" className="w-full h-full object-contain rounded-full" alt="EMATEA" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 leading-none mb-1">Bem-vindo à</p>
            <h1 className="text-xl font-black tracking-tighter italic leading-none">EMATEA</h1>
          </div>
        </div>

        <button 
          onClick={() => window.open(WHATSAPP_MANAGER, "_blank")}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
        >
          <WhatsappLogo size={18} weight="fill" />
          Suporte
        </button>
      </header>

      <main className="px-6 pt-6 pb-32 max-w-xl mx-auto space-y-8">
        
        {/* HERO CARD (BANNER PRINCIPAL) */}
        <section 
          onClick={() => navigate("/tasks")}
          className="relative overflow-hidden p-8 rounded-[2.5rem] bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 shadow-2xl group cursor-pointer"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/10 rounded-full filter blur-[80px] group-hover:bg-green-500/20 transition-all duration-700"></div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-green-500">
              <TrendUp size={24} weight="duotone" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Oportunidade Ativa</span>
            </div>
            
            <h2 className="text-3xl font-black tracking-tighter leading-tight italic">
              GANHE DINHEIRO <br /> DIARIAMENTE <span className="text-green-500">.</span>
            </h2>

            <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-[220px]">
              Complete tarefas de marketing e receba recompensas instantâneas.
            </p>

            <div className="pt-2">
               <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-green-500 group-hover:text-white transition-all shadow-xl shadow-black/50">
                  Começar agora
                  <ArrowUpRight size={16} weight="bold" />
               </button>
            </div>
          </div>
        </section>

        {/* CORE SERVICES GRID */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 ml-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Serviços Financeiros</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card
              icon={<Briefcase size={28} weight="duotone" />}
              title="Tarefas"
              subtitle="Marketing Hub"
              onClick={() => navigate("/tasks")}
            />
            <Card
              icon={<TrendUp size={28} weight="duotone" />}
              title="Investir"
              subtitle="Wealth Management"
              onClick={() => navigate("/applications")}
            />
            <Card
              icon={<Wallet size={28} weight="duotone" />}
              title="Depósito"
              subtitle="Inserir Capital"
              onClick={() => navigate("/deposit")}
            />
            <Card
              icon={<ArrowUpRight size={28} weight="duotone" />}
              title="Saque"
              subtitle="Levantar Fundos"
              onClick={() => navigate("/withdraw")}
            />
          </div>
        </section>

        {/* EXTRA SERVICES */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 ml-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-700"></div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Ecossistema</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card
              icon={<Swap size={28} weight="duotone" />}
              title="Cripto OTC"
              subtitle="Câmbio Direto"
              onClick={() => navigate("/otc")}
            />
            <Card
              icon={<Info size={28} weight="duotone" />} // Alterado para About
              title="Sobre Nós"
              subtitle="Nossa História"
              onClick={() => navigate("/about")}
            />
          </div>
        </section>

        {/* COMPLIANCE INFO */}
        <div className="p-6 rounded-[2rem] bg-[#111]/50 border border-white/5 flex items-start gap-4 shadow-inner">
          <ShieldCheck size={32} weight="duotone" className="text-green-500 shrink-0" />
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-1">Protocolo Seguro</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
              A EMATEA utiliza encriptação de ponta para garantir que os seus ativos e dados institucionais estejam sempre protegidos.
            </p>
          </div>
        </div>

      </main>

      <footer className="fixed bottom-24 left-0 w-full flex justify-center opacity-20 pointer-events-none">
        <p className="text-[8px] font-bold uppercase tracking-[0.6em]">Powered by EMATEA Engine v4.0</p>
      </footer>
    </div>
  )
}

function Card({ icon, title, subtitle, onClick }: { icon: React.ReactNode, title: string, subtitle: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-6 rounded-[2rem] bg-[#111] border border-white/5 hover:border-green-500/20 hover:bg-[#161616] transition-all duration-300 text-left relative overflow-hidden group active:scale-95 shadow-lg"
    >
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/0 group-hover:bg-white/[0.02] transition-all rounded-bl-[2rem]"></div>
      <div className="mb-4 text-green-500 group-hover:scale-110 group-hover:rotate-[-5deg] transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-sm font-black tracking-tight italic uppercase mb-0.5">{title}</h3>
      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest group-hover:text-gray-400 transition-colors">{subtitle}</p>
    </button>
  )
}