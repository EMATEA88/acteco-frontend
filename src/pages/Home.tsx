import { useState } from "react"
import { Headset, Users, X, MessageCircle, TrendingUp, Percent, ShieldCheck } from "lucide-react"
import Carousel from "./Carousel"

const WHATSAPP_MANAGER = "https://wa.me/244928270636"
const WHATSAPP_GROUP = "https://chat.whatsapp.com/CaiU4nncaaa7vUnzO6HTzB?mode=gi_t"

export default function Home() {
  const [supportOpen, setSupportOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] px-5 pt-4 pb-28 antialiased selection:bg-[#02C076]/20">

      {/* HEADER LIMPO E PROFISSIONAL - DARK MODE */}
      <div className="pt-4 pb-5 flex items-center justify-between border-b border-white/[0.05] sticky top-0 bg-[#0B0E11]/90 backdrop-blur-md z-50">
        <div>
          <p className="text-[11px] text-gray-400 font-medium tracking-wide">
            Bem-vindo à
          </p>
          <h1 className="text-xl font-black tracking-wider text-white flex items-center gap-1.5 mt-0.5">
            EMATEA
            <span className="inline-flex relative items-center justify-center h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#02C076] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#02C076]"></span>
            </span>
          </h1>
        </div>

        {/* BOTÃO SUPORTE COM DESIGN PREMIUM */}
        <button
          onClick={() => setSupportOpen(true)}
          className="
            h-9 px-4 rounded-xl
            bg-white/[0.03] border border-white/[0.05]
            text-white text-xs font-bold
            flex items-center gap-2
            hover:bg-white/[0.08] hover:border-white/[0.1]
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

      {/* MÉTRICAS DO MERCADO - CARDS AVANÇADOS */}
      <SectionTitle title="MÉTRICAS DO MERCADO" />
      
      <div className="grid grid-cols-1 gap-4 mb-8">
        {/* CARD LOMBO: VOLUME 24H */}
        <div className="bg-gradient-to-br from-[#02C076]/[0.03] to-transparent bg-[#161A1E] border border-white/[0.03] p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <TrendingUp size={12} className="text-[#02C076]" /> Volume 24h
            </p>
            <h3 className="text-lg font-mono font-black text-white">
              +{Number(12500000).toLocaleString()} <span className="text-xs font-sans text-gray-400 font-bold">Kz</span>
            </h3>
          </div>
          <div className="text-[10px] font-mono font-black text-[#02C076] bg-[#02C076]/10 px-2 py-1 rounded-md border border-[#02C076]/20">
            ATIVO
          </div>
        </div>

        {/* SUB-GRID PARA MEDIAS E TAXAS */}
        <div className="grid grid-cols-2 gap-4">
          {/* CARD: MÉDIA JUROS */}
          <div className="bg-[#161A1E] border border-white/[0.03] p-4 rounded-2xl shadow-lg flex flex-col justify-between space-y-3">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Percent size={12} className="text-blue-400" /> Média Juros
            </p>
            <div>
              <span className="text-base font-mono font-black text-[#02C076] bg-[#02C076]/10 px-2 py-0.5 rounded-md">
                7.15%
              </span>
              <p className="text-[9px] text-gray-400 font-medium mt-1">Por Mês contratado</p>
            </div>
          </div>

          {/* CARD: TAXAS OTC */}
          <div className="bg-[#161A1E] border border-white/[0.03] p-4 rounded-2xl shadow-lg flex flex-col justify-between space-y-3">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-amber-400" /> Taxas OTC
            </p>
            <div>
              <span className="text-base font-mono font-black text-white">
                0.05%
              </span>
              <p className="text-[9px] text-gray-400 font-medium mt-1">Por Ordem executada</p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL SUPORTE - ADAPTADO PARA DARK MODE */}
      {supportOpen && (
        <div
          onClick={() => setSupportOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm p-6 rounded-3xl bg-[#161A1E] border border-white/[0.05] shadow-2xl relative"
          >
            <button
              onClick={() => setSupportOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X size={20}/>
            </button>

            <h2 className="text-base font-black text-white mb-6 text-center uppercase tracking-widest font-mono">
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
                className="w-full h-12 rounded-xl bg-white/[0.04] border border-white/[0.05] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/[0.08] transition-all shadow-md"
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
    <h2 className="text-xs tracking-widest text-gray-400 mb-4 uppercase font-mono font-black border-l-2 border-[#02C076] pl-3">
      {title}
    </h2>
  )
}