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
    <div className="h-screen w-screen overflow-hidden bg-[#0B0E11] text-[#EAECEF] flex flex-col fixed inset-0 font-sans antialiased selection:bg-[#02C076]/25">

      {/* HEADER FIXO NO TOPO */}
      <div className="px-6 py-5 border-b border-white/[0.05] bg-[#0B0E11] shrink-0 z-50">
        <h1 className="text-xl font-bold tracking-tight text-white">
          Serviços
        </h1>
        <p className="text-xs text-gray-400 mt-0.5 tracking-wide">
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
                className="w-full bg-[#161A1E] border border-white/[0.02] rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1E2329] border border-[#2B313A]"></div>
                  <div className="w-32 h-3.5 bg-[#1E2329] rounded-md"></div>
                </div>
                <div className="w-5 h-5 rounded-md bg-[#1E2329]"></div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-xs font-mono">
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
                className="w-full bg-[#161A1E] rounded-2xl p-4 flex items-center justify-between hover:bg-[#1D232A] border border-white/[0.02] hover:border-emerald-500/30 transition-all shadow-lg cursor-pointer group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Icon
                      size={22}
                      className="text-emerald-400"
                    />
                  </div>

                  <span className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                    {category.name}
                  </span>
                </div>

                <ChevronRight
                  size={18}
                  className="text-gray-500 group-hover:text-white transition-colors shrink-0"
                />
              </button>
            );
          })
        )}
      </div>

    </div>
  );
}