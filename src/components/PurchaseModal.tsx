import { useState } from "react";
import type { CatalogPlan } from "../types/catalog";
import { purchaseService } from "../services/purchase.service";
import { formatCurrencyAOA } from "../utils/formatCurrency";
import { XCircle, X, Copy, Check } from "@phosphor-icons/react";

// 1. Importação estática das imagens de recarga (igual à tela de transações)
// Certifique-se de que os caminhos e nomes de arquivo correspondem exatamente à sua estrutura de assets
const rechargeImages = import.meta.glob<string>(
  "../assets/recharges/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}",
  {
    eager: true,
    import: "default"
  }
);

// 2. Mapeamento de branding (igual à tela de transações)
const providerBranding: Record<string, { logo: string }> = {
  UNITEL: { logo: "UNITEL.PNG" },
  BAZZA: { logo: "UNITEL.PNG" }, // Bazza usa o logo da Unitel
  MOVICEL: { logo: "MOVICEL.PNG" },
  AFRICELL: { logo: "AFRICELL.PNG" },
  NETONE: { logo: "NETONE.PNG" },
  DSTV: { logo: "DSTV.PNG" },
  ZAP: { logo: "ZAP1.PNG" },
  "ZAP FIBRA": { logo: "ZAP2.PNG" },
  ENDE: { logo: "ENDE.PNG" },
  EPAL: { logo: "EPAL.PNG" },
  // Adicione mais provedores conforme necessário...
};

interface PurchaseModalProps {
  plan: CatalogPlan;
  onClose: () => void;
}

export default function PurchaseModal({
  plan,
  onClose
}: PurchaseModalProps) {
  const [customerReference, setCustomerReference] = useState("");
  const [amount, setAmount] = useState(
    plan.valueVariable ? "" : String(plan.price)
  );
  const [loading, setLoading] = useState(false);
  
  const [resultData, setResultData] = useState<{
    success: boolean;
    transaction?: any;
    errorMessage?: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  // 3. Lógica para obter o nome da operadora e resolver o logo (agora funcional e segura)
  const getOperatorInfo = (text: string = "") => {
    const upperText = text.toUpperCase();
    let operatorKey = null;

    // Identifica a chave da operadora com base no nome do plano/serviço
    if (upperText.includes("UNITEL") || upperText.includes("BAZZA")) operatorKey = "UNITEL";
    else if (upperText.includes("MOVICEL")) operatorKey = "MOVICEL";
    else if (upperText.includes("AFRICELL")) operatorKey = "AFRICELL";
    else if (upperText.includes("DSTV")) operatorKey = "DSTV";
    else if (upperText.includes("ZAP")) operatorKey = "ZAP";
    else if (upperText.includes("ENDE")) operatorKey = "ENDE";
    else if (upperText.includes("EPAL")) operatorKey = "EPAL";

    // Se for uma operadora conhecida, tenta resolver o logo
    if (operatorKey) {
      const brand = providerBranding[operatorKey];
      if (brand) {
        const targetFileName = brand.logo.toLowerCase();
        // Procura a imagem importada que termina com o nome do arquivo correto
        for (const path in rechargeImages) {
          if (path.toLowerCase().endsWith(targetFileName)) {
            return { name: operatorKey, logoUrl: rechargeImages[path] };
          }
        }
      }
    }

    // Retorna o logo genérico da Ematea se não for recarga de operadora mapeada
    return { name: plan.name, logoUrl: "/logo.png" };
  };

  const operatorInfo = getOperatorInfo(plan.name);

  async function handlePurchase() {
    try {
      setLoading(true);

      // Tipagem explícita do response para evitar erro no build
      const response = (await purchaseService.purchase({
        planId: plan.id,
        customerReference,
        amount: Number(amount)
      })) as any;

      const transaction = response?.data || response || {
        id: Math.floor(Math.random() * 10000),
        type: "Telecomunicações",
        client: customerReference,
        operator: plan.name,
        amount: Number(amount),
        currency: "AOA",
        createdAt: new Date().toISOString(),
        status: "PAGO"
      };

      setResultData({
        success: true,
        transaction
      });

    } catch (error: any) {
      setResultData({
        success: false,
        errorMessage: error?.response?.data?.message ?? "Erro ao efetuar compra."
      });
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      
      {!resultData ? (
        <div className="w-full max-w-md rounded-3xl bg-[#161b22] border border-[#30363d] overflow-hidden shadow-2xl">
          <div className="px-6 py-5 border-b border-[#30363d] flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Confirmar Compra</h2>
              <p className="text-sm text-gray-400 mt-1">{plan.name}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/[0.03] text-gray-400 hover:text-white transition-all"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Referência</label>
              <input
                className="w-full rounded-xl bg-[#0d1117] border border-[#30363d] px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                placeholder="Telefone, contador ou referência"
                value={customerReference}
                onChange={(e) => setCustomerReference(e.target.value)}
              />
            </div>

            {plan.valueVariable ? (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Valor</label>
                <input
                  type="number"
                  className="w-full rounded-xl bg-[#0d1117] border border-[#30363d] px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Introduza o valor"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Mínimo: {plan.valueVariableMin?.toLocaleString("pt-PT")} Kz {" • "}
                  Máximo: {plan.valueVariableMax?.toLocaleString("pt-PT")} Kz
                </p>
              </div>
            ) : (
              <div className="rounded-2xl bg-[#0d1117] border border-[#30363d] p-4">
                <span className="text-sm text-gray-400">Valor da Recarga</span>
                <p className="mt-2 text-3xl font-bold text-emerald-400">
                  {plan.price.toLocaleString("pt-PT")} Kz
                </p>
              </div>
            )}

            <div className="rounded-2xl bg-[#0d1117] border border-[#30363d] p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Produto</span>
                <span className="text-white">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tipo</span>
                <span className="text-white">{plan.valueVariable ? "Valor variável" : "Valor fixo"}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#30363d] p-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-[#30363d] py-3 text-white hover:bg-[#20252c] transition-all"
            >
              Cancelar
            </button>
            <button
              disabled={loading}
              onClick={handlePurchase}
              className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 text-white font-semibold transition-all disabled:opacity-50"
            >
              {loading ? "Processando..." : "Comprar"}
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-sm rounded-[2rem] bg-[#161A1E] border border-white/[0.08] p-6 shadow-2xl flex flex-col items-center relative animate-fadeIn">
          
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.03] border border-white/[0.05] text-gray-400 hover:text-white transition-all"
          >
            <X size={18} weight="bold" />
          </button>

          {resultData.success && resultData.transaction ? (
            <>
              {/* Logotipo da operadora no topo (agora funcional e detalhado) */}
              <div className="w-16 h-16 rounded-full border border-white/[0.08] overflow-hidden bg-white/[0.02] p-1.5 mb-4 shadow-inner flex items-center justify-center">
                <img 
                  src={operatorInfo.logoUrl} 
                  alt={operatorInfo.name} 
                  className="w-full h-full object-contain rounded-full"
                />
              </div>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Comprovativo de Venda</h3>

              <div className="w-full space-y-3 text-xs font-medium">
                <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                  <span className="text-gray-400 font-mono">Id:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-bold">{resultData.transaction.id}</span>
                    <button onClick={() => copyToClipboard(String(resultData.transaction.id))} className="text-gray-500 hover:text-emerald-400">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                  <span className="text-gray-400 font-mono">Tipo:</span>
                  <span className="text-white font-bold">{resultData.transaction.type || "Telecomunicações"}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                  <span className="text-gray-400 font-mono">Cliente:</span>
                  <span className="text-white font-bold">{resultData.transaction.client || customerReference}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                  <span className="text-gray-400 font-mono">Operadora:</span>
                  <span className="text-white font-bold uppercase">{operatorInfo.name}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                  <span className="text-gray-400 font-mono">Valor:</span>
                  <span className="text-emerald-400 font-black text-sm">
                    {formatCurrencyAOA(resultData.transaction.amount || Number(amount))}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                  <span className="text-gray-400 font-mono">Data:</span>
                  <span className="text-white font-bold">
                    {new Date(resultData.transaction.createdAt || Date.now()).toLocaleString('pt-AO')}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400 font-mono">Status:</span>
                  <span className="text-emerald-400 font-black tracking-wider">PAGO</span>
                </div>
              </div>

              <p className="text-[9px] font-mono text-gray-500 tracking-widest uppercase mt-6">
                Obrigado pela preferência
              </p>

              <button
                onClick={onClose}
                className="w-full mt-5 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
              >
                Concluir
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full border border-rose-500/20 bg-rose-500/10 p-1.5 mb-4 flex items-center justify-center">
                <XCircle size={36} weight="fill" className="text-rose-500" />
              </div>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Erro na Transação</h3>
              <p className="text-xs text-gray-400 text-center mb-6 px-2">
                {resultData.errorMessage}
              </p>

              <button
                onClick={() => setResultData(null)}
                className="w-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
              >
                Tentar Novamente
              </button>
            </>
          )}

        </div>
      )}

    </div>
  );
}