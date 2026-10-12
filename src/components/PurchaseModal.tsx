import { useState } from "react";

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

  pending?: boolean;

  transaction?: any;

  errorMessage?: string;

} | null>(null);



  // ===================================================

  // AUTO-PREENCHIMENTO DO TELEFONE

  // ===================================================



 // useEffect(() => {

  //const reference = customerReference

   // .replace(/\D/g, "");



  // Só preencher automaticamente quando

  // a referência já for claramente um telefone

  // angolano de 9 dígitos.

  //if (reference.length === 9) {

    //setCustomerNotification((current) => {

    //  if (current.trim() !== "") {

      //  return current;

      //}



    //  return reference;

   // });

  //}

//}, [customerReference]);



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

   notificationType === "SMS" ||

   providerCode === "ZAP_SAT" ||

   providerCode === "ZAP_MEDIA" ||

   providerCode === "DSTV";



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



      const customerNameForPurchase =

  extractCustomerName(customerInfo) ?? undefined;



const response = (await purchaseService.purchase({

  planId: plan.id,

  customerReference: purchaseCustomerReference,

  customerName: customerNameForPurchase,

  customerNotification: notification,

  amount: payableAmount

})) as any;



      const akiResponse =

        response?.akiResponse ??

        response?.data?.akiResponse ??

        response?.data ??

        response;



        const purchaseStatus = String(

  response?.status ??

  response?.data?.status ??

  akiResponse?.Status ??

  akiResponse?.status ??

  ""

)

  .trim()

  .toUpperCase();



const pending =

  response?.pending === true ||

  purchaseStatus === "RUNNING" ||

  purchaseStatus === "IN_PROGRESS";



const normalizedStatus =

  pending

    ? "IN_PROGRESS"

    : purchaseStatus === "SUCCESS" || purchaseStatus === "COMPLETED"

      ? "SUCCESS"

      : purchaseStatus || "UNKNOWN";



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

        status: normalizedStatus,

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

        pending,

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
          <div className="w-full max-w-lg max-h-[90vh] overflow-hidden rounded-[28px] border border-[#0ea5e9]/30 bg-[#082f49] text-white shadow-2xl">
            <div className="max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="px-5 pt-5 pb-4 sm:px-6">
                <div className="flex items-start gap-3.5">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white flex items-center justify-center ring-1 ring-[#0ea5e9]/30">
                    <img
                      src={operatorInfo.logoUrl}
                      alt={operatorInfo.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <h2 className="text-lg sm:text-xl font-semibold leading-tight tracking-tight text-white">
                      {plan.name}
                    </h2>
                    <p className="mt-1 text-sm text-[#7dd3fc]">
                      {operationType}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    aria-label="Fechar"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#7dd3fc] transition hover:bg-[#0ea5e9]/15 hover:text-white disabled:opacity-50 cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mt-5 flex items-end justify-between gap-4 border-b border-[#0ea5e9]/20 pb-5">
                  <div>
                    <p className="text-xs font-medium text-[#7dd3fc]">
                      {requiresDocumentQuery ? "Valor a pagar" : plan.valueVariable ? "Montante" : "Total"}
                    </p>
                    <p className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">
                      {payableAmount > 0
                        ? `${Number(payableAmount).toLocaleString("pt-PT")} Kz`
                        : plan.valueVariable
                          ? "— Kz"
                          : `${Number(plan.price).toLocaleString("pt-PT")} Kz`}
                    </p>
                  </div>
                  {plan.valueVariable && !requiresDocumentQuery && (
                    <span className="mb-1 rounded-lg border border-[#0ea5e9]/30 bg-[#0ea5e9]/10 px-2.5 py-1.5 text-xs text-[#38bdf8]">
                      Valor variável
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4 px-5 pb-5 sm:px-6">
                {/* RESUMO DO PLANO E DO PAGAMENTO */}
                <div className="rounded-xl border border-[#0ea5e9]/30 bg-gradient-to-br from-[#0c4a6e] to-[#075985] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#7dd3fc]">
                        Plano selecionado
                      </p>
                      <p className="mt-1 break-words text-sm font-semibold text-white">
                        {plan.name}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#7dd3fc]">
                        {requiresDocumentQuery ? "Valor em dívida" : plan.valueVariable ? "Montante" : "Preço"}
                      </p>
                      <p className="mt-1 text-sm font-bold tabular-nums text-[#38bdf8]">
                        {payableAmount > 0
                          ? `${Number(payableAmount).toLocaleString("pt-PT")} Kz`
                          : plan.valueVariable
                            ? "A definir"
                            : `${Number(plan.price).toLocaleString("pt-PT")} Kz`}
                      </p>
                    </div>
                  </div>
                  {customerInfo && (
                    <div className="mt-3 border-t border-white/10 pt-3">
                      <p className="text-xs text-[#7dd3fc]">Beneficiário</p>
                      <p className="mt-1 break-words text-sm font-medium text-white">
                        {extractCustomerName(customerInfo) ?? customerReference}
                      </p>
                      {customerInfo.Client_Number && (
                        <p className="mt-1 text-xs text-[#7dd3fc]">
                          Cliente: {String(customerInfo.Client_Number)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {requiresDocumentQuery && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#7dd3fc]">
                      Pesquisar por
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
                      className="w-full rounded-xl border border-[#0ea5e9]/30 bg-[#0c4a6e] px-3.5 py-3 text-sm text-white outline-none transition focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/10"
                    >
                      <option value="CUSTOMER">Número de cliente</option>
                      <option value="INVOICE">Número da fatura</option>
                      <option value="TAXPAYER">Número de contribuinte / BI</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#7dd3fc]">
                    {requiresDocumentQuery
                      ? epalQueryType === "CUSTOMER"
                        ? "Número de cliente"
                        : epalQueryType === "INVOICE"
                          ? "Número da fatura"
                          : "Número de contribuinte / BI"
                      : "Número / Referência"}
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="min-w-0 w-full rounded-xl border border-[#0ea5e9]/30 bg-[#0c4a6e] px-3.5 py-3.5 text-sm text-white outline-none transition placeholder:text-[#7dd3fc]/60 focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/10"
                      placeholder={
                        requiresDocumentQuery
                          ? epalQueryType === "CUSTOMER"
                            ? "Ex.: 123456"
                            : epalQueryType === "INVOICE"
                              ? "Ex.: 9010000001"
                              : "N.º de contribuinte ou BI"
                          : "Telemóvel, contador ou referência"
                      }
                      inputMode="numeric"
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
                        disabled={checkingCustomer || !customerReference.trim()}
                        className="shrink-0 rounded-xl bg-[#0ea5e9] px-4 text-sm font-semibold text-white transition hover:bg-[#0284c7] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {checkingCustomer ? "A consultar…" : "Consultar"}
                      </button>
                    )}
                  </div>
                  {customerInfoError && (
                    <p role="alert" className="mt-2 text-sm text-red-400">
                      {customerInfoError}
                    </p>
                  )}
                </div>

                {customerInfo && (
                  <div className="rounded-xl border border-[#34d399]/40 bg-[#0c4a6e] p-3.5">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#34d399]">
                      <ShieldCheck size={17} weight="fill" />
                      Cliente confirmado
                    </div>
                    <div className="mt-3 space-y-2 text-sm">
                      {extractCustomerName(customerInfo) && (
                        <div className="flex justify-between gap-4">
                          <span className="text-[#7dd3fc]">Nome</span>
                          <span className="text-right font-medium text-white">
                            {extractCustomerName(customerInfo)}
                          </span>
                        </div>
                      )}
                      {customerInfo.Client_Number && (
                        <div className="flex justify-between gap-4">
                          <span className="text-[#7dd3fc]">N.º cliente</span>
                          <span className="font-medium text-white">
                            {customerInfo.Client_Number}
                          </span>
                        </div>
                      )}
                      {customerInfo.Invoice_Number && (
                        <div className="flex justify-between gap-4">
                          <span className="text-[#7dd3fc]">Fatura</span>
                          <span className="font-medium text-white">
                            {customerInfo.Invoice_Number}
                          </span>
                        </div>
                      )}
                      {customerInfo.AmountDue !== undefined && customerInfo.AmountDue !== null && (
                        <div className="flex justify-between gap-4 border-t border-[#0ea5e9]/20 pt-2">
                          <span className="text-[#7dd3fc]">Em dívida</span>
                          <span className="font-semibold tabular-nums text-white">
                            {Number(customerInfo.AmountDue).toLocaleString("pt-PT")} Kz
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!requiresDocumentQuery && plan.valueVariable && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#7dd3fc]">
                      Montante (Kz)
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full rounded-xl border border-[#0ea5e9]/30 bg-[#0c4a6e] px-3.5 py-3.5 text-sm text-white outline-none transition placeholder:text-[#7dd3fc]/60 focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/10"
                      placeholder="Introduza o montante"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                )}

                {requiresCustomerNotification && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#7dd3fc]">
                      Telemóvel para SMS
                    </label>
                    <input
                      className="w-full rounded-xl border border-[#0ea5e9]/30 bg-[#0c4a6e] px-3.5 py-3.5 text-sm text-white outline-none transition placeholder:text-[#7dd3fc]/60 focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/10"
                      placeholder="Ex.: 923000000"
                      inputMode="numeric"
                      value={customerNotification}
                      onChange={(e) => setCustomerNotification(e.target.value.replace(/\D/g, "").slice(0, 9))}
                      maxLength={9}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 border-t border-[#0ea5e9]/20 bg-[#0c4a6e] px-5 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="rounded-xl border border-[#0ea5e9]/30 px-5 py-3.5 text-sm font-semibold text-[#7dd3fc] transition hover:bg-white/[0.05] hover:text-white disabled:opacity-50 cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handlePurchase}
                  disabled={loading || checkingCustomer}
                  className="flex-1 rounded-xl bg-[#0ea5e9] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0284c7] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  {loading
                    ? "A processar pagamento..."
                    : `Concluir${payableAmount > 0 ? ` ${Number(payableAmount).toLocaleString("pt-PT")} Kz` : ""}`}
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

                <div

                  className={`flex items-center justify-center gap-1.5 ${

                    resultData.pending ? "text-amber-400" : "text-[#34d399]"

                 }`}

                >

               {resultData.pending ? (

              <Receipt size={15} weight="fill" />

              ) : (

             <CheckCircle size={15} weight="fill" />

           )}



           <span className="text-[10px] font-bold uppercase tracking-wider">

            {resultData.pending

            ? "Transação em Processamento"

           : "Transação Bem-Sucedida"}

         </span>

      </div>



         <h3 className="text-base font-bold text-white mt-2">

           {resultData.pending

          ? "Recarga em Processamento"

          : "Comprovativo de Pagamento"}

        </h3>



        <p className="text-[11px] text-[#7dd3fc] mt-1">

              {resultData.pending

               ? "A sua operação foi recebida e está a ser processada. Não efetue uma nova recarga para a mesma referência."

               : "A sua transação foi efetuada com sucesso."}

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



                  <span

                    className={`text-[10px] font-bold uppercase ${

                    resultData.pending

                    ? "text-amber-400"

                    : "text-[#34d399]"

                    }`}

                   >

                    {resultData.pending

                    ? "EM PROCESSAMENTO"

                    : "CONCLUÍDO"}

                  </span>

                </div>

              </div>



              {/* PIN DE VOUCHER */}

              {!resultData.pending && resultData.transaction?.voucherPIN && (

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

                {resultData.pending ? "Fechar" : "Concluir"}

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