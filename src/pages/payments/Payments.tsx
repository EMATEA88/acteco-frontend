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

  // Mapeamento de ícones e cores de alto contraste calibradas para o modo claro
  function getPaymentIcon(name: string) {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes("ende")) {
      return { icon: Zap, color: "text-yellow-700 bg-yellow-50 border-yellow-200" };
    }
    if (lowercaseName.includes("epal")) {
      return { icon: Droplet, color: "text-blue-600 bg-blue-50 border-blue-200" };
    }
    if (lowercaseName.includes("unitel money")) {
      return { icon: Wallet, color: "text-orange-600 bg-orange-50 border-orange-200" };
    }
    if (lowercaseName.includes("multicaixa")) {
      return { icon: CreditCard, color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    }
    return { icon: HelpCircle, color: "text-gray-700 bg-gray-50 border-gray-200" };
  }

  return (
    <div className="min-h-screen bg-[#F2F4F7] text-[#111827] pb-28 antialiased">
      
      {/* HEADER FIXO - ALTO CONTRASTE */}
      <div className="px-6 pt-8 pb-5 flex items-center gap-4 border-b border-[#D1D5DB] bg-[#F2F4F7]/80 backdrop-blur-md sticky top-0 z-50">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-xl bg-[#FCFCFD] border border-[#E4E7EB] text-gray-800 hover:bg-gray-50 transition-all duration-200 shadow-sm"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-black tracking-tight text-gray-950">Pagamentos</h1>
          <p className="text-xs text-gray-600 font-medium mt-0.5">
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
              className="group bg-[#FCFCFD] border border-[#E4E7EB] rounded-2xl p-4 flex items-center justify-between transition-all duration-200 hover:bg-gray-50 hover:border-emerald-300 text-left shadow-sm"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* CONTAINER DO ÍCONE PROFISSIONAL */}
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-200 ${iconStyle}`}>
                  <Icon size={20} />
                </div>

                <div className="space-y-1 min-w-0">
                  <span className="block text-sm font-black text-gray-950 group-hover:text-emerald-700 transition-colors truncate tracking-tight">
                    {payment.name}
                  </span>
                  <span className="inline-block text-[9px] text-gray-700 font-mono font-black tracking-wider uppercase bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded">
                    CÓDIGO: #{payment.id.toString().padStart(3, '0')}
                  </span>
                </div>
              </div>

              {/* SETA MINIMALISTA DE NAVEGAÇÃO */}
              <div className="p-1 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all duration-200 shrink-0">
                <ChevronRight size={16} className="stroke-[3px]" />
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
}