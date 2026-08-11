import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  WifiHigh,
  DeviceMobile,
  WarningOctagon,
  ShieldPlus,
  CheckCircle
} from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Security() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  // simulação leve (mantém padrão do app)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe] font-sans selection:bg-cyan-500/30">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0a2533]/90 backdrop-blur-xl border-b border-cyan-500/10">
        <div className="max-w-xl mx-auto flex items-center justify-between px-6 py-5">
          
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-[#0e364a] border border-cyan-500/25 rounded-full text-cyan-300 hover:bg-[#124158] hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>

          <h1 className="text-xl font-black tracking-tighter uppercase font-mono text-white">Segurança</h1>

          <div className="text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 p-2 rounded-xl shadow-sm">
            <ShieldPlus size={20} weight="fill" />
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-8 pb-32 relative">

        {/* LUZ DE FUNDO */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/[0.06] rounded-full filter blur-[100px] pointer-events-none"></div>

        {loading ? (
          <div className="space-y-4 animate-pulse relative z-10">

            {/* STATUS */}
            <div className="bg-[#0e364a] border border-cyan-500/20 rounded-[2rem] p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-cyan-500/10 rounded" />
                <div className="h-2 w-32 bg-cyan-500/10 rounded" />
              </div>
            </div>

            {/* LISTA */}
            <div className="bg-[#0e364a] border border-cyan-500/20 rounded-[2.5rem] p-8 space-y-6">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 bg-cyan-500/10 rounded" />
                    <div className="h-2 w-40 bg-cyan-500/10 rounded" />
                  </div>
                </div>
              ))}
            </div>

            {/* ALERT */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-[2rem] p-6 h-20" />

          </div>
        ) : (
          <div className="space-y-6 relative z-10">

            {/* STATUS */}
            <div className="bg-[#0e364a] border border-cyan-500/20 rounded-[2rem] p-6 flex items-center gap-4 shadow-xl shadow-cyan-950/20">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <ShieldCheck size={22} weight="fill" className="text-cyan-400" />
              </div>

              <div>
                <p className="text-sm font-black uppercase font-mono tracking-wider text-white">Proteção ativa</p>
                <p className="text-xs text-cyan-200/70 font-mono mt-0.5">
                  Sistema seguro em funcionamento
                </p>
              </div>
            </div>

            {/* BOAS PRÁTICAS */}
            <div className="bg-[#0e364a] border border-cyan-500/20 rounded-[2.5rem] p-8 space-y-6 shadow-2xl shadow-cyan-950/20">

              <div className="flex items-center gap-2 border-b border-cyan-500/10 pb-4">
                <CheckCircle size={16} weight="fill" className="text-cyan-400" />
                <span className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] text-cyan-200/70">
                  Boas práticas
                </span>
              </div>

              <SecurityItem icon={<Lock size={18} weight="duotone" />} title="Sigilo" text="Nunca partilhe senha ou códigos." />
              <SecurityItem icon={<ShieldPlus size={18} weight="duotone" />} title="Senha forte" text="Use senha diferente para operações." />
              <SecurityItem icon={<DeviceMobile size={18} weight="duotone" />} title="Dispositivo" text="Use bloqueio e biometria." />
              <SecurityItem icon={<WifiHigh size={18} weight="duotone" />} title="Rede segura" text="Evite Wi-Fi público." />
              <SecurityItem icon={<WarningOctagon size={18} weight="duotone" />} title="Phishing" text="Nunca forneça dados fora da app." />

            </div>

            {/* ALERTA */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-[2rem] p-6 flex gap-4 shadow-xl shadow-red-950/20">
              <WarningOctagon size={22} weight="fill" className="text-red-400 shrink-0 mt-0.5" />

              <div>
                <p className="text-xs font-black uppercase font-mono tracking-wider text-red-400">
                  Atividade suspeita
                </p>
                <p className="text-xs text-red-200/70 font-mono mt-1 leading-relaxed">
                  Altere a senha imediatamente e contacte o suporte.
                </p>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  )
}

/* ITEM */

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
    <div className="flex items-center gap-4">

      <div className="w-12 h-12 rounded-2xl bg-[#0a2533] border border-cyan-500/25 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
        {icon}
      </div>

      <div>
        <p className="text-xs font-bold uppercase font-mono tracking-wider text-white">{title}</p>
        <p className="text-xs text-cyan-200/70 font-mono mt-0.5">{text}</p>
      </div>

    </div>
  )
}