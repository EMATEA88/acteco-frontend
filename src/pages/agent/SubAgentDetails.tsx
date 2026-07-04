import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Lock,
  Unlock,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Building2,
  Wallet,
  UserCircle
} from "lucide-react";

import { AgentService } from "../../services/agent.service";

export default function SubAgentDetails() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [loading, setLoading] =
    useState(true);

  const [subAgent, setSubAgent] =
    useState<any>(null);

  const [history, setHistory] =
    useState<any[]>([]);

  useEffect(() => {

    load();

  }, []);

  async function load() {

    try {

      const details =
        await AgentService.getSubAgent(
          Number(id)
        );

      const sales =
        await AgentService.getSubAgentHistory(
          Number(id)
        );

      setSubAgent(details);

      setHistory(sales);

    } finally {

      setLoading(false);

    }

  }

  async function toggleStatus(){

    if(subAgent.user.isBlocked){

      await AgentService.unblockSubAgent(
        subAgent.id
      );

    }else{

      await AgentService.blockSubAgent(
        subAgent.id
      );

    }

    load();

  }

  if(loading){

    return(

      <div className="text-center py-20">

        Carregando...

      </div>

    );

  }

  return(

    <div className="space-y-8">

      <div className="flex justify-between items-center">

        <button

          onClick={()=>navigate(-1)}

          className="flex gap-2 items-center border rounded-lg px-4 py-2"

        >

          <ArrowLeft size={18}/>

          Voltar

        </button>

        <div className="flex gap-3">

          <button

            onClick={()=>

              navigate(

                `/agent/sub-agents/${subAgent.id}/edit`

              )

            }

            className="flex gap-2 items-center bg-blue-600 text-white px-4 py-2 rounded-lg"

          >

            <Pencil size={18}/>

            Editar

          </button>

          <button

            onClick={toggleStatus}

            className={`flex gap-2 items-center px-4 py-2 rounded-lg text-white

            ${

              subAgent.user.isBlocked

              ?

              "bg-green-600"

              :

              "bg-red-600"

            }

            `}

          >

            {

              subAgent.user.isBlocked

              ?

              <Unlock size={18}/>

              :

              <Lock size={18}/>

            }

            {

              subAgent.user.isBlocked

              ?

              "Desbloquear"

              :

              "Bloquear"

            }

          </button>

        </div>

      </div>

      {/* PERFIL */}

      <div className="bg-white rounded-xl shadow p-8">

        <div className="flex gap-5 items-center">

          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white">

            <UserCircle size={64}/>

          </div>

          <div>

            <h1 className="text-3xl font-bold">

              {subAgent.user.fullName}

            </h1>

            <p className="text-gray-500">

              {subAgent.employeeCode}

            </p>

          </div>

        </div>

      </div>

      {/* DADOS */}

      <div className="grid lg:grid-cols-2 gap-6">

        <Card
          icon={<Phone size={18}/>}
          title="Telefone"
          value={subAgent.user.phone}
        />

        <Card
          icon={<Mail size={18}/>}
          title="Email"
          value={subAgent.user.email || "-"}
        />

        <Card
          icon={<Wallet size={18}/>}
          title="Saldo"
          value={Number(
            subAgent.user.balance
          ).toLocaleString()}
        />

        <Card
          icon={<Briefcase size={18}/>}
          title="Cargo"
          value={subAgent.position || "-"}
        />

        <Card
          icon={<Building2 size={18}/>}
          title="Departamento"
          value={subAgent.department || "-"}
        />

        <Card
          icon={<MapPin size={18}/>}
          title="Endereço"
          value={subAgent.address || "-"}
        />

      </div>

      {/* HISTÓRICO */}

      <div className="bg-white rounded-xl shadow">

        <div className="p-6 border-b">

          <h2 className="text-xl font-semibold">

            Histórico de vendas

          </h2>

        </div>

        <div className="overflow-auto">

          <table className="min-w-full">

            <thead>

              <tr className="border-b bg-gray-100">

                <th className="text-left p-4">

                  Serviço

                </th>

                <th className="text-left">

                  Referência

                </th>

                <th className="text-right">

                  Valor

                </th>

                <th className="text-right">

                  Data

                </th>

              </tr>

            </thead>

            <tbody>

              {

                history.length===0

                ?

                <tr>

                  <td
                    colSpan={4}
                    className="text-center py-10 text-gray-500"
                  >

                    Nenhuma venda encontrada.

                  </td>

                </tr>

                :

                history.map((item:any)=>(

                  <tr
                    key={item.id}
                    className="border-b"
                  >

                    <td className="p-4">

                      {item.serviceName}

                    </td>

                    <td>

                      {item.customerReference}

                    </td>

                    <td className="text-right">

                      {Number(
                        item.amount
                      ).toLocaleString()}

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

interface CardProps{

  icon:any;

  title:string;

  value:any;

}

function Card({

  icon,

  title,

  value

}:CardProps){

  return(

    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex gap-3 items-center mb-4">

        {icon}

        <h3 className="font-semibold">

          {title}

        </h3>

      </div>

      <div className="text-lg font-medium">

        {value}

      </div>

    </div>

  );

}