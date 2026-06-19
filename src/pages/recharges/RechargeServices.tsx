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
      return { icon: Smartphone, color: "text-orange-600 bg-orange-50 border-orange-200" };
    }
    if (lowercaseName.includes("tv") || lowercaseName.includes("dstv") || lowercaseName.includes("zap tv") || lowercaseName.includes("gostv")) {
      return { icon: Tv, color: "text-rose-600 bg-rose-50 border-rose-200" };
    }
    if (lowercaseName.includes("internet") || lowercaseName.includes("netone") || lowercaseName.includes("zap fibra")) {
      return { icon: Wifi, color: "text-blue-600 bg-blue-50 border-blue-200" };
    }
    if (lowercaseName.includes("ende") || lowercaseName.includes("energia") || lowercaseName.includes("luz")) {
      return { icon: Zap, color: "text-yellow-700 bg-yellow-50 border-yellow-200" };
    }
    return { icon: Globe, color: "text-gray-700 bg-gray-50 border-gray-200" };
  }

  return (
    <div className="min-h-screen bg-[#F2F4F7] text-[#111827] pb-28 antialiased">
      
      {/* HEADER FIXO COM BOTÃO "MINHAS RECARGAS" NO CANTO SUPERIOR DIREITO */}
      <div className="px-6 pt-8 pb-5 flex items-center justify-between border-b border-[#D1D5DB] bg-[#F2F4F7]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-xl bg-[#FCFCFD] border border-[#E4E7EB] text-gray-800 hover:bg-gray-50 transition-all duration-200 shadow-sm"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight text-gray-950">Recargas</h1>
            <p className="text-xs text-gray-600 font-medium mt-0.5">
              Escolha um serviço para prosseguir
            </p>
          </div>
        </div>

        {/* BOTÃO PROFISSIONAL - HISTÓRICO DE RECARGAS */}
        <button
          onClick={() => navigate("/my-recharges")}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FCFCFD] border border-[#E4E7EB] text-xs font-black text-gray-900 uppercase tracking-wider hover:bg-gray-50 hover:border-emerald-300 transition-all duration-200 shadow-sm group shrink-0"
        >
          <History size={14} className="text-gray-600 group-hover:text-emerald-700 transition-colors stroke-[2.5px]" />
          <span className="hidden xs:inline">Minhas Recargas</span>
        </button>
      </div>

      {/* CONTEÚDO PRINCIPAL (DADOS OU SKELETON) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
        {loading ? (
          /* SKELETON LOADER ANIMADO - ALTO CONTRASTE */
          Array.from({ length: 4 }).map((_, index) => (
            <div 
              key={index} 
              className="bg-[#FCFCFD] border border-[#E4E7EB] rounded-2xl p-4 flex items-center justify-between animate-pulse"
            >
              <div className="flex items-center gap-4 w-full">
                {/* Quadrado do ícone */}
                <div className="w-12 h-12 rounded-xl bg-gray-200" />
                {/* Linhas de texto simuladas */}
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
              {/* Seta simulada */}
              <div className="w-4 h-4 bg-gray-200 rounded-full" />
            </div>
          ))
        ) : (
          /* EXIBIÇÃO REAL DOS SERVIÇOS COM MÁXIMA LEITURA */
          services.map((service) => {
            const { icon: Icon, color: iconStyle } = getServiceIcon(service.name);

            return (
              <button
                key={service.id}
                onClick={() => navigate(`/recharges/${service.id}`)}
                className="group bg-[#FCFCFD] border border-[#E4E7EB] rounded-2xl p-4 flex items-center justify-between transition-all duration-200 hover:bg-gray-50 hover:border-emerald-300 text-left shadow-sm"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-200 ${iconStyle}`}>
                    <Icon size={20} />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <span className="block text-sm font-black text-gray-950 group-hover:text-emerald-700 transition-colors truncate tracking-tight">
                      {service.name}
                    </span>
                    <span className="inline-block text-[9px] text-gray-700 font-mono font-black tracking-wider uppercase bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded">
                      CÓDIGO: #{service.id.toString().padStart(3, '0')}
                    </span>
                  </div>
                </div>

                <div className="p-1 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all duration-200 shrink-0">
                  <ChevronRight size={16} className="stroke-[3px]" />
                </div>
              </button>
            );
          })
        )}
      </div>

      {!loading && services.length === 0 && (
        <div className="text-center py-12 text-xs text-gray-600 font-mono font-bold tracking-wide">
          Nenhum serviço disponível de momento.
        </div>
      )}
    </div>
  );
}