import { useEffect, useState } from "react"
import { KixikilaService } from "../services/kixikila.service"
import { formatCurrencyAOA } from "../utils/formatCurrency"
import { type KixikilaDashboard } from "../types/kixikila"
import KixikilaTermsModal from "../components/KixikilaTermsModal"
import { api } from "../services/api"
import { SkeletonPage } from "../components/ui/Skeleton"
import { 
  Info, 
  Snowflake, 
  ListChecks, 
  HandCoins,
  X 
} from "@phosphor-icons/react"

export default function Kixikila() {
  const [data, setData] = useState<KixikilaDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingGroup, setLoadingGroup] = useState<string | null>(null)
  const [members, setMembers] = useState<any[]>([])
  const [showMembers, setShowMembers] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  async function load() {
    try {
      const dashboard = await KixikilaService.dashboard()
      setData(dashboard)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function join(groupId: string) {
    try {
      setLoadingGroup(groupId)
      await KixikilaService.join(groupId)
      alert("Pedido enviado para aprovação")
      await load()
    } catch (err: any) {
      alert(err?.response?.data?.error || "Erro")
    } finally {
      setLoadingGroup(null)
    }
  }

  async function viewMembers(groupId: string) {
    try {
      const res = await api.get(`/kixikila/group/${groupId}/members`)
      setMembers(res.data)
      setShowMembers(true)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { load() }, [])

  /* ================= LOADING ================= */
  if (loading) {
    return <SkeletonPage title="Carregando Kixikila..." />
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 pb-32 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10">
            <img src="/logo.png" className="w-full h-full object-cover"/>
          </div>
          <div>
            <h1 className="text-lg font-semibold">Kixikila</h1>
            <p className="text-[10px] text-gray-500">Savings Protocol</p>
          </div>
        </div>

        <button 
          onClick={() => setShowTerms(true)} 
          className="p-2 rounded-xl bg-white/5 border border-white/10"
        >
          <Info size={18}/>
        </button>
      </div>

      {/* WALLET */}
      <div className="glass-card p-5 rounded-2xl space-y-2">
        <p className="text-xs text-gray-500">Saldo disponível</p>
        <h2 className="text-2xl font-semibold">
          {formatCurrencyAOA(data.wallet.balance)}
        </h2>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-3">
        <Stat icon={<Snowflake size={16}/>} label="Congelado" value={formatCurrencyAOA(data.wallet.frozen)} />
        <Stat icon={<ListChecks size={16}/>} label="Grupos" value={data.participation ? "1" : "0"} />
        <Stat icon={<HandCoins size={16}/>} label="Receber" value={data.participation ? formatCurrencyAOA(data.participation.totalReceive) : "0"} />
      </div>

      {/* GRUPOS */}
      <div className="space-y-4">
        <p className="text-xs text-gray-500">Pools disponíveis</p>

        {data.groups.map(group => {
          const filled = group.filled ?? 0
          const percent = Math.floor((filled / group.membersLimit) * 100)
          const isFull = filled >= group.membersLimit

          return (
            <div key={group.id} className="glass-card p-4 rounded-2xl space-y-4">

              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-sm">{group.name}</p>
                  <p className="text-[10px] text-gray-500">
                    {filled}/{group.membersLimit} membros
                  </p>
                </div>

                <span className="text-xs text-emerald-500 font-semibold">
                  {percent}%
                </span>
              </div>

              <div className="text-xs text-gray-500">
                Contribuição: {formatCurrencyAOA(group.contribution)}
              </div>

              <div className="flex gap-2">

                <button
                  onClick={() => viewMembers(group.id)}
                  className="flex-1 h-10 bg-white/5 rounded-xl text-xs"
                >
                  Membros
                </button>

                <button
                  disabled={loadingGroup === group.id || isFull}
                  onClick={() => join(group.id)}
                  className="flex-1 h-10 bg-white text-black rounded-xl text-xs font-semibold"
                >
                  {loadingGroup === group.id ? "..." : isFull ? "Cheio" : "Entrar"}
                </button>

              </div>

            </div>
          )
        })}
      </div>

      {/* PARTICIPAÇÃO */}
      {data.participation && (
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <p className="text-xs text-gray-500">Minha participação</p>

          <div className="flex justify-between text-sm">
            <span>{data.participation.groupName}</span>
            <span className="text-emerald-500">
              {formatCurrencyAOA(data.participation.totalReceive)}
            </span>
          </div>
        </div>
      )}

      {/* MODAL */}
      {showMembers && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-5 z-50">
          <div className="glass-card p-5 rounded-2xl w-full max-w-sm space-y-4">

            <div className="flex justify-between">
              <p className="font-semibold">Membros</p>
              <button onClick={() => setShowMembers(false)}>
                <X size={18}/>
              </button>
            </div>

            {members.map((m, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>#{m.position}</span>
                <span>{m.user?.fullName || "Anónimo"}</span>
              </div>
            ))}

          </div>
        </div>
      )}

      {showTerms && <KixikilaTermsModal onAccept={() => setShowTerms(false)} />}

    </div>
  )
}

function Stat({ icon, label, value }: any) {
  return (
    <div className="glass-card p-3 rounded-xl text-center space-y-1">
      <div className="text-gray-500 flex justify-center">{icon}</div>
      <p className="text-[10px] text-gray-500">{label}</p>
      <p className="text-xs font-semibold">{value}</p>
    </div>
  )
}