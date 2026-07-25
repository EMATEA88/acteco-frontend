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

      const data =
        await serviceService.listCategories();

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

    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] pb-28">

      <div className="px-6 pt-8 pb-5 border-b border-white/5">

        <h1 className="text-xl font-bold">
          Serviços
        </h1>

        <p className="text-sm text-gray-400">
          Escolha uma categoria
        </p>

      </div>

      <div className="p-6 space-y-4">

        {loading ? (

          <div className="text-center">
            Carregando...
          </div>

        ) : (

          categories.map(category => {

            const Icon =
              getIcon(category.id);

            return (

              <button
                key={category.id}
                onClick={() =>
                  navigate(
                    `/recharges/categories/${category.id}/operators`
                  )
                }
                className="w-full bg-[#161A1E] rounded-2xl p-5 flex items-center justify-between hover:bg-[#1D232A] transition"
              >

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">

                    <Icon
                      size={22}
                      className="text-emerald-400"
                    />

                  </div>

                  <span className="font-semibold">
                    {category.name}
                  </span>

                </div>

                <ChevronRight
                  size={18}
                  className="text-gray-500"
                />

              </button>

            );

          })

        )}

      </div>

    </div>

  );

}