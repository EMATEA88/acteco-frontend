import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Security() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-1 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-lg font-semibold">
          Segurança da Conta
        </h1>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-2xl p-5 shadow-card space-y-4 text-sm animate-fadeZoom">
        <div className="flex items-center gap-2 text-emerald-600">
          <ShieldCheck />
          <h2 className="font-medium text-gray-900">
            Boas práticas de segurança
          </h2>
        </div>

        <ul className="space-y-3 text-gray-700 leading-relaxed">
          <li>
            • Nunca partilhe sua <strong>senha de login</strong> com
            terceiros, mesmo que aleguem representar a ACTECO.
          </li>

          <li>
            • Utilize uma <strong>senha exclusiva para levantamentos</strong>,
            diferente da senha de acesso à plataforma.
          </li>

          <li>
            • Ative o <strong>bloqueio de tela</strong> do seu dispositivo
            (PIN, impressão digital ou reconhecimento facial).
          </li>

          <li>
            • Evite acessar sua conta em <strong>dispositivos públicos</strong>
            ou redes Wi-Fi desconhecidas.
          </li>

          <li>
            • Verifique sempre se está no <strong>site ou aplicativo oficial</strong>
            da ACTECO antes de inserir seus dados.
          </li>

          <li>
            • A <strong>ACTECO nunca solicita</strong> sua senha, códigos de
            verificação ou dados bancários por mensagens ou chamadas.
          </li>
        </ul>

        <div className="pt-2 text-xs text-gray-500">
          Em caso de atividade suspeita, altere sua senha imediatamente
          e contacte o suporte oficial.
        </div>
      </div>
    </div>
  )
}
