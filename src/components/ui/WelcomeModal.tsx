// src/components/ui/WelcomeModal.tsx
import { useEffect, useState } from 'react'
import { X, MessageCircle, Users } from 'lucide-react'

const WHATSAPP_MANAGER =
  'https://wa.me/244928270636'

const WHATSAPP_GROUP =
  'https://chat.whatsapp.com/CaiU4nncaaa7vUnzO6HTzB?mode=gi_t'

export default function WelcomeModal() {
  const [open, setOpen] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  useEffect(() => {
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
            Junte-se à ACTECO, empresa sustentável com rendimentos diários
            e crescimento em equipa.
          </p>

          {/* BOTÃO PRINCIPAL */}
          {!showOptions && (
            <button
              onClick={() => setShowOptions(true)}
              className="
                block w-full h-12 rounded-xl
                bg-emerald-600 text-white font-semibold
                flex items-center justify-center gap-2
                hover:bg-emerald-700 transition
                active:scale-95
              "
            >
              <MessageCircle size={18} />
              WhatsApp ACTECO
            </button>
          )}

          {/* OPÇÕES */}
          {showOptions && (
            <div className="space-y-3">

              {/* GERENTE */}
              <a
                href={WHATSAPP_MANAGER}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  w-full h-12 rounded-xl
                  bg-green-500 text-white font-semibold
                  flex items-center justify-center gap-2
                  hover:bg-green-600 transition
                  active:scale-95
                "
              >
                <MessageCircle size={18} />
                Falar com Gerente
              </a>

              {/* GRUPO */}
              <a
                href={WHATSAPP_GROUP}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  w-full h-12 rounded-xl
                  bg-emerald-600 text-white font-semibold
                  flex items-center justify-center gap-2
                  hover:bg-emerald-700 transition
                  active:scale-95
                "
              >
                <Users size={18} />
                Entrar no Grupo Oficial
              </a>

              <button
                onClick={() => setShowOptions(false)}
                className="text-xs text-gray-400 mt-2"
              >
                Voltar
              </button>
            </div>
          )}

          <p className="mt-4 text-xs text-gray-400">
            Comunidade oficial ACTECO S.A
          </p>

        </div>
      </div>
    </div>
  )
}