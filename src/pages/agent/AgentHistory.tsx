import { useEffect, useMemo, useState } from "react";
import { Search, History } from "lucide-react";

import { AgentService } from "../../services/agent.service";

export default function AgentHistory() {

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [history, setHistory] =
    useState<any[]>([]);

  useEffect(() => {

    load();

  }, []);

  async function load() {

    try {

      const data =
        await AgentService.getTeamSales();

      setHistory(data);

    } finally {

      setLoading(false);

    }

  }

  const filtered =
    useMemo(() => {

      return history.filter((item) => {

        const value = `

          ${item.user?.fullName || ""}

          ${item.serviceName || ""}

          ${item.customerReference || ""}

        `.toLowerCase();

        return value.includes(

          search.toLowerCase()

        );

      });

    }, [history, search]);

  if (loading) {

    return (

      <div className="text-center py-20">

        Carregando histórico...

      </div>

    );

  }

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">

          Histórico da Equipa

        </h1>

        <p className="text-gray-500 mt-2">

          Todas as vendas realizadas pelos seus Sub-agentes.

        </p>

      </div>

      <div className="flex items-center gap-3">

        <div className="relative w-full max-w-md">

          <Search

            size={18}

            className="absolute left-3 top-3 text-gray-400"

          />

          <input

            value={search}

            onChange={(e)=>

              setSearch(e.target.value)

            }

            placeholder="Pesquisar..."

            className="w-full border rounded-lg pl-10 pr-4 py-3"

          />

        </div>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="min-w-full">

          <thead>

            <tr className="bg-gray-100 border-b">

              <th className="text-left p-4">

                Sub-agente

              </th>

              <th className="text-left">

                Serviço

              </th>

              <th className="text-left">

                Referência

              </th>

              <th className="text-right">

                Valor

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

              filtered.length===0

              ?

              <tr>

                <td

                  colSpan={6}

                  className="text-center py-16 text-gray-500"

                >

                  <div className="flex flex-col items-center gap-3">

                    <History size={40}/>

                    Nenhum histórico encontrado.

                  </div>

                </td>

              </tr>

              :

              filtered.map((item:any)=>(

                <tr

                  key={item.id}

                  className="border-b hover:bg-gray-50"

                >

                  <td className="p-4">

                    {

                      item.user?.fullName ||

                      "-"

                    }

                  </td>

                  <td>

                    {

                      item.serviceName ||

                      "-"

                    }

                  </td>

                  <td>

                    {

                      item.customerReference ||

                      "-"

                    }

                  </td>

                  <td className="text-right font-semibold">

                    {

                      Number(

                        item.amount

                      ).toLocaleString()

                    }

                  </td>

                  <td className="text-center">

                    <Status

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

  );

}

function Status({

  status

}:{

  status:string

}){

  switch(status){

    case "COMPLETED":

      return(

        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">

          Concluído

        </span>

      );

    case "PENDING":

      return(

        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">

          Pendente

        </span>

      );

    case "FAILED":

      return(

        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">

          Falhou

        </span>

      );

    default:

      return(

        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">

          {status}

        </span>

      );

  }

}