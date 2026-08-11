import { useEffect, useState } from "react";
import type { CatalogPlan } from "../types/catalog";
import { purchaseService } from "../services/purchase.service";
import {
  X,
  Receipt,
  CheckCircle,
  ShieldCheck,
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
        operator: operatorInfo.name,
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
    <div className="fixed inset-0 bg-[#030712]/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
      {!resultData ? (
        <div className="w-full max-w-md max-h-[85vh] rounded-2xl bg-[#082f49] border border-[#0ea5e9]/30 flex flex-col shadow-2xl overflow-hidden text-gray-100">
          
          {/* CABEÇALHO (FIXO) */}
          <div className="px-4 py-3.5 border-b border-[#0ea5e9]/20 flex justify-between items-center bg-[#0c4a6e]/95 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0ea5e9]/20 border border-[#0ea5e9]/40 flex items-center justify-center text-[#38bdf8]">
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
                    className="w-4 h-4 rounded object-contain bg-white/10 p-0.5"
                  />
                  <p className="text-[11px] text-[#7dd3fc] truncate max-w-[200px]">
                    {operationType} · <span className="text-white font-medium">{operatorInfo.name}</span>
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 text-[#7dd3fc] hover:text-white hover:bg-[#0ea5e9]/25 transition-all cursor-pointer"
            >
              <X size={14} weight="bold" />
            </button>
          </div>

          {/* CORPO COM ROLAGEM INTERNA */}
          <div className="p-4 space-y-3.5 overflow-y-auto custom-scrollbar flex-1 bg-[#082f49]">
            
            {/* PLANO SELECIONADO CARD */}
            <div className="rounded-xl bg-gradient-to-br from-[#0c4a6e] to-[#075985] border border-[#0ea5e9]/30 p-3.5 flex items-center justify-between shadow-md">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#38bdf8]">Plano Selecionado</span>
                <h4 className="text-xs font-bold text-white mt-0.5">{plan.name}</h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7dd3fc]">Preço Base</span>
                <p className="text-xs font-bold text-[#38bdf8] mt-0.5">
                  {plan.valueVariable ? "Valor Variável" : `${Number(plan.price).toLocaleString("pt-PT")} Kz`}
                </p>
              </div>
            </div>

            {/* REFERÊNCIA / CONSULTA EPAL */}
            <div>
              {requiresDocumentQuery && (
                <>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#7dd3fc] mb-1">
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
                    className="w-full rounded-xl bg-[#0c4a6e] border border-[#0ea5e9]/30 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#38bdf8] transition-colors mb-2.5 shadow-inner"
                  >
                    <option value="CUSTOMER">Número de Cliente</option>
                    <option value="INVOICE">Número de Fatura</option>
                    <option value="TAXPAYER">Número de Contribuinte / BI</option>
                  </select>
                </>
              )}

              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#7dd3fc] mb-1">
                {requiresDocumentQuery
                  ? epalQueryType === "CUSTOMER"
                    ? "Número de Cliente EPAL"
                    : epalQueryType === "INVOICE"
                      ? "Número da Fatura EPAL"
                      : "Número de Contribuinte / BI"
                  : "Referência / Destino"}
              </label>

              <div className="flex gap-2">
                <input
                  className="w-full rounded-xl bg-[#0c4a6e] border border-[#0ea5e9]/30 px-3 py-2.5 text-xs text-white placeholder-[#7dd3fc]/50 focus:outline-none focus:border-[#38bdf8] transition-colors font-mono shadow-inner"
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

                {(requiresCustomerInfo || requiresDocumentQuery) && (
                  <button
                    type="button"
                    onClick={requiresDocumentQuery ? handleDocumentQuery : handleCustomerInfo}
                    disabled={checkingCustomer}
                    className="px-4 rounded-xl bg-[#0284c7] text-white text-xs font-bold hover:bg-[#0369a1] transition-all disabled:opacity-50 shrink-0 cursor-pointer shadow-md"
                  >
                    {checkingCustomer ? "A consultar..." : "Consultar"}
                  </button>
                )}
              </div>

              {customerInfoError && (
                <p className="text-[11px] text-red-400 mt-1.5">
                  {customerInfoError}
                </p>
              )}
            </div>

            {/* CARD DE DADOS DO CLIENTE CONSULTADO */}
            {customerInfo && (
              <div className="rounded-xl bg-[#0c4a6e] border border-[#34d399]/40 p-3 space-y-2 text-left shadow-inner">
                <div className="flex items-center gap-1.5 text-[#34d399]">
                  <ShieldCheck size={14} weight="fill" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Cliente Localizado
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  {extractCustomerName(customerInfo) && (
                    <div className="flex justify-between">
                      <span className="text-[#7dd3fc]">Nome:</span>
                      <span className="text-white font-semibold text-right">
                        {extractCustomerName(customerInfo)}
                      </span>
                    </div>
                  )}

                  {customerInfo.Client_Number && (
                    <div className="flex justify-between">
                      <span className="text-[#7dd3fc]">Nº Cliente:</span>
                      <span className="text-white font-mono">
                        {customerInfo.Client_Number}
                      </span>
                    </div>
                  )}

                  {customerInfo.Invoice_Number && (
                    <div className="flex justify-between">
                      <span className="text-[#7dd3fc]">Nº Fatura:</span>
                      <span className="text-white font-mono">
                        {customerInfo.Invoice_Number}
                      </span>
                    </div>
                  )}

                  {customerInfo.AmountDue !== undefined && customerInfo.AmountDue !== null && (
                    <div className="flex justify-between border-t border-[#0ea5e9]/20 pt-1 mt-1">
                      <span className="text-[#7dd3fc]">Valor em Dívida:</span>
                      <span className="text-[#38bdf8] font-bold font-mono">
                        {Number(customerInfo.AmountDue).toLocaleString("pt-PT")} AOA
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MONTANTE (SE VARIÁVEL E NÃO FOR DOCUMENT QUERY) */}
            {!requiresDocumentQuery && plan.valueVariable && (
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#7dd3fc] mb-1">
                  Montante (AOA)
                </label>
                <input
                  type="number"
                  className="w-full rounded-xl bg-[#0c4a6e] border border-[#0ea5e9]/30 px-3 py-2.5 text-xs text-white placeholder-[#7dd3fc]/50 focus:outline-none focus:border-[#38bdf8] transition-colors font-mono shadow-inner"
                  placeholder="Introduza o montante"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            )}

            {/* NOTIFICAÇÃO SMS (SE OBRIGATÓRIA) */}
            {requiresCustomerNotification && (
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#7dd3fc] mb-1">
                  Telemóvel para Notificação SMS
                </label>
                <input
                  className="w-full rounded-xl bg-[#0c4a6e] border border-[#0ea5e9]/30 px-3 py-2.5 text-xs text-white placeholder-[#7dd3fc]/50 focus:outline-none focus:border-[#38bdf8] transition-colors font-mono shadow-inner"
                  placeholder="Ex.: 923000000"
                  value={customerNotification}
                  onChange={(e) => setCustomerNotification(e.target.value)}
                  maxLength={9}
                />
              </div>
            )}

          </div>

          {/* RODAPÉ DO CHECKOUT */}
<div className="p-4 border-t border-[#0ea5e9]/20 bg-[#0c4a6e]/95 shrink-0">
  <div className="flex gap-2">

    {/* CANCELAR */}
    <button
      type="button"
      onClick={onClose}
      disabled={loading}
      className="flex-1 rounded-xl border border-[#0ea5e9]/30 bg-[#082f49] py-3 text-xs font-bold text-[#7dd3fc] hover:bg-[#0c4a6e] hover:text-white transition-all disabled:opacity-50 cursor-pointer"
    >
      Cancelar
    </button>

    {/* CONCLUIR PAGAMENTO */}
    <button
      type="button"
      onClick={handlePurchase}
      disabled={loading}
      className="flex-[2] rounded-xl bg-[#0ea5e9] py-3 text-xs font-bold text-white hover:bg-[#0284c7] transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#0ea5e9]/30 flex items-center justify-center gap-2"
    >
      {loading ? (
        "A processar pagamento..."
      ) : (
        <>
          Concluir
          {payableAmount > 0
            ? ` ${Number(payableAmount).toLocaleString("pt-PT")} Kz`
            : ""}
        </>
      )}
    </button>

  </div>
</div>
        </div>
      ) : (
        <div className="w-full max-w-md rounded-2xl bg-[#082f49] border border-[#0ea5e9]/30 p-5 text-center shadow-2xl space-y-4 text-gray-100 max-h-[90vh] overflow-y-auto">
          {resultData.success ? (
            <>
              {/* LOGO DO OPERADOR */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full border border-[#0ea5e9]/40 bg-[#0c4a6e] flex items-center justify-center overflow-hidden shadow-lg">
                  <img
                    src={operatorInfo.logoUrl}
                    alt={operatorInfo.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              {/* ESTADO */}
              <div>
                <div className="flex items-center justify-center gap-1.5 text-[#34d399]">
                  <CheckCircle size={15} weight="fill" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Transação Bem-Sucedida
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-2">
                  Comprovativo de Pagamento
                </h3>

                <p className="text-[11px] text-[#7dd3fc] mt-1">
                  A sua transação foi efetuada com sucesso.
                </p>
              </div>

              {/* DETALHES DA TRANSAÇÃO */}
              <div className="rounded-xl bg-[#0c4a6e] border border-[#0ea5e9]/20 px-3.5 py-2 text-left">

                {/* ID OPERAÇÃO */}
                <div className="flex justify-between items-center py-2 border-b border-[#0ea5e9]/10">
                  <span className="text-[10px] text-[#7dd3fc]">
                    ID Operação
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-white font-mono font-semibold">
                      {String(resultData.transaction?.id ?? "N/D")}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          String(resultData.transaction?.id ?? ""),
                          "transactionId"
                        )
                      }
                      className="text-[#7dd3fc] hover:text-white transition-colors cursor-pointer"
                      title="Copiar ID da operação"
                    >
                      {copiedField === "transactionId" ? (
                        <Check size={12} className="text-[#34d399]" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                </div>

                {/* REFERÊNCIA */}
                <div className="flex justify-between items-center py-2 border-b border-[#0ea5e9]/10">
                  <span className="text-[10px] text-[#7dd3fc]">
                    Referência
                  </span>

                  <span className="text-[11px] text-white font-mono font-semibold">
                    {String(resultData.transaction?.client ?? "N/D")}
                  </span>
                </div>

                {/* OPERADORA */}
                <div className="flex justify-between items-center py-2 border-b border-[#0ea5e9]/10">
                  <span className="text-[10px] text-[#7dd3fc]">
                    Operadora
                  </span>

                  <span className="text-[11px] text-white font-semibold">
                    {String(
                      resultData.transaction?.operator ??
                      operatorInfo.name ??
                      "N/D"
                    )}
                  </span>
                </div>

                {/* SERVIÇO */}
                <div className="flex justify-between items-center py-2 border-b border-[#0ea5e9]/10">
                  <span className="text-[10px] text-[#7dd3fc]">
                    Serviço
                  </span>

                  <span className="text-[11px] text-white font-semibold text-right max-w-[210px]">
                    {String(plan.name ?? "N/D")}
                  </span>
                </div>

                {/* CLIENTE — APENAS SE EXISTIR */}
                {resultData.transaction?.customerName && (
                  <div className="flex justify-between items-center py-2 border-b border-[#0ea5e9]/10">
                    <span className="text-[10px] text-[#7dd3fc]">
                      Cliente
                    </span>

                    <span className="text-[11px] text-white font-semibold text-right max-w-[210px]">
                      {String(resultData.transaction.customerName)}
                    </span>
                  </div>
                )}

                {/* MONTANTE */}
                <div className="flex justify-between items-center py-2 border-b border-[#0ea5e9]/10">
                  <span className="text-[10px] text-[#7dd3fc]">
                    Montante
                  </span>

                  <span className="text-sm text-[#38bdf8] font-extrabold font-mono">
                    {Number(
                      resultData.transaction?.amount ?? 0
                    ).toLocaleString("pt-PT")}{" "}
                    {resultData.transaction?.currency ?? "AOA"}
                  </span>
                </div>

                {/* DATA */}
                <div className="flex justify-between items-center py-2 border-b border-[#0ea5e9]/10">
                  <span className="text-[10px] text-[#7dd3fc]">
                    Data
                  </span>

                  <span className="text-[10px] text-white font-mono">
                    {resultData.transaction?.createdAt
                      ? new Date(
                          resultData.transaction.createdAt
                        ).toLocaleString("pt-PT", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })
                      : "N/D"}
                  </span>
                </div>

                {/* ESTADO */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-[10px] text-[#7dd3fc]">
                    Estado
                  </span>

                  <span className="text-[10px] text-[#34d399] font-bold uppercase">
                    {String(
                      resultData.transaction?.status ?? "SUCCESS"
                    ) === "SUCCESS"
                      ? "CONCLUÍDO"
                      : String(resultData.transaction?.status ?? "N/D")}
                  </span>
                </div>
              </div>

              {/* PIN DE VOUCHER */}
              {resultData.transaction?.voucherPIN && (
                <div className="rounded-xl bg-[#0c4a6e] border border-[#0ea5e9]/40 p-3 text-left space-y-1.5 font-mono shadow-inner">
                  <div className="flex justify-between items-center text-[10px] text-[#38bdf8] font-bold">
                    <span>PIN DE CARREGAMENTO</span>

                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          resultData.transaction.voucherPIN,
                          "voucherPIN"
                        )
                      }
                      className="text-[#7dd3fc] hover:text-white cursor-pointer"
                    >
                      {copiedField === "voucherPIN" ? (
                        <Check
                          size={14}
                          className="text-[#38bdf8]"
                        />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>

                  <p className="text-sm font-bold text-white tracking-wider">
                    {resultData.transaction.voucherPIN}
                  </p>
                </div>
              )}

              {/* RODAPÉ */}
              <div className="pt-2 border-t border-[#0ea5e9]/10">
                <p className="text-[8px] text-gray-500 uppercase tracking-[0.25em]">
                  Obrigado pela preferência
                </p>
              </div>

              {/* CONCLUIR */}
              <button
                onClick={onClose}
                className="w-full rounded-xl bg-[#0ea5e9] py-3 text-xs font-bold text-white hover:bg-[#0284c7] transition-all cursor-pointer shadow-lg shadow-[#0ea5e9]/30"
              >
                Concluir
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-red-400">
                Erro na Transação
              </h3>
              <p className="text-xs text-gray-300">
                {resultData.errorMessage}
              </p>
              <button
                onClick={() => setResultData(null)}
                className="w-full rounded-xl bg-[#0ea5e9] py-3 text-xs font-bold text-white hover:bg-[#0284c7] transition-all cursor-pointer shadow-lg shadow-[#0ea5e9]/30"
              >
                Tentar Novamente
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}