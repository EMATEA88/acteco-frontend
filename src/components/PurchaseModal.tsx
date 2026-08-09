import { useEffect, useState } from "react";
import type { CatalogPlan } from "../types/catalog";
import { purchaseService } from "../services/purchase.service";
import {
  X,
  Receipt,
  CheckCircle,
  ShieldCheck,
  User,
  Hash,
  Calendar,
  FileText,
  Copy,
  Check
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
  const [epalQueryType, setEpalQueryType] = useState<"CUSTOMER" | "INVOICE" | "TAXPAYER">("CUSTOMER");
  const [customerNotification, setCustomerNotification] = useState("");
  const [amount, setAmount] = useState(
    plan.valueVariable ? "" : String(plan.price)
  );
  const [loading, setLoading] = useState(false);
  const [checkingCustomer, setCheckingCustomer] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<Record<string, any> | null>(null);
  const [customerInfoError, setCustomerInfoError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [resultData, setResultData] = useState<{
    success: boolean;
    transaction?: any;
    errorMessage?: string;
  } | null>(null);
  
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

  // ===================================================
  // PROVIDER CODE E REGRAS DE NOTIFICAÇÃO / PRODUTO
  // ===================================================

  const providerCode = String(
    (plan as CatalogPlan & { providerCode?: string }).providerCode ?? ""
  ).trim().toUpperCase();
  
  const operatorInfo = getOperatorInfo(
    `${plan.name} ${providerCode}`
  );

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
  ]);

  const requiresCustomerInfo =
    CUSTOMER_INFO_PROVIDER_CODES.has(providerCode);

  // ===================================================
  // PROVIDERS COM CONSULTA DE DOCUMENTOS
  // ===================================================
  const requiresDocumentQuery =
    providerCode === "EPAL";

  // ===================================================
  // VALOR APURADO PARA PAGAMENTO
  // ===================================================
  const payableAmount = requiresDocumentQuery
    ? Number(customerInfo?.AmountDue ?? 0)
    : Number(amount);

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
  // CONSULTA DE DOCUMENTOS / FATURAS (EPAL)
  // ===================================================

  async function handleDocumentQuery() {
    try {
      const queryValue = customerReference.trim();

      if (!queryValue) {
        const labels = {
          CUSTOMER: "número de cliente",
          INVOICE: "número da fatura emitida pela EPAL",
          TAXPAYER: "número de contribuinte / BI"
        };

        setCustomerInfoError(
          `Introduza o ${labels[epalQueryType]}.`
        );
        return;
      }

      if (providerCode !== "EPAL") {
        setCustomerInfoError(
          "Este serviço não possui consulta de documentos configurada."
        );
        return;
      }

      setCheckingCustomer(true);
      setCustomerInfo(null);
      setCustomerInfoError(null);

      const akiQueryType =
        epalQueryType === "CUSTOMER"
          ? "CLIENT"
          : epalQueryType === "TAXPAYER"
            ? "TAXNUMBER"
            : epalQueryType;

      const response = await purchaseService.documentQuery({
        providerCode: "EPAL",
        queryType: akiQueryType,
        queryValue
      });

      const status = String(
        response?.status ??
        response?.data?.Status ??
        ""
      ).toUpperCase();

      if (
        status === "FAILED" ||
        response?.success === false
      ) {
        setCustomerInfoError(
          response?.data?.Response?.Description ??
          "A EPAL não conseguiu localizar os dados informados."
        );
        return;
      }

      const data = (response?.data ?? {}) as {
        Clients?: Array<{
          Number?: string;
          Name?: string;
          TaxNumber?: string;
          Address?: string;
        }>;
        Invoices?: Array<{
          Number?: string;
          Client_Number?: string;
          Amount?: number;
          AmountPaid?: number;
          AmountDue?: number;
          Date?: string;
          DateDue?: string;
        }>;
      };

      const clients = Array.isArray(data.Clients) ? data.Clients : [];
      const invoices = Array.isArray(data.Invoices) ? data.Invoices : [];

      if (clients.length === 0 && invoices.length === 0) {
        setCustomerInfoError(
          "A EPAL não encontrou nenhum cliente ou fatura para os dados informados."
        );
        return;
      }

      let invoice: any = null;

      if (epalQueryType === "INVOICE") {
        invoice =
          invoices.find(
            (item: any) =>
              String(item?.Number ?? "").trim() === queryValue
          ) ??
          invoices[0] ??
          null;
      } else {
        invoice = invoices[0] ?? null;
      }

      const clientNumber = String(
        invoice?.Client_Number ??
        clients[0]?.Number ??
        ""
      ).trim();

      const client =
        clients.find(
          (item: any) =>
            String(item?.Number ?? "").trim() === clientNumber
        ) ??
        clients[0] ??
        null;

      const normalizedInfo: Record<string, any> = {
        ...(client ?? {}),
        Query_Type: epalQueryType,
        Query_Value: queryValue,
        Invoice_Number: invoice?.Number ?? null,
        Client_Number: clientNumber || (client?.Number ?? null),
        Amount: invoice?.Amount ?? null,
        AmountPaid: invoice?.AmountPaid ?? null,
        AmountDue: invoice?.AmountDue ?? null,
        Date: invoice?.Date ?? null,
        DateDue: invoice?.DateDue ?? null
      };

      setCustomerInfo(normalizedInfo);
    } catch (error: any) {
      setCustomerInfoError(
        error?.response?.data?.message ??
        error?.response?.data?.error ??
        error?.message ??
        "Erro ao consultar os dados da EPAL."
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
      const purchaseCustomerReference =
        requiresDocumentQuery
          ? String(customerInfo?.Client_Number ?? "").trim()
          : reference;

      if (!reference) {
        setResultData({
          success: false,
          errorMessage: "Introduza a referência ou número do cliente."
        });
        return;
      }

      if (requiresDocumentQuery && !purchaseCustomerReference) {
        setResultData({
          success: false,
          errorMessage: "A fatura EPAL foi consultada, mas não foi possível identificar o cliente."
        });
        return;
      }

      if (
        !requiresDocumentQuery &&
        plan.valueVariable &&
        (!amount || Number(amount) <= 0)
      ) {
        setResultData({
          success: false,
          errorMessage: "Introduza um montante válido."
        });
        return;
      }

      if (requiresDocumentQuery && payableAmount <= 0) {
        setResultData({
          success: false,
          errorMessage: "A fatura EPAL não possui um valor em dívida válido."
        });
        return;
      }

      if (
        (requiresCustomerInfo || requiresDocumentQuery) &&
        !customerInfo
      ) {
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
          errorMessage: "Introduza um número de telefone válido com 9 dígitos."
        });
        return;
      }

      setLoading(true);

      const response = (await purchaseService.purchase({
        planId: plan.id,
        customerReference: purchaseCustomerReference,
        customerNotification: notification,
        amount: payableAmount
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
          `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        client: purchaseCustomerReference,
        operator: plan.name,
        amount: payableAmount,
        currency: "AOA",
        createdAt: new Date().toISOString(),
        status: akiResponse?.Status ?? akiResponse?.status ?? "SUCCESS",
        voucherPIN: transactionExtraInfo?.VoucherPIN ?? transactionExtraInfo?.voucherPIN ?? null,
        voucherValue: transactionExtraInfo?.VoucherValue ?? transactionExtraInfo?.voucherValue ?? null,
        customerName,
        customerAddress: customerInfo?.Address ?? customerInfo?.address ?? null,
        invoiceNumber: customerInfo?.Invoice_Number ?? customerInfo?.invoiceNumber ?? null,
        clientNumber: customerInfo?.Client_Number ?? customerInfo?.clientNumber ?? purchaseCustomerReference,
        extraInfo: transactionExtraInfo
      };

      setResultData({
        success: true,
        transaction
      });
    } catch (error: any) {
      setResultData({
        success: false,
        errorMessage:
          error?.response?.data?.message ??
          error?.response?.data?.error ??
          "Erro ao efetuar compra. Tente novamente."
      });
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
      {!resultData ? (
        <div className="w-full max-w-md max-h-[85vh] rounded-2xl bg-[#161A1F] border border-white/15 flex flex-col shadow-2xl overflow-hidden">
          
          {/* CABEÇALHO (FIXO) */}
          <div className="px-4 py-3.5 border-b border-white/10 flex justify-between items-center bg-[#161A1F]/95 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Receipt size={18} weight="bold" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white tracking-wide uppercase">
                  Checkout de Pagamento
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <img
                    src={operatorInfo.logoUrl}
                    alt={operatorInfo.name}
                    className="w-4 h-4 rounded object-contain bg-white/5 p-0.5"
                  />
                  <p className="text-[11px] text-gray-400 truncate max-w-[200px]">
                    {operationType} · <span className="text-white font-medium">{operatorInfo.name}</span>
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.1] transition-all cursor-pointer"
            >
              <X size={14} weight="bold" />
            </button>
          </div>

          {/* CORPO COM ROLAGEM INTERNA */}
          <div className="p-4 space-y-3.5 overflow-y-auto custom-scrollbar flex-1">
            
            {/* PLANO SELECIONADO CARD */}
            <div className="rounded-xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Plano Selecionado</span>
                <h4 className="text-xs font-bold text-white mt-0.5">{plan.name}</h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Preço Base</span>
                <p className="text-xs font-bold text-emerald-400 mt-0.5">
                  {plan.valueVariable ? "Valor Variável" : `${Number(plan.price).toLocaleString("pt-PT")} Kz`}
                </p>
              </div>
            </div>

            {/* REFERÊNCIA / CONSULTA EPAL */}
            <div>
              {requiresDocumentQuery && (
                <>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Pesquisar EPAL por
                  </label>

                  <select
                    value={epalQueryType}
                    onChange={(e) => {
                      setEpalQueryType(
                        e.target.value as "CUSTOMER" | "INVOICE" | "TAXPAYER"
                      );
                      setCustomerReference("");
                      setCustomerInfo(null);
                      setCustomerInfoError(null);
                    }}
                    className="w-full rounded-xl bg-[#0d1117] border border-white/15 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors mb-2.5"
                  >
                    <option value="CUSTOMER">Número de Cliente</option>
                    <option value="INVOICE">Número de Fatura</option>
                    <option value="TAXPAYER">Número de Contribuinte / BI</option>
                  </select>
                </>
              )}

              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                {requiresDocumentQuery
                  ? epalQueryType === "CUSTOMER"
                    ? "Número de Cliente EPAL"
                    : epalQueryType === "INVOICE"
                      ? "Número da Fatura EPAL"
                      : "Número de Contribuinte / BI"
                  : "Referência / Destino"}
              </label>

              <input
                className="w-full rounded-xl bg-[#0d1117] border border-white/15 px-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                placeholder={
                  requiresDocumentQuery
                    ? epalQueryType === "CUSTOMER"
                      ? "Ex.: 123456"
                      : epalQueryType === "INVOICE"
                        ? "Ex.: 9010000001"
                        : "Ex.: 000988522LA037"
                    : "Nº de Telemóvel, Contador ou ID"
                }
                value={customerReference}
                onChange={(e) => {
                  setCustomerReference(e.target.value);
                  setCustomerInfo(null);
                  setCustomerInfoError(null);
                }}
              />
            </div>

            {/* BOTÃO DE CONSULTA */}
            {(requiresCustomerInfo || requiresDocumentQuery) && (
              <button
                type="button"
                onClick={requiresDocumentQuery ? handleDocumentQuery : handleCustomerInfo}
                disabled={checkingCustomer}
                className="w-full rounded-xl bg-white/[0.06] border border-white/15 py-2.5 text-xs font-semibold text-white hover:bg-white/[0.1] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {checkingCustomer ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-emerald-400 rounded-full animate-spin" />
                    <span>A consultar dados oficiais...</span>
                  </>
                ) : (
                  <span>
                    {requiresDocumentQuery ? "Consultar Fatura / Cliente EPAL" : "Consultar Dados do Cliente"}
                  </span>
                )}
              </button>
            )}

            {/* TELEFONE NOTIFICAÇÃO */}
            {requiresCustomerNotification && (
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Telefone para Notificações (SMS)
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
                  className="w-full rounded-xl bg-[#0d1117] border border-white/15 px-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                />
              </div>
            )}

            {/* DADOS DETALHADOS DO CLIENTE (ESTILO PROFISSIONAL) */}
            {customerInfo && (
              <div className="rounded-xl bg-[#0d1117] border border-emerald-500/30 p-3.5 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-400" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      {requiresDocumentQuery ? "Detalhes da Fatura & Cliente" : "Dados Verificados"}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 uppercase tracking-wider">
                    Válido
                  </span>
                </div>

                {requiresDocumentQuery && (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-gray-400 flex items-center gap-1.5"><User size={13} /> Nome do Titular</span>
                      <span className="text-white font-semibold text-right max-w-[190px] truncate">{customerInfo.Name || "N/D"}</span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-gray-400 flex items-center gap-1.5"><Hash size={13} /> Nº de Cliente</span>
                      <span className="text-emerald-300 font-mono font-semibold">{customerInfo.Client_Number || "N/D"}</span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-gray-400 flex items-center gap-1.5"><FileText size={13} /> Nº da Fatura</span>
                      <span className="text-white font-mono font-semibold">{customerInfo.Invoice_Number || "N/D"}</span>
                    </div>

                    {customerInfo.Address && (
                      <div className="flex justify-between items-center py-1 border-b border-white/5">
                        <span className="text-gray-400">Endereço</span>
                        <span className="text-white text-right max-w-[180px] truncate">{customerInfo.Address}</span>
                      </div>
                    )}

                    {customerInfo.TaxNumber && (
                      <div className="flex justify-between items-center py-1 border-b border-white/5">
                        <span className="text-gray-400">NIF / BI</span>
                        <span className="text-white font-mono">{customerInfo.TaxNumber}</span>
                      </div>
                    )}

                    {customerInfo.DateDue && (
                      <div className="flex justify-between items-center py-1 border-b border-white/5">
                        <span className="text-gray-400 flex items-center gap-1.5"><Calendar size={13} /> Vencimento</span>
                        <span className="text-white font-mono">{customerInfo.DateDue}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-gray-300 font-bold">Montante em Dívida</span>
                      <span className="text-emerald-400 font-extrabold text-sm font-mono">
                        {Number(customerInfo.AmountDue ?? 0).toLocaleString("pt-PT")} Kz
                      </span>
                    </div>
                  </div>
                )}

                {!requiresDocumentQuery && Object.entries(customerInfo).map(([key, value]) => {
                  if (value === null || value === undefined || value === "") return null;
                  const label = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, char => char.toUpperCase());
                  let displayValue = typeof value === "object" ? JSON.stringify(value) : value;

                  return (
                    <div key={key} className="flex justify-between gap-4 text-xs py-1 border-b border-white/5 last:border-0">
                      <span className="text-gray-400">{label}</span>
                      <span className="text-white font-medium text-right break-words max-w-[190px] font-mono">
                        {String(displayValue)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ERRO DE CONSULTA */}
            {customerInfoError && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 px-3.5 py-3">
                <p className="text-xs text-rose-400 font-medium">{customerInfoError}</p>
              </div>
            )}

            {/* VALOR */}
            {plan.valueVariable && !requiresDocumentQuery && (
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Montante a Pagar (AOA)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl bg-[#0d1117] border border-white/15 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            )}
          </div>

          {/* RODAPÉ (FIXO) */}
          <div className="p-4 border-t border-white/10 bg-[#161A1F] shrink-0">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="text-gray-400">Total a Debitar:</span>
              <span className="text-emerald-400 font-bold text-sm font-mono">
                {payableAmount > 0 ? `${payableAmount.toLocaleString("pt-PT")} Kz` : "0,00 Kz"}
              </span>
            </div>
            <button
              type="button"
              onClick={handlePurchase}
              disabled={loading}
              className="w-full h-11 rounded-xl bg-emerald-500 font-bold text-xs text-black hover:bg-emerald-400 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 uppercase tracking-wide"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  <span>A processar transação...</span>
                </>
              ) : (
                <span>Confirmar e Efetuar Pagamento</span>
              )}
            </button>
          </div>

        </div>
      ) : (
        /* TELA DE SUCESSO PROFISSIONAL (RECIBO DETALHADO) */
        <div className="w-full max-w-md max-h-[90vh] rounded-2xl bg-[#161A1F] border border-emerald-500/40 p-5 space-y-4 shadow-2xl overflow-y-auto custom-scrollbar animate-fadeIn">
          
          <div className="text-center space-y-2 pt-2">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <CheckCircle size={32} weight="fill" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Pagamento Bem-Sucedido</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">A transação foi processada e registada com sucesso.</p>
            </div>
          </div>

          {/* RECIBO DETALHADO COM DADOS REAIS */}
          <div className="rounded-xl bg-[#0d1117] border border-white/10 p-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
              <span className="text-gray-400 text-[10px] uppercase">ID da Transação</span>
              <div className="flex items-center gap-1.5 text-white font-bold">
                <span>{resultData.transaction?.id}</span>
                <button 
                  onClick={() => copyToClipboard(String(resultData.transaction?.id), 'txId')}
                  className="p-1 hover:text-emerald-400 transition-colors"
                  title="Copiar ID"
                >
                  {copiedField === 'txId' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-500">Operadora / Serviço:</span>
                <span className="text-white font-sans font-semibold">{resultData.transaction?.operator}</span>
              </div>

              {resultData.transaction?.customerName && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Titular / Cliente:</span>
                  <span className="text-white font-sans font-semibold text-right max-w-[180px] truncate">{resultData.transaction?.customerName}</span>
                </div>
              )}

              {resultData.transaction?.clientNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Número de Cliente:</span>
                  <span className="text-emerald-300">{resultData.transaction?.clientNumber}</span>
                </div>
              )}

              {resultData.transaction?.invoiceNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Número da Fatura:</span>
                  <span className="text-white">{resultData.transaction?.invoiceNumber}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-500">Referência / Destino:</span>
                <span className="text-white">{resultData.transaction?.client}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Data e Hora:</span>
                <span className="text-white">{new Date(resultData.transaction?.createdAt).toLocaleString("pt-PT")}</span>
              </div>

              {resultData.transaction?.voucherPIN && (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5 my-2 space-y-1">
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-sans font-bold">PIN do Voucher Gerado</span>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-emerald-300 font-mono tracking-widest">{resultData.transaction.voucherPIN}</span>
                    <button 
                      onClick={() => copyToClipboard(resultData.transaction.voucherPIN, 'pin')}
                      className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] hover:bg-emerald-500/30 transition-colors"
                    >
                      {copiedField === 'pin' ? 'Copiado!' : 'Copiar PIN'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-white/10 font-sans">
              <span className="text-gray-400 text-xs font-semibold">Montante Pago</span>
              <span className="text-emerald-400 font-extrabold text-sm font-mono">
                {Number(resultData.transaction?.amount ?? 0).toLocaleString("pt-PT")} Kz
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-white/10 text-xs font-bold text-white hover:bg-white/15 transition-colors cursor-pointer uppercase tracking-wide font-sans shadow-md"
          >
            Fechar Janela
          </button>
        </div>
      )}
    </div>
  );
}