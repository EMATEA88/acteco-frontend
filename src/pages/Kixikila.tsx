import { useEffect, useState } from "react"
import { KixikilaService } from "../services/kixikila.service"
import { formatCurrencyAOA } from "../utils/formatCurrency"
import { type KixikilaDashboard } from "../types/kixikila"
import KixikilaTermsModal from "../components/KixikilaTermsModal"
import { api } from "../services/api"
import { 
  UsersThree, 
  Wallet, 
  Info, 
  ShieldCheck, 
  Snowflake, 
  ListChecks, 
  HandCoins,
  X 
} from "@phosphor-icons/react"

export default function Kixikila() {
  const [data, setData] = useState<KixikilaDashboard | null>(null)
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
    }
  }

  async function join(groupId: string) {
    try {
      setLoadingGroup(groupId)
      await KixikilaService.join(groupId)
      alert("Pedido enviado para aprovação dos auditores EMATEA")
      await load()
    } catch (err: any) {
      alert(err?.response?.data?.error || "Erro ao aderir ao grupo")
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

  if (!data) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-green-500/30 pb-32">
      
      {/* HEADER PREMIUM */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-6 py-5">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-white/10 p-0.5 bg-[#111]">
              <img src="/logo.png" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic">Kixikila</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Savings Protocol v2.0</p>
            </div>
          </div>
          <button onClick={() => setShowTerms(true)} className="p-2 bg-white/5 rounded-full text-green-500 hover:bg-green-500/10 transition-all">
            <Info size={24} weight="duotone" />
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 pt-8 space-y-8">
        
        {/* WALLET / SALDO PRINCIPAL */}
        <section className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Wallet size={80} weight="thin" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-1">Saldo Disponível em Carteira</p>
            <h2 className="text-4xl font-black tracking-tighter italic">
              {formatCurrencyAOA(data.wallet.balance)}
            </h2>
          </div>
        </section>

        {/* STATS GRID */}
        <section className="grid grid-cols-3 gap-4">
          <Stat icon={<Snowflake size={20} weight="duotone" />} label="Congelado" value={formatCurrencyAOA(data.wallet.frozen)} />
          <Stat icon={<ListChecks size={20} weight="duotone" />} label="Grupos" value={data.participation ? "1" : "0"} />
          <Stat icon={<HandCoins size={20} weight="duotone" />} label="A Receber" value={data.participation ? formatCurrencyAOA(data.participation.totalReceive) : "0 Kz"} />
        </section>

        {/* GRUPOS DISPONÍVEIS */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 ml-2">
            <UsersThree size={20} weight="fill" className="text-green-500" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">Pools de Poupança Ativas</h3>
          </div>

          <div className="space-y-4">
            {data.groups.map(group => {
              const filled = group.filled ?? 0
              const percent = Math.floor((filled / group.membersLimit) * 100)
              const isFull = filled >= group.membersLimit

              return (
                <div key={group.id} className="bg-[#111] border border-white/5 rounded-[2rem] p-6 space-y-6 transition-all hover:border-green-500/20 group">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="text-lg font-black tracking-tight italic uppercase">{group.name}</h4>
                      <div className="flex items-center gap-2">
                         <UsersThree size={14} className="text-gray-600" />
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{filled}/{group.membersLimit} Membros</span>
                      </div>
                    </div>
                    <div className="relative w-14 h-14">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path className="text-white/5" strokeDasharray="100, 100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-green-500 transition-all duration-1000" strokeDasharray={`${percent}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black">{percent}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-5">
                    <div>
                      <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Yield de Recebimento</p>
                      <p className="text-sm font-black text-green-500 italic">{formatCurrencyAOA(group.totalReceive)}</p>
                      <p className="text-[9px] text-gray-500 font-medium">Contribuição: {formatCurrencyAOA(group.contribution)}/mês</p>
                    </div>
                    <div className="flex flex-col items-end justify-center gap-3">
                      <button onClick={() => viewMembers(group.id)} className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors underline underline-offset-4">Ver Membros</button>
                      <button
                        disabled={loadingGroup === group.id || isFull}
                        onClick={() => join(group.id)}
                        className="bg-white text-black px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all active:scale-95 disabled:opacity-20 shadow-xl"
                      >
                        {loadingGroup === group.id ? "A Processar" : isFull ? "Esgotado" : "Aderir à Pool"}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* MINHA PARTICIPAÇÃO */}
        {data.participation && (
          <section className="bg-green-500/5 border border-green-500/10 rounded-[2.5rem] p-8 space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck size={28} weight="duotone" className="text-green-500" />
              <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Minha Participação Ativa</h3>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-green-500/10">
              <div>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Grupo & Posição</p>
                <p className="text-xs font-black uppercase italic">{data.participation.groupName} • #{data.participation.position}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Montante Final</p>
                <p className="text-lg font-black text-green-500 italic">{formatCurrencyAOA(data.participation.totalReceive)}</p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* MODAL MEMBROS PREMIUM */}
      {showMembers && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[60] p-6 animate-in fade-in duration-300">
          <div className="bg-[#111] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowMembers(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
              <X size={24} weight="bold" />
            </button>
            <h2 className="text-xl font-black uppercase tracking-tighter italic mb-8 flex items-center gap-3">
              <UsersThree size={28} weight="duotone" className="text-green-500" />
              Estrutura da Pool
            </h2>
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 no-scrollbar">
              {members.map((m, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black text-green-500 bg-green-500/10 w-8 h-8 flex items-center justify-center rounded-lg">#{m.position}</span>
                  <span className="text-sm font-bold text-white tracking-tight">{m.user?.fullName || "Membro Anónimo"}</span>
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
    <div className="bg-[#111] border border-white/5 rounded-3xl p-4 text-center space-y-2">
      <div className="text-gray-600 flex justify-center">{icon}</div>
      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none">{label}</p>
      <p className="font-black text-[11px] tracking-tight text-white">{value}</p>
    </div>
  )
}