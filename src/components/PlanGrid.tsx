import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { CatalogGroup, CatalogPlan } from "../types/catalog";
import { ArrowLeft } from "lucide-react";
import { getLogo } from "../utils/getLogo";

interface PlanGridProps {
  group: CatalogGroup;
  onBack: () => void;
  onSelect: (plan: CatalogPlan) => void;
}

/**
 * Logos específicos dos provedores/produtos.
 */
const planBrandingMap: Record<string, string> = {
  UNITEL: "UNITEL.PNG",
  MOVICEL: "MOVICEL.PNG",
  AFRICELL: "AFRICELL.PNG",
  NETONE: "NETONE.PNG",
  DSTV: "DSTV.PNG",
  ZAP: "ZAP1.PNG",
  "ZAP FIBRA": "ZAP2.PNG",
  ENDE: "ENDE.PNG",
  EPAL: "EPAL.PNG",
  STAS: "STAS.PNG",
  "5LINHAS": "CINCO.PNG",
  "5 LINHAS": "CINCO.PNG",
  CINCO: "CINCO.PNG",
  AMAZON: "AMAZON.PNG",
  APPLE: "APPLE.PNG",
  "GOOGLE PLAY": "GOOGLEPLAY.PNG",
  NETFLIX: "NETFLIX.PNG",
  SPOTIFY: "SPOTIFY.PNG",
  PLAYSTATION: "TEAM.PNG",
  TEAM: "TEAM.PNG",
  XBOX: "XBOX.PNG",
  BOLT: "BOLT.PNG",
  FLIXBUS: "FLIXBUS.PNG",
  PREMIERBET: "Premiebet.png",
  PBET: "Premiebet.png",
  BANTUBET: "BantuBet.png",
  BBET: "BantuBet.png",
  ELEPHANTBET: "Elephantbet.png",
  EBET: "Elephantbet.png",
  AFRIBET: "AfriBet.png",
  ABET: "AfriBet.png",
  MOBET: "Mobet.png",
  MELBET: "MelBet.png",
  MGMBET: "MelBet.png",
  KWANZABET: "Kwanzabet.png",
  "888BETS": "888Bets.png",
  "888BET": "888Bets.png",
};

const normalize = (value: string = "") =>
  value
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

type PlanSection = {
  title: string;
  order: number;
  plans: CatalogPlan[];
};

export default function PlanGrid({
  group,
  onBack,
  onSelect,
}: PlanGridProps) {
  const { providerCode } = useParams<{ providerCode: string }>();
  const [providerLogo, setProviderLogo] = useState<string | null>(null);

  /**
   * Carrega o logo do provedor.
   */
  useEffect(() => {
    if (providerCode) {
      const logoUrl = getLogo(providerCode.toLowerCase());
      setProviderLogo(logoUrl);
    }
  }, [providerCode]);

  /**
   * Mantido para preservar o comportamento atual
   * de ocultação de determinadas recargas de apostas.
   */
  const isBettingProvider = useMemo(() => {
    const code = normalize(providerCode);
    const name = normalize(group.name);

    const bettingKeywords = [
      "BET",
      "PREMIER",
      "BANTU",
      "ELEPHANT",
      "AFRI",
      "MOBET",
      "MEL",
      "KWANZA",
      "888",
    ];

    return bettingKeywords.some(
      (keyword) =>
        code.includes(keyword) ||
        name.includes(keyword)
    );
  }, [providerCode, group.name]);

  /**
   * Identifica o provedor atual.
   */
  const provider = useMemo(() => {
    const code = normalize(providerCode);
    const name = normalize(group.name);

    if (code.includes("UNITEL") || name.includes("UNITEL")) {
      return "UNITEL";
    }

    if (code.includes("MOVICEL") || name.includes("MOVICEL")) {
      return "MOVICEL";
    }

    if (code.includes("AFRICELL") || name.includes("AFRICELL")) {
      return "AFRICELL";
    }

    if (code.includes("DSTV") || name.includes("DSTV")) {
      return "DSTV";
    }

    if (code.includes("ENDE") || name.includes("ENDE")) {
      return "ENDE";
    }

    if (code.includes("EPAL") || name.includes("EPAL")) {
      return "EPAL";
    }

    if (
      code.includes("PREMIER") ||
      name.includes("PREMIER")
    ) {
      return "PREMIERBET";
    }

    if (
      code.includes("BANTU") ||
      name.includes("BANTU")
    ) {
      return "BANTUBET";
    }

    if (
      code.includes("KWANZA") ||
      name.includes("KWANZA")
    ) {
      return "KWANZABET";
    }

    if (
      code.includes("MOBET") ||
      name.includes("MOBET")
    ) {
      return "MOBET";
    }

    if (
      code.includes("888") ||
      name.includes("888")
    ) {
      return "888BET";
    }

    if (
      code.includes("AFRIBET") ||
      name.includes("AFRIBET")
    ) {
      return "AFRIBET";
    }

    return "OTHER";
  }, [providerCode, group.name]);

  /**
   * ============================================================
   * REGRAS AUXILIARES DE CLASSIFICAÇÃO
   * ============================================================
   */

  /**
   * Detecta produtos que possuem MB ou GB.
   *
   * Exemplos:
   * 400MB/1D
   * 1GB/30D
   * 30min+2GB/2D
   * 100GB/6M
   */
  const hasDataUnit = (name: string) =>
    /\b\d+(?:[.,]\d+)?\s*(?:MB|GB)\b/.test(name);

  /**
   * Detecta produtos de voz.
   *
   * Incluímos SMS porque o próprio catálogo da AKI
   * possui produtos de voz compostos apenas por SMS.
   */
  const hasVoiceKeyword = (name: string) =>
    name.includes("VOZ") ||
    /\b\d+\s*MIN\b/.test(name) ||
    /\b\d+\s*MINUTO/.test(name) ||
    name.includes("MIN/SMS") ||
    name.includes("MIN/SMS") ||
    /\b\d+\s*SMS\b/.test(name) ||
    name.includes("SALDO VOZ") ||
    name.includes("RECARGA VOZ");

  /**
   * Detecta recarga variável de voz/saldo.
   *
   * Essas recargas devem aparecer no topo.
   */
  const isDirectVoiceRecharge = (name: string) =>
    name.includes("SALDO VOZ") ||
    name.includes("RECARGA VOZ");

  /**
   * Detecta produtos Bazza.
   *
   * A identificação acontece pelo nome do produto e não
   * pelo providerCode, porque Bazza pertence ao catálogo
   * da Unitel, mas precisa de uma estrutura própria.
   */
  const isBazzaPlan = (name: string) =>
    name.includes("BAZZA");

  /**
   * ============================================================
   * CLASSIFICAÇÃO
   * ============================================================
   *
   * A prioridade é deliberadamente rígida:
   *
   * 1. Recargas diretas
   * 2. Bazza
   * 3. Mais
   * 4. TELCOTV
   * 5. Residencial
   * 6. Voz
   * 7. Dados
   * 8. Pacotes
   *
   * Isso impede que um produto com "GB + min"
   * caia no grupo errado.
   */
  const classifyPlan = (
    plan: CatalogPlan
  ): { title: string; order: number } => {
    const name = normalize(plan.name);

    switch (provider) {
      /**
       * =====================================================
       * UNITEL
       * =====================================================
       */
            case "UNITEL": {
        /**
         * =====================================================
         * 1. RECARGAS DIRETAS
         * =====================================================
         *
         * Recargas de saldo/voz configuráveis.
         */
        if (isDirectVoiceRecharge(name)) {
          return {
            title: "Recargas Diretas",
            order: 1,
          };
        }

        /**
         * =====================================================
         * 2. PLANOS MAIS
         * =====================================================
         *
         * "Mais" possui prioridade sobre MB/GB,
         * minutos e SMS.
         */
        if (
          name.startsWith("UNITEL: MAIS ") ||
          name.startsWith("UNITEL MAIS ") ||
          name.startsWith("MAIS ")
        ) {
          return {
            title: "Planos Mais",
            order: 2,
          };
        }

        /**
         * =====================================================
         * 3. TELCOTV
         * =====================================================
         */
        if (
          name.includes("DSTV") ||
          name.includes("TELCOTV")
        ) {
          return {
            title: "TELCOTV",
            order: 3,
          };
        }

        /**
         * =====================================================
         * 4. BAZZA
         * =====================================================
         *
         * Bazza pertence à Unitel na origem, mas deve
         * permanecer completamente separado dos planos Unitel.
         */
        if (isBazzaPlan(name)) {

          /**
           * Bazza com MB/GB → Dados
           */
          if (hasDataUnit(name)) {
            return {
              title: "Planos Bazza Dados",
              order: 5,
            };
          }

          /**
           * Bazza com Voz/Min/Minutos/SMS → Voz
           */
          if (hasVoiceKeyword(name)) {
            return {
              title: "Planos Bazza Voz",
              order: 4,
            };
          }

          /**
           * Bazza sem indicador explícito.
           */
          return {
            title: "Planos Bazza",
            order: 4,
          };
        }

        /**
         * =====================================================
         * 5. RESIDENCIAL
         * =====================================================
         *
         * NetCasa/Casa 4G/Casa 5G não deve entrar em
         * Planos de Dados mesmo possuindo MB/GB.
         */
        if (
          name.includes("CASA 4G") ||
          name.includes("CASA 5G") ||
          name.includes("NETCASA") ||
          name.includes("NET CASA")
        ) {
          return {
            title: "Residencial",
            order: 6,
          };
        }

        /**
         * =====================================================
         * 6. DADOS
         * =====================================================
         *
         * REGRA PRINCIPAL:
         *
         * Qualquer plano Unitel que tenha MB ou GB
         * pertence a Planos de Dados.
         *
         * Isso inclui:
         *
         * - 7GB/30D
         * - 15GB/30D
         * - 300MB/1D
         * - 300min+5GB/30D
         * - 10GB + minutos
         *
         * Se tiver MB/GB, Dados tem prioridade sobre Voz.
         */
        if (hasDataUnit(name)) {
          return {
            title: "Planos de Dados",
            order: 7,
          };
        }

        /**
         * =====================================================
         * 7. VOZ
         * =====================================================
         *
         * Produtos que possuem:
         *
         * - VOZ
         * - MIN
         * - MINUTO
         * - SMS
         *
         * mas que NÃO possuem MB/GB
         * entram aqui.
         */
        if (hasVoiceKeyword(name)) {
          return {
            title: "Planos de Voz",
            order: 8,
          };
        }

        /**
         * =====================================================
         * 8. PACOTES
         * =====================================================
         *
         * Produtos Unitel que não se enquadram nas
         * categorias anteriores.
         */
        return {
          title: "Pacotes",
          order: 9,
        };
      }

      /**
       * =====================================================
       * MOVICEL
       * =====================================================
       */
      case "MOVICEL": {
        if (
          name.includes("RECARGA VOZ") ||
          name.includes("ADITIVO") ||
          name.includes("FLEX") ||
          name.includes("SPYKA") ||
          name.includes("VOZ KAMBA") ||
          hasVoiceKeyword(name)
        ) {
          return {
            title: "Voz",
            order: 2,
          };
        }

        if (
          name.includes("MOVINET") ||
          name.includes("BWÉ") ||
          name.includes("BWE") ||
          name.includes("NOITES") ||
          hasDataUnit(name)
        ) {
          return {
            title: "Dados",
            order: 3,
          };
        }

        return {
          title: "Pacotes",
          order: 1,
        };
      }

      /**
       * =====================================================
       * AFRICELL
       * =====================================================
       */
      case "AFRICELL": {
        if (
          name.includes("SALDO VOZ") ||
          name.includes("RECARGA VOZ") ||
          name.includes("FALA TODOS") ||
          hasVoiceKeyword(name)
        ) {
          return {
            title: "Voz",
            order: 2,
          };
        }

        if (
          name.includes("AFRIMIX") ||
          name.includes("AFRINET") ||
          name.includes("KONEKTA") ||
          hasDataUnit(name)
        ) {
          return {
            title: "Dados",
            order: 3,
          };
        }

        return {
          title: "Pacotes",
          order: 1,
        };
      }

      /**
       * =====================================================
       * DSTV
       * =====================================================
       */
      case "DSTV": {
        if (
          name.includes("BOX OFFICE") ||
          name.includes("FILME")
        ) {
          return {
            title: "TV - Filmes",
            order: 4,
          };
        }

        if (
          name.includes("EXTRAVIEW") ||
          name.includes("HD-PVR") ||
          name.includes("NORMAL")
        ) {
          return {
            title: "TV - Descodificadores",
            order: 5,
          };
        }

        if (
          name.includes("BUÉ+INDIA") ||
          name.includes("BUE+INDIA") ||
          name.includes("FRENCH CLS") ||
          name.includes("PREMIUM+")
        ) {
          return {
            title: "TV - Combinados",
            order: 3,
          };
        }

        if (
          name.includes("INDIA") ||
          name.includes("FRENCH") ||
          name.includes("CHINA")
        ) {
          return {
            title: "TV - Adicionais",
            order: 2,
          };
        }

        return {
          title: "TV",
          order: 1,
        };
      }

      /**
       * =====================================================
       * ENDE
       * =====================================================
       */
      case "ENDE":
        return {
          title: "Energia e Água",
          order: 1,
        };

      /**
       * =====================================================
       * EPAL
       * =====================================================
       */
      case "EPAL":
        return {
          title: "Energia e Água",
          order: 1,
        };

      /**
       * =====================================================
       * JOGOS / APOSTAS
       * =====================================================
       */
      case "PREMIERBET":
      case "BANTUBET":
      case "KWANZABET":
      case "MOBET":
      case "888BET":
      case "AFRIBET":
        return {
          title: "Jogos e Apostas",
          order: 1,
        };

      /**
       * =====================================================
       * OUTROS
       * =====================================================
       */
      default:
        if (
          name.includes("SEGURO") ||
          name.includes("SEGUROS")
        ) {
          return {
            title: "Seguros",
            order: 1,
          };
        }

        if (
          name.includes("TRANSFERENCIA AKI") ||
          name.includes("TRANSFERÊNCIA AKI")
        ) {
          return {
            title: "Transferências AKI",
            order: 1,
          };
        }

        return {
          title: "Serviços",
          order: 1,
        };
    }
  };

  /**
   * ============================================================
   * AGRUPAMENTO
   * ============================================================
   */
  const groupedPlans = useMemo(() => {
    if (!group.plans || group.plans.length === 0) {
      return [];
    }

    const sections = new Map<string, PlanSection>();

    group.plans.forEach((plan) => {
      /**
       * Mantém o comportamento existente de ocultar
       * determinadas recargas de 100 Kz nos provedores
       * de apostas.
       */
      if (
        isBettingProvider &&
        Number(plan.price) === 100
      ) {
        return;
      }

      const classification = classifyPlan(plan);

      if (!sections.has(classification.title)) {
        sections.set(classification.title, {
          title: classification.title,
          order: classification.order,
          plans: [],
        });
      }

      sections
        .get(classification.title)!
        .plans
        .push(plan);
    });

    /**
     * Ordena:
     *
     * Recargas Diretas
     * Planos Mais
     * TELCOTV
     * Bazza Voz
     * Bazza Dados
     * Voz
     * Dados
     * Residencial
     * Pacotes
     */
    return Array.from(sections.values()).sort(
      (a, b) => {
        if (a.order !== b.order) {
          return a.order - b.order;
        }

        return a.title.localeCompare(
          b.title,
          "pt-PT"
        );
      }
    );
  }, [
    group.plans,
    isBettingProvider,
    provider,
  ]);

  /**
   * Logo específico do provedor.
   */
  const effectiveProviderLogo = useMemo(() => {
    if (providerLogo) {
      return providerLogo;
    }

    const providerName = normalize(group.name);

    for (const [key, fileName] of Object.entries(
      planBrandingMap
    )) {
      if (providerName.includes(key)) {
        const cleanName = fileName
          .toLowerCase()
          .replace(/\.[^/.]+$/, "");

        const logo = getLogo(cleanName);

        if (logo) {
          return logo;
        }
      }
    }

    return null;
  }, [providerLogo, group.name]);

  /**
   * ============================================================
   * RENDER
   * ============================================================
   */
  return (
    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe] px-4 sm:px-6 pt-4 pb-28 antialiased selection:bg-cyan-500/20">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="pt-3 pb-4 flex items-center justify-between border-b border-cyan-500/10 sticky top-0 bg-[#0a2533]/90 backdrop-blur-xl z-40">

        <button
          onClick={onBack}
          className="
            h-10 px-4
            rounded-xl
            bg-[#0e364a]
            border border-cyan-500/20
            text-cyan-300
            text-xs font-semibold
            flex items-center gap-2
            hover:bg-[#124158]
            hover:text-white
            transition-all duration-200
            active:scale-95
            cursor-pointer
            shadow-sm
          "
        >
          <ArrowLeft
            size={16}
            className="text-cyan-400"
          />

          <span>Voltar</span>
        </button>

        {/* Título */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none flex items-center gap-2.5">

          {effectiveProviderLogo && (
            <img
              src={effectiveProviderLogo}
              alt={group.name}
              className="
                w-8 h-8
                rounded-full
                object-contain
                bg-[#144863]
                p-0.5
                border border-cyan-500/30
                shadow-md
              "
            />
          )}

          <h1
            className="
              text-sm sm:text-base
              font-black
              tracking-wider
              text-white
              uppercase
              font-mono
            "
          >
            {group.name}
          </h1>
        </div>

        <div className="w-16" />
      </div>

      {/* =====================================================
          PLANOS
      ===================================================== */}
      <div className="space-y-7 mt-6 max-w-2xl mx-auto w-full">

        {groupedPlans.length > 0 ? (
          groupedPlans.map((section) => (
            <section
              key={section.title}
              className="space-y-3"
            >

              {/* =================================================
                  SEPARADOR DA CATEGORIA
                  ================================================= */}
              <div
                className="
                  w-full
                  rounded-2xl
                  border border-amber-400/40
                  bg-gradient-to-r
                  from-amber-700
                  via-amber-600
                  to-amber-700
                  px-5
                  py-4
                  shadow-lg
                  shadow-amber-950/20
                  flex
                  items-center
                  justify-center
                "
              >
                <h3
                  className="
                    text-sm sm:text-base
                    font-black
                    uppercase
                    tracking-[0.14em]
                    text-white
                    font-mono
                    text-center
                    drop-shadow-sm
                  "
                >
                  {section.title}
                </h3>
              </div>

              {/* =================================================
                  CARDS DOS PLANOS
                  ================================================= */}
              <div className="grid grid-cols-1 gap-3">

                {section.plans.map((plan) => {
                  const isVariable =
                    plan.valueVariable;

                  const isVoucher =
                    normalize(plan.name).includes(
                      "VOUCHER"
                    );

                  return (
                    <button
                      key={plan.id}
                      onClick={() => onSelect(plan)}
                      className="
                        group
                        relative
                        overflow-hidden
                        w-full
                        rounded-2xl
                        border border-cyan-500/20
                        bg-[#0e364a]
                        py-4
                        px-6
                        text-left
                        hover:border-cyan-400/50
                        hover:bg-[#124158]
                        transition-all
                        duration-200
                        shadow-lg
                        shadow-cyan-950/20
                        flex
                        items-center
                        justify-between
                        cursor-pointer
                        active:scale-[0.99]
                      "
                    >

                      {/* Conteúdo */}
                      <div
                        className="
                          flex
                          items-center
                          gap-5
                          pr-4
                          flex-1
                          min-w-0
                        "
                      >
                        <div
                          className="
                            space-y-1
                            flex-1
                            min-w-0
                          "
                        >
                          <h4
                            className="
                              text-sm sm:text-base
                              font-bold
                              text-white
                              group-hover:text-cyan-200
                              transition-colors
                              tracking-wide
                              leading-snug
                            "
                          >
                            {plan.name}
                          </h4>

                          {isVariable && (
                            <p
                              className="
                                text-xs
                                text-cyan-200/70
                                font-medium
                                flex
                                items-center
                                gap-1.5
                              "
                            >
                              <span
                                className="
                                  text-cyan-300
                                  font-mono
                                "
                              >
                                {plan.valueVariableMin &&
                                plan.valueVariableMax
                                  ? `De ${plan.valueVariableMin.toLocaleString(
                                      "pt-PT"
                                    )} Kz até ${plan.valueVariableMax.toLocaleString(
                                      "pt-PT"
                                    )} Kz`
                                  : "Montante flexível configurável"}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Preço / Ação */}
                      <div
                        className="
                          text-right
                          shrink-0
                          pl-4
                        "
                      >

                        {isVariable ? (
                          <span
                            className={`
                              inline-flex
                              items-center
                              px-3.5
                              py-2
                              rounded-xl
                              text-xs
                              font-black
                              uppercase
                              font-mono
                              tracking-wider
                              shadow-md
                              active:scale-95
                              transition-transform
                              ${
                                isVoucher
                                  ? "bg-red-600 text-white"
                                  : "bg-cyan-600 text-white"
                              }
                            `}
                          >
                            {isVoucher
                              ? "Voucher"
                              : "Recargas Diretas"}
                          </span>
                        ) : (
                          <div
                            className="
                              flex
                              flex-col
                              items-end
                            "
                          >
                            <span
                              className="
                                text-[10px]
                                text-cyan-200/60
                                uppercase
                                font-mono
                              "
                            >
                              Preço
                            </span>

                            <span
                              className="
                                text-base sm:text-lg
                                font-black
                                font-mono
                                text-cyan-300
                                group-hover:text-white
                                transition-colors
                              "
                            >
                              {typeof plan.price ===
                              "number"
                                ? `${plan.price.toLocaleString(
                                    "pt-PT"
                                  )} Kz`
                                : "Ativo"}
                            </span>
                          </div>
                        )}

                      </div>
                    </button>
                  );
                })}

              </div>
            </section>
          ))
        ) : (
          <div
            className="
              text-center
              py-20
              bg-[#0e364a]
              rounded-2xl
              border border-cyan-500/20
              shadow-md
            "
          >
            <p
              className="
                text-xs
                text-cyan-200/70
                font-mono
              "
            >
              Nenhum plano disponível para este operador
              no momento.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}