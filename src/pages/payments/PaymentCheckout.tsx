import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Hash, DollarSign, User, CreditCard } from "lucide-react";

export default function PaymentCheckout() {
  const navigate = useNavigate();
  const { paymentId } = useParams();

  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);

  // Mapeamento local rápido apenas para exibir o nome correto baseado na rota anterior
  function getPaymentName(id: string | undefined) {
    switch (id) {
      case "1": return "ENDE";
      case "2": return "EPAL";
      case "3": return "Unitel Money";
      case "4": return "Multicaixa";
      default: return "Pagamento";
    }
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      console.log({
        paymentId,
        reference,
        amount,
        customerName,
      });
      
      // TODO: Conexão com a API do Backend
    } catch (error) {
      console.error(error);
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
            {getPaymentName(paymentId)}
          </h1>
          <p className="text-xs text-gray-600 font-medium mt-0.5">
            Preencha os dados da fatura para pagar
          </p>
        </div>
      </div>

      {/* FORMULÁRIO PRINCIPAL */}
      <div className="p-6">
        <div className="bg-[#FCFCFD] border border-[#E4E7EB] rounded-2xl p-5 shadow-sm space-y-5">
          
          <h3 className="text-xs font-black uppercase text-gray-600 tracking-wider mb-2 flex items-center gap-2">
            <CreditCard size={14} className="text-emerald-700" /> Formulário de Depósito / Liquidação
          </h3>

          <div className="space-y-4">
            
            {/* CAMPO: REFERÊNCIA */}
            <div>
              <label className="text-xs font-black uppercase text-gray-600 tracking-wider flex items-center gap-2 mb-2">
                Referência do Serviço
              </label>
              <div className="relative flex items-center">
                <Hash size={16} className="absolute left-4 text-gray-500" />
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Ex: 0012345678"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl font-mono text-sm text-gray-950 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold placeholder:text-gray-400 placeholder:font-sans"
                />
              </div>
            </div>

            {/* CAMPO: VALOR */}
            <div>
              <label className="text-xs font-black uppercase text-gray-600 tracking-wider flex items-center gap-2 mb-2">
                Valor a Pagar (Kz)
              </label>
              <div className="relative flex items-center">
                <DollarSign size={16} className="absolute left-4 text-gray-500" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl font-mono text-sm text-gray-950 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold placeholder:text-gray-400 placeholder:font-sans"
                />
              </div>
            </div>

            {/* CAMPO: NOME DO CLIENTE */}
            <div>
              <label className="text-xs font-black uppercase text-gray-600 tracking-wider flex items-center gap-2 mb-2">
                Nome do Titular / Cliente
              </label>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-4 text-gray-500" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Nome Completo"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-950 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* BOTÃO DE ENVIO PROFISSIONAL */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gray-950 hover:bg-gray-900 active:scale-[0.99] border border-transparent text-white rounded-xl py-4 text-xs font-black uppercase tracking-widest disabled:opacity-40 transition-all shadow-md mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processando...</span>
                </>
              ) : (
                <span>Confirmar Pagamento</span>
              )}
            </button>

          </div>
        </div>
      </div>

    </div>
  );
}