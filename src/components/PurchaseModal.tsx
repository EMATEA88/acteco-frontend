import { useEffect, useState } from "react";
import type { CatalogPlan } from "../types/catalog";
import { purchaseService } from "../services/purchase.service";
import {
  X,
  Copy,
  Check,
  ShieldCheck,
  Receipt
} from "@phosphor-icons/react";

// =====================================================
// IMAGENS DE RECARGA
// =====================================================

const rechargeImages = import.meta.glob<string>(
  "../assets/recharges/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}",
  {
    eager: true,
    import: "default"
  }
);

// =====================================================
// BRANDING DOS PROVIDERS
// =====================================================

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
  BETIKA: { logo: "BETIKA.PNG" }
};

// =====================================================
// PROPS
// =====================================================

interface PurchaseModalProps {
  plan: CatalogPlan;
  onClose: () => void;
}

// =====================================================
// COMPONENT
// =====================================================

export default function PurchaseModal({
  plan,
  onClose
}: PurchaseModalProps) {

  // ===================================================
  // ESTADO
  // ===================================================

  const [customerReference, setCustomerReference] = useState("");
  const [customerNotification, setCustomerNotification] = useState("");
  const [amount, setAmount] = useState(
    plan.valueVariable ? "" : String(plan.price)
  );
  const [loading, setLoading] = useState(false);
  const [checkingCustomer, setCheckingCustomer] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<Record<string, any> | null>(null);
  const [customerInfoError, setCustomerInfoError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<{
    success: boolean;
    transaction?: any;
    errorMessage?: string;
  } | null>(null);
  
  // Estados de cópia separados para ID e PIN
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);

  // ===================================================
  // AUTO-PREENCHIMENTO DO TELEFONE
  // ===================================================

  useEffect(() => {
    const reference = customerReference
      .replace(/\D/g, "")
      .slice(0, 9);

    if (reference.length === 9) {
      setCustomerNotification((current) => {
        if (current.trim() !== "") {
          return current;
        }
        return reference;
      });
    }
  }, [customerReference]);

  // ===================================================
  // TEXTO / PROVIDER
  // ===================================================

  const getOperatorInfo = (text: string = "") => {
    const upperText = text.toUpperCase();
    let operatorKey: string | null = null;

    if (upperText.includes("UNITEL") || upperText.includes("BAZZA")) {
      operatorKey = "UNITEL";
    } else if (upperText.includes("MOVICEL")) {
      operatorKey = "MOVICEL";
    } else if (upperText.includes("AFRICELL")) {
      operatorKey = "AFRICELL";
    } else if (upperText.includes("BANTUBET")) {
      operatorKey = "BANTUBET";
    } else if (upperText.includes("PREMIERBET")) {
      operatorKey = "PREMIERBET";
    } else if (upperText.includes("BETIKA")) {
      operatorKey = "BETIKA";
    } else if (upperText.includes("DSTV")) {
      operatorKey = "DSTV";
    } else if (upperText.includes("ZAP")) {
      operatorKey = "ZAP";
    } else if (upperText.includes("ENDE")) {
      operatorKey = "ENDE";
    } else if (upperText.includes("EPAL")) {
      operatorKey = "EPAL";
    }

    if (operatorKey) {
      const brand = providerBranding[operatorKey];
      if (brand) {
        const targetFileName = brand.logo.toLowerCase();
        for (const path in rechargeImages) {
          if (path.toLowerCase().endsWith(targetFileName)) {
            return {
              name: operatorKey,
              logoUrl: rechargeImages[path]
            };
          }
        }
      }
    }

    return {
      name: plan.name,
      logoUrl: "/logo.png"
    };
  };

  const operatorInfo = getOperatorInfo(plan.name);

  // ===================================================
  // PROVIDER CODE E REGRAS DE NOTIFICAÇÃO / PRODUTO
  // ===================================================

  const providerCode = String(
    (plan as CatalogPlan & { providerCode?: string }).providerCode ?? ""
  ).trim().toUpperCase();

  const notificationType = String(
    plan.notificationType ?? ""
  ).trim().toUpperCase();

  const requiresCustomerNotification =
    notificationType === "SMS";

  const productCode = String(
    plan.externalId ?? ""
  ).trim().toUpperCase();

  const productName = String(
    plan.name ?? ""
  ).trim();

  const isVoucher =
    productCode.includes("VCH") ||
    /voucher/i.test(productName);

  const operationType = isVoucher
    ? "Voucher"
    : "Recarga";

  // ===================================================
  // PROVIDERS COM CONSULTA DE CLIENTE SUPORTADA PELA AKI
  // ===================================================
  const CUSTOMER_INFO_PROVIDER_CODES = new Set([
    "ZAP_SAT",
    "ZAP_MEDIA",
    "DSTV",
    "ENDE",
    "EPAL",
  ]);

  const requiresCustomerInfo =
    CUSTOMER_INFO_PROVIDER_CODES.has(providerCode);

  // ===================================================
  // EXTRAÇÃO DO NOME DO CLIENTE
  // ===================================================

  const extractCustomerName = (
    info: Record<string, any> | null | undefined
  ): string | null => {
    if (!info) return null;
    const possibleNames = [
      info.CustomerName,
      info.customerName,
      info.Customer_Name,
      info.customer_name,
      info.Name,
      info.name
    ];
    const found = possibleNames.find(
      value => value !== null && value !== undefined && String(value).trim() !== ""
    );
    return found ? String(found).trim() : null;
  };

  // ===================================================
  // CONSULTA DO CLIENTE
  // ===================================================

  async function handleCustomerInfo() {
    try {
      const customerId = customerReference.trim();

      if (!customerId) {
        setCustomerInfoError(
          "Introduza a referência ou número do cliente."
        );
        return;
      }

      if (!providerCode) {
        setCustomerInfoError(
          "Este serviço não possui um código de provedor configurado."
        );
        return;
      }

      setCheckingCustomer(true);
      setCustomerInfo(null);
      setCustomerInfoError(null);

      let response = await purchaseService.customerInfo({
        providerCode,
        customerId
      });

      let status = String(
        response?.status ??
        response?.data?.Status ??
        ""
      ).toUpperCase();

      if (status === "RUNNING") {
        const orderId = String(response?.orderId ?? "").trim();

        if (!orderId) {
          setCustomerInfoError(
            "A consulta foi iniciada, mas a AKI não devolveu o Order ID."
          );
          return;
        }

        const maxAttempts = 10;
        const intervalMs = 2000;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          await new Promise(resolve =>
            setTimeout(resolve, intervalMs)
          );

          response = await purchaseService.customerInfoQuery({
            orderId,
            providerCode,
            customerId
          });

          status = String(
            response?.status ??
            response?.data?.Status ??
            ""
          ).toUpperCase();

          if (status === "SUCCESS") {
            break;
          }

          if (status === "FAILED") {
            setCustomerInfoError(
              response?.response?.Description ??
              response?.data?.Response?.Description ??
              "A AKI não conseguiu localizar os dados do cliente."
            );
            return;
          }

          if (status !== "RUNNING") {
            setCustomerInfoError(
              response?.response?.Description ??
              response?.data?.Response?.Description ??
              "Não foi possível concluir a consulta do cliente."
            );
            return;
          }

          if (attempt === maxAttempts) {
            setCustomerInfoError(
              "A consulta do cliente ainda está em processamento. Tente novamente dentro de alguns segundos."
            );
            return;
          }
        }
      }

      if (status !== "SUCCESS") {
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

      if (!info || typeof info !== "object") {
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

  // ===================================================
  // COMPRA
  // ===================================================

  async function handlePurchase() {
    try {
      const reference = customerReference.trim();
      if (!reference) {
        setResultData({
          success: false,
          errorMessage: "Introduza a referência ou número do cliente."
        });
        return;
      }

      if (plan.valueVariable && (!amount || Number(amount) <= 0)) {
        setResultData({
          success: false,
          errorMessage: "Introduza um montante válido."
        });
        return;
      }

      if (requiresCustomerInfo && !customerInfo) {
        setResultData({
          success: false,
          errorMessage: "Consulte primeiro os dados do cliente antes de efetuar o pagamento."
        });
        return;
      }

      const notification = customerNotification.replace(/\D/g, "").slice(0, 9);
      if (requiresCustomerNotification && notification.length !== 9) {
        setResultData({
          success: false,
          errorMessage: "Introduza um número de telefone válido com 9 dígitos para receber a confirmação da operação."
        });
        return;
      }

      setLoading(true);

      const response = (await purchaseService.purchase({
        planId: plan.id,
        customerReference: reference,
        customerNotification: notification,
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
        akiResponse?.ExtraInfo ??
        akiResponse?.extraInfo ??
        null;

      if (typeof transactionExtraInfo === "string") {
        try {
          transactionExtraInfo = JSON.parse(transactionExtraInfo);
        } catch {}
      }

      const customerName =
        transactionExtraInfo?.CustomerName ??
        transactionExtraInfo?.customerName ??
        extractCustomerName(customerInfo);

      const transaction = {
        id:
          akiResponse?.Transaction_ID ??
          akiResponse?.transactionId ??
          response?.serviceRequestId ??
          Math.floor(Math.random() * 10000),
        client: reference,
        operator: plan.name,
        amount: Number(amount),
        currency: "AOA",
        createdAt: new Date().toISOString(),
        status: akiResponse?.Status ?? akiResponse?.status ?? "SUCCESS",
        voucherPIN: transactionExtraInfo?.VoucherPIN ?? transactionExtraInfo?.voucherPIN ?? null,
        voucherValue: transactionExtraInfo?.VoucherValue ?? transactionExtraInfo?.voucherValue ?? null,
        voucherUnits: transactionExtraInfo?.VoucherUnits ?? transactionExtraInfo?.voucherUnits ?? null,
        voucherVat: transactionExtraInfo?.VoucherVat ?? transactionExtraInfo?.voucherVat ?? null,
        customerName,
        extraInfo: transactionExtraInfo
      };

      setResultData({
        success: true,
        transaction
      });
    } catch (error: any) {
      console.error("========== ERRO AO EFETUAR COMPRA ==========", error);
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

  // Funções de cópia para ID e PIN
  const copyIdToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const copyPinToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
      {!resultData ? (
        <div className="w-full max-w-md max-h-[90vh] rounded-2xl bg-[#161A1F] border border-white/10 flex flex-col shadow-2xl overflow-hidden">
          
          {/* CABEÇALHO (FIXO) */}
          <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center bg-[#161A1F]/90 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Receipt size={18} weight="bold" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Confirmar Operação
                </h2>
                <p className="text-xs text-gray-400 truncate max-w-[220px]">
                  {operationType} · {plan.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              <X size={15} weight="bold" />
            </button>
          </div>

          {/* CORPO COM ROLAGEM INTERNA */}
          <div className="p-5 space-y-3.5 overflow-y-auto custom-scrollbar flex-1">
            {/* REFERÊNCIA */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Referência / Destino
              </label>
              <input
                className="w-full rounded-xl bg-[#0d1117] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Nº de Telemóvel, Contador ou ID"
                value={customerReference}
                onChange={(e) => {
                  setCustomerReference(e.target.value);
                  setCustomerInfo(null);
                  setCustomerInfoError(null);
                }}
              />
            </div>

            {/* TELEFONE NOTIFICAÇÃO */}
            {requiresCustomerNotification && (
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  Telefone para Notificações
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={9}
                  value={customerNotification}
                  onChange={(event) =>
                    setCustomerNotification(
                      event.target.value.replace(/\D/g, "").slice(0, 9)
                    )
                  }
                  placeholder="Ex.: 944272561"
                  className="w-full rounded-xl bg-[#0d1117] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Número de 9 dígitos para receber a confirmação da operação.
                </p>
              </div>
            )}

            {/* DADOS DO CLIENTE */}
            {customerInfo && (
              <div className="rounded-xl bg-[#0d1117] border border-emerald-500/20 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                    Dados do Cliente
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">
                    Cliente Encontrado
                  </span>
                </div>
                {Object.entries(customerInfo).map(([key, value]) => {
                  if (value === null || value === undefined || value === "") return null;
                  const label = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, char => char.toUpperCase());
                  let displayValue = typeof value === "object" ? JSON.stringify(value) : value;

                  return (
                    <div key={key} className="flex justify-between gap-4 text-xs">
                      <span className="text-gray-500">{label}</span>
                      <span className="text-white font-medium text-right break-words max-w-[200px]">
                        {String(displayValue)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ERRO DE CONSULTA */}
            {customerInfoError && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5">
                <p className="text-xs text-rose-400">{customerInfoError}</p>
              </div>
            )}

            {/* VALOR */}
            {plan.valueVariable ? (
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  Montante a Pagar (AOA)
                </label>
                <input
                  type="number"
                  className="w-full rounded-xl bg-[#0d1117] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="Introduza o valor"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <p className="text-[10px] text-gray-500 mt-1 flex justify-between">
                  <span>Mín: {plan.valueVariableMin?.toLocaleString("pt-PT")} Kz</span>
                  <span>Máx: {plan.valueVariableMax?.toLocaleString("pt-PT")} Kz</span>
                </p>
              </div>
            ) : (
              <div className="rounded-xl bg-[#0d1117] border border-white/5 p-3.5 flex items-center justify-between">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                  Preço Fixo
                </span>
                <span className="text-base font-bold text-emerald-400">
                  {plan.price.toLocaleString("pt-PT")} Kz
                </span>
              </div>
            )}

            {/* RESUMO */}
            <div className="rounded-xl bg-[#0d1117] border border-white/5 p-3.5 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Serviço Selecionado</span>
                <span className="text-white font-medium">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Categoria / Tipo</span>
                <span className="text-gray-300">
                  {operationType} · {plan.valueVariable ? "Valor Variável" : "Valor Fixo"}
                </span>
              </div>
            </div>
          </div>

          {/* RODAPÉ DE AÇÃO (FIXO) */}
          <div className="border-t border-white/5 px-5 py-3.5 bg-[#161A1F]/90 flex gap-3 shrink-0">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 py-2.5 text-xs font-semibold text-gray-300 hover:bg-white/[0.03] hover:text-white transition-all cursor-pointer"
            >
              Cancelar
            </button>

            {!requiresCustomerInfo ? (
              <button
                disabled={loading || !customerReference.trim() || (plan.valueVariable && !amount)}
                onClick={handlePurchase}
                className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
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
                disabled={checkingCustomer || !customerReference.trim()}
                onClick={handleCustomerInfo}
                className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
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
                  (requiresCustomerNotification && customerNotification.length !== 9) ||
                  (plan.valueVariable && !amount)
                }
                onClick={handlePurchase}
                className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
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
        /* TELA DE RECIBO (LIGEIRAMENTE MAIOR E COM CÓPIA DO PIN) */
        <div className="w-full max-w-md rounded-2xl bg-[#161A1F] border border-white/10 p-7 shadow-2xl flex flex-col items-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <X size={16} weight="bold" />
          </button>

          {resultData.success && resultData.transaction ? (
            <>
              <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/[0.02] p-2.5 mb-3 shadow-inner flex items-center justify-center">
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

              <h3 className="text-lg font-bold text-white mb-4">
                Comprovativo de Pagamento
              </h3>

              <div className="w-full space-y-3 text-xs bg-[#0d1117] border border-white/5 p-4.5 rounded-xl">
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-gray-500 font-mono">ID Operação:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-mono font-semibold">
                      {resultData.transaction.id}
                    </span>
                    <button
                      onClick={() => copyIdToClipboard(String(resultData.transaction.id))}
                      className="text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      {copiedId ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-gray-400">Cliente / Destino</span>
                  <span className="text-white font-medium">{resultData.transaction.client}</span>
                </div>

                {resultData.transaction.customerName && (
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Nome do Titular</span>
                    <span className="text-emerald-400 font-medium">{resultData.transaction.customerName}</span>
                  </div>
                )}

                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-gray-400">Serviço</span>
                  <span className="text-white font-medium">{resultData.transaction.operator}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-gray-400">Montante</span>
                  <span className="text-emerald-400 font-semibold text-sm">
                    {Number(resultData.transaction.amount).toLocaleString("pt-PT")} {resultData.transaction.currency}
                  </span>
                </div>

                {resultData.transaction.voucherPIN && (
                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-gray-400">PIN do Voucher</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-400 font-mono font-bold tracking-wider">
                        {resultData.transaction.voucherPIN}
                      </span>
                      <button
                        onClick={() => copyPinToClipboard(String(resultData.transaction.voucherPIN))}
                        className="text-gray-400 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        {copiedPin ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-full mt-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
              >
                Concluir
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-2.5 mb-3 shadow-inner flex items-center justify-center text-rose-400">
                <X size={24} weight="bold" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2">
                Falha na Operação
              </h3>

              <p className="text-xs text-rose-400 text-center mb-5 bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl w-full">
                {resultData?.errorMessage || "Ocorreu um erro desconhecido ao processar a compra."}
              </p>

              <button
                onClick={() => setResultData(null)}
                className="w-full rounded-xl border border-white/10 py-3 text-xs font-semibold text-gray-300 hover:bg-white/[0.03] hover:text-white transition-all cursor-pointer"
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