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
    <div className="min-h-screen bg-[#0B0E11] text-white font-sans">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0B0E11]/80 backdrop-blur border-b border-white/5">
        <div className="max-w-xl mx-auto flex items-center justify-between px-5 py-4">
          
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/5 rounded-full"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-base font-bold">Segurança</h1>

          <ShieldPlus size={18} className="text-emerald-500" />
        </div>
      </header>

      <main className="max-w-xl mx-auto px-5 py-6 pb-28">

        {loading ? (
          <div className="space-y-4 animate-pulse">

            {/* STATUS */}
            <div className="bg-[#111318] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-white/5 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-white/5 rounded" />
                <div className="h-2 w-32 bg-white/5 rounded" />
              </div>
            </div>

            {/* LISTA */}
            <div className="bg-[#111318] rounded-2xl p-4 space-y-4">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 bg-white/5 rounded" />
                    <div className="h-2 w-40 bg-white/5 rounded" />
                  </div>
                </div>
              ))}
            </div>

            {/* ALERT */}
            <div className="bg-white/5 rounded-2xl p-4 h-14" />

          </div>
        ) : (
          <div className="space-y-6">

            {/* STATUS */}
            <div className="bg-[#111318] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <ShieldCheck size={20} className="text-emerald-500" />
              </div>

              <div>
                <p className="text-sm font-semibold">Proteção ativa</p>
                <p className="text-[11px] text-gray-500">
                  Sistema seguro em funcionamento
                </p>
              </div>
            </div>

            {/* BOAS PRÁTICAS */}
            <div className="bg-[#111318] border border-white/5 rounded-2xl p-4 space-y-4">

              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <CheckCircle size={14} className="text-emerald-500" />
                <span className="text-[10px] text-gray-500 uppercase">
                  Boas práticas
                </span>
              </div>

              <SecurityItem icon={<Lock size={16} />} title="Sigilo" text="Nunca partilhe senha ou códigos." />
              <SecurityItem icon={<ShieldPlus size={16} />} title="Senha forte" text="Use senha diferente para operações." />
              <SecurityItem icon={<DeviceMobile size={16} />} title="Dispositivo" text="Use bloqueio e biometria." />
              <SecurityItem icon={<WifiHigh size={16} />} title="Rede segura" text="Evite Wi-Fi público." />
              <SecurityItem icon={<WarningOctagon size={16} />} title="Phishing" text="Nunca forneça dados fora da app." />

            </div>

            {/* ALERTA */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 flex gap-3">
              <WarningOctagon size={18} className="text-red-500 mt-0.5" />

              <div>
                <p className="text-xs font-semibold text-red-500">
                  Atividade suspeita
                </p>
                <p className="text-[11px] text-gray-400">
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
    <div className="flex items-start gap-3">

      <div className="w-10 h-10 rounded-xl bg-[#0B0E11] border border-white/5 flex items-center justify-center text-emerald-500">
        {icon}
      </div>

      <div>
        <p className="text-xs font-semibold">{title}</p>
        <p className="text-[11px] text-gray-500">{text}</p>
      </div>

    </div>
  )
}