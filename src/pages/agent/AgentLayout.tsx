import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BadgeDollarSign,
  BarChart3,
  History,
  ArrowLeftRight,
  User,
  Settings,
  LogOut
} from "lucide-react";

export default function AgentLayout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const menu = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/agent"
    },
    {
      label: "Sub-agentes",
      icon: Users,
      path: "/agent/sub-agents"
    },
    {
      label: "Novo Sub-agente",
      icon: UserPlus,
      path: "/agent/sub-agents/new"
    },
    {
      label: "Comissões",
      icon: BadgeDollarSign,
      path: "/agent/commissions"
    },
    {
      label: "Estatísticas",
      icon: BarChart3,
      path: "/agent/statistics"
    },
    {
      label: "Histórico",
      icon: History,
      path: "/agent/history"
    },
    {
      label: "Transferências",
      icon: ArrowLeftRight,
      path: "/transfer"
    },
    {
      label: "Perfil",
      icon: User,
      path: "/profile"
    },
    {
      label: "Definições",
      icon: Settings,
      path: "/settings"
    }
  ];

  return (
    // Fundo geral da aplicação alterado para #0B0E11
    <div className="min-h-screen bg-[#0B0E11] flex text-[#EAECEF] antialiased">
      
      {/* Sidebar - Atualizada para o tom de cinza escuro correto */}
      <aside className="w-72 bg-[#161A1E] text-white flex flex-col border-r border-white/[0.04]">
        <div className="p-6 border-b border-white/[0.04]">
          <h1 className="text-2xl font-black tracking-wider text-white uppercase font-mono">
            EMATEA
          </h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
            Painel do Agente
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold tracking-wide transition-all duration-200
                  ${
                    isActive
                      ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/[0.04]">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-xs font-black uppercase tracking-wider text-rose-400 hover:bg-rose-500/20 transition-all"
          >
            <LogOut size={16} />
            Sair da conta
          </button>
        </div>
      </aside>

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar/Header - Agora escuro e harmonioso com o resto */}
        <header className="bg-[#161A1E]/40 backdrop-blur-md border-b border-white/[0.04] px-8 py-5">
          <h2 className="text-sm font-black tracking-wider uppercase font-mono text-white">
            Painel de Operações
          </h2>
        </header>

        {/* Injeção dos componentes de página através do Outlet */}
        <section className="p-8 flex-1 overflow-y-auto">
          <Outlet />
        </section>
      </main>

    </div>
  );
}