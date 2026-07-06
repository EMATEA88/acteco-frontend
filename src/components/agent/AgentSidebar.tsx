import {
  ChartBar,
  Users,
  UserPlus,
  Coins,
  ChartLine,
  ClockCounterClockwise,
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
    title: "Novo Sub-agente",
    icon: UserPlus,
    to: "/agent/sub-agents/new",
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
    title: "Histórico",
    icon: ClockCounterClockwise,
    to: "/agent/history",
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
    <div className="h-full flex flex-col bg-[#161A1E] text-[#EAECEF] antialiased">
      <div className="p-6 border-b border-white/[0.04] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-white/[0.08] overflow-hidden bg-white/[0.02] p-1 shadow-inner">
            <img
              src="/logo.png"
              className="w-full h-full object-contain rounded-full"
              alt="Logo"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-sm font-black tracking-wider text-white uppercase font-mono">
              EMATEA
            </h1>

            <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">
              Painel do Agente
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 bg-white/[0.05] rounded-full text-gray-400 hover:text-white hover:bg-white/[0.1] transition-all"
        >
          <X size={20} weight="bold" />
        </button>
      </div>

      <div className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) => `
                flex items-center gap-4 rounded-xl px-4 py-3
                font-medium text-[13px] tracking-tight relative group
                transition-all duration-200 border border-transparent
                ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/15 border-blue-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.03] hover:border-white/[0.02]"
                }
              `}
            >
              {({ isActive }) => (
                <button
  type="button"
  onClick={onClose}
  className="flex items-center gap-4 w-full text-left"
>
                  <div
                    className={`w-1 h-5 rounded-full bg-blue-400 absolute left-0 top-1/2 -translate-y-1/2 transition-transform duration-200 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />

                  <div
                    className={`transition-transform duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-blue-400/80 group-hover:text-blue-400"
                    }`}
                  >
                    <Icon
                      size={20}
                      weight={isActive ? "bold" : "regular"}
                    />
                  </div>

                  <span className="font-semibold">
                    {item.title}
                  </span>
                </button>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}