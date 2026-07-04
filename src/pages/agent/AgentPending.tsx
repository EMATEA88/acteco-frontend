import { Clock3, LogOut } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

export default function AgentPending() {

  const { user, logout } = useAuth()

  return (

    <div className="min-h-screen bg-[#070d1a] flex items-center justify-center px-6">

      <div className="w-full max-w-lg rounded-3xl border border-yellow-500/20 bg-[#0b1220] p-8">

        <div className="flex justify-center">

          <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center">

            <Clock3
              size={42}
              className="text-yellow-400"
            />

          </div>

        </div>

        <h1 className="mt-6 text-3xl font-bold text-center text-white">

          Cadastro em Análise

        </h1>

        <p className="mt-4 text-center text-gray-400 leading-7">

          Olá <strong>{user?.fullName}</strong>.

          <br /><br />

          A sua conta de agente foi criada com sucesso.

          Neste momento encontra-se em processo de análise pela equipa da EMATEA.

        </p>

        <div className="mt-8 rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4">

          <p className="text-sm text-yellow-300">

            • Aguarde a validação da documentação.

            <br />

            • Efetue o depósito inicial quando solicitado.

            <br />

            • Assim que aprovado, todos os serviços serão desbloqueados automaticamente.

          </p>

        </div>

        <button

          onClick={logout}

          className="mt-8 w-full h-12 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold flex items-center justify-center gap-2"

        >

          <LogOut size={18} />

          Sair

        </button>

      </div>

    </div>

  )

}