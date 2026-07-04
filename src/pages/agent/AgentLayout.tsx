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

    <div className="min-h-screen bg-slate-100 flex">

      {/* Sidebar */}

      <aside className="w-72 bg-slate-900 text-white flex flex-col">

        <div className="p-6 border-b border-slate-700">

          <h1 className="text-2xl font-bold">

            EMATEA

          </h1>

          <p className="text-sm text-slate-300">

            Painel do Agente

          </p>

        </div>

        <nav className="flex-1 p-4 space-y-2">

          {

            menu.map((item) => {

              const Icon = item.icon;

              return (

                <NavLink

                  key={item.path}

                  to={item.path}

                  className={({ isActive }) =>

                    `flex items-center gap-3 rounded-lg px-4 py-3 transition

                    ${

                      isActive

                        ? "bg-blue-600 text-white"

                        : "hover:bg-slate-800"

                    }`

                  }

                >

                  <Icon size={20} />

                  <span>

                    {item.label}

                  </span>

                </NavLink>

              );

            })

          }

        </nav>

        <div className="p-4 border-t border-slate-700">

          <button

            onClick={logout}

            className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 hover:bg-red-700"

          >

            <LogOut size={18} />

            Sair

          </button>

        </div>

      </aside>

      {/* Conteúdo */}

      <main className="flex-1">

        <header className="bg-white shadow px-8 py-5">

          <h2 className="text-2xl font-semibold">

            Painel do Agente

          </h2>

        </header>

        <section className="p-8">

          <Outlet />

        </section>

      </main>

    </div>

  );

}