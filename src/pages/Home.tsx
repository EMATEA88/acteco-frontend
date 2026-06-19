// Home.tsx
import { useState } from "react"
import { Headset, Users, X, MessageCircle } from "lucide-react" // Substituído para Headset no topo
import Carousel from "./Carousel"

const WHATSAPP_MANAGER = "https://wa.me/244928270636"
const WHATSAPP_GROUP = "https://chat.whatsapp.com/CaiU4nncaaa7vUnzO6HTzB?mode=gi_t"

export default function Home() {
  const [supportOpen, setSupportOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-[#1E2329] px-5 pt-4 pb-28 antialiased selection:bg-[#02C076]/20">

      {/* HEADER LIMPO E PROFISSIONAL */}
      <div className="pt-4 pb-5 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div>
          <p className="text-[11px] text-[#848E9C] font-medium tracking-wide">
            Bem-vindo à
          </p>
          <h1 className="text-xl font-black tracking-wider text-[#1E2329] flex items-center gap-1.5 mt-0.5">
            EMATEA
            <span className="inline-flex relative items-center justify-center h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#02C076] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#02C076]"></span>
            </span>
          </h1>
        </div>

        {/* BOTÃO SUPORTE COM ÍCONE REAL DE ATENDENTE (HEADSET) */}
        <button
          onClick={() => setSupportOpen(true)}
          className="
            h-9 px-4 rounded-xl
            bg-gray-50 border border-gray-200
            text-[#1E2329] text-xs font-bold
            flex items-center gap-2
            hover:bg-gray-100 hover:border-gray-300
            transition-all duration-200 shadow-sm
          "
        >
          <Headset size={15} className="text-[#02C076]" strokeWidth={2.5} />
          Suporte
        </button>
      </div>

      {/* CARROSSEL PRINCIPAL */}
      <div className="mt-5 mb-8">
        <Carousel />
      </div>

      {/* MÉTRICAS RÁPIDAS DO MERCADO */}
      <SectionTitle title="MÉTRICAS DO MERCADO" />
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm mb-8 flex justify-around items-center">
        <div className="text-center">
          <p className="text-[10px] text-[#848E9C] font-bold uppercase tracking-widest mb-1">Volume 24h</p>
          <span className="text-xs font-mono font-black text-[#1E2329] bg-white border border-gray-100 px-2.5 py-1 rounded-full shadow-sm">
            +{Number(12500000).toLocaleString()} Kz
          </span>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-[#848E9C] font-bold uppercase tracking-widest mb-1">Média Juros</p>
          <span className="text-xs font-mono font-black text-[#02C076] bg-[#02C076]/10 px-2.5 py-1 rounded-full">
            7.15% <span className="font-sans font-bold text-[9px] text-[#848E9C]">/ Mês</span>
          </span>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-[#848E9C] font-bold uppercase tracking-widest mb-1">Taxas OTC</p>
          <span className="text-xs font-mono font-black text-[#1E2329] bg-white border border-gray-100 px-2.5 py-1 rounded-full shadow-sm">
            0.05% <span className="font-sans font-bold text-[9px] text-[#848E9C]">/ Ordem</span>
          </span>
        </div>
      </div>

      {/* MODAL SUPORTE */}
      {supportOpen && (
        <div
          onClick={() => setSupportOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm p-6 rounded-3xl bg-white border border-gray-100 shadow-2xl relative"
          >
            <button
              onClick={() => setSupportOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#1E2329] transition"
            >
              <X size={20}/>
            </button>

            <h2 className="text-base font-black text-[#1E2329] mb-6 text-center uppercase tracking-widest font-mono">
              Centro de Apoio
            </h2>

            <div className="space-y-4">
              <a
                href={WHATSAPP_MANAGER}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 rounded-xl bg-[#02C076] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#00b06c] transition-all shadow-md shadow-[#02C076]/10"
              >
                <MessageCircle size={18} strokeWidth={2.5} />
                Falar com Operadora
              </a>

              <a
                href={WHATSAPP_GROUP}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 rounded-xl bg-[#1E2329] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md"
              >
                <Users size={18} strokeWidth={2.5} />
                Entrar no Grupo
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-xs tracking-widest text-[#848E9C] mb-4 uppercase font-mono font-black border-l-2 border-[#02C076] pl-3">
      {title}
    </h2>
  )
}