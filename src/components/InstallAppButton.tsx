import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

let deferredPrompt: any = null

export default function InstallAppButton() {
  const [canInstall, setCanInstall] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-ignore
      window.navigator.standalone === true

    setIsStandalone(standalone)

    function onBeforeInstallPrompt(e: any) {
      e.preventDefault()
      deferredPrompt = e
      setCanInstall(true)
    }

    window.addEventListener(
      'beforeinstallprompt',
      onBeforeInstallPrompt
    )

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        onBeforeInstallPrompt
      )
    }
  }, [])

  if (isStandalone) return null

  return (
    <button
      onClick={async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt()
          await deferredPrompt.userChoice
          deferredPrompt = null
          setCanInstall(false)
        } else {
          alert(
            'Para instalar:\n\nChrome ▸ Menu ⋮ ▸ "Adicionar à tela inicial"'
          )
        }
      }}
      className="
        w-full flex items-center justify-center gap-2
        bg-emerald-600 hover:bg-emerald-700
        text-white font-medium
        rounded-2xl h-12
        shadow-card active:scale-95 transition
      "
    >
      <Download size={19} />
      {canInstall ? 'Instalar App' : 'Download APP'}
    </button>
  )
}
