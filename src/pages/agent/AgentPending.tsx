import { useEffect, useState } from "react"
import { Clock3, LogOut, RefreshCw, ShieldCheck } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { api } from "../../services/api"

export default function AgentPending() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [checking, setChecking] = useState(false)

  // Função para verificar se a conta já foi aprovada
  const checkStatus = async () => {
    try {
      setChecking(true)
      // Faz uma chamada rápida para atualizar os dados do utilizador logado
      const { data } = await api.get("/auth/me") // Endpoint padrão de perfil, ajuste se necessário
      
      // Se a propriedade de aprovação estiver ativa, redireciona para o dashboard
      if (data?.agentProfile?.status === "APPROVED" || data?.isAgentApproved) {
        navigate("/agent/dashboard", { replace: true })
      }
    } catch (error) {
      console.error("Erro ao verificar status da conta", error)
    } finally {
      setChecking(false)
    }
  }

  // Polling automático a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      checkStatus()
    }, 5000)

    return () => clearInterval(interval)
  }, [navigate])

  return (
    <div className="min-h-screen bg-[#070d1a] flex items-center justify-center px-6 selection:bg-cyan-500 selection:text-black">
      <div className="w-full max-w-lg rounded-[2rem] border border-white/[0.08] bg-[#0b1220]/90 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow ornamental de fundo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Ícone de Destaque */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.1)]">
            <Clock3 size={38} className="text-yellow-400 animate-pulse" />
          </div>
        </div>

        {/* Títulos */}
        <div className="text-center mt-6 space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-yellow-500/80 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
            Aguardando Validação
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase font-mono">
            Cadastro em Análise
          </h1>
        </div>

        {/* Mensagem descritiva */}
        <p className="mt-4 text-center text-gray-400 text-xs leading-relaxed">
          Olá, <strong className="text-white capitalize">{user?.fullName || "Agente"}</strong>.<br />
          O seu registo foi submetido com sucesso e encontra-se sob auditoria rigorosa da equipa de conformidade da <span className="text-white font-semibold">EMATEA</span>.
        </p>

        {/* Caixa Informativa */}
        <div className="mt-6 rounded-2xl bg-[#111827]/80 border border-white/[0.04] p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
            <ShieldCheck size={16} className="text-cyan-400" />
            <span>Próximos passos operacionais:</span>
          </div>
          <ul className="text-[11px] text-gray-400 space-y-2 pl-6 list-disc marker:text-cyan-500">
            <li>Validação documental e conformidade regulatória em andamento.</li>
            <li>Conclusão do processo de ativação da infraestrutura de pagamentos.</li>
            <li><strong>Desbloqueio automático:</strong> esta página transitará para o painel assim que aprovado.</li>
          </ul>
        </div>

        {/* Ações */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={checkStatus}
            disabled={checking}
            className="flex-1 h-12 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-gray-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <RefreshCw size={15} className={checking ? "animate-spin text-cyan-400" : ""} />
            {checking ? "Verificando..." : "Verificar Estado"}
          </button>

          <button
            onClick={logout}
            className="h-12 px-6 rounded-xl bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-400 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <LogOut size={15} />
            Sair
          </button>
        </div>

        {/* Rodapé interno */}
        <div className="mt-6 text-center">
          <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
            ID de Sessão: #{user?.id || "---"} • Ambiente Seguro EMATEA
          </p>
        </div>

      </div>
    </div>
  )
}