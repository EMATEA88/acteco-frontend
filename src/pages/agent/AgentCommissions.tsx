import { useEffect, useState } from "react";
import {
  BadgeDollarSign,
  Clock3,
  CheckCircle2,
  XCircle,
  TrendingUp
} from "lucide-react";

import { AgentService } from "../../services/agent.service";

export default function AgentCommissions() {

  const [loading, setLoading] =
    useState(true);

  const [summary, setSummary] =
    useState<any>(null);

  const [history, setHistory] =
    useState<any[]>([]);

  useEffect(() => {

    load();

  }, []);

  async function load() {

    try {

      const [

        summaryData,

        historyData

      ] = await Promise.all([

        AgentService.getCommissionSummary(),

        AgentService.getCommissionHistory()

      ]);

      setSummary(summaryData);

      setHistory(historyData);

    } finally {

      setLoading(false);

    }

  }

  if (loading) {

    return (

      <div className="text-center py-20">

        Carregando...

      </div>

    );

  }

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">

          Comissões

        </h1>

        <p className="text-gray-500 mt-2">

          Acompanhe todas as comissões geradas pela sua equipa.

        </p>

      </div>

      {/* Cards */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        <Card

          title="Disponível"

          value={summary.availableCommission}

          icon={<BadgeDollarSign size={24}/>}

        />

        <Card

          title="Total"

          value={summary.totalCommission}

          icon={<TrendingUp size={24}/>}

        />

        <Card

          title="Pendentes"

          value={summary.pending.amount}

          subtitle={`${summary.pending.count} registos`}

          icon={<Clock3 size={24}/>}

        />

        <Card

          title="Pagas"

          value={summary.paid.amount}

          subtitle={`${summary.paid.count} registos`}

          icon={<CheckCircle2 size={24}/>}

        />

      </div>

      {/* Histórico */}

      <div className="bg-white rounded-xl shadow">

        <div className="p-6 border-b">

          <h2 className="font-semibold text-xl">

            Histórico de Comissões

          </h2>

        </div>

        <div className="overflow-auto">

          <table className="min-w-full">

            <thead>

              <tr className="bg-gray-100 border-b">

                <th className="text-left p-4">

                  Serviço

                </th>

                <th className="text-left">

                  Referência

                </th>

                <th className="text-right">

                  Comissão

                </th>

                <th className="text-center">

                  Estado

                </th>

                <th className="text-right">

                  Data

                </th>

              </tr>

            </thead>

            <tbody>

              {

                history.length === 0

                ?

                <tr>

                  <td

                    colSpan={5}

                    className="text-center py-12 text-gray-500"

                  >

                    Nenhuma comissão encontrada.

                  </td>

                </tr>

                :

                history.map((item:any)=>(

                  <tr

                    key={item.id}

                    className="border-b"

                  >

                    <td className="p-4">

                      {

                        item.serviceRequest

                        ?.serviceName ||

                        "-"

                      }

                    </td>

                    <td>

                      {

                        item.serviceRequest

                        ?.customerReference ||

                        "-"

                      }

                    </td>

                    <td className="text-right font-semibold text-green-600">

                      {

                        Number(

                          item.amount

                        ).toLocaleString()

                      }

                    </td>

                    <td className="text-center">

                      <StatusBadge

                        status={item.status}

                      />

                    </td>

                    <td className="text-right">

                      {

                        new Date(

                          item.createdAt

                        ).toLocaleString()

                      }

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

function Card({

  title,

  value,

  subtitle,

  icon

}:any){

  return(

    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex justify-between">

        <div>

          <p className="text-gray-500">

            {title}

          </p>

          <h2 className="text-2xl font-bold mt-2">

            {

              Number(value)

              .toLocaleString()

            }

          </h2>

          {

            subtitle &&

            <p className="text-sm text-gray-400 mt-2">

              {subtitle}

            </p>

          }

        </div>

        <div className="text-blue-600">

          {icon}

        </div>

      </div>

    </div>

  );

}

function StatusBadge({

  status

}:{

  status:string

}){

  if(status==="PENDING"){

    return(

      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-700 px-3 py-1 text-sm">

        <Clock3 size={14}/>

        Pendente

      </span>

    );

  }

  if(status==="PAID"){

    return(

      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm">

        <CheckCircle2 size={14}/>

        Paga

      </span>

    );

  }

  return(

    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 px-3 py-1 text-sm">

      <XCircle size={14}/>

      Cancelada

    </span>

  );

}