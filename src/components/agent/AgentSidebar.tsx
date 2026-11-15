
import {
  ChartBar,
  Users,
  Coins,
  ChartLine,
  User,
  Gear,
  X,
} from "@phosphor-icons/react";

import { NavLink } from "react-router-dom";

const menus = [
  {
    title: "Dashboard",
    icon: ChartBar,
    to: "/agent/dashboard",
  },
  {
    title: "Sub-agentes",
    icon: Users,
    to: "/agent/sub-agents",
  },
  {
    title: "Comissões",
    icon: Coins,
    to: "/agent/commissions",
  },
  {
    title: "Estatísticas",
    icon: ChartLine,
    to: "/agent/statistics",
  },
  {
    title: "Perfil",
    icon: User,
    to: "/profile",
  },
  {
    title: "Definições",
    icon: Gear,
    to: "/settings",
  },
];

export default function AgentSidebar({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <aside className="h-full flex flex-col bg-[#0a2533] text-[#e0f2fe] antialiased">

      {/* IDENTIDADE */}

      <div className="px-5 py-5 border-b border-cyan-500/10 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-full border border-cyan-500/25 overflow-hidden bg-[#0e364a] p-1 shadow-inner shrink-0">
            <img
              src="/logo.png"
              alt="Logo EMATEA"
              className="w-full h-full object-contain rounded-full"
          />
       </div>

          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">
              EMATEA
            </h1>

            <p className="text-[10px] text-cyan-400 font-semibold mt-0.5">
              Painel do Agente
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar menu"
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#0e364a] border border-cyan-500/15 text-cyan-300 hover:bg-[#124158] hover:text-white transition-colors"
        >
          <X size={19} />
        </button>

      </div>

      {/* NAVEGAÇÃO */}

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">

        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#7897a7]">
          Menu principal
        </p>

        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `
                relative flex items-center gap-3
                px-3.5 py-3 rounded-xl
                border transition-colors duration-200
                ${
                  isActive
                    ? "bg-[#0e364a] border-cyan-500/25 text-white"
                    : "border-transparent text-[#a9c4cf] hover:bg-[#0e364a]/70 hover:text-white"
                }
                `
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-[#19c5ce]" />
                  )}

                  <Icon
                    size={21}
                    weight={isActive ? "bold" : "regular"}
                    className={
                      isActive
                        ? "text-[#19c5ce]"
                        : "text-[#8baebb]"
                    }
                  />

                  <span className="text-[13px] font-medium">
                    {item.title}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}

      </nav>

      {/* RODAPÉ */}

      <div className="px-5 py-4 border-t border-cyan-500/10">
        <p className="text-[10px] text-[#7897a7] text-center">
          EMATEA · Painel de Agentes
        </p>
      </div>

    </aside>
  );
}
