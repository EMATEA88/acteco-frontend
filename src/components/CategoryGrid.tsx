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
    <div className="max-w-6xl mx-auto px-4 pb-24">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white">
          Recargas
        </h1>
        <p className="mt-2 text-gray-400">
          Escolha uma categoria
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
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
                border-[#232A33]
                rounded-3xl
                p-5
                transition-all
                duration-300
                hover:border-emerald-500
                hover:bg-[#171C22]
                hover:-translate-y-1
                flex
                flex-col
                items-center
                justify-between
              "
            >
              {/* Imagem do Setor */}
              <div className="w-full flex items-center justify-center overflow-hidden rounded-2xl mb-4">
                {categoryImage ? (
                  <img
                    src={categoryImage}
                    alt={category.name}
                    className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-20 h-20 bg-[#0B0E11] border border-[#30363d] rounded-2xl flex items-center justify-center">
                    <span className="text-white text-xs text-center px-1">
                      {category.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Apenas o Nome do Serviço / Categoria */}
              <div className="text-center w-full">
                <h2 className="text-white font-semibold text-sm sm:text-base group-hover:text-emerald-400 transition-colors">
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