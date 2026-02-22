import { ArrowLeft, ShieldCheck, Lock, Wifi, Smartphone, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Security() {

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1220] to-[#0F172A] text-white">

      {/* HEADER FIXO */}
      <div className="sticky top-0 z-50 bg-[#0F172A] border-b border-white/10 px-6 py-4 flex items-center gap-4">

        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="text-lg font-semibold tracking-wide">
          Segurança da Conta
        </h1>

      </div>

      <div className="px-6 py-8 space-y-8 max-w-xl mx-auto">

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">

          <div className="flex items-center gap-3 text-emerald-400">
            <ShieldCheck size={22} />
            <h2 className="font-semibold text-white">
              Boas práticas de segurança
            </h2>
          </div>

          <SecurityItem icon={<Lock size={18} />} text="Nunca partilhe sua senha de login com terceiros." />
          <SecurityItem icon={<ShieldCheck size={18} />} text="Utilize senha exclusiva para levantamentos." />
          <SecurityItem icon={<Smartphone size={18} />} text="Ative bloqueio de tela no seu dispositivo." />
          <SecurityItem icon={<Wifi size={18} />} text="Evite redes Wi-Fi públicas ou desconhecidas." />
          <SecurityItem icon={<ShieldCheck size={18} />} text="Confirme sempre que está no aplicativo oficial." />
          <SecurityItem icon={<AlertTriangle size={18} />} text="Nunca forneça senha ou códigos por mensagens." />

        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 text-sm text-red-300 leading-relaxed">
          Em caso de atividade suspeita, altere sua senha imediatamente
          e contacte o suporte oficial.
        </div>

      </div>
    </div>
  )
}

function SecurityItem({
  icon,
  text,
}: {
  icon: React.ReactNode
  text: string
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <p className="text-sm text-gray-300 leading-relaxed">
        {text}
      </p>
    </div>
  )
}