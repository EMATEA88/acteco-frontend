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
  ChevronRight,
  History 
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
      return { icon: Smartphone, color: "text-orange-400 bg-orange-500/10 border-orange-500/20" };
    }
    if (lowercaseName.includes("tv") || lowercaseName.includes("dstv") || lowercaseName.includes("zap tv") || lowercaseName.includes("gostv")) {
      return { icon: Tv, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
    }
    if (lowercaseName.includes("internet") || lowercaseName.includes("netone") || lowercaseName.includes("zap fibra")) {
      return { icon: Wifi, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
    }
    if (lowercaseName.includes("ende") || lowercaseName.includes("energia") || lowercaseName.includes("luz")) {
      return { icon: Zap, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    }
    return { icon: Globe, color: "text-gray-400 bg-white/[0.04] border-white/[0.05]" };
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] pb-28 antialiased">
      
      {/* HEADER FIXO - ADAPTADO PARA DARK MODE */}
      <div className="px-6 pt-8 pb-5 flex items-center justify-between border-b border-white/[0.05] bg-[#0B0E11]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-gray-300 hover:bg-white/[0.08] transition-all duration-200 shadow-sm"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">Recargas</h1>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Escolha um serviço para prosseguir
            </p>
          </div>
        </div>

        {/* BOTÃO PREMIUM - HISTÓRICO DE RECARGAS */}
        <button
          onClick={() => navigate("/my-recharges")}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-xs font-bold text-white uppercase tracking-wider hover:bg-white/[0.08] hover:border-blue-500/30 transition-all duration-200 shadow-sm group shrink-0"
        >
          <History size={14} className="text-gray-400 group-hover:text-blue-400 transition-colors stroke-[2.5px]" />
          <span className="hidden xs:inline">Minhas Recargas</span>
        </button>
      </div>

      {/* CONTEÚDO PRINCIPAL (DADOS OU SKELETON) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
        {loading ? (
          /* SKELETON LOADER ANIMADO - DARK MODE */
          Array.from({ length: 4 }).map((_, index) => (
            <div 
              key={index} 
              className="bg-[#161A1E] border border-white/[0.03] rounded-2xl p-4 flex items-center justify-between animate-pulse"
            >
              <div className="flex items-center gap-4 w-full">
                {/* Quadrado do ícone */}
                <div className="w-12 h-12 rounded-xl bg-gray-800" />
                {/* Linhas de texto simuladas */}
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-800 rounded w-1/2" />
                  <div className="h-3 bg-gray-800/50 rounded w-1/3" />
                </div>
              </div>
              {/* Seta simulada */}
              <div className="w-4 h-4 bg-gray-800 rounded-full" />
            </div>
          ))
        ) : (
          /* EXIBIÇÃO REAL DOS SERVIÇOS */
          services.map((service) => {
            const { icon: Icon, color: iconStyle } = getServiceIcon(service.name);

            return (
              <button
                key={service.id}
                onClick={() => navigate(`/recharges/${service.id}`)}
                className="group bg-[#161A1E] border border-white/[0.03] rounded-2xl p-4 flex items-center justify-between transition-all duration-200 hover:bg-[#1c2127] hover:border-blue-500/30 text-left shadow-lg"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${iconStyle}`}>
                    <Icon size={20} />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <span className="block text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate tracking-tight">
                      {service.name}
                    </span>
                    <span className="inline-block text-[9px] text-gray-400 font-mono font-black tracking-wider uppercase bg-white/[0.04] border border-white/[0.05] px-1.5 py-0.5 rounded">
                      CÓDIGO: #{service.id.toString().padStart(3, '0')}
                    </span>
                  </div>
                </div>

                <div className="p-1 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0">
                  <ChevronRight size={16} className="stroke-[3px]" />
                </div>
              </button>
            );
          })
        )}
      </div>

      {!loading && services.length === 0 && (
        <div className="text-center py-12 text-xs text-gray-400 font-mono font-bold tracking-wide">
          Nenhum serviço disponível de momento.
        </div>
      )}
    </div>
  );
}