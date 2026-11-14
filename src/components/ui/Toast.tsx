import { AlertCircle, CheckCircle2, X } from "lucide-react"

type ToastProps = {
  visible: boolean
  message: string
  type: "success" | "error"
  onClose?: () => void
}

export default function Toast({
  visible,
  message,
  type,
  onClose,
}: ToastProps) {
  if (!visible || !message) return null

  const isSuccess = type === "success"
  const title = isSuccess ? "Operação concluída" : "Não foi possível concluir"
  const Icon = isSuccess ? CheckCircle2 : AlertCircle

  return (
    <>
      <style>
        {`
          @keyframes ematea-toast-enter {
            from {
              opacity: 0;
              transform: translate3d(18px, -8px, 0) scale(.98);
            }
            to {
              opacity: 1;
              transform: translate3d(0, 0, 0) scale(1);
            }
          }

          @keyframes ematea-toast-progress {
            from { transform: scaleX(1); }
            to { transform: scaleX(0); }
          }

          .ematea-toast-enter {
            animation: ematea-toast-enter .24s cubic-bezier(.2,.8,.2,1) both;
          }

          .ematea-toast-progress {
            transform-origin: left;
            animation: ematea-toast-progress 3.5s linear forwards;
          }

          @media (prefers-reduced-motion: reduce) {
            .ematea-toast-enter,
            .ematea-toast-progress {
              animation: none;
            }
          }
        `}
      </style>

      <div
        className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-4 sm:inset-x-auto sm:right-6 sm:top-6 sm:w-[min(420px,calc(100vw-2rem))] sm:justify-end"
        aria-live={isSuccess ? "polite" : "assertive"}
      >
        <div
          role={isSuccess ? "status" : "alert"}
          className="ematea-toast-enter pointer-events-auto relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#102F40]/[.97] text-white shadow-[0_18px_60px_rgba(0,0,0,.38)] ring-1 ring-black/10 backdrop-blur-xl"
        >
          <div className="flex items-start gap-3.5 p-4 pr-12">
            <div
              className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                isSuccess
                  ? "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-300/20"
                  : "bg-rose-400/10 text-rose-300 ring-1 ring-rose-300/20"
              }`}
            >
              <Icon size={21} strokeWidth={2.1} />
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-sm font-semibold tracking-[0.01em] text-white">
                {title}
              </p>
              <p className="mt-1 break-words text-[13px] leading-5 text-[#B7CFD9]">
                {message}
              </p>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar notificação"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-[#8FAFBC] transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#19C5CE]"
            >
              <X size={17} />
            </button>
          )}

          <div className="h-[3px] w-full bg-white/[.06]">
            <div
              className={`ematea-toast-progress h-full w-full ${
                isSuccess ? "bg-[#19C5CE]" : "bg-rose-400"
              }`}
            />
          </div>
        </div>
      </div>
    </>
  )
}
