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
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] pb-28 antialiased">
      
      {/* HEADER FIXO - DARK MODE */}
      <div className="px-6 pt-8 pb-5 flex items-center gap-4 border-b border-white/[0.05] bg-[#0B0E11]/90 backdrop-blur-md sticky top-0 z-50">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-gray-300 hover:bg-white/[0.08] transition-all duration-200 shadow-sm"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-black tracking-tight text-white">
            {loadingPlan ? "Carregando..." : plan ? plan.serviceGroup.service.name : "Recarga"}
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Confirme os detalhes e forneça a referência
          </p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        
        {loadingPlan ? (
          /* SKELETON INTEGRADO DA TELA DE CHECKOUT - DARK MODE */
          <>
            <div className="bg-[#161A1E] border border-white/[0.03] rounded-2xl p-5 space-y-4 animate-pulse">
              <div className="h-4 bg-gray-800 rounded w-1/3" />
              <div className="space-y-2.5 pt-2">
                <div className="flex justify-between"><div className="h-4 bg-gray-800 rounded w-1/4" /><div className="h-4 bg-gray-800 rounded w-1/3" /></div>
                <div className="flex justify-between"><div className="h-4 bg-gray-800 rounded w-1/4" /><div className="h-4 bg-gray-800 rounded w-1/2" /></div>
                <div className="flex justify-between"><div className="h-4 bg-gray-800 rounded w-1/4" /><div className="h-4 bg-gray-800 rounded w-1/4" /></div>
              </div>
            </div>
            <div className="bg-[#161A1E] border border-white/[0.03] rounded-2xl p-5 space-y-3 animate-pulse">
              <div className="h-3 bg-gray-800 rounded w-1/4" />
              <div className="h-12 bg-gray-800/50 rounded-xl w-full" />
              <div className="h-12 bg-gray-800 rounded-xl w-full mt-2" />
            </div>
          </>
        ) : !plan ? (
          /* COMPORTAMENTO SE NÃO ENCONTRAR O PLANO */
          <div className="bg-[#161A1E] border border-white/[0.03] rounded-2xl p-8 text-center text-xs text-gray-400 font-mono font-bold tracking-wide shadow-xl">
            Plano ou serviço não encontrado. Volte e selecione novamente.
          </div>
        ) : (
          /* CONTEÚDO PRINCIPAL DE PAGAMENTO */
          <>
            {/* CARD DE RESUMO DO PRODUTO */}
            <div className="bg-[#161A1E] border border-white/[0.03] rounded-2xl p-5 shadow-xl">
              <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-4 flex items-center gap-2">
                <CreditCard size={14} className="text-emerald-400" /> Detalhes da Compra
              </h3>
              
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                  <span className="text-gray-400 font-medium">Categoria</span>
                  <span className="font-bold text-white text-right">{plan.serviceGroup.name}</span>
                </div>

                <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                  <span className="text-gray-400 font-medium">Plano</span>
                  <span className="font-bold text-white text-right">{plan.name}</span>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-gray-400 font-medium">Preço Total</span>
                  <span className="text-sm font-mono font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
                    {Number(plan.price).toLocaleString()} Kz
                  </span>
                </div>
              </div>
            </div>

            {/* CARD DO FORMULÁRIO DE DESTINO */}
            <div className="bg-[#161A1E] border border-white/[0.03] rounded-2xl p-5 shadow-xl space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2 mb-2">
                  <User size={14} className="text-gray-400" /> Número de Conta / Telefone
                </label>

                <div className="relative flex items-center">
                  <Hash size={16} className="absolute left-4 text-gray-500" />
                  <input
                    type="text"
                    value={customerReference}
                    onChange={(e) => setCustomerReference(e.target.value)}
                    placeholder="Ex: 9XXXXXXXX ou Nº de Contrato"
                    className="w-full pl-11 pr-4 py-3.5 bg-white/[0.02] border border-white/[0.08] rounded-xl font-mono text-sm text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.04] transition-all font-bold placeholder:text-gray-600 placeholder:font-sans"
                  />
                </div>
              </div>

              {/* BOTÃO DE ENVIO COM DESTAQUE E ALTO CONTRASTE */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.99] border border-transparent text-white rounded-xl py-4 text-xs font-black uppercase tracking-widest disabled:opacity-40 transition-all shadow-md mt-2 flex items-center justify-center gap-2"
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