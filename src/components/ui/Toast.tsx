type ToastProps = {
  message: string
  visible: boolean
  type?: "success" | "error"
  onClose?: () => void
}

export default function Toast({
  message,
  visible,
  type = "error",
  onClose,
}: ToastProps) {
  if (!visible) return null

  const styles =
    type === "success"
      ? {
          container: "bg-white",
          text: "text-emerald-600",
          iconBg: "bg-emerald-100",
          icon: "✓",
        }
      : {
          container: "bg-white",
          text: "text-red-600",
          iconBg: "bg-red-100",
          icon: "!",
        }

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/30 backdrop-blur-sm
      "
      onClick={onClose}
    >
      <div
        className={`
          ${styles.container}
          rounded-2xl px-8 py-6 shadow-2xl
          flex flex-col items-center gap-4
          min-w-[260px]
          animate-fadeZoom
        `}
      >
        <div
          className={`w-12 h-12 rounded-full ${styles.iconBg}
          flex items-center justify-center text-xl font-bold ${styles.text}`}
        >
          {styles.icon}
        </div>

        <p
          className={`text-base font-semibold text-center ${styles.text}`}
        >
          {message}
        </p>
      </div>
    </div>
  )
}
