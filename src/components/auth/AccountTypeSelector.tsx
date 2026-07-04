import { User, Briefcase } from "lucide-react"

type Props = {
  value: "CLIENT" | "AGENT"
  onChange: (role: "CLIENT" | "AGENT") => void
}

export default function AccountTypeSelector({
  value,
  onChange
}: Props) {
  return (
    <div className="space-y-3">

      <label className="text-[10px] uppercase tracking-widest font-mono text-gray-400 font-bold">
        Tipo de Conta
      </label>

      <div className="grid grid-cols-2 gap-3">

        <button
          type="button"
          onClick={() => onChange("CLIENT")}
          className={`rounded-2xl border p-4 transition-all ${
            value === "CLIENT"
              ? "border-blue-500 bg-blue-500/10"
              : "border-white/5 bg-[#070d1a]"
          }`}
        >
          <User
            className="mx-auto mb-3 text-blue-400"
            size={26}
          />

          <h3 className="font-semibold text-sm">
            Cliente
          </h3>

          <p className="text-[11px] mt-2 text-gray-400">
            Fazer recargas e pagamentos.
          </p>

        </button>

        <button
          type="button"
          onClick={() => onChange("AGENT")}
          className={`rounded-2xl border p-4 transition-all ${
            value === "AGENT"
              ? "border-blue-500 bg-blue-500/10"
              : "border-white/5 bg-[#070d1a]"
          }`}
        >
          <Briefcase
            className="mx-auto mb-3 text-blue-400"
            size={26}
          />

          <h3 className="font-semibold text-sm">
            Agente
          </h3>

          <p className="text-[11px] mt-2 text-gray-400">
            Venda serviços e receba comissão.
          </p>

        </button>

      </div>

      {value === "AGENT" && (

        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-xs leading-6 text-yellow-300">

          <p className="font-semibold mb-2">
            Após o cadastro será necessário:
          </p>

          <ul className="space-y-1 list-disc pl-4">

            <li>Enviar documentação.</li>

            <li>Efetuar depósito inicial de 25.000 Kz.</li>

            <li>Aguardar aprovação da EMATEA.</li>

          </ul>

        </div>

      )}

    </div>
  )
}