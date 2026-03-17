import { useEffect, useState } from "react"
import { KixikilaService } from "../services/kixikila.service"
import { formatCurrencyAOA } from "../utils/formatCurrency"
import { type KixikilaDashboard } from "../types/kixikila"
import { api } from "../services/api"

export default function Kixikila() {

  const [data,setData] = useState<KixikilaDashboard | null>(null)
  const [loadingGroup,setLoadingGroup] = useState<string | null>(null)

  const [members,setMembers] = useState<any[]>([])
  const [showMembers,setShowMembers] = useState(false)

  const [showTerms,setShowTerms] = useState(false)

  async function load(){

    try{
      const dashboard = await KixikilaService.dashboard()
      setData(dashboard)
    }catch(e){
      console.error(e)
    }

  }

  async function join(groupId:string){

    try{

      setLoadingGroup(groupId)

      await KixikilaService.join(groupId)

      alert("Pedido enviado para aprovação")

      await load()

    }catch(err:any){

      alert(err?.response?.data?.error || "Erro ao aderir")

    }finally{
      setLoadingGroup(null)
    }

  }

  async function viewMembers(groupId:string){

    try{

      const res = await api.get(`/kixikila/group/${groupId}/members`)

      setMembers(res.data)

      setShowMembers(true)

    }catch(e){
      console.error(e)
    }

  }

  useEffect(()=>{
    load()
  },[])

  if(!data) return null

  return(

    <div className="bg-[#0B0E11] min-h-screen text-[#EAECEF] pb-24">

      <div className="px-5 pt-4 flex flex-col gap-5">

        {/* HEADER */}

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="
              w-10
              h-10
              rounded-full
              overflow-hidden
              border border-[#2B3139]
            ">
              <img
                src="/logo.png"
                className="w-full h-full object-cover"
              />
            </div>

            <div>

              <p className="font-semibold text-lg">
                KIXIKILA
              </p>

              <p className="text-[11px] text-[#848E9C]">
                Poupança Coletiva Segura
              </p>

            </div>

          </div>

          <button
            onClick={()=>setShowTerms(true)}
            className="text-xs text-[#FCD535] hover:underline"
          >
            Termos
          </button>

        </div>

        {/* WALLET */}

        <div className="
          rounded-3xl
          p-5
          bg-gradient-to-br from-[#1E2329] to-[#14181D]
          border border-[#2B3139]
          shadow-[0_12px_30px_rgba(0,0,0,0.6)]
        ">

          <p className="text-[11px] text-[#848E9C] uppercase tracking-widest">
            Saldo disponível
          </p>

          <p className="text-2xl font-semibold mt-2">
            {formatCurrencyAOA(data.wallet.balance)}
          </p>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-3 gap-3">

          <Stat
            label="Saldo Congelado"
            value={formatCurrencyAOA(data.wallet.frozen)}
          />

          <Stat
            label="Participações"
            value={data.participation ? "1" : "0"}
          />

          <Stat
            label="Valor a Receber"
            value={
              data.participation
                ? formatCurrencyAOA(data.participation.totalReceive)
                : "0 Kz"
            }
          />

        </div>

        {/* GRUPOS */}

        <div className="flex items-center justify-between">

          <p className="font-semibold">
            Kixikila — Grupos Disponíveis
          </p>

        </div>

        {data.groups.map(group=>{

          const receive = group.totalReceive

          const filled = group.filled ?? 0

          const percent = Math.floor((filled / group.membersLimit) * 100)

          const isFull = filled >= group.membersLimit

          return(

            <div
              key={group.id}
              className="
              rounded-2xl
              p-4
              bg-gradient-to-br from-[#1E2329] to-[#14181D]
              border border-[#2B3139]
              "
            >

              <div className="flex justify-between items-center">

                <div>

                  <p className="font-semibold">
                    {group.name}
                  </p>

                  <p className="text-[12px] text-[#848E9C]">
                    {filled}/{group.membersLimit} membros
                  </p>

                  <p className="text-[12px] text-[#848E9C]">
                    {formatCurrencyAOA(group.contribution)} / mês
                  </p>

                  <button
                    onClick={()=>viewMembers(group.id)}
                    className="text-[11px] text-[#FCD535] hover:underline mt-1"
                  >
                    Ver membros
                  </button>

                </div>

                {/* PROGRESS */}

                <div className="flex flex-col items-center">

                  <div className="w-12 h-12 rounded-full border-2 border-[#FCD535] flex items-center justify-center text-xs">
                    {percent}%
                  </div>

                </div>

                <div className="text-right">

                  <p className="text-[11px] text-[#848E9C]">
                    Valor a receber
                  </p>

                  <p className="text-[#FCD535] font-semibold">
                    {formatCurrencyAOA(receive)}
                  </p>

                  <button
                    disabled={loadingGroup === group.id || isFull}
                    onClick={()=>join(group.id)}
                    className="
                    mt-2
                    bg-[#FCD535]
                    disabled:bg-gray-600
                    text-black
                    px-4
                    py-1
                    rounded-lg
                    text-sm
                    font-semibold
                    "
                  >
                    {loadingGroup === group.id
                     ? "Enviando..."
                     : isFull
                     ? "Grupo cheio"
                     : "Aderir"}
                  </button>

                </div>

              </div>

            </div>

          )

        })}

        {/* PARTICIPAÇÃO */}

        {data.participation && (

          <div className="
          rounded-2xl
          p-4
          bg-gradient-to-br from-[#1E2329] to-[#14181D]
          border border-[#2B3139]
          ">

            <p className="font-semibold mb-3">
              Minha Participação Atual
            </p>

            <p className="text-[13px] text-[#848E9C]">
              Grupo: {data.participation.groupName}
            </p>

            <p className="text-[13px] text-[#848E9C]">
              Posição: {data.participation.position}
            </p>

            <p className="text-[13px] text-[#848E9C]">
              Contribuição:{" "}
              {formatCurrencyAOA(data.participation.contribution)}
            </p>

            <p className="text-[#0ECB81] font-semibold mt-2">
              {formatCurrencyAOA(data.participation.totalReceive)}
            </p>

          </div>

        )}

      </div>

      {/* MODAL MEMBROS */}

      {showMembers && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-[#14181D] border border-[#2B3139] rounded-xl p-6 w-[90%] max-w-[400px]">

            <h2 className="font-semibold mb-4">
              Membros da Kixikila
            </h2>

            {members.map((m,index)=>(

              <div key={index} className="flex justify-between text-sm mb-2">

                <span>
                  {m.position}
                </span>

                <span>
                  {m.user?.fullName || "Usuário"}
                </span>

              </div>

            ))}

            <button
              onClick={()=>setShowMembers(false)}
              className="mt-4 bg-[#FCD535] text-black px-4 py-1 rounded"
            >
              Fechar
            </button>

          </div>

        </div>

      )}

      {/* MODAL TERMOS */}

      {showTerms && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-[#14181D] border border-[#2B3139] rounded-xl p-6 w-[90%] max-w-[400px]">

            <h2 className="font-semibold mb-3">
              Termos da Kixikila
            </h2>

            <p className="text-sm text-[#848E9C]">

            • Cada membro contribui mensalmente.<br/>
            • A cada ciclo um membro recebe o valor total.<br/>
            • A ordem é definida pela posição.<br/>
            • Após receber o membro continua contribuindo até terminar o ciclo.

            </p>

            <button
              onClick={()=>setShowTerms(false)}
              className="mt-4 bg-[#FCD535] text-black px-4 py-1 rounded"
            >
              Fechar
            </button>

          </div>

        </div>

      )}

    </div>

  )

}

function Stat({label,value}:any){

  return(

    <div className="
    bg-[#14181D]
    border border-[#2B3139]
    rounded-xl
    p-3
    text-center
    ">

      <p className="text-[11px] text-[#848E9C]">
        {label}
      </p>

      <p className="font-semibold text-sm mt-1">
        {value}
      </p>

    </div>

  )

}