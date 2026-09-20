import { useEffect, useState } from "react"
import {
  Clock3,
  LogOut,
  RefreshCw,
  ShieldCheck
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { api } from "../../services/api"

export default function AgentPending() {
  const {
  user,
  logout,
  setUser
} = useAuth()
  const navigate = useNavigate()

  const [checking, setChecking] = useState(false)

  /*
   * Verifica o estado REAL da conta diretamente no backend.
   *
   * O AuthContext pode conter dados antigos.
   * Por isso, consultamos /users/me diretamente.
   */
  const checkStatus = async () => {
  try {
    setChecking(true)

    const response = await api.get("/users/me")

    const data =
      response?.data?.data ??
      response?.data

    console.log(
      "STATUS REAL DO AGENTE:",
      {
        isAgentApproved:
          data?.isAgentApproved,
        agentStatus:
          data?.agent?.status
      }
    )

    // Sincroniza o utilizador real com o AuthContext
    setUser(data)

    const agentApproved =
      data?.isAgentApproved === true

    const agentStatus =
      data?.agent?.status === "APPROVED"

    if (
      agentApproved &&
      agentStatus
    ) {
      navigate(
        "/agent/dashboard",
        {
          replace: true
        }
      )

      return
    }

  } catch (error) {

    console.error(
      "ERRO AO VERIFICAR ESTADO DA CONTA:",
      error
    )

  } finally {

    setChecking(false)

  }
}

  /*
   * Verificação imediata ao abrir a página.
   */
  useEffect(() => {
    checkStatus()
  }, [])

  /*
   * Verificação automática a cada 5 segundos.
   *
   * Se o administrador aprovar o agente enquanto
   * ele estiver nesta página, o redirecionamento
   * acontece automaticamente.
   */
  useEffect(() => {

    const interval = setInterval(() => {
      checkStatus()
    }, 5000)

    return () => {
      clearInterval(interval)
    }

  }, [])

  return (
    <div className="min-h-screen bg-[#070d1a] flex items-center justify-center px-6 selection:bg-cyan-500 selection:text-black">

      <div className="w-full max-w-lg rounded-[2rem] border border-white/[0.08] bg-[#0b1220]/90 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">

        {/* Glow ornamental */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Ícone */}
        <div className="flex justify-center">

          <div className="w-20 h-20 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.1)]">

            <Clock3
              size={38}
              className="text-yellow-400 animate-pulse"
            />

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

        {/* Mensagem */}
        <p className="mt-4 text-center text-gray-400 text-xs leading-relaxed">

          Olá,{" "}

          <strong className="text-white capitalize">
            {user?.fullName || "Agente"}
          </strong>.

          <br />

          O seu registo foi submetido com sucesso e encontra-se sob análise da equipa da{" "}

          <span className="text-white font-semibold">
            EMATEA
          </span>.

        </p>

        {/* Informação */}
        <div className="mt-6 rounded-2xl bg-[#111827]/80 border border-white/[0.04] p-5 space-y-3">

          <div className="flex items-center gap-2 text-xs font-bold text-gray-300">

            <ShieldCheck
              size={16}
              className="text-cyan-400"
            />

            <span>
              Próximos passos:
            </span>

          </div>

          <ul className="text-[11px] text-gray-400 space-y-2 pl-6 list-disc marker:text-cyan-500">

            <li>
              Validação dos dados enviados.
            </li>

            <li>
              Análise e aprovação da conta.
            </li>

            <li>
              Após aprovação, o acesso ao painel será liberado automaticamente.
            </li>

          </ul>

        </div>

        {/* Ações */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">

          <button
            onClick={checkStatus}
            disabled={checking}
            className="flex-1 h-12 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-gray-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
          >

            <RefreshCw
              size={15}
              className={
                checking
                  ? "animate-spin text-cyan-400"
                  : ""
              }
            />

            {checking
              ? "Verificando..."
              : "Verificar Estado"}

          </button>

          <button
            onClick={logout}
            className="h-12 px-6 rounded-xl bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-400 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >

            <LogOut size={15} />

            Sair

          </button>

        </div>

        {/* Rodapé */}
        <div className="mt-6 text-center">

          <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
            ID de Sessão: #{user?.id || "---"}
          </p>

        </div>

      </div>

    </div>
  )
}