import { useEffect, useState } from "react";
import {
  Wallet,
  BadgeDollarSign,
  Users,
  TrendingUp,
  Calendar,
  Activity
} from "lucide-react";

import { AgentService } from "../../services/agent.service";

export default function AgentDashboard() {

  const [loading, setLoading] =
    useState(true);

  const [dashboard, setDashboard] =
    useState<any>(null);

  useEffect(() => {

    loadDashboard();

  }, []);

  async function loadDashboard() {

    try {

      const data =
        await AgentService.dashboard();

      setDashboard(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  if (loading) {

    return (

      <div className="flex justify-center py-20">

        <div className="text-gray-500">

          Carregando...

        </div>

      </div>

    );

  }

  if (!dashboard) {

    return (

      <div className="text-red-500">

        Não foi possível carregar o dashboard.

      </div>

    );

  }

  return (

    <div className="space-y-8">

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <Card

          title="Saldo"

          value={dashboard.profile.currentBalance}

          icon={<Wallet size={24} />}

        />

        <Card

          title="Comissão"

          value={dashboard.profile.commissionBalance}

          icon={<BadgeDollarSign size={24} />}

        />

        <Card

          title="Total Vendido"

          value={dashboard.profile.totalSales}

          icon={<TrendingUp size={24} />}

        />

        <Card

          title="Sub-agentes"

          value={dashboard.team.total}

          icon={<Users size={24} />}

        />

      </div>

      {/* Estatísticas */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="font-semibold text-lg mb-5">

            Vendas

          </h2>

          <div className="space-y-4">

            <Item

              icon={<Calendar size={18}/>}

              label="Hoje"

              value={dashboard.sales.today}

            />

            <Item

              icon={<TrendingUp size={18}/>}

              label="Este mês"

              value={dashboard.sales.month}

            />

            <Item

              icon={<Users size={18}/>}

              label="Sub-agentes ativos"

              value={dashboard.team.active}

            />

            <Item

              icon={<Users size={18}/>}

              label="Sub-agentes inativos"

              value={dashboard.team.inactive}

            />

          </div>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="font-semibold text-lg mb-5">

            Comissões

          </h2>

          <div className="space-y-4">

            <Item

              icon={<BadgeDollarSign size={18}/>}

              label="Disponível"

              value={dashboard.commissions.available}

            />

            <Item

              icon={<Activity size={18}/>}

              label="Pendentes"

              value={dashboard.commissions.pending}

            />

            <Item

              icon={<TrendingUp size={18}/>}

              label="Total"

              value={dashboard.profile.totalCommission}

            />

          </div>

        </div>

      </div>

      {/* Últimas vendas */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="font-semibold text-lg mb-5">

          Últimas vendas

        </h2>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">

                  Serviço

                </th>

                <th className="text-left">

                  Referência

                </th>

                <th className="text-right">

                  Valor

                </th>

              </tr>

            </thead>

            <tbody>

              {

                dashboard.recentSales.map((sale:any)=>(

                  <tr
                    key={sale.id}
                    className="border-b"
                  >

                    <td className="py-3">

                      {sale.serviceName}

                    </td>

                    <td>

                      {sale.customerReference}

                    </td>

                    <td className="text-right">

                      {sale.amount}

                    </td>

                  </tr>

                ))

              }

            </tbody>

          </table>

        </div>

      </div>

      {/* Últimas comissões */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="font-semibold text-lg mb-5">

          Últimas comissões

        </h2>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">

                  Descrição

                </th>

                <th className="text-right">

                  Valor

                </th>

              </tr>

            </thead>

            <tbody>

              {

                dashboard.recentCommissions.map((item:any)=>(

                  <tr
                    key={item.id}
                    className="border-b"
                  >

                    <td className="py-3">

                      {item.description}

                    </td>

                    <td className="text-right">

                      {item.amount}

                    </td>

                  </tr>

                ))

              }

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}

/* =====================================================
CARD
===================================================== */

function Card({

  title,

  value,

  icon

}:any){

  return(

    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-sm text-gray-500">

            {title}

          </p>

          <h2 className="text-2xl font-bold mt-2">

            {value}

          </h2>

        </div>

        <div className="text-blue-600">

          {icon}

        </div>

      </div>

    </div>

  );

}

/* =====================================================
ITEM
===================================================== */

function Item({

  icon,

  label,

  value

}:any){

  return(

    <div className="flex justify-between">

      <div className="flex gap-3 items-center">

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