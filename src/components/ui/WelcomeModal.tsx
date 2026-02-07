// src/components/ui/WelcomeModal.tsx
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const WHATSAPP_LINK =
  'https://chat.whatsapp.com/FvRSde9OrURE2LZ72BcXnT?mode=gi_t'

export default function WelcomeModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // SEM sessionStorage → aparece SEMPRE ao entrar na Home
    setOpen(true)
  }, [])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-black/60 backdrop-blur-sm"
    >
      <div className="w-[90%] max-w-sm animate-fadeZoom">
        <div className="relative bg-white rounded-3xl px-6 pt-10 pb-6 shadow-card text-center">
          {/* CLOSE */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          >
            <X size={20} />
          </button>

          {/* LOGO */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-white shadow-soft border
                            flex items-center justify-center overflow-hidden">
              <img
                src="/logo.png"
                alt="ACTECO S.A"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* TITLE */}
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Bem-vindo à ACTECO
          </h2>

          {/* TEXT */}
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Olá, junte-se à Acteco, uma empresa de reciclagem sustentável com rendimentos
            diários e crescimento em equipa.
          </p>

          {/* CTA */}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="
              block w-full h-12 rounded-xl
              bg-emerald-600 text-white font-semibold
              flex items-center justify-center
              hover:bg-emerald-700 transition
              active:scale-95
            "
          >
            Entrar no Grupo WhatsApp
          </a>

          <p className="mt-4 text-xs text-gray-400">
            Comunidade oficial ACTECO
          </p>
        </div>
      </div>
    </div>
  )
}
