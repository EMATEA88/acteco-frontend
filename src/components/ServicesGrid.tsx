import { CATEGORIES, type Category } from '../config/categories';

interface ServicesGridProps {
  onSelectCategory: (category: Category) => void;
}

export default function ServicesGrid({ onSelectCategory }: ServicesGridProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Serviços EMATEA</h1>
        <p className="text-sm text-gray-400 mt-1">Escolha uma categoria para começar</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category)}
            className="bg-[#12161C] border border-[#1E2329] hover:border-blue-500/50 hover:bg-[#1A1F24] p-5 rounded-2xl text-left transition-all group flex flex-col justify-between h-36 shadow-sm"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-3xl p-2.5 bg-gray-900/60 rounded-xl border border-gray-800/80 group-hover:scale-110 transition-transform">
                {category.icon}
              </span>
              <span className="text-xs text-gray-500 group-hover:text-blue-400 transition-colors font-medium">
                Aceder &rarr;
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-200 group-hover:text-white text-base">
                {category.name}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                {category.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}