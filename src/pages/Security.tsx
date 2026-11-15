import { useNavigate } from 'react-router-dom'
import {
  Lock,
  ShieldCheck,
  DeviceMobile,
  WifiHigh,
  WarningOctagon,
} from '@phosphor-icons/react'
import type { ReactNode } from 'react'

export default function Security() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0a2533] px-4 py-8 text-[#e0f2fe] font-sans sm:px-6">
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl flex-col justify-center">
        <section className="overflow-hidden rounded-2xl border border-[#24566A] bg-[#103647] shadow-xl shadow-black/10">
          <div className="border-b border-[#24566A] px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A2533] text-[#19C5CE]">
                <ShieldCheck size={21} weight="regular" />
              </div>

              <div>
                <h1 className="text-sm font-semibold text-white">
                  Segurança da conta
                </h1>
                <p className="mt-0.5 text-xs text-[#A9C4CF]">
                  Recomendações para proteger os seus dados
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-[#24566A] px-5 sm:px-6">
            <SecurityItem
              icon={<Lock size={19} weight="regular" />}
              title="Proteja as suas palavras-passe"
              text="Utilize palavras-passe fortes e diferentes para acesso e operações."
            />

            <SecurityItem
              icon={<WarningOctagon size={19} weight="regular" />}
              title="Mantenha os seus códigos privados"
              text="Nunca partilhe palavras-passe ou códigos de verificação."
            />

            <SecurityItem
              icon={<DeviceMobile size={19} weight="regular" />}
              title="Proteja o seu dispositivo"
              text="Ative o bloqueio de ecrã e mantenha o sistema atualizado."
            />

            <SecurityItem
              icon={<WifiHigh size={19} weight="regular" />}
              title="Utilize redes de confiança"
              text="Evite aceder à sua conta através de redes Wi-Fi públicas."
            />

            <SecurityItem
              icon={<ShieldCheck size={19} weight="regular" />}
              title="Confirme a origem das mensagens"
              text="Não aceda a links suspeitos nem forneça dados fora dos canais oficiais."
            />
          </div>
        </section>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 h-12 w-full rounded-xl border border-[#2A6073] bg-[#103647] px-6 text-sm font-semibold text-[#D8EAF0] transition-colors hover:bg-[#16465A] focus:outline-none focus:ring-2 focus:ring-[#19C5CE]/50"
        >
          Voltar
        </button>
      </main>
    </div>
  )
}

function SecurityItem({
  icon,
  title,
  text,
}: {
  icon: ReactNode
  title: string
  text: string
}) {
  return (
    <div className="flex items-center gap-3 py-4 sm:gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A2533] text-[#19C5CE]">
        {icon}
      </div>

      <div className="min-w-0">
        <h2 className="text-sm font-medium text-white">{title}</h2>
        <p className="mt-1 text-xs leading-5 text-[#A9C4CF]">{text}</p>
      </div>
    </div>
  )
}
