import { useNavigate } from "react-router-dom"
import {
  Bank,
  ClockCounterClockwise,
} from "@phosphor-icons/react"

const methodCardClass =
  "flex w-full items-center gap-4 rounded-2xl border border-[#24566A] bg-[#103647] p-5 text-left shadow-[0_10px_28px_rgba(0,0,0,0.14)] transition-colors hover:border-[#19C5CE]/60 hover:bg-[#124052] active:bg-[#153F50]"

const actionButtonClass =
  "flex min-h-14 w-full items-center justify-center rounded-xl border border-[#315365] bg-[#102F3D] px-5 text-[15px] font-semibold text-[#D8E8EE] transition-colors hover:bg-[#153B4B] active:bg-[#1A4658]"

export default function Withdraw() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-[#0A2533] px-4 py-6 text-white sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-[460px]">
        <header className="mb-7">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#19C5CE]">
            Levantamentos
          </p>

          <div className="mt-2 flex items-center justify-between gap-3">
            <h1 className="text-[25px] font-semibold tracking-tight text-white">
              Método de levantamento
            </h1>

            <button
              type="button"
              onClick={() => navigate("/withdraw-history")}
              aria-label="Consultar histórico de levantamentos"
              title="Histórico"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#24566A] bg-[#103647] text-[#65D5DE] transition-colors hover:border-[#19C5CE]/60 hover:bg-[#124052] hover:text-white"
            >
              <ClockCounterClockwise size={21} weight="regular" />
            </button>
          </div>
        </header>

        <section className="space-y-3">
          <button
            type="button"
            onClick={() => navigate("/withdraw/aoa")}
            className={methodCardClass}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#079CB3]/15 text-[#19C5CE]">
              <Bank size={25} weight="duotone" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold text-white">
                Conta bancária
              </span>
              <span className="mt-1 block text-[12px] text-[#A9C4CF]">
                Levantamento em Kwanza (AOA)
              </span>
            </span>

            <span className="rounded-full border border-[#1C9DAD]/30 bg-[#079CB3]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#5DDAE3]">
              AOA
            </span>
          </button>
        </section>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`${actionButtonClass} mt-5`}
        >
          Voltar
        </button>
      </div>
    </main>
  )
}
