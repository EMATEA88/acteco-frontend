import type { CatalogCategory } from "../types/catalog";

// Importação direta das imagens dos setores/categorias solicitadas
import telecomImage from "../assets/recharges/telecomunicacao.png";
import tvImage from "../assets/recharges/televisao.png";
import apostasImage from "../assets/recharges/apostas.png";
import parceirosImage from "../assets/recharges/parceiros.png";
import internacionaisImage from "../assets/recharges/internacionais.png";
import servicosImage from "../assets/recharges/servicos.png";

interface CategoryGridProps {
  categories: CatalogCategory[];
  onSelect: (category: CatalogCategory) => void;
}

export default function CategoryGrid({
  categories,
  onSelect
}: CategoryGridProps) {
  // Função auxiliar para mapear o nome da categoria para a imagem correspondente
  const getCategoryAsset = (categoryName: string) => {
    if (!categoryName) return null;
    
    const normalized = categoryName
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (normalized.includes("TELECOM") || normalized.includes("MOVEL")) {
      return telecomImage;
    }
    if (normalized.includes("TELEVISAO") || normalized.includes("TV")) {
      return tvImage;
    }
    if (normalized.includes("JOGOS") || normalized.includes("APOSTA")) {
      return apostasImage;
    }
    if (normalized.includes("PARCEIRO")) {
      return parceirosImage;
    }
    if (normalized.includes("INTERNACIONAL") || normalized.includes("PAGAMENTOS INTERNACIONAIS")) {
      return internacionaisImage;
    }
    if (normalized.includes("PUBLICO") || normalized.includes("SERVICOS")) {
      return servicosImage;
    }
    return null;
  };

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-[#0a2533] text-[#e0f2fe] flex flex-col justify-center items-center px-5 font-sans antialiased selection:bg-cyan-500/25 z-50">
      
      {/* CONTAINER CENTRALIZADO SEM SCROLL */}
      <div className="max-w-4xl w-full flex flex-col justify-center h-full py-6">
        
        {/* TÍTULO CENTRALIZADO */}
        <div className="text-center mb-6 shrink-0">
          <p className="text-xs font-semibold text-cyan-200/70 tracking-wider uppercase">
            Escolha uma categoria
          </p>
        </div>

        {/* GRELHA COM CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 w-full">
          {categories.map(category => {
            const categoryImage = getCategoryAsset(category.name);

            return (
              <button
                key={category.id}
                onClick={() => onSelect(category)}
                className="
                  group
                  bg-[#0e364a]
                  border
                  border-cyan-500/20
                  rounded-2xl
                  p-4
                  transition-all
                  duration-200
                  hover:border-cyan-400/50
                  hover:bg-[#124158]
                  flex
                  flex-col
                  items-center
                  justify-center
                  cursor-pointer
                  shrink-0
                  shadow-lg
                  shadow-cyan-950/20
                "
              >
                {/* Imagem do Setor */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center overflow-hidden rounded-xl mb-3 bg-[#144863] border border-cyan-500/30 shrink-0 shadow-sm">
                  {categoryImage ? (
                    <img
                      src={categoryImage}
                      alt={category.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-contain transition-transform duration-200 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#144863] flex items-center justify-center">
                      <span className="text-white text-[11px] text-center px-1 font-semibold">
                        {category.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Nome do Serviço / Categoria */}
                <div className="text-center w-full">
                  <h2 className="text-white font-medium text-xs sm:text-sm group-hover:text-cyan-200 transition-colors truncate">
                    {category.name}
                  </h2>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}