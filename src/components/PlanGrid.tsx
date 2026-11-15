import { useMemo, useState } from "react";

import { useParams } from "react-router-dom";

import type { CatalogGroup, CatalogPlan } from "../types/catalog";

import {

  ShieldCheck,

  Plane,

  CarFront,

  RefreshCw,

  ChevronRight,

  FileText,

} from "lucide-react";

interface PlanGridProps {

  group: CatalogGroup;

  onSelect: (plan: CatalogPlan) => void;

}

/**

 * Logos específicos dos provedores/produtos.

 */

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

  onSelect,

}: PlanGridProps) {

  const { providerCode } = useParams<{ providerCode: string }>();

  const [insuranceSection, setInsuranceSection] = useState<

    "travel" | "auto" | "renew" | null

  >(null);

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

  const isDirectVoiceRecharge = (name: string) => {
    if (
      name.includes("SALDO VOZ") ||
      name.includes("RECARGA VOZ")
    ) return true;

    // Movicel: Recarga 100Kz, Recarga 400Kz, etc.
    if (provider === "MOVICEL") {
      return name.includes("RECARGA") && /\b\d+(?:[.,]\d+)?\s*KZ\b/.test(name);
    }

    // Africell: Africell: 200Kz, Africell: 500Kz, etc.
    if (provider === "AFRICELL") {
      return /^AFRICELL\s*:\s*\d+(?:[.,]\d+)?\s*KZ$/.test(name);
    }

    return false;
  };

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

   * REGRAS ESPECÍFICAS UNITEL

   * ============================================================

   */

  /**

   * Detecta planos internacionais pelo país/destino.

   */

  const isInternationalPlan = (name: string) => {

    const countries = [

      "NAMIBIA",

      "PORTUGAL",

      "EAU",

      "EMIRADOS ARABES UNIDOS",

      "BRASIL",

      "MOCAMBIQUE",

      "AFRICA DO SUL",

      "CONGO",

      "FRANCA",

      "INGLATERRA",

      "ESPANHA",

      "EUA",

      "ESTADOS UNIDOS"

    ];

    return countries.some((country) =>

      name.includes(normalize(country))

    );

  };

  /**

   * Detecta planos destinados a Redes Sociais.

   *

   * A regra é deliberadamente baseada no nome do produto,

   * porque a classificação deve acompanhar o catálogo da Unitel.

   */

  const isSocialNetworkPlan = (name: string) =>

    name.includes("REDES SOCIAIS") ||

    name.includes("REDES");

  /**

   * Detecta especificamente Redes Sociais do Bazza.

   *

   * Esses produtos permanecem dentro da estrutura Bazza

   * e não devem aparecer na categoria global "Redes Sociais".

   */

  const isBazzaSocialNetworkPlan = (name: string) =>

    isBazzaPlan(name) && isSocialNetworkPlan(name);

  /**

   * Detecta campanhas comerciais/promocionais.

   */

  const isCampaignPlan = (name: string) =>

    name.includes("NAVEGA TUDO") ||

    name.includes("FALA TUDO");

  /**

   * Linhas específicas dos Planos Mais.

   */

  const isMaisLevePlan = (name: string) =>

    name.includes("MAIS LEVE");

  const isMaisAgilPlan = (name: string) =>

    name.includes("MAIS AGIL");

  const isMaisLivrePlan = (name: string) =>

    name.includes("MAIS LIVRE");

  /**

   * NET AO DIA.

   *

   * Qualquer plano Unitel com MB/GB e sem minutos explícitos

   * entra nesta categoria.

   *

   * Exemplos:

   * - 400MB/1D

   * - 800MB/1D

   * - 750MB/3D

   * - 1GB/1D

   * - 1.5GB/7D

   * - Net 1.5GB/30D

   * - 2.5GB/7D

   */

  const isNetAoDiaPlan = (name: string) => {

    if (!hasDataUnit(name)) {

      return false;

    }

    const hasMinutes =

      /\b\d+\s*MIN\b/.test(name) ||

      /\b\d+\s*MINUTO/.test(name);

    return !hasMinutes;

  };

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

    const catalogGroupName = normalize(plan.catalogGroupName ?? "");

    switch (provider) {

      /**

       * =====================================================

       * UNITEL

       * =====================================================

       */

            case "UNITEL": {

        // O grupo definido no catálogo tem prioridade sobre o nome do produto.

        // Evita que produtos de dados atribuídos a Redes Sociais regressem

        // à secção NET AO DIA. Os produtos Bazza mantêm a regra própria.

        if (

          (catalogGroupName.includes("REDES SOCIAIS") ||

            catalogGroupName.includes("SOCIAL")) &&

          !isBazzaPlan(name)

        ) {

          return {

            title: "Redes Sociais",

            order: 8,

          };

        }

        /**

         * =====================================================

         * 1. RECARGAS DIRETAS

         * =====================================================

         */

        if (isDirectVoiceRecharge(name)) {

          return {

            title: "Recargas Diretas UTTs",

            order: 1,

          };

        }

        /**

         * =====================================================

         * 2. PLANOS BALA

         * =====================================================

         */

        if (name.includes("BALA")) {

          return {

            title: "Planos Bala",

            order: 2,

          };

        }

        /**

         * =====================================================

         * 3. PLANOS ÓPTIMO

         * =====================================================

         * normalize() remove os acentos, portanto OPTIMO também

         * corresponde a ÓPTIMO.

         */

        if (name.includes("OPTIMO")) {

          return {

            title: "Planos Óptimo",

            order: 3,

          };

        }

        /**

         * =====================================================

         * 4. PLANOS MAIS LEVE

         * =====================================================

         */

        if (isMaisLevePlan(name)) {

          return {

            title: "Planos Mais Leve",

            order: 4,

          };

        }

        /**

         * =====================================================

         * 5. PLANOS MAIS ÁGIL

         * =====================================================

         */

        if (isMaisAgilPlan(name)) {

          return {

            title: "Planos Mais Ágil",

            order: 5,

          };

        }

        /**

         * =====================================================

         * 6. PLANOS MAIS LIVRE

         * =====================================================

         */

        if (isMaisLivrePlan(name)) {

          return {

            title: "Planos Mais Livre",

            order: 6,

          };

        }

        /**

         * =====================================================

         * 7. PLANOS MAIS GENÉRICOS

         * =====================================================

         * Fallback para outros produtos da família MAIS que

         * não pertençam às três linhas específicas acima.

         */

        if (

          name.startsWith("UNITEL: MAIS ") ||

          name.startsWith("UNITEL MAIS ") ||

          name.startsWith("MAIS ")

        ) {

          return {

            title: "Planos Mais",

            order: 7,

          };

        }

        /**

         * =====================================================

         * 8. REDES SOCIAIS

         * =====================================================

         */

        if (

          isSocialNetworkPlan(name) &&

          !isBazzaPlan(name)

        ) {

          return {

            title: "Redes Sociais",

            order: 8,

          };

        }

        /**

         * =====================================================

         * 9. PLANOS INTERNACIONAIS

         * =====================================================

         */

        if (isInternationalPlan(name)) {

          return {

            title: "Planos Internacionais",

            order: 9,

          };

        }

        /**

         * =====================================================

         * 10. CAMPANHAS

         * =====================================================

         */

        if (isCampaignPlan(name)) {

          return {

            title: "Campanhas",

            order: 10,

          };

        }

        /**

         * =====================================================

         * 11. TELCOTV

         * =====================================================

         */

        if (

          name.includes("DSTV") ||

          name.includes("TELCOTV")

        ) {

          return {

            title: "TELCOTV",

            order: 11,

          };

        }

        /**

         * =====================================================

         * 12. BAZZA

         * =====================================================

         * Bazza pertence ao catálogo Unitel, mas permanece

         * completamente separado dos planos Unitel normais.

         */

        if (isBazzaPlan(name)) {

          /**

           * Redes Sociais Bazza permanecem dentro de

           * "Planos Bazza", separadas da categoria global

           * "Redes Sociais" da Unitel.

           */

          if (isBazzaSocialNetworkPlan(name)) {

            return {

              title: "Planos Bazza",

              order: 12,

            };

          }

          if (hasDataUnit(name)) {

            return {

              title: "Planos Bazza Dados",

              order: 13,

            };

          }

          if (hasVoiceKeyword(name)) {

            return {

              title: "Planos Bazza Voz",

              order: 12,

            };

          }

          return {

            title: "Planos Bazza",

            order: 12,

          };

        }

        /**

         * =====================================================

         * 13. RESIDENCIAL

         * =====================================================

         * NetCasa/Casa 4G/Casa 5G não deve entrar em NET AO DIA

         * mesmo possuindo MB/GB.

         */

        if (

          name.includes("CASA 4G") ||

          name.includes("CASA 5G") ||

          name.includes("NETCASA") ||

          name.includes("NET CASA")

        ) {

          return {

            title: "Residencial",

            order: 14,

          };

        }

        /**

         * =====================================================

         * 14. NET AO DIA

         * =====================================================

         * Internet Unitel com MB/GB e sem minutos explícitos.

         */

        if (isNetAoDiaPlan(name)) {

          return {

            title: "NET AO DIA",

            order: 15,

          };

        }

        /**

         * =====================================================

         * 15. VOZ

         * =====================================================

         */

        if (hasVoiceKeyword(name)) {

          return {

            title: "Planos de Voz",

            order: 16,

          };

        }

        /**

         * =====================================================

         * 16. DADOS

         * =====================================================

         * Fallback para produtos Unitel com MB/GB que não tenham

         * sido classificados em uma categoria comercial específica.

         */

        if (hasDataUnit(name)) {

          return {

            title: "Planos de Dados",

            order: 17,

          };

        }

        /**

         * =====================================================

         * 17. PLanos Extras

         * =====================================================

         */

        return {

          title: "PLanos Extras",

          order: 18,

        };

      }

      /**

       * =====================================================

       * MOVICEL

       * =====================================================

       */

      case "MOVICEL": {
        // 1. Carregamentos diretos
        if (isDirectVoiceRecharge(name)) {
          return { title: "Recargas Diretas UTTs", order: 1 };
        }

        // 2. Planos de voz + Dados
        if (
          name.includes("ADITIVO") ||
          name.includes("FLEX") ||
          name.includes("SPYKA") ||
          name.includes("VOZ KAMBA") ||
          hasVoiceKeyword(name)
        ) {
          return { title: "Planos de Voz + Dados", order: 2 };
        }

        // 3. Planos de dados
        if (
          name.includes("MOVINET") ||
          name.includes("BWE") ||
          name.includes("NOITES") ||
          hasDataUnit(name)
        ) {
          return { title: "Planos de Dados", order: 3 };
        }

        // 4. Outros pacotes
        return { title: "Outros Pacotes", order: 4 };
      }

      /**

       * =====================================================

       * AFRICELL

       * =====================================================

       */

      case "AFRICELL": {
        // 1. Carregamentos diretos
        if (isDirectVoiceRecharge(name)) {
          return { title: "Recargas Diretas UTTs", order: 1 };
        }

        // 2. Planos de voz
        if (
          name.includes("FALA TODOS") ||
          hasVoiceKeyword(name)
        ) {
          return { title: "Planos de Voz + Dados", order: 2 };
        }

        // 3. Planos de dados
        if (
          name.includes("AFRIMIX") ||
          name.includes("AFRINET") ||
          name.includes("KONEKTA") ||
          hasDataUnit(name)
        ) {
          return { title: "Planos de Dados", order: 3 };
        }

        // 4. Outros pacotes
        return { title: "Outros Pacotes", order: 4 };
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

  const isInsuranceProvider = useMemo(() => {

  const code = normalize(providerCode);

  const name = normalize(group.name);

  return (

    code.includes("STAS") ||

    name.includes("SEGURO") ||

    name.includes("SEGUROS")

  );

}, [providerCode, group.name]);

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

     * Ordena as categorias pela prioridade definida em classifyPlan().

     *

     * Categorias específicas da Unitel aparecem antes dos fallbacks

     * genéricos, mantendo a navegação do catálogo previsível.

     */

    // Ordena os preços do menor para o maior dentro de cada secção.

    // A prioridade e a ordem das secções permanecem inalteradas.

    for (const section of sections.values()) {

      section.plans.sort(

        (a, b) => Number(a.price) - Number(b.price)

      );

    }

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

   * ============================================================

   * RENDER

   * ============================================================

   */

  if (isInsuranceProvider) {

    const insurancePlans = group.plans ?? [];

    const travelPlans = insurancePlans.filter((plan) => {

      const code = normalize(plan.externalId ?? "");

      const name = normalize(plan.name ?? "");

      return code.includes("VOYAGER") || name.includes("VIAGEM");

    });

    const autoPlans = insurancePlans.filter((plan) => {

      const code = normalize(plan.externalId ?? "");

      const name = normalize(plan.name ?? "");

      return code.includes("AUTO") || name.includes("AUTO");

    });

    const selectedPlans =

      insuranceSection === "travel"

        ? travelPlans

        : insuranceSection === "auto"

          ? autoPlans

          : [];

    const categories = [

      {

        id: "travel" as const,

        title: "Viagem",

        description: "Proteção para as suas viagens",

        Icon: Plane,

      },

      {

        id: "auto" as const,

        title: "Automóvel",

        description: "Seguro para o seu veículo",

        Icon: CarFront,

      },

      {

        id: "renew" as const,

        title: "Renovar Seguros",

        description: "Consulte as opções de renovação",

        Icon: RefreshCw,

      },

    ];

    return (

      <div className="min-h-screen bg-[#0a2533] px-4 py-5 text-[#e0f2fe] sm:px-6">

        <div className="mx-auto w-full max-w-2xl">

          {!insuranceSection ? (

            <div className="space-y-3">

              <div className="mb-5">

                <h2 className="text-xl font-semibold text-white">

                  Como podemos ajudar?

                </h2>

                <p className="mt-1 text-sm leading-6 text-cyan-100/65">

                  Selecione uma opção para continuar.

                </p>

              </div>

              {categories.map(({ id, title, description, Icon }) => (

                <button

                  key={id}

                  type="button"

                  onClick={() => setInsuranceSection(id)}

                  className="group flex w-full items-center gap-4 rounded-2xl border border-cyan-500/20 bg-[#0e364a] p-4 text-left shadow-lg shadow-cyan-950/10 transition hover:border-cyan-300/50 hover:bg-[#124158] active:scale-[0.99] sm:p-5"

                >

                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 transition group-hover:bg-cyan-400/15">

                    <Icon size={27} strokeWidth={1.8} />

                  </span>

                  <span className="min-w-0 flex-1">

                    <span className="block text-base font-semibold text-white">

                      {title}

                    </span>

                    <span className="mt-1 block text-sm text-cyan-100/65">

                      {description}

                    </span>

                  </span>

                  <ChevronRight

                    size={21}

                    className="shrink-0 text-cyan-300/70 transition group-hover:translate-x-0.5 group-hover:text-cyan-200"

                  />

                </button>

              ))}

            </div>

          ) : insuranceSection === "renew" ? (

            <div className="rounded-2xl border border-cyan-500/20 bg-[#0e364a] p-6 text-center sm:p-8">

              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">

                <FileText size={30} strokeWidth={1.7} />

              </span>

              <h2 className="mt-4 text-lg font-semibold text-white">

                Renovar Seguros

              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-cyan-100/70">

                A renovação ainda não está configurada. Para evitar uma operação incorreta,

                esta opção ficará disponível quando o procedimento de renovação da STAS

                estiver integrado.

              </p>

            </div>

          ) : selectedPlans.length > 0 ? (

            <div className="space-y-3">

              <div className="mb-5">

                <h2 className="text-xl font-semibold text-white">{insuranceSection === "travel" ? "Seguro de Viagem" : "Seguro Automóvel"}</h2>

                <p className="mt-1 text-sm text-cyan-100/65">

                  Selecione o produto pretendido para continuar.

                </p>

              </div>

              {selectedPlans.map((plan) => (

                <button

                  key={plan.id}

                  type="button"

                  onClick={() => onSelect(plan)}

                  className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-cyan-500/20 bg-[#0e364a] p-4 text-left transition hover:border-cyan-300/50 hover:bg-[#124158] active:scale-[0.99] sm:p-5"

                >

                  <span className="flex min-w-0 items-center gap-3">

                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">

                      {insuranceSection === "travel" ? (

                        <Plane size={22} strokeWidth={1.8} />

                      ) : (

                        <CarFront size={22} strokeWidth={1.8} />

                      )}

                    </span>

                    <span className="min-w-0">

                      <span className="block font-semibold text-white">{plan.name}</span>

                      <span className="mt-1 block text-xs text-cyan-100/60">

                        Cotação sujeita aos dados exigidos pela seguradora

                      </span>

                    </span>

                  </span>

                  <ChevronRight size={20} className="shrink-0 text-cyan-300/70" />

                </button>

              ))}

            </div>

          ) : (

            <div className="rounded-2xl border border-cyan-500/20 bg-[#0e364a] p-6 text-center">

              <ShieldCheck size={30} className="mx-auto text-cyan-300" />

              <h2 className="mt-3 font-semibold text-white">{insuranceSection === "travel" ? "Seguro de Viagem" : "Seguro Automóvel"}</h2>

              <p className="mt-2 text-sm leading-6 text-cyan-100/70">

                Não foram encontrados produtos desta categoria no catálogo. Tente novamente

                mais tarde ou contacte o suporte.

              </p>

            </div>

          )}

        </div>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe] px-4 sm:px-6 pt-4 pb-28 antialiased selection:bg-cyan-500/20">

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

                  const isInsurancePlan =

                   isInsuranceProvider ||

                    normalize(plan.name).includes("SEGURO");

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

                          {isInsurancePlan ? (

                           <p className="text-xs text-amber-300 font-medium">

                             Seguro disponível para simulação

                            </p>

                         ) : isVariable ? (

                          <p className="text-xs text-cyan-200/70 font-medium">

                           <span className="text-cyan-300 font-mono">

                             {plan.valueVariableMin && plan.valueVariableMax

                               ? `De ${plan.valueVariableMin.toLocaleString(

                                  "pt-PT"

                                )} Kz até ${plan.valueVariableMax.toLocaleString(

                                  "pt-PT"

                                )} Kz`

                              : "Montante flexível configurável"}

                          </span>

                        </p>

                      ) : null}

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

                        {isInsurancePlan ? (

                     <span className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-black uppercase font-mono tracking-wider bg-amber-600 text-white">

                       Seguro

                      </span>

                    ) : isVariable ? (

                   <span

                  className={`inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-black uppercase font-mono tracking-wider shadow-md ${

                    isVoucher

                      ? "bg-red-600 text-white"

                      : "bg-cyan-600 text-white"

                  }`}

                  >

                    {isVoucher ? "Voucher" : "Recargas Diretas"}

                 </span>

                 ) : (

                  <div className="flex flex-col items-end">

                <span className="text-[10px] text-cyan-200/60 uppercase font-mono">

                  Preço

                 </span>

               <span className="text-base sm:text-lg font-black font-mono text-cyan-300">

                 {typeof plan.price === "number"

                    ? `${plan.price.toLocaleString("pt-PT")} Kz`

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
