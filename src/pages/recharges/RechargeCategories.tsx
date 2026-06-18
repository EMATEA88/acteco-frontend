import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { ServiceService } from "../../services/service.service";

interface ServiceGroup {
  id: number;
  name: string;
}

export default function RechargeCategories() {
  const navigate = useNavigate();

  const { serviceId } = useParams();

  const [groups, setGroups] = useState<ServiceGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (serviceId) {
      loadGroups();
    }
  }, [serviceId]);

  async function loadGroups() {
    try {
      const data = await ServiceService.listGroups(
        Number(serviceId)
      );

      setGroups(data);
    } catch (error) {
      console.error(error);

      toast.error(
        "Erro ao carregar categorias"
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] text-white flex items-center justify-center">
        Carregando categorias...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white pb-24">

      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold">
          Categorias
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Escolha uma categoria
        </p>
      </div>

      <div className="p-4 space-y-4">

        {groups.length === 0 && (
          <div
            className="
              bg-[#1A1D23]
              border border-[#2B3139]
              rounded-2xl
              p-6
              text-center
              text-gray-400
            "
          >
            Nenhuma categoria encontrada
          </div>
        )}

        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() =>
              navigate(
                `/recharges/${serviceId}/categories/${group.id}`
              )
            }
            className="
              w-full
              bg-[#1A1D23]
              border border-[#2B3139]
              rounded-2xl
              p-5
              text-left
              hover:border-green-500
              transition
            "
          >
            <h3 className="font-semibold text-lg">
              {group.name}
            </h3>
          </button>
        ))}

      </div>

    </div>
  );
}