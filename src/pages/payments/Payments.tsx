import { useNavigate } from "react-router-dom";
import { 
  Zap, 
  Droplet, 
  Wallet, 
  CreditCard, 
  ArrowLeft, 
  ChevronRight,
  HelpCircle 
} from "lucide-react";

const payments = [
  {
    id: 1,
    name: "ENDE",
  },
  {
    id: 2,
    name: "EPAL",
  },
  {
    id: 3,
    name: "UNITEL MONEY",
  },
  {
    id: 4,
    name: "MULTICAIXA",
  },
];

export default function Payments() {
  const navigate = useNavigate();

  // Mapeamento de ícones específicos para pagamentos de Angola sobre o estilo escuro
  function getPaymentIcon(name: string) {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes("ende")) {
      return { icon: Zap, color: "text-yellow-400 bg-yellow-500/5 border-yellow-500/10" };
    }
    if (lowercaseName.includes("epal")) {
      return { icon: Droplet, color: "text-blue-400 bg-blue-500/5 border-blue-500/10" };
    }
    if (lowercaseName.includes("unitel money")) {
      return { icon: Wallet, color: "text-orange-400 bg-orange-500/5 border-orange-500/10" };
    }
    if (lowercaseName.includes("multicaixa")) {
      return { icon: CreditCard, color: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10" };
    }
    return { icon: HelpCircle, color: "text-gray-400 bg-white/[0.02] border-white/[0.05]" };
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white pb-24 antialiased selection:bg-white/10">
      
      {/* HEADER NO ESTILO CRYPTO DA PLATAFORMA */}
      <div className="px-6 pt-8 pb-5 flex items-center gap-4 border-b border-white/[0.04] bg-[#0B0E11]/90 backdrop-blur-md sticky top-0 z-50">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-xl bg-[#181A20] border border-white/[0.05] hover:bg-[#1E2329] text-gray-400 hover:text-white transition-all duration-200"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Pagamentos</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Escolha um serviço para prosseguir
          </p>
        </div>
      </div>

      {/* GRID PADRÃO DE PRODUTOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-6">
        {payments.map((payment) => {
          const { icon: Icon, color: iconStyle } = getPaymentIcon(payment.name);

          return (
            <button
              key={payment.id}
              onClick={() => navigate(`/payments/${payment.id}`)}
              className="group bg-[#181A20] border border-white/[0.05] rounded-2xl p-4 flex items-center justify-between transition-all duration-200 hover:bg-[#1E2329] hover:border-white/10 text-left shadow-xl"
            >
              <div className="flex items-center gap-4">
                {/* CONTAINER DO ÍCONE PROFISSIONAL */}
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-transform duration-200 ${iconStyle}`}>
                  <Icon size={20} />
                </div>

                <div className="space-y-0.5">
                  <span className="block text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                    {payment.name}
                  </span>
                  <span className="block text-[10px] text-gray-500 font-mono tracking-wider">
                    CÓDIGO: #{payment.id.toString().padStart(3, '0')}
                  </span>
                </div>
              </div>

              {/* SETA MINIMALISTA DE NAVEGAÇÃO */}
              <div className="p-1 text-gray-600 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all duration-200">
                <ChevronRight size={16} />
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
}