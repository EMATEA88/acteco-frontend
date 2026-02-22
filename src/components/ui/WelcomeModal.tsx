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
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/70 backdrop-blur-md
      "
    >
      <div
        className="
          w-[90%] max-w-sm
          bg-[#0F172A]
          border border-white/10
          rounded-3xl
          p-6
          animate-fadeZoom
          text-center
        "
      >

        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="flex justify-center mb-4">
          <div className="
            w-20 h-20 rounded-full
            border border-white/10
            overflow-hidden
          ">
            <img
              src="/logo.png"
              alt="ACTECO"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-white mb-2">
          BEM-VINDO(A) À EMATEA
        </h2>

        <p className="text-sm text-gray-400 mb-6">
          A nossa missão é oferecer soluções tecnológicas, financeiras e comerciais inovadoras.
        </p>

        {!showOptions && (
          <button
            onClick={() => setShowOptions(true)}
            className="
              w-full h-12 rounded-xl
              bg-emerald-600
              text-white font-semibold
              flex items-center justify-center gap-2
              transition
              hover:bg-emerald-700
              hover:scale-105
            "
          >
            <MessageCircle size={18} />
            WhatsApp Oficial
          </button>
        )}

        {showOptions && (
          <div className="space-y-3">

            <a
              href={WHATSAPP_MANAGER}
              target="_blank"
              className="
                w-full h-12 rounded-xl
                bg-green-500 text-white font-semibold
                flex items-center justify-center gap-2
                hover:bg-green-600 transition hover:scale-105
              "
            >
              <MessageCircle size={18} />
              Falar com Gerente
            </a>

            <a
              href={WHATSAPP_GROUP}
              target="_blank"
              className="
                w-full h-12 rounded-xl
                bg-emerald-600 text-white font-semibold
                flex items-center justify-center gap-2
                hover:bg-emerald-700 transition hover:scale-105
              "
            >
              <Users size={18} />
              Entrar no Grupo
            </a>

            <button
              onClick={() => setShowOptions(false)}
              className="text-xs text-gray-500"
            >
              Voltar
            </button>
          </div>
        )}

      </div>
    </div>
  )
}