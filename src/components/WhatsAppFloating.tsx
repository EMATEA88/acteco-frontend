import { Phone } from 'lucide-react'

export default function WhatsAppFloating() {
  // ⚠️ número SEM + e SEM espaços
  const phone = '447895505209'
  const message = encodeURIComponent(
    'Olá, preciso de apoio no app ACTECO'
  )

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ACTECO"
      className="
        fixed bottom-20 right-4 z-50
        w-14 h-14
        rounded-full
        bg-green-600
        flex items-center justify-center
        shadow-lg
        hover:bg-green-700 hover:scale-110
        active:scale-95
        transition
      "
    >
      <Phone size={30} className="text-white" />
    </a>
  )
}
