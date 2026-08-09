import { useEffect, useState } from "react";
import type { CatalogPlan } from "../types/catalog";
import { purchaseService } from "../services/purchase.service";
import {
  X,
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
  const [epalQueryType, setEpalQueryType] = useState<"CUSTOMER" | "INVOICE" | "TAXPAYER">("CUSTOMER");
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
  // VALOR APURADO PARA PAGAMENTO (FASE 6)
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
  // CONSULTA DE DOCUMENTOS / FATURAS (FASE 1)
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
        Status?: string;
        Response?: {
          Code?: number;
          Description?: string;
          Runtime?: string;
        };
      };

      const clients = Array.isArray(data.Clients)
        ? data.Clients
        : [];

      const invoices = Array.isArray(data.Invoices)
        ? data.Invoices
        : [];

      if (clients.length === 0 && invoices.length === 0) {
        setCustomerInfoError(
          "A EPAL não encontrou nenhum cliente ou fatura para os dados informados."
        );
        return;
      }

      /*
       * Para consulta por fatura:
       * - localizamos exatamente a fatura solicitada.
       *
       * Para consulta por cliente / contribuinte:
       * - utilizamos o primeiro cliente devolvido;
       * - se a EPAL devolver faturas, utilizamos a primeira fatura
       *   devolvida para apresentar o valor disponível.
       *
       * Não inventamos dados: todos os valores apresentados vêm da resposta AKI.
       */
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

      /*
       * Se a consulta encontrou apenas o cliente e nenhuma fatura,
       * ainda mostramos os dados do cliente.
       * O pagamento só poderá avançar quando existir um valor em dívida.
       */
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
      console.error(
        "========== ERRO AO CONSULTAR EPAL ==========",
        error
      );

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
  // COMPRA (FASE 2 E FASE 6)
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
          errorMessage:
            "A fatura EPAL foi consultada, mas não foi possível identificar o cliente associado."
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
          errorMessage:
            "A fatura EPAL não possui um valor em dívida válido para pagamento."
        });
        return;
      }

      if (
        (requiresCustomerInfo || requiresDocumentQuery) &&
        !customerInfo
      ) {
        setResultData({
          success: false,
          errorMessage:
            "Consulte primeiro os dados do cliente antes de efetuar o pagamento."
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
          Math.floor(Math.random() * 10000),
        client: purchaseCustomerReference,
        operator: plan.name,
        amount: payableAmount,
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
               <div className="flex items-center gap-2">
              <img
                 src={operatorInfo.logoUrl}
                 alt={operatorInfo.name}
                 className="w-5 h-5 rounded-md object-contain"
                />

               <p className="text-xs text-gray-400 truncate max-w-[220px]">
               {operationType} · {operatorInfo.name}
             </p>
              </div>
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
            {/* REFERÊNCIA / CONSULTA EPAL */}
            <div>
              {requiresDocumentQuery && (
                <>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
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
                    className="w-full rounded-xl bg-[#0d1117] border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors mb-2"
                  >
                    <option value="CUSTOMER">
                      Número de Cliente
                    </option>
                    <option value="INVOICE">
                      Número de Fatura
                    </option>
                    <option value="TAXPAYER">
                      Número de Contribuinte / BI
                    </option>
                  </select>
                </>
              )}

              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                {requiresDocumentQuery
                  ? epalQueryType === "CUSTOMER"
                    ? "Número de Cliente EPAL"
                    : epalQueryType === "INVOICE"
                      ? "Número da Fatura EPAL"
                      : "Número de Contribuinte / BI"
                  : "Referência / Destino"}
              </label>

              <input
                className="w-full rounded-xl bg-[#0d1117] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
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

              {requiresDocumentQuery && (
                <p className="text-[10px] text-gray-500 mt-1">
                  A consulta será feita na EPAL usando o método selecionado acima.
                </p>
              )}
            </div>

            {/* BOTÃO DE CONSULTA */}
            {(requiresCustomerInfo || requiresDocumentQuery) && (
              <button
                type="button"
                onClick={requiresDocumentQuery ? handleDocumentQuery : handleCustomerInfo}
                disabled={checkingCustomer}
                className="w-full rounded-xl bg-white/[0.05] border border-white/10 py-2.5 text-xs font-semibold text-white hover:bg-white/[0.08] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {checkingCustomer ? (
                  <span>A consultar...</span>
                ) : (
                  <span>
                    {requiresDocumentQuery
                      ? "Consultar EPAL"
                      : "Consultar Cliente"}
                  </span>
                )}
              </button>
            )}

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

            {/* DADOS DO CLIENTE / FATURA (FASE 5) */}
            {customerInfo && (
              <div className="rounded-xl bg-[#0d1117] border border-emerald-500/20 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                    {requiresDocumentQuery ? "Resultado da Consulta EPAL" : "Dados do Cliente"}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">
                    {requiresDocumentQuery ? "Fatura Encontrada" : "Cliente Encontrado"}
                  </span>
                </div>

                {requiresDocumentQuery && (
                  <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">
                        Método de Consulta
                      </span>
                      <span className="text-white font-semibold">
                        {epalQueryType === "CUSTOMER"
                          ? "Nº de Cliente"
                          : epalQueryType === "INVOICE"
                            ? "Nº de Fatura"
                            : "Nº de Contribuinte / BI"}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">
                        Referência Consultada
                      </span>
                      <span className="text-white font-semibold text-right break-all max-w-[220px]">
                        {customerInfo.Query_Value}
                      </span>
                    </div>

                    {customerInfo.Client_Number && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">
                          Nº do Cliente
                        </span>
                        <span className="text-white font-semibold">
                          {customerInfo.Client_Number}
                        </span>
                      </div>
                    )}

                    {customerInfo.Invoice_Number && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">
                          Nº da Fatura
                        </span>
                        <span className="text-white font-semibold">
                          {customerInfo.Invoice_Number}
                        </span>
                      </div>
                    )}

                    {customerInfo.AmountDue !== null &&
                      customerInfo.AmountDue !== undefined && (
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">
                            Valor em Dívida
                          </span>
                          <span className="text-emerald-400 font-bold">
                            {Number(customerInfo.AmountDue ?? 0).toLocaleString("pt-PT")} Kz
                          </span>
                        </div>
                      )}

                    {customerInfo.DateDue && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">
                          Data de Vencimento
                        </span>
                        <span className="text-white font-medium">
                          {String(customerInfo.DateDue)}
                        </span>
                      </div>
                    )}
                  </div>
                )}


                {!requiresDocumentQuery && Object.entries(customerInfo).map(([key, value]) => {
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
            {plan.valueVariable && !requiresDocumentQuery ? (
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
                  {requiresDocumentQuery ? "Montante da Fatura" : "Preço Fixo"}
                </span>
                <span className="text-sm font-bold text-white">
                  {requiresDocumentQuery 
                    ? `${Number(customerInfo?.AmountDue ?? 0).toLocaleString("pt-PT")} Kz`
                    : `${Number(amount).toLocaleString("pt-PT")} Kz`}
                </span>
              </div>
            )}
          </div>

          {/* RODAPÉ / AÇÕES (FIXO) */}
          <div className="p-5 border-t border-white/5 bg-[#161A1F]/90 shrink-0">
            <button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] py-3 text-xs font-bold text-slate-950 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>A processar...</span>
              ) : (
                <span>Efetuar Pagamento</span>
              )}
            </button>
          </div>

        </div>
      ) : (
        /* TELA DE SUCESSO / RESULTADO */
        <div className="w-full max-w-md rounded-2xl bg-[#161A1F] border border-white/10 p-6 shadow-2xl text-center space-y-4">
          <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${resultData.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
            {resultData.success ? <ShieldCheck size={24} weight="bold" /> : <X size={24} weight="bold" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {resultData.success ? "Operação Realizada com Sucesso" : "Falha na Operação"}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {resultData.success ? "O seu pagamento foi processado com sucesso." : (resultData.errorMessage || "Não foi possível concluir a operação.")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-white/10 hover:bg-white/20 py-2.5 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}