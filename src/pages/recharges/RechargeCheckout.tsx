import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CreditCard, User, Hash } from "lucide-react";
import toast from "react-hot-toast";

import { ServiceService } from "../../services/service.service";
import { serviceRequestService } from "../../services/serviceRequest.service";

interface Plan {
  id: number;
  name: string;
  price: number;
  serviceGroup: {
    name: string;
    service: {
      name: string;
    };
  };
}

export default function RechargeCheckout() {
  const navigate = useNavigate();
  const { planId } = useParams();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [loading, setLoading] = useState(false);
  const [customerReference, setCustomerReference] = useState("");

  useEffect(() => {
    loadPlan();
  }, [planId]);

  async function loadPlan() {
    try {
      if (!planId) return;
      const data = await ServiceService.getPlan(Number(planId));
      setPlan(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar plano");
    } finally {
      setLoadingPlan(false);
    }
  }

  async function handleSubmit() {
    if (!customerReference.trim()) {
      toast.error("Informe o número do cliente");
      return;
    }

    try {
      setLoading(true);
      await serviceRequestService.pay({
        planId: Number(planId),
        customerReference
      });

      toast.success("Serviço solicitado com sucesso");
      setCustomerReference("");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Erro ao processar serviço"
      );
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-xl font-black tracking-tight text-gray-950">
            {loadingPlan ? "Carregando..." : plan ? plan.serviceGroup.service.name : "Recarga"}
          </h1>
          <p className="text-xs text-gray-600 font-medium mt-0.5">
            Confirme os detalhes e forneça a referência
          </p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        
        {loadingPlan ? (
          /* SKELETON INTEGRADO DA TELA DE CHECKOUT */
          <>
            <div className="bg-[#FCFCFD] border border-[#E4E7EB] rounded-2xl p-5 space-y-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="space-y-2.5 pt-2">
                <div className="flex justify-between"><div className="h-4 bg-gray-100 rounded w-1/4" /><div className="h-4 bg-gray-200 rounded w-1/3" /></div>
                <div className="flex justify-between"><div className="h-4 bg-gray-100 rounded w-1/4" /><div className="h-4 bg-gray-200 rounded w-1/2" /></div>
                <div className="flex justify-between"><div className="h-4 bg-gray-100 rounded w-1/4" /><div className="h-4 bg-gray-200 rounded w-1/4" /></div>
              </div>
            </div>
            <div className="bg-[#FCFCFD] border border-[#E4E7EB] rounded-2xl p-5 space-y-3 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-1/4" />
              <div className="h-12 bg-gray-100 rounded-xl w-full" />
              <div className="h-12 bg-gray-200 rounded-xl w-full mt-2" />
            </div>
          </>
        ) : !plan ? (
          /* COMPORTAMENTO SE NÃO ENCONTRAR O PLANO */
          <div className="bg-[#FCFCFD] border border-[#E4E7EB] rounded-2xl p-8 text-center text-xs text-gray-600 font-mono font-bold tracking-wide shadow-sm">
            Plano ou serviço não encontrado. Volte e selecione novamente.
          </div>
        ) : (
          /* CONTEÚDO PRINCIPAL DE PAGAMENTO */
          <>
            {/* CARD DE RESUMO DO PRODUTO */}
            <div className="bg-[#FCFCFD] border border-[#E4E7EB] rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-black uppercase text-gray-600 tracking-wider mb-4 flex items-center gap-2">
                <CreditCard size={14} className="text-emerald-700" /> Detalhes da Compra
              </h3>
              
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-gray-600 font-medium">Categoria</span>
                  <span className="font-extrabold text-gray-950 text-right">{plan.serviceGroup.name}</span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-gray-600 font-medium">Plano</span>
                  <span className="font-extrabold text-gray-950 text-right">{plan.name}</span>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-gray-600 font-medium">Preço Total</span>
                  <span className="text-base font-mono font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-xl">
                    {Number(plan.price).toLocaleString()} Kz
                  </span>
                </div>
              </div>
            </div>

            {/* CARD DO FORMULÁRIO DE DESTINO */}
            <div className="bg-[#FCFCFD] border border-[#E4E7EB] rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-gray-600 tracking-wider flex items-center gap-2 mb-2">
                  <User size={14} className="text-gray-700" /> Número de Conta / Telefone
                </label>

                <div className="relative flex items-center">
                  <Hash size={16} className="absolute left-4 text-gray-600" />
                  <input
                    type="text"
                    value={customerReference}
                    onChange={(e) => setCustomerReference(e.target.value)}
                    placeholder="Ex: 9XXXXXXXX ou Nº de Contrato"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl font-mono text-sm text-gray-950 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold placeholder:text-gray-400 placeholder:font-sans"
                  />
                </div>
              </div>

              {/* BOTÃO DE ENVIO COM DESTAQUE E ALTO CONTRASTE */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gray-950 hover:bg-gray-900 active:scale-[0.99] border border-transparent text-white rounded-xl py-3.5 text-xs font-black uppercase tracking-widest disabled:opacity-40 transition-all shadow-md mt-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processando Transação...</span>
                  </>
                ) : (
                  <span>Confirmar Compra</span>
                )}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}