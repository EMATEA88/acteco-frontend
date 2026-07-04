import { useEffect, useState } from "react";
import {
  TrendingUp,
  BadgeDollarSign,
  Users,
  UserCheck,
  UserX,
  Percent
} from "lucide-react";

import { AgentService } from "../../services/agent.service";

export default function AgentStatistics() {

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState<any>(null);

  useEffect(() => {

    load();

  }, []);

  async function load() {

    try {

      const data =
        await AgentService.statistics();

      setStats(data);

    } finally {

      setLoading(false);

    }

  }

  if (loading) {

    return (

      <div className="text-center py-20">

        Carregando estatísticas...

      </div>

    );

  }

  if (!stats) {

    return (

      <div className="text-center py-20 text-red-600">

        Não foi possível carregar as estatísticas.

      </div>

    );

  }

  const totalSubAgents =

    stats.totalSubAgents || 0;

  const activeSubAgents =

    stats.activeSubAgents || 0;

  const inactiveSubAgents =

    stats.inactiveSubAgents || 0;

  const activePercent =

    totalSubAgents === 0

      ? 0

      : (

          activeSubAgents /

          totalSubAgents

        ) * 100;

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">

          Estatísticas

        </h1>

        <p className="text-gray-500 mt-2">

          Desempenho geral do Agente e da sua equipa.

        </p>

      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        <StatCard

          title="Total Vendido"

          value={stats.totalSales}

          icon={<TrendingUp size={24}/>}

        />

        <StatCard

          title="Comissão Total"

          value={stats.totalCommission}

          icon={<BadgeDollarSign size={24}/>}

        />

        <StatCard

          title="Comissão Disponível"

          value={stats.commissionBalance}

          icon={<BadgeDollarSign size={24}/>}

        />

        <StatCard

          title="Sub-agentes"

          value={totalSubAgents}

          icon={<Users size={24}/>}

        />

        <StatCard

          title="Ativos"

          value={activeSubAgents}

          icon={<UserCheck size={24}/>}

        />

        <StatCard

          title="Inativos"

          value={inactiveSubAgents}

          icon={<UserX size={24}/>}

        />

      </div>

      {/* Indicadores */}

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="font-semibold text-xl mb-6">

            Indicadores

          </h2>

          <div className="space-y-5">

            <Indicator

              icon={<Users size={18}/>}

              label="Total de Sub-agentes"

              value={totalSubAgents}

            />

            <Indicator

              icon={<UserCheck size={18}/>}

              label="Sub-agentes ativos"

              value={activeSubAgents}

            />

            <Indicator

              icon={<UserX size={18}/>}

              label="Sub-agentes inativos"

              value={inactiveSubAgents}

            />

            <Indicator

              icon={<TrendingUp size={18}/>}

              label="Total vendido"

              value={Number(

                stats.totalSales

              ).toLocaleString()}

            />

            <Indicator

              icon={<BadgeDollarSign size={18}/>}

              label="Comissão acumulada"

              value={Number(

                stats.totalCommission

              ).toLocaleString()}

            />

          </div>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="font-semibold text-xl mb-6">

            Eficiência da Equipa

          </h2>

          <div className="flex flex-col items-center">

            <div className="relative w-44 h-44 rounded-full border-8 border-blue-500 flex items-center justify-center">

              <div className="text-center">

                <Percent

                  size={30}

                  className="mx-auto"

                />

                <div className="text-4xl font-bold mt-2">

                  {activePercent.toFixed(0)}%

                </div>

              </div>

            </div>

            <p className="mt-6 text-gray-600">

              Percentagem de Sub-agentes ativos.

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}

function StatCard({

  title,

  value,

  icon

}:any){

  return(

    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500">

            {title}

          </p>

          <h2 className="text-3xl font-bold mt-2">

            {

              typeof value==="number"

              ?

              value.toLocaleString()

              :

              value

            }

          </h2>

        </div>

        <div className="text-blue-600">

          {icon}

        </div>

      </div>

    </div>

  );

}

function Indicator({

  icon,

  label,

  value

}:any){

  return(

    <div className="flex justify-between items-center border-b pb-3">

      <div className="flex items-center gap-3">

        {icon}

        <span>

          {label}

        </span>

      </div>

      <strong>

        {value}

      </strong>

    </div>

  );

}