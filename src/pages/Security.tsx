import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  WifiHigh,      // Alterado de Wifi para WifiHigh
  DeviceMobile,  // Alterado de Smartphone para DeviceMobile
  WarningOctagon, 
  ShieldPlus, 
  CheckCircle 
} from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'

export default function Security() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-green-500/30">
      
      {/* DECORAÇÃO DE FUNDO */}
      <div className="fixed top-0 right-0 w-80 h-80 bg-green-600/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      {/* HEADER PREMIUM */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-xl mx-auto flex items-center justify-between px-6 py-5">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
          <h1 className="text-xl font-black tracking-tighter uppercase">Segurança</h1>
          <ShieldPlus size={24} weight="fill" className="text-green-500" />
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-10 pb-32 space-y-8 relative z-10">
        
        {/* STATUS CENTRAL */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 rounded-[2rem] bg-green-500/10 flex items-center justify-center border border-green-500/20 mb-4 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
            <ShieldCheck size={40} weight="duotone" className="text-green-500" />
          </div>
          <h2 className="text-2xl font-black tracking-tight italic">Proteção Ativa</h2>
          <p className="text-gray-500 text-sm font-medium text-center uppercase tracking-widest text-[10px]">
            Protocolos de segurança EMATEA em vigor.
          </p>
        </div>

        {/* LISTA DE DIRETRIZES */}
        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-10 shadow-2xl">
          <div className="flex items-center gap-3 pb-6 border-b border-white/5">
            <CheckCircle size={24} weight="fill" className="text-green-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Manual de Boas Práticas</span>
          </div>

          <div className="space-y-10">
            <SecurityItem 
              icon={<Lock size={28} weight="duotone" />} 
              title="Sigilo Absoluto"
              text="Nunca partilhe a sua palavra-passe de acesso ou códigos OTP com terceiros, inclusive supostos funcionários." 
            />
            <SecurityItem 
              icon={<ShieldPlus size={28} weight="duotone" />} 
              title="Operações Blindadas"
              text="Utilize uma senha exclusiva e complexa para levantamentos, diferente da senha de entrada na conta." 
            />
            <SecurityItem 
              icon={<DeviceMobile size={28} weight="duotone" />} // Nome corrigido
              title="Acesso Biométrico"
              text="Mantenha o bloqueio de ecrã e a autenticação biométrica (FaceID/Digital) ativos no seu dispositivo." 
            />
            <SecurityItem 
              icon={<WifiHigh size={28} weight="duotone" />} // Nome corrigido
              title="Redes Confiáveis"
              text="Evite aceder à sua conta financeira através de redes Wi-Fi públicas, abertas ou VPNs desconhecidas." 
            />
            <SecurityItem 
              icon={<WarningOctagon size={28} weight="duotone" />} 
              title="Alerta de Phishing"
              text="A EMATEA nunca solicita dados sensíveis ou códigos de confirmação via SMS, chamadas ou redes sociais." 
            />
          </div>
        </div>

        {/* ALERTA DE EMERGÊNCIA */}
        <div className="bg-red-500/5 border border-red-500/10 rounded-[2rem] p-6 flex items-start gap-5">
          <WarningOctagon size={32} weight="fill" className="text-red-500 flex-shrink-0" />
          <div className="space-y-1">
            <h4 className="text-red-500 font-bold text-sm uppercase tracking-wider italic">Atividade Suspeita?</h4>
            <p className="text-gray-400 text-xs leading-relaxed font-medium">
              Se detectar qualquer movimento estranho, altere as suas credenciais imediatamente e bloqueie a conta contactando o suporte.
            </p>
          </div>
        </div>

      </main>

      <footer className="fixed bottom-10 left-0 w-full text-center opacity-20 pointer-events-none">
        <p className="text-[9px] font-bold uppercase tracking-[0.5em]">End-to-End Encryption Protocol v4.0</p>
      </footer>
    </div>
  )
}

function SecurityItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="flex items-start gap-5 group">
      <div className="w-14 h-14 rounded-2xl bg-[#0a0a0a] border border-white/5 text-green-500 flex items-center justify-center shrink-0 group-hover:border-green-500/30 transition-all shadow-lg">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-gray-400 leading-relaxed font-medium">
          {text}
        </p>
      </div>
    </div>
  )
}