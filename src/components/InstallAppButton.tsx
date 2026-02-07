import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

let deferredPrompt: any = null

export default function InstallAppButton() {
  const [canInstall, setCanInstall] = useState(false)

  useEffect(() => {
    function handler(e: any) {
      e.preventDefault()
      deferredPrompt = e
      setCanInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handler
      )
    }
  }, [])

  async function install() {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    await deferredPrompt.userChoice

    deferredPrompt = null
    setCanInstall(false)
  }

  // Se não puder instalar (ou já está instalado), não mostra
  if (!canInstall) return null

  return (
    <button
      onClick={install}
      className="
        w-full
        bg-gradient-to-r from-emerald-600 to-emerald-500
        text-white
        rounded-2xl
        px-5 py-4
        font-semibold
        shadow-card
        flex items-center justify-center gap-2
        active:scale-95 transition
      "
    >
      <Download size={18} />
      Download APP
    </button>
  )
}
