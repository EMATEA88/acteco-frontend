import { Eye, EyeOff, Lock, Phone, User } from "lucide-react"

type Props = {
  fullName: string
  phone: string
  password: string
  confirmPassword: string

  showPassword: boolean
  showConfirmPassword: boolean

  registerLoading: boolean

  role: "CLIENT" | "AGENT"

  onFullNameChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void

  onTogglePassword: () => void
  onToggleConfirmPassword: () => void
}

export default function RegisterForm({
  fullName,
  phone,
  password,
  confirmPassword,

  showPassword,
  showConfirmPassword,

  registerLoading,

  role,

  onFullNameChange,
  onPhoneChange,
  onPasswordChange,
  onConfirmPasswordChange,

  onTogglePassword,
  onToggleConfirmPassword

}: Props) {

  return (
    <>
      {/* NOME COMPLETO */}

      <div className="space-y-1.5">

        <label className="text-[10px] uppercase tracking-widest font-mono text-gray-400 font-bold ml-1">
          Nome Completo
        </label>

        <div className="flex items-center rounded-xl bg-[#070d1a] border border-white/[0.05] focus-within:border-blue-500">

          <div className="pl-4 text-gray-600">
            <User size={14} />
          </div>

          <input
            type="text"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            placeholder="Nome completo"
            className="flex-1 bg-transparent p-3.5 pl-3 text-sm text-white placeholder:text-gray-600 focus:outline-none"
          />

        </div>

      </div>

      {/* TELEFONE */}

      <div className="space-y-1.5">

        <label className="text-[10px] uppercase tracking-widest font-mono text-gray-400 font-bold ml-1">
          Telefone
        </label>

        <div className="flex rounded-xl bg-[#070d1a] border border-white/[0.05] focus-within:border-blue-500">

          <div className="flex items-center px-4 border-r border-white/[0.05] text-xs font-mono text-gray-500">
            +244
          </div>

          <div className="absolute mt-[17px] ml-[78px] text-gray-600">
            <Phone size={14} />
          </div>

          <input
            type="tel"
            value={phone}
            onChange={(e) =>
              onPhoneChange(
                e.target.value.replace(/\D/g, "")
              )
            }
            placeholder="923000000"
            className="flex-1 bg-transparent p-3.5 pl-10 text-sm text-white placeholder:text-gray-600 focus:outline-none"
          />

        </div>

      </div>

      {/* SENHA */}

      <div className="space-y-1.5">

        <label className="text-[10px] uppercase tracking-widest font-mono text-gray-400 font-bold ml-1">
          Senha
        </label>

        <div className="flex items-center rounded-xl bg-[#070d1a] border border-white/[0.05] focus-within:border-blue-500">

          <div className="pl-4 text-gray-600">
            <Lock size={14} />
          </div>

          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) =>
              onPasswordChange(e.target.value)
            }
            placeholder="Mínimo 6 caracteres"
            className="flex-1 bg-transparent p-3.5 pl-3 text-sm text-white placeholder:text-gray-600 focus:outline-none"
          />

          <button
            type="button"
            onClick={onTogglePassword}
            className="pr-4 text-gray-500 hover:text-white"
          >
            {showPassword
              ? <EyeOff size={16} />
              : <Eye size={16} />}
          </button>

        </div>

      </div>

      {/* CONFIRMAR SENHA */}

      <div className="space-y-1.5">

        <label className="text-[10px] uppercase tracking-widest font-mono text-gray-400 font-bold ml-1">
          Confirmar Senha
        </label>

        <div className="flex items-center rounded-xl bg-[#070d1a] border border-white/[0.05] focus-within:border-blue-500">

          <div className="pl-4 text-gray-600">
            <Lock size={14} />
          </div>

          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            value={confirmPassword}
            onChange={(e) =>
              onConfirmPasswordChange(
                e.target.value
              )
            }
            placeholder="Repita a senha"
            className="flex-1 bg-transparent p-3.5 pl-3 text-sm text-white placeholder:text-gray-600 focus:outline-none"
          />

          <button
            type="button"
            onClick={onToggleConfirmPassword}
            className="pr-4 text-gray-500 hover:text-white"
          >
            {showConfirmPassword
              ? <EyeOff size={16} />
              : <Eye size={16} />}
          </button>

        </div>

      </div>

      {/* BOTÃO */}

      <button
        type="submit"
        disabled={registerLoading}
        className="w-full rounded-xl bg-blue-600 p-3.5 font-bold text-white transition hover:bg-blue-500 disabled:opacity-50"
      >
        {registerLoading
          ? "Criando conta..."
          : role === "AGENT"
          ? "Criar Conta de Agente"
          : "Criar Conta de Cliente"}
      </button>
    </>
  )
}