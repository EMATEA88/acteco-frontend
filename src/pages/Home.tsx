import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Headset, Users, X, MessageCircle } from "lucide-react"
import Carousel from "./Carousel"
import { purchaseService } from "../services/purchase.service"
import type { CatalogCategory } from "../types/catalog"
import { getLogo } from "../utils/getLogo"
import { providerBranding } from "../config/recharge-branding"

const WHATSAPP_MANAGER = "https://wa.me/244928270636"
const WHATSAPP_GROUP = "https://chat.whatsapp.com/CaiU4nncaaa7vUnzO6HTzB?mode=gi_t"

export default function Home() {
  const navigate = useNavigate();
  const [supportOpen, setSupportOpen] = useState(false)
  const [catalog, setCatalog] = useState<CatalogCategory[]>([])
  const [loadingCatalog, setLoadingCatalog] = useState(true)

  useEffect(() => {
    loadDynamicCatalog()
  }, [])

  async function loadDynamicCatalog() {
    try {
      setLoadingCatalog(true)
      const response = await purchaseService.getCatalog()
      setCatalog(response.data || [])
    } catch (error) {
      console.error("Erro ao carregar catálogo na home:", error)
    } finally {
      setLoadingCatalog(false)
    }
  }

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

      {/* SECÇÕES DE SERVIÇOS DINÂMICOS (DADOS REAIS + BRANDING CONFIG) */}
      <div className="space-y-8">
        {loadingCatalog ? (
          /* SKELETON LOADER ESTILO BINANCE (DARK THEME) */
          <div className="space-y-6 animate-pulse">
            {[1, 2].map((sectionIndex) => (
              <div key={sectionIndex} className="space-y-3">
                {/* Título Skeleton */}
                <div className="w-28 h-3.5 bg-[#1E2329] rounded-md"></div>

                {/* Grelha de Provedores Skeleton */}
                <div className="grid grid-cols-4 gap-3 sm:gap-4">
                  {[1, 2, 3, 4].map((itemIndex) => (
                    <div key={itemIndex} className="flex flex-col items-center space-y-2">
                      {/* Círculo do Logo Skeleton */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1E2329] border border-[#2B313A]"></div>
                      {/* Texto do Nome Skeleton */}
                      <div className="w-12 h-2.5 bg-[#1E2329] rounded-sm"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : catalog.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-xs font-mono">
            Nenhum serviço disponível no momento.
          </div>
        ) : (
          catalog.map((category) => (
            <div key={category.id}>
              <SectionTitle title={category.name} />
              
              <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {category.providers && category.providers.map((provider) => {
                  const branding = providerBranding[provider.name.toUpperCase() as keyof typeof providerBranding];
                  const logo = getLogo(branding?.logo);

                  return (
                    <div 
                      key={provider.id}
                      onClick={() => {
                        navigate(`/recharges/${provider.code}`);
                      }}
                      className="flex flex-col items-center group cursor-pointer"
                    >
                      {/* Círculo do Logótipo (Perfeitamente Arredondado) */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#12161C] border border-[#2D333B] p-1 flex items-center justify-center shadow-lg group-hover:border-emerald-500 group-hover:scale-105 transition-all duration-200">
                        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-[#0B0E11] p-1.5">
                          {logo ? (
                            <img 
                              src={logo} 
                              alt={provider.name}
                              className="w-full h-full object-cover rounded-full opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                          ) : (
                            <span className="text-[10px] font-bold text-white uppercase text-center px-1">
                              {provider.name}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Nome do Provedor */}
                      <span className="text-[11px] sm:text-xs font-medium text-gray-300 mt-2 text-center tracking-wide group-hover:text-white transition-colors truncate w-full">
                        {provider.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL SUPORTE */}
      {supportOpen && (
        <div
          onClick={() => setSupportOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm p-6 rounded-3xl bg-[#161b22] border border-[#30363d] shadow-2xl relative"
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
                className="w-full h-12 rounded-xl bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-md"
              >
                <MessageCircle size={18} strokeWidth={2.5} />
                Falar com Operadora
              </a>

              <a
                href={WHATSAPP_GROUP}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 rounded-xl bg-[#0d1117] border border-[#30363d] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#1b2129] transition-all shadow-md"
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
    <h2 className="text-xs tracking-widest text-gray-400 mb-4 uppercase font-mono font-black border-l-2 border-emerald-500 pl-3">
      {title}
    </h2>
  )
}