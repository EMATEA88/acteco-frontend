import { ArrowLeft, ShieldCheck, Lock, Wifi, Smartphone, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Security() {

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF]">

      {/* HEADER FIXO */}
      <div className="sticky top-0 z-50 bg-[#1E2329] border-b border-[#2B3139] px-6 py-4 flex items-center gap-4">

        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-[#2B3139] hover:bg-[#3A424D] transition"
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="text-lg font-semibold tracking-wide">
          Segurança da Conta
        </h1>

      </div>

      <div className="px-6 py-8 space-y-8 max-w-xl mx-auto">

        <div className="bg-[#1E2329] border border-[#2B3139] rounded-3xl p-8 space-y-6">

          <div className="flex items-center gap-3 text-[#FCD535]">
            <ShieldCheck size={22} />
            <h2 className="font-semibold">
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

        <div className="bg-[#2B3139] border border-[#EF4444] rounded-2xl p-5 text-sm text-[#EF4444] leading-relaxed">
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
      <div className="w-9 h-9 rounded-full bg-[#0B0E11] border border-[#2B3139] text-[#FCD535] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <p className="text-sm text-[#848E9C] leading-relaxed">
        {text}
      </p>
    </div>
  )
}