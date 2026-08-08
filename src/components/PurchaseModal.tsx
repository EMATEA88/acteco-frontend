import { useState } from "react";
import type { CatalogPlan } from "../types/catalog";
import { purchaseService } from "../services/purchase.service";
import { formatCurrencyAOA } from "../utils/formatCurrency";
import { XCircle, X, Copy, Check, ShieldCheck, Receipt } from "@phosphor-icons/react";

// 1. Importação estática das imagens de recarga
const rechargeImages = import.meta.glob<string>(
  "../assets/recharges/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}",
  {
    eager: true,
    import: "default"
  }
);

// 2. Mapeamento de branding
const providerBranding: Record<string, { logo: string }> = {
  UNITEL: { logo: "UNITEL.PNG" },
  BAZZA: { logo: "UNITEL.PNG" },
  MOVICEL: { logo: "MOVICEL.PNG" },
  AFRICELL: { logo: "AFRICELL.PNG" },
  NETONE: { logo: "NETONE.PNG" },
  DSTV: { logo: "DSTV.PNG" },
  ZAP: { logo: "ZAP1.PNG" },
  "ZAP FIBRA": { logo: "ZAP2.PNG" },
  ENDE: { logo: "ENDE.PNG" },
  EPAL: { logo: "EPAL.PNG" },
  BANTUBET: { logo: "BANTUBET.PNG" },
  PREMIERBET: { logo: "PREMIERBET.PNG" },
  BETIKA: { logo: "BETIKA.PNG" },
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
  const [customerNotification, setCustomerNotification] = useState("");
  const [amount, setAmount] = useState(
    plan.valueVariable ? "" : String(plan.price)
  );
  const [loading, setLoading] = useState(false);
  const [checkingCustomer, setCheckingCustomer] = useState(false);
  const [customerInfo, setCustomerInfo] =
    useState<Record<string, any> | null>(null);
  const [customerInfoError, setCustomerInfoError] =
    useState<string | null>(null);
  
  const [resultData, setResultData] = useState<{
    success: boolean;
    transaction?: any;
    errorMessage?: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  // Identificação do tipo ENDE
  const isEnde =
    plan.name
      .toUpperCase()
      .includes("ENDE");

  const getOperatorInfo = (text: string = "") => {
    const upperText = text.toUpperCase();
    let operatorKey = null;

    if (upperText.includes("UNITEL") || upperText.includes("BAZZA")) operatorKey = "UNITEL";
    else if (upperText.includes("MOVICEL")) operatorKey = "MOVICEL";
    else if (upperText.includes("AFRICELL")) operatorKey = "AFRICELL";
    else if (upperText.includes("BANTUBET")) operatorKey = "BANTUBET";
    else if (upperText.includes("PREMIERBET")) operatorKey = "PREMIERBET";
    else if (upperText.includes("BETIKA")) operatorKey = "BETIKA";
    else if (upperText.includes("DSTV")) operatorKey = "DSTV";
    else if (upperText.includes("ZAP")) operatorKey = "ZAP";
    else if (upperText.includes("ENDE")) operatorKey = "ENDE";
    else if (upperText.includes("EPAL")) operatorKey = "EPAL";

    if (operatorKey) {
      const brand = providerBranding[operatorKey];
      if (brand) {
        const targetFileName = brand.logo.toLowerCase();
        for (const path in rechargeImages) {
          if (path.toLowerCase().endsWith(targetFileName)) {
            return { name: operatorKey, logoUrl: rechargeImages[path] };
          }
        }
      }
    }

    return { name: plan.name, logoUrl: "/logo.png" };
  };

  const operatorInfo = getOperatorInfo(plan.name);

  const planText = (
    `${plan.name} ${(plan as CatalogPlan & {
      providerCode?: string;
    }).providerCode ?? ""}`
  ).toUpperCase();

  const requiresCustomerInfo =
    !(
      planText.includes("UNITEL") ||
      planText.includes("BAZZA") ||
      planText.includes("MOVICEL") ||
      planText.includes("AFRICELL") ||
      planText.includes("NETONE")
    );

  async function handleCustomerInfo() {
    try {
      if (!customerReference.trim()) {
        setCustomerInfoError(
          "Introduza a referência ou número do cliente."
        );
        return;
      }

      const providerCode = String(
        (plan as CatalogPlan & {
          providerCode?: string;
        }).providerCode ?? ""
      ).trim();

      if (!providerCode) {
        setCustomerInfoError(
          "Este serviço não possui um código de provedor configurado."
        );
        return;
      }

      setCheckingCustomer(true);
      setCustomerInfo(null);
      setCustomerInfoError(null);

      const response =
        await purchaseService.customerInfo({
          providerCode,
          customerId: customerReference.trim(),
        });

      if (response?.status !== "SUCCESS") {
        setCustomerInfoError(
          response?.response?.Description ??
          response?.data?.Response?.Description ??
          "Não foi possível localizar os dados do cliente."
        );
        return;
      }

      let info =
        response?.client ??
        response?.data?.Provider_ClientInfo ??
        null;

      if (typeof info === "string") {
        try {
          info = JSON.parse(info);
        } catch {
          info = {
            Informação: info
          };
        }
      }

      if (
        !info ||
        typeof info !== "object"
      ) {
        setCustomerInfoError(
          "A operadora não devolveu informações do cliente."
        );
        return;
      }

      setCustomerInfo(info);

    } catch (error: any) {
      console.error(
        "========== ERRO AO CONSULTAR CLIENTE ==========",
        error
      );

      setCustomerInfoError(
        error?.response?.data?.error ??
        error?.response?.data?.message ??
        error?.message ??
        "Erro ao consultar os dados do cliente."
      );

    } finally {
      setCheckingCustomer(false);
    }
  }

  async function handlePurchase() {
    try {
      setLoading(true);

      const response = (await purchaseService.purchase({
        planId: plan.id,
        customerReference,
        customerNotification: customerNotification || "",
        amount: Number(amount)
      })) as any;

      const akiResponse =
        response?.akiResponse ??
        response?.data?.akiResponse ??
        response?.data ??
        response;

      let transactionExtraInfo =
        akiResponse?.Transaction_ExtraInfo ??
        akiResponse?.transaction_ExtraInfo ??
        null;

      if (typeof transactionExtraInfo === "string") {
        try {
          transactionExtraInfo = JSON.parse(transactionExtraInfo);
        } catch {
          // Algumas respostas da AKI podem ser texto simples.
        }
      }

      const transaction = {
        id:
          akiResponse?.Transaction_ID ??
          akiResponse?.transactionId ??
          response?.serviceRequestId ??
          Math.floor(Math.random() * 10000),

        client: customerReference,

        operator: plan.name,

        amount: Number(amount),

        currency: "AOA",

        createdAt: new Date().toISOString(),

        status:
          akiResponse?.Status ??
          "SUCCESS",

        voucherPIN:
          transactionExtraInfo?.VoucherPIN ??
          null,

        voucherValue:
          transactionExtraInfo?.VoucherValue ??
          null,

        voucherUnits:
          transactionExtraInfo?.VoucherUnits ??
          null,

        voucherVat:
          transactionExtraInfo?.VoucherVat ??
          null,

        customerName:
          transactionExtraInfo?.CustomerName ??
          null,

        extraInfo:
          transactionExtraInfo
      };

      setResultData({
        success: true,
        transaction
      });

    } catch (error: any) {

      console.error(
        "========== ERRO AO EFETUAR COMPRA ==========",
        error
      );

      setResultData({
        success: false,
        errorMessage:
          error?.response?.data?.message ??
          error?.response?.data?.error ??
          "Erro ao efetuar compra. Verifique os dados e tente novamente."
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
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
      
      {!resultData ? (
        <div className="w-full max-w-md rounded-2xl bg-[#161A1F] border border-white/10 overflow-hidden shadow-2xl">
          
          {/* Cabeçalho */}
          <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-[#161A1F]/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Receipt size={20} weight="bold" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-wide">Confirmar Operação</h2>
                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[220px]">{plan.name}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          {/* Corpo do Formulário */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Referência / Destino
              </label>
              <input
                className="w-full rounded-xl bg-[#0d1117] border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Nº de Telemóvel, Contador ou ID"
                value={customerReference}
                onChange={(e) => {
                  setCustomerReference(e.target.value);
                  setCustomerInfo(null);
                  setCustomerInfoError(null);
                }}
              />
            </div>

            {/* CAMPO TELEFONE EXCLUSIVO PARA ENDE */}
            {isEnde && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Telefone para receber o comprovativo
                </label>

                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={9}
                  value={customerNotification}
                  onChange={(event) =>
                    setCustomerNotification(
                      event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 9)
                    )
                  }
                  placeholder="Ex.: 944272561"
                  className="w-full rounded-xl bg-[#0d1117] border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            )}

            {/* CONSULTA DO CLIENTE */}
            {customerInfo && (
              <div className="rounded-xl bg-[#0d1117] border border-emerald-500/20 p-4 space-y-3">

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Dados do Cliente
                  </span>

                  <span className="text-[10px] font-bold text-emerald-400 uppercase">
                    Cliente encontrado
                  </span>
                </div>

                {Object.entries(customerInfo).map(
                  ([key, value]) => {

                    if (
                      value === null ||
                      value === undefined ||
                      value === ""
                    ) {
                      return null;
                    }

                    const label = key
                      .replace(
                        /([A-Z])/g,
                        " $1"
                      )
                      .replace(/^./, char =>
                        char.toUpperCase()
                      );

                    return (
                      <div
                        key={key}
                        className="flex justify-between gap-4 border-b border-white/5 last:border-0 pb-2 last:pb-0"
                      >
                        <span className="text-xs text-gray-500">
                          {label}
                        </span>

                        <span className="text-xs text-white font-medium text-right">
                          {String(value)}
                        </span>
                      </div>
                    );
                  }
                )}

              </div>
            )}

            {customerInfoError && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3">
                <p className="text-xs text-rose-400">
                  {customerInfoError}
                </p>
              </div>
            )}

            {plan.valueVariable ? (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Montante a Pagar (AOA)
                </label>
                <input
                  type="number"
                  className="w-full rounded-xl bg-[#0d1117] border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="Introduza o valor"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <p className="text-[11px] text-gray-500 mt-1.5 flex justify-between">
                  <span>Mín: {plan.valueVariableMin?.toLocaleString("pt-PT")} Kz</span>
                  <span>Máx: {plan.valueVariableMax?.toLocaleString("pt-PT")} Kz</span>
                </p>
              </div>
            ) : (
              <div className="rounded-xl bg-[#0d1117] border border-white/5 p-4 flex items-center justify-between">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Preço Fixo</span>
                <span className="text-lg font-bold text-emerald-400">
                  {plan.price.toLocaleString("pt-PT")} Kz
                </span>
              </div>
            )}

            {/* Resumo compacto */}
            <div className="rounded-xl bg-[#0d1117] border border-white/5 p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Serviço Selecionado</span>
                <span className="text-white font-medium">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Categoria / Tipo</span>
                <span className="text-gray-300">{plan.valueVariable ? "Valor Variável" : "Valor Fixo"}</span>
              </div>
            </div>
          </div>

          {/* Rodapé / Ações */}
          <div className="border-t border-white/5 px-6 py-4 bg-[#161A1F]/50 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 py-2.5 text-xs font-semibold text-gray-300 hover:bg-white/[0.03] hover:text-white transition-all"
            >
              Cancelar
            </button>

            {!requiresCustomerInfo ? (
              <button
                disabled={
                  loading ||
                  !customerReference.trim() ||
                  (plan.valueVariable && !amount) ||
                  (isEnde && customerNotification.length !== 9)
                }
                onClick={handlePurchase}
                className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>A processar...</span>
                  </>
                ) : (
                  <span>Confirmar Pagamento</span>
                )}
              </button>
            ) : !customerInfo ? (
              <button
                disabled={
                  checkingCustomer ||
                  !customerReference.trim()
                }
                onClick={handleCustomerInfo}
                className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {checkingCustomer ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>A consultar...</span>
                  </>
                ) : (
                  <span>Consultar Cliente</span>
                )}
              </button>
            ) : (
              <button
                disabled={
                  loading ||
                  !customerReference.trim() ||
                  (plan.valueVariable && !amount) ||
                  (isEnde && customerNotification.length !== 9)
                }
                onClick={handlePurchase}
                className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>A processar...</span>
                  </>
                ) : (
                  <span>Confirmar Pagamento</span>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Comprovativo Estilizado (Receipt) */
        <div className="w-full max-w-sm rounded-2xl bg-[#161A1F] border border-white/10 p-6 shadow-2xl flex flex-col items-center relative">
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white transition-all"
          >
            <X size={16} weight="bold" />
          </button>

          {resultData.success && resultData.transaction ? (
            <>
              {/* Logo Operadora */}
              <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.02] p-2 mb-3 shadow-inner flex items-center justify-center">
                <img 
                  src={operatorInfo.logoUrl} 
                  alt={operatorInfo.name} 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>

              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
                <ShieldCheck size={16} weight="fill" />
                <span>Transação Bem-Sucedida</span>
              </div>
              <h3 className="text-base font-bold text-white mb-4">Comprovativo de Pagamento</h3>

              {/* Bloco de dados do recibo */}
              <div className="w-full space-y-2.5 text-xs bg-[#0d1117] border border-white/5 p-4 rounded-xl">
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-gray-500 font-mono">ID Operação:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-mono font-semibold">{resultData.transaction.id}</span>
                    <button onClick={() => copyToClipboard(String(resultData.transaction.id))} className="text-gray-400 hover:text-emerald-400 transition-colors">
                      {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-gray-500 font-mono">Referência:</span>
                  <span className="text-white font-medium">{resultData.transaction.client || customerReference}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-gray-500 font-mono">Operadora:</span>
                  <span className="text-white font-semibold uppercase">{operatorInfo.name}</span>
                </div>

                {resultData.transaction.customerName && (
                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-gray-500 font-mono">Nome Cliente:</span>
                    <span className="text-white font-medium text-right truncate max-w-[180px]">
                      {resultData.transaction.customerName}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-gray-500 font-mono">Montante:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {formatCurrencyAOA(resultData.transaction.amount || Number(amount))}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-gray-500 font-mono">Data:</span>
                  <span className="text-gray-300">
                    {new Date(resultData.transaction.createdAt || Date.now()).toLocaleString('pt-AO')}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-gray-500 font-mono">Estado:</span>
                  <span className="text-emerald-400 font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px]">
                    CONCLUÍDO
                  </span>
                </div>
              </div>

              {/* SEÇÃO ENDE: PIN DE CARREGAMENTO */}
              {resultData.transaction.operator
                ?.toUpperCase()
                .includes("ENDE") &&
                resultData.transaction.voucherPIN && (
                  <div className="w-full mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                        PIN de Carregamento
                      </span>

                      <button
                        onClick={() =>
                          copyToClipboard(
                            String(resultData.transaction.voucherPIN)
                          )
                        }
                        className="text-gray-400 hover:text-emerald-400 transition-colors"
                      >
                        {copied ? (
                          <Check
                            size={16}
                            className="text-emerald-400"
                          />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>

                    <div className="text-center">
                      <span className="text-xl font-mono font-bold tracking-widest text-white break-all">
                        {resultData.transaction.voucherPIN}
                      </span>
                    </div>

                    {resultData.transaction.voucherValue != null && (
                      <div className="mt-3 text-center text-xs text-gray-400">
                        Energia:
                        <span className="ml-1 text-white font-semibold">
                          {resultData.transaction.voucherValue}
                          {" "}
                          {resultData.transaction.voucherUnits ?? "kWh"}
                        </span>
                      </div>
                    )}
                  </div>
                )}

              <button
                onClick={onClose}
                className="w-full mt-5 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-900/20"
              >
                Concluir
              </button>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-1.5 mb-4 flex items-center justify-center">
                <XCircle size={32} weight="fill" className="text-rose-500" />
              </div>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Falha na Operação</h3>
              <p className="text-xs text-gray-400 text-center mb-6 px-2 leading-relaxed">
                {resultData.errorMessage}
              </p>

              <button
                onClick={() => setResultData(null)}
                className="w-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
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