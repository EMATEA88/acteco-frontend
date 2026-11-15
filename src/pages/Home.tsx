import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Carousel from "./Carousel"
import { purchaseService } from "../services/purchase.service"
import type { CatalogCategory, CatalogProvider } from "../types/catalog"
import { getLogo } from "../utils/getLogo"
import { providerBranding } from "../config/recharge-branding"

const getProviderLogoPath = (provider: CatalogProvider) => {
  if (provider.code) {
    const cleanCode = provider.code.toUpperCase().replace(/\s+/g, "")

    if (providerBranding[cleanCode]) {
      return providerBranding[cleanCode].logo
    }
  }

  if (provider.name) {
    const cleanName = provider.name.toUpperCase().replace(/\s+/g, "")

    if (providerBranding[cleanName]) {
      return providerBranding[cleanName].logo
    }

    if (providerBranding[provider.name]) {
      return providerBranding[provider.name].logo
    }
  }

  return undefined
}

// Formata os nomes dos provedores para apresentação no catálogo.
const getDisplayName = (name: string) => {
  const upper = name.toUpperCase().trim()

  if (upper === "AFRIBET" || upper === "ABET") return "Afri Bet"
  if (upper === "PREMIERBET" || upper === "PBET") return "Premier Bet"
  if (upper === "BANTUBET" || upper === "BBET") return "Bantu Bet"
  if (upper === "ELEPHANTBET" || upper === "EBET") return "Elephant Bet"

  return name
}

export default function Home() {
  const navigate = useNavigate()

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
    <div className="fixed inset-0 flex h-screen w-screen flex-col overflow-hidden bg-[#0a2533] font-sans text-[#e0f2fe] antialiased selection:bg-cyan-500/20">
      {/* Conteúdo principal */}
      <main className="mx-auto w-full max-w-4xl flex-1 overflow-y-auto overflow-x-hidden px-4 pb-32 pt-3 sm:px-5 sm:pt-4">
        {/* Carrossel principal */}
        <div className="mb-7 h-[190px] w-full overflow-hidden rounded-xl [&>*]:!h-full">
          <Carousel />
        </div>

        {/* Catálogo de serviços */}
        <div className="space-y-8">
          {loadingCatalog ? (
            <div className="animate-pulse space-y-6">
              {[1, 2].map((sectionIndex) => (
                <div key={sectionIndex} className="space-y-3">
                  <div className="h-3.5 w-28 rounded-md border border-cyan-500/20 bg-[#0e364a]" />

                  <div className="grid grid-cols-4 gap-3 sm:gap-4">
                    {[1, 2, 3, 4].map((itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex flex-col items-center space-y-2"
                      >
                        <div className="h-16 w-16 rounded-full border border-cyan-500/20 bg-[#0e364a] shadow-md sm:h-20 sm:w-20" />
                        <div className="h-2.5 w-12 rounded-sm bg-[#0e364a]" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : catalog.length === 0 ? (
            <div className="py-10 text-center text-xs text-cyan-200/70">
              Nenhum serviço disponível no momento.
            </div>
          ) : (
            catalog.map((category) => (
              <section key={category.id}>
                <SectionTitle title={category.name} />

                <div className="grid grid-cols-4 gap-3 sm:gap-4">
                  {category.providers?.map((provider) => {
                    const logoFilename = getProviderLogoPath(provider)
                    const logo = getLogo(logoFilename)
                    const displayName = getDisplayName(provider.name)

                    return (
                      <button
                        key={provider.id}
                        type="button"
                        onClick={() => navigate(`/recharges/${provider.code}`)}
                        aria-label={`Abrir ${displayName}`}
                        className="group flex min-w-0 cursor-pointer flex-col items-center"
                      >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-500/20 bg-[#0e364a] p-1 shadow-lg transition-all duration-200 group-hover:scale-105 group-hover:border-cyan-400/50 group-hover:bg-[#124158] sm:h-20 sm:w-20">
                          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#144863] p-1.5 shadow-sm">
                            {logo ? (
                              <img
                                src={logo}
                                alt={displayName}
                                className="h-full w-full rounded-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                              />
                            ) : (
                              <span className="px-1 text-center text-[10px] font-bold uppercase text-white">
                                {displayName}
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="mt-2 w-full truncate text-center text-[11px] font-medium tracking-wide text-cyan-200/80 transition-colors group-hover:text-white sm:text-xs">
                          {displayName}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="mb-4 border-l-2 border-cyan-400 pl-3 text-xs font-black uppercase tracking-widest text-cyan-200/80">
      {title}
    </h2>
  )
}
