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
    <div className="max-w-5xl mx-auto px-5 pt-4 pb-24">
      {/* TÍTULO CENTRALIZADO */}
      <div className="text-center mb-6">
        <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
          Escolha uma categoria
        </p>
      </div>

      {/* GRELHA COM CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
        {categories.map(category => {
          const categoryImage = getCategoryAsset(category.name);

          return (
            <button
              key={category.id}
              onClick={() => onSelect(category)}
              className="
                group
                bg-[#12161C]
                border
                border-white/[0.06]
                rounded-2xl
                p-5
                transition-all
                duration-200
                hover:border-[#02C076]
                hover:bg-[#161b22]
                flex
                flex-col
                items-center
                justify-center
                cursor-pointer
              "
            >
              {/* Imagem do Setor com Tamanho Aumentado */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center overflow-hidden rounded-2xl mb-3.5 bg-[#0B0E11]/50 border border-white/[0.04]">
                {categoryImage ? (
                  <img
                    src={categoryImage}
                    alt={category.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain transition-transform duration-200 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-[#0B0E11] flex items-center justify-center">
                    <span className="text-white text-[11px] text-center px-1 font-semibold">
                      {category.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Nome do Serviço / Categoria */}
              <div className="text-center w-full">
                <h2 className="text-white font-medium text-xs sm:text-sm group-hover:text-[#02C076] transition-colors truncate">
                  {category.name}
                </h2>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}