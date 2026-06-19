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

  // Mapeamento de ícones e cores calibradas para o NOVO PADRÃO ESCURO PREMIUM
  function getPaymentIcon(name: string) {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes("ende")) {
      return { icon: Zap, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    }
    if (lowercaseName.includes("epal")) {
      return { icon: Droplet, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
    }
    if (lowercaseName.includes("unitel money")) {
      return { icon: Wallet, color: "text-orange-400 bg-orange-500/10 border-orange-500/20" };
    }
    if (lowercaseName.includes("multicaixa")) {
      return { icon: CreditCard, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    }
    return { icon: HelpCircle, color: "text-gray-400 bg-white/[0.04] border-white/[0.05]" };
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] pb-28 antialiased">
      
      {/* HEADER FIXO - ADAPTADO PARA MODO ESCURO */}
      <div className="px-6 pt-8 pb-5 flex items-center gap-4 border-b border-white/[0.05] bg-[#0B0E11]/90 backdrop-blur-md sticky top-0 z-50">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-gray-300 hover:bg-white/[0.08] transition-all duration-200 shadow-sm"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-black tracking-tight text-white">Pagamentos</h1>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Escolha um serviço para prosseguir
          </p>
        </div>
      </div>

      {/* GRID PADRÃO DE PRODUTOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
        {payments.map((payment) => {
          const { icon: Icon, color: iconStyle } = getPaymentIcon(payment.name);

          return (
            <button
              key={payment.id}
              onClick={() => navigate(`/payments/${payment.id}`)}
              className="group bg-[#161A1E] border border-white/[0.03] rounded-2xl p-4 flex items-center justify-between transition-all duration-200 hover:bg-[#1c2127] hover:border-blue-500/30 text-left shadow-lg"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* CONTAINER DO ÍCONE PROFISSIONAL */}
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${iconStyle}`}>
                  <Icon size={20} />
                </div>

                <div className="space-y-1 min-w-0">
                  <span className="block text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate tracking-tight">
                    {payment.name}
                  </span>
                  <span className="inline-block text-[9px] text-gray-400 font-mono font-black tracking-wider uppercase bg-white/[0.04] border border-white/[0.05] px-1.5 py-0.5 rounded">
                    CÓDIGO: #{payment.id.toString().padStart(3, '0')}
                  </span>
                </div>
              </div>

              {/* SETA MINIMALISTA DE NAVEGAÇÃO */}
              <div className="p-1 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0">
                <ChevronRight size={16} className="stroke-[3px]" />
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
}