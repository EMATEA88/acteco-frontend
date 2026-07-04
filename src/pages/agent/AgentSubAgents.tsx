import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Lock,
  Unlock
} from "lucide-react";

import { AgentService } from "../../services/agent.service";

export default function AgentSubAgents() {

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [subAgents, setSubAgents] =
    useState<any[]>([]);

  useEffect(() => {

    load();

  }, []);

  async function load() {

    try {

      const data =
        await AgentService.listSubAgents();

      setSubAgents(data);

    } finally {

      setLoading(false);

    }

  }

  async function toggleStatus(item:any){

    if(item.user.isBlocked){

      await AgentService.unblockSubAgent(item.id);

    }else{

      await AgentService.blockSubAgent(item.id);

    }

    load();

  }

  const filtered =
    useMemo(()=>{

      return subAgents.filter((item)=>{

        const value=

        `${item.user.fullName}

        ${item.user.phone}

        ${item.employeeCode}`

        .toLowerCase();

        return value.includes(

          search.toLowerCase()

        );

      });

    },[search,subAgents]);

  if(loading){

    return(

      <div className="py-20 text-center">

        Carregando...

      </div>

    );

  }

  return(

    <div className="space-y-6">

      <div className="flex flex-col md:flex-row gap-4 justify-between">

        <div className="relative w-full md:w-96">

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

            className="w-full border rounded-lg pl-10 pr-4 py-2"

          />

        </div>

        <button

          onClick={()=>

            navigate("/agent/sub-agents/new")

          }

          className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2"

        >

          <Plus size={18}/>

          Novo Sub-agente

        </button>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">

                Nome

              </th>

              <th className="text-left">

                Telefone

              </th>

              <th className="text-left">

                Código

              </th>

              <th className="text-right">

                Saldo

              </th>

              <th className="text-center">

                Estado

              </th>

              <th className="text-center">

                Ações

              </th>

            </tr>

          </thead>

          <tbody>

            {

              filtered.map((item)=>(

                <tr

                  key={item.id}

                  className="border-t"

                >

                  <td className="p-4">

                    {item.user.fullName}

                  </td>

                  <td>

                    {item.user.phone}

                  </td>

                  <td>

                    {item.employeeCode}

                  </td>

                  <td className="text-right">

                    {Number(

                      item.user.balance

                    ).toLocaleString()}

                  </td>

                  <td className="text-center">

                    {

                      item.user.isBlocked

                      ?

                      <span className="text-red-600 font-medium">

                        Bloqueado

                      </span>

                      :

                      <span className="text-green-600 font-medium">

                        Ativo

                      </span>

                    }

                  </td>

                  <td>

                    <div className="flex justify-center gap-2">

                      <button

                        onClick={()=>

                          navigate(

                            `/agent/sub-agents/${item.id}`

                          )

                        }

                        className="p-2 rounded hover:bg-gray-100"

                      >

                        <Eye size={18}/>

                      </button>

                      <button

                        onClick={()=>

                          navigate(

                            `/agent/sub-agents/${item.id}/edit`

                          )

                        }

                        className="p-2 rounded hover:bg-gray-100"

                      >

                        <Pencil size={18}/>

                      </button>

                      <button

                        onClick={()=>

                          toggleStatus(item)

                        }

                        className="p-2 rounded hover:bg-gray-100"

                      >

                        {

                          item.user.isBlocked

                          ?

                          <Unlock size={18}/>

                          :

                          <Lock size={18}/>

                        }

                      </button>

                    </div>

                  </td>

                </tr>

              ))

            }

          </tbody>

        </table>

        {

          filtered.length===0 &&(

            <div className="text-center py-12 text-gray-500">

              Nenhum Sub-agente encontrado.

            </div>

          )

        }

      </div>

    </div>

  );

}