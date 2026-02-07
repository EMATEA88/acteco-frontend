type ToastProps = {
  message: string
  visible: boolean
  type?: 'success' | 'error'
}

export default function Toast({
  message,
  visible,
  type = 'error',
}: ToastProps) {
  if (!visible) return null

  const styles =
    type === 'success'
      ? {
          container: 'bg-emerald-600',
          text: 'text-white',
          iconBg: 'bg-emerald-100',
          icon: '✓',
        }
      : {
          container: 'bg-red-600',
          text: 'text-white',
          iconBg: 'bg-red-100',
          icon: '!',
        }

  return (
    <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
      <div
        className={`
          ${styles.container}
          rounded-2xl px-8 py-6 shadow-xl
          flex flex-col items-center gap-3
          min-w-[220px]
        `}
      >
        <div
          className={`w-10 h-10 rounded-full ${styles.iconBg}
          flex items-center justify-center text-lg font-bold`}
        >
          {styles.icon}
        </div>

        <p
          className={`text-sm font-medium text-center ${styles.text}`}
        >
          {message}
        </p>
      </div>
    </div>
  )
}
