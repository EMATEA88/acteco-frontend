import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ServiceService } from "../../services/service.service";
import { 
  Zap, 
  Smartphone, 
  Tv, 
  Wifi, 
  Globe, 
  ArrowLeft,
  ChevronRight 
} from "lucide-react";
import toast from "react-hot-toast";

interface Service {
  id: number;
  name: string;
}

export default function RechargeServices() {
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const data = await ServiceService.listServices();
      setServices(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar serviços");
    } finally {
      setLoading(false);
    }
  }

  function getServiceIcon(name: string) {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes("unitel") || lowercaseName.includes("movicel") || lowercaseName.includes("africell") || lowercaseName.includes("móvel") || lowercaseName.includes("telefone")) {
      return { icon: Smartphone, color: "text-orange-400 bg-orange-500/5 border-orange-500/10" };
    }
    if (lowercaseName.includes("tv") || lowercaseName.includes("dstv") || lowercaseName.includes("zap tv") || lowercaseName.includes("gostv")) {
      return { icon: Tv, color: "text-rose-400 bg-rose-500/5 border-rose-500/10" };
    }
    if (lowercaseName.includes("internet") || lowercaseName.includes("netone") || lowercaseName.includes("zap fibra")) {
      return { icon: Wifi, color: "text-blue-400 bg-blue-500/5 border-blue-500/10" };
    }
    if (lowercaseName.includes("ende") || lowercaseName.includes("energia") || lowercaseName.includes("luz")) {
      return { icon: Zap, color: "text-yellow-400 bg-yellow-500/5 border-yellow-500/10" };
    }
    return { icon: Globe, color: "text-gray-400 bg-white/[0.02] border-white/[0.05]" };
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white pb-24 antialiased selection:bg-white/10">
      
      {/* HEADER FIXO NO ESTILO CRYPTO-EXCHANGE */}
      <div className="px-6 pt-8 pb-5 flex items-center gap-4 border-b border-white/[0.04] bg-[#0B0E11]/90 backdrop-blur-md sticky top-0 z-50">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-xl bg-[#181A20] border border-white/[0.05] hover:bg-[#1E2329] text-gray-400 hover:text-white transition-all duration-200"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Recargas</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Escolha um serviço para prosseguir
          </p>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL (DADOS OU SKELETON) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-6">
        {loading ? (
          // SKELETON LOADER ANIMADO (ESTILO BINANCE)
          Array.from({ length: 4 }).map((_, index) => (
            <div 
              key={index} 
              className="bg-[#181A20] border border-white/[0.03] rounded-2xl p-4 flex items-center justify-between animate-pulse"
            >
              <div className="flex items-center gap-4 w-full">
                {/* Quadrado do ícone */}
                <div className="w-12 h-12 rounded-xl bg-white/[0.03]" />
                {/* Linhas de texto simuladas */}
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/[0.05] rounded w-1/2" />
                  <div className="h-3 bg-white/[0.02] rounded w-1/3" />
                </div>
              </div>
              {/* Seta simulada */}
              <div className="w-4 h-4 bg-white/[0.03] rounded-full" />
            </div>
          ))
        ) : (
          // EXIBIÇÃO REAL DOS SERVIÇOS APÓS O CARREGAMENTO
          services.map((service) => {
            const { icon: Icon, color: iconStyle } = getServiceIcon(service.name);

            return (
              <button
                key={service.id}
                onClick={() => navigate(`/recharges/${service.id}`)}
                className="group bg-[#181A20] border border-white/[0.05] rounded-2xl p-4 flex items-center justify-between transition-all duration-200 hover:bg-[#1E2329] hover:border-white/10 text-left shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-transform duration-200 ${iconStyle}`}>
                    <Icon size={20} />
                  </div>

                  <div className="space-y-0.5">
                    <span className="block text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                      {service.name}
                    </span>
                    <span className="block text-[10px] text-gray-500 font-mono tracking-wider">
                      CÓDIGO: #{service.id.toString().padStart(3, '0')}
                    </span>
                  </div>
                </div>

                <div className="p-1 text-gray-600 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all duration-200">
                  <ChevronRight size={16} />
                </div>
              </button>
            );
          })
        )}
      </div>

      {!loading && services.length === 0 && (
        <div className="text-center py-12 text-xs text-gray-500 font-mono">
          Nenhum serviço disponível de momento.
        </div>
      )}
    </div>
  );
}