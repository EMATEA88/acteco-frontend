import { XCircle, LogOut } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

export default function AgentRejected() {

  const { logout } = useAuth()

  return (

    <div className="min-h-screen bg-[#070d1a] flex items-center justify-center px-6">

      <div className="w-full max-w-lg rounded-3xl border border-red-500/20 bg-[#0b1220] p-8">

        <div className="flex justify-center">

          <XCircle
            size={72}
            className="text-red-500"
          />

        </div>

        <h1 className="mt-6 text-3xl font-bold text-center text-white">

          Cadastro Rejeitado

        </h1>

        <p className="mt-5 text-center text-gray-400 leading-7">

          A sua solicitação para tornar-se agente foi rejeitada.

          <br /><br />

          Entre em contacto com a equipa EMATEA para obter mais informações.

        </p>

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