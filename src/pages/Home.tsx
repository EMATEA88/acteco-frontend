import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Headset, Users, X, MessageCircle } from "lucide-react"
import Carousel from "./Carousel"
import { purchaseService } from "../services/purchase.service"
import type { CatalogCategory, CatalogProvider } from "../types/catalog"
import { getLogo } from "../utils/getLogo"
import { providerBranding } from "../config/recharge-branding"

const WHATSAPP_MANAGER = "https://wa.me/244928270636"
const WHATSAPP_GROUP = "https://chat.whatsapp.com/CaiU4nncaaa7vUnzO6HTzB?mode=gi_t"

const getProviderLogoPath = (provider: CatalogProvider) => {
  // 1. Procurar pelo código do provedor
  if (provider.code) {
    const cleanCode = provider.code
      .toUpperCase()
      .replace(/\s+/g, "");

    if (providerBranding[cleanCode]) {
      return providerBranding[cleanCode].logo;
    }
  }

  // 2. Procurar pelo nome sem espaços
  if (provider.name) {
    const cleanName = provider.name
      .toUpperCase()
      .replace(/\s+/g, "");

    if (providerBranding[cleanName]) {
      return providerBranding[cleanName].logo;
    }

    // 3. Procurar pelo nome exato
    if (providerBranding[provider.name]) {
      return providerBranding[provider.name].logo;
    }
  }

  return undefined;
};

// Função para formatar o nome do provedor de apostas específico para exibição
const getDisplayName = (name: string) => {
  const upper = name.toUpperCase().trim();
  if (upper === "AFRIBET" || upper === "ABET") return "Afri Bet";
  if (upper === "PREMIERBET" || upper === "PBET") return "Premier Bet";
  if (upper === "BANTUBET" || upper === "BBET") return "Bantu Bet";
  if (upper === "ELEPHANTBET" || upper === "EBET") return "Elephant Bet";
  return name;
};

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
    <div className="h-screen w-screen overflow-hidden bg-[#0a2533] text-[#e0f2fe] flex flex-col fixed inset-0 font-sans antialiased selection:bg-cyan-500/20">

      {/* HEADER LIMPO E PROFISSIONAL (FIXO NO TOPO) */}
      <div className="px-5 pt-4 pb-5 flex items-center justify-between border-b border-cyan-500/10 bg-[#0a2533]/90 backdrop-blur-md shrink-0 z-50">
        <div>
          <p className="text-[11px] text-cyan-200/70 font-medium tracking-wide">
            Bem-vindo à
          </p>
          <h1 className="text-xl font-black tracking-wider text-white flex items-center gap-1.5 mt-0.5">
            EMATEA
            <span className="inline-flex relative items-center justify-center h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
            </span>
          </h1>
        </div>

        {/* BOTÃO SUPORTE COM DESIGN PREMIUM */}
        <button
          onClick={() => setSupportOpen(true)}
          className="
            h-9 px-4 rounded-xl
            bg-[#0e364a] border border-cyan-500/20
            text-white text-xs font-bold
            flex items-center gap-2
            hover:bg-[#124158] hover:border-cyan-400/50
            transition-all duration-200 shadow-sm cursor-pointer
          "
        >
          <Headset size={15} className="text-cyan-400" strokeWidth={2.5} />
          Suporte
        </button>
      </div>

      {/* ÁREA DE CONTEÚDO COM SCROLL REAL E ESTÁVEL */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 pt-5 pb-32 max-w-4xl mx-auto w-full">
        
        {/* CARROSSEL PRINCIPAL */}
        <div className="mb-8">
          <Carousel />
        </div>

        {/* SECÇÕES DE SERVIÇOS DINÂMICOS */}
        <div className="space-y-8">
          {loadingCatalog ? (
            /* SKELETON LOADER */
            <div className="space-y-6 animate-pulse">
              {[1, 2].map((sectionIndex) => (
                <div key={sectionIndex} className="space-y-3">
                  <div className="w-28 h-3.5 bg-[#0e364a] rounded-md border border-cyan-500/20"></div>

                  <div className="grid grid-cols-4 gap-3 sm:gap-4">
                    {[1, 2, 3, 4].map((itemIndex) => (
                      <div key={itemIndex} className="flex flex-col items-center space-y-2">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0e364a] border border-cyan-500/20 shadow-md"></div>
                        <div className="w-12 h-2.5 bg-[#0e364a] rounded-sm"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : catalog.length === 0 ? (
            <div className="text-center py-10 text-cyan-200/70 text-xs font-mono">
              Nenhum serviço disponível no momento.
            </div>
          ) : (
            catalog.map((category) => (
              <div key={category.id}>
                <SectionTitle title={category.name} />
                
                <div className="grid grid-cols-4 gap-3 sm:gap-4">
                  {category.providers && category.providers.map((provider) => {
                    const logoFilename = getProviderLogoPath(provider);
                    const logo = getLogo(logoFilename);
                    const displayName = getDisplayName(provider.name);

                    return (
                      <div 
                        key={provider.id}
                        onClick={() => {
                          navigate(`/recharges/${provider.code}`);
                        }}
                        className="flex flex-col items-center group cursor-pointer"
                      >
                        {/* Círculo do Logótipo */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0e364a] border border-cyan-500/20 p-1 flex items-center justify-center shadow-lg group-hover:border-cyan-400/50 group-hover:bg-[#124158] group-hover:scale-105 transition-all duration-200">
                          <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-[#144863] p-1.5 shadow-sm">
                            {logo ? (
                              <img 
                                src={logo} 
                                alt={displayName}
                                className="w-full h-full object-cover rounded-full opacity-90 group-hover:opacity-100 transition-opacity"
                              />
                            ) : (
                              <span className="text-[10px] font-bold text-white uppercase text-center px-1">
                                {displayName}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Nome do Provedor */}
                        <span className="text-[11px] sm:text-xs font-medium text-cyan-200/80 mt-2 text-center tracking-wide group-hover:text-white transition-colors truncate w-full">
                          {displayName}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* MODAL SUPORTE */}
      {supportOpen && (
        <div
          onClick={() => setSupportOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm p-6 rounded-3xl bg-[#0e364a] border border-cyan-500/20 shadow-2xl relative shadow-cyan-950/40"
          >
            <button
              onClick={() => setSupportOpen(false)}
              className="absolute top-4 right-4 text-cyan-200/70 hover:text-white transition cursor-pointer"
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
                className="w-full h-12 rounded-xl bg-cyan-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-cyan-500 transition-all shadow-md shadow-cyan-950/20 cursor-pointer"
              >
                <MessageCircle size={18} strokeWidth={2.5} />
                Falar com Operadora
              </a>

              <a
                href={WHATSAPP_GROUP}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 rounded-xl bg-[#0a2533] border border-cyan-500/20 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#124158] hover:border-cyan-400/50 transition-all shadow-md shadow-cyan-950/20 cursor-pointer"
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
    <h2 className="text-xs tracking-widest text-cyan-200/80 mb-4 uppercase font-mono font-black border-l-2 border-cyan-400 pl-3">
      {title}
    </h2>
  )
}