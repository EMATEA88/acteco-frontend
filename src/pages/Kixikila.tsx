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
  X,
  CalendarBlank,
  UserList
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

  if (loading) {
    return <SkeletonPage title="Carregando Kixikila..." />
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 pb-32 space-y-6 font-normal">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#161A1F] border border-white/5 p-1.5">
            <img src="/logo.png" className="w-full h-full object-contain filter grayscale brightness-200"/>
          </div>
          <div>
            <h1 className="text-lg font-medium">Kixikila</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Savings Protocol</p>
          </div>
        </div>

        <button 
          onClick={() => setShowTerms(true)} 
          className="p-2.5 rounded-xl bg-[#161A1F] border border-white/5 text-gray-400"
        >
          <Info size={20}/>
        </button>
      </div>

      {/* WALLET CARD */}
      <div className="bg-[#161A1F] p-6 rounded-3xl space-y-2 border border-white/5 shadow-xl">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Saldo disponível</p>
        <h2 className="text-3xl font-semibold text-white tracking-tight">
          {formatCurrencyAOA(data.wallet.balance)}
        </h2>
      </div>

      {/* STATS - GRID */}
      <div className="grid grid-cols-3 gap-3">
        <Stat icon={<Snowflake size={18} className="text-cyan-400"/>} label="Congelado" value={formatCurrencyAOA(data.wallet.frozen)} />
        <Stat icon={<ListChecks size={18} className="text-emerald-500"/>} label="Grupos" value={data.participation ? "1" : "0"} />
        <Stat icon={<HandCoins size={18} className="text-amber-500"/>} label="Receber" value={data.participation ? formatCurrencyAOA(data.participation.totalReceive) : "0"} />
      </div>

      {/* GRUPOS DISPONÍVEIS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Pools disponíveis</p>
          <div className="h-px bg-white/5 flex-1 ml-4" />
        </div>

        {data.groups.map(group => {
          const filled = group.filled ?? 0
          const percent = Math.floor((filled / group.membersLimit) * 100)
          const isFull = filled >= group.membersLimit

          return (
            <div key={group.id} className="bg-[#161A1F] p-5 rounded-[2rem] space-y-5 border border-white/5 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-base text-white">{group.name}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                    <CalendarBlank size={12} /> Duração: {group.membersLimit} meses
                  </p>
                </div>
                <div className="bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                  <span className="text-xs text-emerald-500 font-semibold">{percent}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0B0E11] p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Quota Mensal</span>
                  <p className="text-xs font-medium text-white">{formatCurrencyAOA(group.contribution)}</p>
                </div>
                <div className="bg-[#0B0E11] p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Total Final</span>
                  <p className="text-xs font-medium text-emerald-500">{formatCurrencyAOA(group.contribution * group.membersLimit)}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => viewMembers(group.id)}
                  className="flex-1 h-11 bg-white/5 border border-white/5 rounded-2xl text-[11px] font-medium text-gray-400 active:bg-white/10"
                >
                  Ver Membros
                </button>
                <button
                  disabled={loadingGroup === group.id || isFull}
                  onClick={() => join(group.id)}
                  className="flex-1 h-11 bg-white text-black rounded-2xl text-[11px] font-semibold active:opacity-80"
                >
                  {loadingGroup === group.id ? "Aguarde..." : isFull ? "Esgotado" : "Entrar na Pool"}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* MINHA PARTICIPAÇÃO DETALHADA */}
      {data.participation && (
        <div className="bg-emerald-500/5 p-6 rounded-[2.5rem] border border-emerald-500/10 space-y-4 shadow-2xl">
          <div className="flex justify-between items-center">
             <p className="text-[10px] text-emerald-500 uppercase font-black tracking-widest">Minha participação</p>
             <div className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-[9px] font-bold uppercase tracking-tighter border border-emerald-500/20">Ativo</div>
          </div>

          <div className="flex justify-between items-end">
            <h3 className="text-lg font-medium text-white">{data.participation.groupName}</h3>
            <div className="text-right">
                <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Valor a Receber</p>
                <p className="text-xl font-semibold text-emerald-500">{formatCurrencyAOA(data.participation.totalReceive)}</p>
            </div>
          </div>

          <div className="h-px bg-emerald-500/10 w-full" />

          <div className="grid grid-cols-2 gap-4">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <CalendarBlank size={16} />
                </div>
                <div>
                    <p className="text-[9px] text-gray-500 uppercase font-bold">Ciclo Total</p>
                    <p className="text-xs text-white">10 meses</p>
                </div>
             </div>

             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                    <UserList size={16} />
                </div>
                <div>
                    <p className="text-[9px] text-gray-500 uppercase font-bold">Sua Posição</p>
                    <p className="text-xs text-white">#{data.participation.position || '8'}º na fila</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* MODAL MEMBROS */}
      {showMembers && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-[#161A1F] p-6 rounded-[2.5rem] w-full max-w-sm space-y-6 border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium uppercase tracking-wider text-gray-400">Lista de Membros</p>
              <button onClick={() => setShowMembers(false)} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-full">
                <X size={16}/>
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {members.map((m, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-gray-600 font-bold">#{m.position}</span>
                    <span className="text-xs text-gray-200">{m.user?.fullName || "Membro Anônimo"}</span>
                  </div>
                  {m.position === 1 && <span className="text-[8px] bg-cyan-500/10 text-cyan-500 px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">Líder</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showTerms && <KixikilaTermsModal onAccept={() => setShowTerms(false)} />}
    </div>
  )
}

function Stat({ icon, label, value }: any) {
  return (
    <div className="bg-[#161A1F] p-4 rounded-2xl text-center space-y-2 border border-white/5 shadow-md">
      <div className="flex justify-center opacity-80">{icon}</div>
      <div className="space-y-0.5">
        <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tight">{label}</p>
        <p className="text-[11px] font-medium text-white truncate px-1">{value}</p>
      </div>
    </div>
  )
}