
import { useCallback, useEffect, useRef, useState } from "react"
import {
  Clock3,
  LogOut,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "../../contexts/AuthContext"
import { api } from "../../services/api"

export default function AgentPending() {
  const { user, logout, setUser } = useAuth()
  const navigate = useNavigate()

  const [checking, setChecking] = useState(false)
  const [checkError, setCheckError] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  // Impede consultas simultâneas.
  const requestInFlight = useRef(false)

  // Impede atualizações de estado após desmontagem.
  const mounted = useRef(false)

  /*
   * VERIFICAÇÃO REAL DO ESTADO DA CONTA
   *
   * A consulta automática não ativa o loading
   * do botão manual.
   */
  const checkStatus = useCallback(async (manual = false) => {
    if (requestInFlight.current) return

    try {
      requestInFlight.current = true

      if (manual && mounted.current) {
        setChecking(true)
        setCheckError(false)
      }

      const response = await api.get("/users/me")

      const data =
        response?.data?.data ??
        response?.data

      if (!mounted.current) return

      // Sincroniza os dados reais com o AuthContext.
      setUser(data)

      setLastChecked(new Date())

      const agentApproved =
        data?.isAgentApproved === true

      const agentStatus =
        data?.agent?.status === "APPROVED"

      if (agentApproved && agentStatus) {
        navigate("/agent/dashboard", {
          replace: true,
        })
      }

    } catch (error) {
      if (mounted.current && manual) {
        setCheckError(true)
      }

      console.error(
        "Erro ao verificar estado da conta:",
        error
      )

    } finally {
      requestInFlight.current = false

      if (mounted.current && manual) {
        setChecking(false)
      }
    }
  }, [navigate, setUser])

  /*
   * VERIFICAÇÃO INICIAL E AUTOMÁTICA
   *
   * Consulta imediatamente e repete a cada 10 segundos.
   */
  useEffect(() => {
    mounted.current = true

    void checkStatus()

    const interval = window.setInterval(() => {
      void checkStatus()
    }, 10000)

    return () => {
      mounted.current = false
      window.clearInterval(interval)
    }
  }, [checkStatus])

  /*
   * IDENTIFICAÇÃO DO UTILIZADOR
   */
  const fullName = user?.fullName || "Agente"

  const sessionId = user?.id
    ? String(user.id).padStart(3, "0")
    : "---"

  return (
    <main className="min-h-screen bg-[#070d1a] text-white flex items-center justify-center px-4 py-8 sm:px-6">

      <div className="w-full max-w-[430px]">

        {/* BRANDING */}

        <header className="text-center mb-6">

          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-3">

            <ShieldCheck
              size={23}
              className="text-cyan-400"
            />

          </div>

          <p className="text-[11px] font-bold tracking-[0.25em] text-cyan-300/60 uppercase">
            EMATEA
          </p>

        </header>

        {/* CARD PRINCIPAL */}

        <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b1220] shadow-xl shadow-black/20">

          {/* Linha superior */}

          <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-yellow-500/70 to-transparent" />

          <div className="p-5 sm:p-7">

            {/* ESTADO */}

            <div className="flex items-center gap-4 mb-6">

              <div className="w-14 h-14 shrink-0 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">

                <Clock3
                  size={27}
                  className="text-yellow-400"
                />

              </div>

              <div className="min-w-0">

                <div className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 mb-1.5">

                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />

                  <span className="text-[9px] font-bold tracking-wider uppercase text-yellow-400">
                    Aguardando validação
                  </span>

                </div>

                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Cadastro em análise
                </h1>

              </div>

            </div>

            {/* MENSAGEM */}

            <div className="mb-6">

              <p className="text-sm text-gray-300 leading-relaxed">
                Olá,{" "}
                <strong className="text-white">
                  {fullName}
                </strong>.
              </p>

              <p className="mt-2 text-xs sm:text-[13px] text-gray-400 leading-relaxed">
                O seu registo foi submetido com sucesso e encontra-se em análise pela equipa da EMATEA.
              </p>

            </div>

            {/* INFORMAÇÃO */}

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">

              <div className="flex items-center gap-2.5 mb-4">

                <ShieldCheck
                  size={17}
                  className="text-cyan-400"
                />

                <h2 className="text-xs font-bold text-gray-200">
                  Próximas etapas
                </h2>

              </div>

              <div className="space-y-4">

                <div className="flex items-start gap-3">

                  <span className="flex items-center justify-center w-5 h-5 shrink-0 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold">
                    1
                  </span>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    Validação dos dados e documentos enviados.
                  </p>

                </div>

                <div className="flex items-start gap-3">

                  <span className="flex items-center justify-center w-5 h-5 shrink-0 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold">
                    2
                  </span>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    Análise e aprovação da conta pela equipa EMATEA.
                  </p>

                </div>

                <div className="flex items-start gap-3">

                  <span className="flex items-center justify-center w-5 h-5 shrink-0 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold">
                    3
                  </span>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    Após aprovação, o acesso ao painel será disponibilizado automaticamente.
                  </p>

                </div>

              </div>

            </div>

            {/* VERIFICAÇÃO AUTOMÁTICA */}

            <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-cyan-500/10 bg-cyan-500/[0.04] px-3.5 py-3">

              <div className="flex items-center gap-2.5 min-w-0">

                <RefreshCw
                  size={15}
                  className="text-cyan-400 animate-spin shrink-0"
                />

                <div className="min-w-0">

                  <p className="text-[11px] font-semibold text-gray-300">
                    Verificação automática ativa
                  </p>

                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Atualização a cada 10 segundos
                  </p>

                </div>

              </div>

              {lastChecked && (
                <CheckCircle2
                  size={16}
                  className="text-cyan-400 shrink-0"
                />
              )}

            </div>

            {/* ERRO DE CONSULTA MANUAL */}

            {checkError && (
              <div
                role="alert"
                className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5"
              >

                <AlertCircle
                  size={15}
                  className="text-red-400 shrink-0"
                />

                <p className="text-[11px] text-red-300">
                  Não foi possível verificar o estado. Tente novamente.
                </p>

              </div>
            )}

            {/* AÇÕES */}

            <div className="grid grid-cols-2 gap-3 mt-5">

              <button
                type="button"
                onClick={() => void checkStatus(true)}
                disabled={checking}
                className="h-11 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 text-[11px] font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >

                <RefreshCw
                  size={15}
                  className={checking ? "animate-spin" : ""}
                />

                {checking
                  ? "A verificar..."
                  : "Verificar agora"}

              </button>

              <button
                type="button"
                onClick={logout}
                className="h-11 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-[11px] font-bold flex items-center justify-center gap-2 transition-colors"
              >

                <LogOut size={15} />

                Terminar sessão

              </button>

            </div>

          </div>

          {/* RODAPÉ */}

          <footer className="border-t border-white/[0.06] px-5 py-3.5 flex items-center justify-between gap-3">

            <span className="text-[9px] text-gray-600 font-medium uppercase tracking-wider">
              EMATEA • Área de agentes
            </span>

            <span className="text-[9px] font-mono text-gray-500">
              SESSÃO #{sessionId}
            </span>

          </footer>

        </section>

        {/* RODAPÉ EXTERIOR */}

        <p className="text-center mt-5 text-[10px] text-gray-600">
          A sua conta será atualizada automaticamente após a aprovação.
        </p>

      </div>

    </main>
  )
}
