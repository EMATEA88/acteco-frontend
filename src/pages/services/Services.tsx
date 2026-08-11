import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Smartphone,
  Tv,
  Lightbulb,
  Globe,
  Gamepad2,
  ChevronRight,
} from "lucide-react";

import serviceService from "../../services/service.service";

type ServiceCategory = {
  id: string;
  name: string;
};

export default function Services() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await serviceService.listCategories();
      setCategories(data);
    } catch {
      toast.error("Erro ao carregar categorias.");
    } finally {
      setLoading(false);
    }
  }

  function getIcon(id: string) {
    switch (id) {
      case "TELECOM":
        return Smartphone;

      case "TV":
        return Tv;

      case "ENERGY":
      case "WATER":
        return Lightbulb;

      case "BETTING":
        return Gamepad2;

      default:
        return Globe;
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0a2533] text-[#e0f2fe] flex flex-col fixed inset-0 font-sans antialiased selection:bg-cyan-500/25">

      {/* HEADER FIXO NO TOPO */}
      <div className="px-6 py-5 border-b border-cyan-500/10 bg-[#0a2533] shrink-0 z-50">
        <h1 className="text-xl font-bold tracking-tight text-white">
          Serviços
        </h1>
        <p className="text-xs text-cyan-200/70 mt-0.5 tracking-wide">
          Escolha uma categoria
        </p>
      </div>

      {/* CONTEÚDO SEM SCROLL (ESTÁTICO) */}
      <div className="flex-1 overflow-hidden p-6 flex flex-col justify-center space-y-3 max-w-2xl mx-auto w-full">
        {loading ? (
          /* SKELETON LOADER MODERNO E PROFISSIONAL */
          <div className="space-y-3 animate-pulse w-full">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-full bg-[#0e364a] border border-cyan-500/20 rounded-2xl p-4 flex items-center justify-between shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#144863] border border-cyan-500/30"></div>
                  <div className="w-32 h-3.5 bg-[#144863] rounded-md"></div>
                </div>
                <div className="w-5 h-5 rounded-md bg-[#144863]"></div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-cyan-200/70 text-xs font-mono">
            Nenhuma categoria disponível no momento.
          </div>
        ) : (
          categories.map((category) => {
            const Icon = getIcon(category.id);

            return (
              <button
                key={category.id}
                onClick={() =>
                  navigate(
                    `/recharges/categories/${category.id}/operators`
                  )
                }
                className="w-full bg-[#0e364a] rounded-2xl p-4 flex items-center justify-between hover:bg-[#124158] border border-cyan-500/20 hover:border-cyan-400/50 transition-all shadow-lg shadow-cyan-950/20 cursor-pointer group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#144863] border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-sm">
                    <Icon
                      size={22}
                      className="text-cyan-300"
                    />
                  </div>

                  <span className="font-semibold text-white group-hover:text-cyan-200 transition-colors">
                    {category.name}
                  </span>
                </div>

                <ChevronRight
                  size={18}
                  className="text-cyan-300/60 group-hover:text-white transition-colors shrink-0"
                />
              </button>
            );
          })
        )}
      </div>

    </div>
  );
}