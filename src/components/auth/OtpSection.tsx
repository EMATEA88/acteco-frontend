import { Mail } from "lucide-react"

type Props = {
  email: string
  code: string
  otpLoading: boolean
  secondsLeft: number // Substituído otpSent por secondsLeft
  onEmailChange: (value: string) => void
  onCodeChange: (value: string) => void
  onRequestOtp: () => void
}

export default function OtpSection({
  email,
  code,
  otpLoading,
  secondsLeft,
  onEmailChange,
  onCodeChange,
  onRequestOtp
}: Props) {
  return (
    <>
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest font-mono text-gray-400 font-bold ml-1">
          E-mail de Acesso
        </label>

        <div className="flex items-center rounded-xl bg-[#070d1a] border border-white/[0.05] focus-within:border-blue-500 pr-2 transition-all">

          <div className="pl-4 text-gray-600">
            <Mail size={14} />
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="exemplo@ematea.com"
            className="flex-1 p-3.5 pl-3 bg-transparent text-sm text-white placeholder:text-gray-600 focus:outline-none"
          />

          {/* Botão adaptado conforme Regra 6 */}
          <button
            type="button"
            onClick={onRequestOtp}
            disabled={otpLoading || secondsLeft > 0}
            className="h-8 px-4 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase rounded-lg disabled:opacity-40 transition-all shrink-0"
          >
            {otpLoading
              ? "Enviando..."
              : secondsLeft > 0
                ? `Reenviar (${secondsLeft}s)`
                : "Enviar Código"}
          </button>

        </div>
      </div>

      {/* Campo OTP sempre visível sem condicional conforme Regra 7 */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest font-mono text-emerald-400 font-bold ml-1">
          Código OTP
        </label>

        <input
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder="DIGITE O CÓDIGO RECEBIDO"
          className="w-full rounded-xl border-2 border-emerald-500/20 bg-[#070d1a] p-3.5 text-center font-mono text-sm font-bold tracking-[0.45em] text-emerald-400 focus:border-emerald-500 focus:outline-none"
        />
      </div>
    </>
  )
}