import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowsLeftRight, CaretLeft, CheckCircle, Wallet } from '@phosphor-icons/react';
import { TransferService } from '../services/transferService';
import { UserService } from '../services/user.service';
import toast, { Toaster } from 'react-hot-toast';

export function Transfer() {
  const navigate = useNavigate();

  const [targetId, setTargetId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estado do saldo em AOA
  const [balanceAoa, setBalanceAoa] = useState(0);

  // Busca o saldo ao carregar a página
  useEffect(() => {
    async function loadData() {
      try {
        const res = await UserService.me();
        setBalanceAoa(Number(res.balance || 0));
      } catch (err) {
        console.error("Erro ao carregar saldo");
      }
    }
    loadData();
  }, []);

  async function handleTransfer(e: React.FormEvent) {
    e.preventDefault();

    const amountNum = Number(amount);

    if (amountNum > balanceAoa) {
      return toast.error('Saldo insuficiente para esta operação');
    }

    setLoading(true);
    const loadToast = toast.loading('Processando transferência...');

    try {
      await TransferService.internal(
        targetId,
        amountNum,
        'AOA'
      );

      toast.success('Transferência realizada!', { id: loadToast });
      setTimeout(() => navigate('/profile'), 1500);

    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao processar transferência', { id: loadToast });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe] p-6 font-sans antialiased selection:bg-cyan-500/30">
      <Toaster position="top-center" reverseOrder={false} />

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/[0.06] rounded-full filter blur-[120px] pointer-events-none"></div>

      {/* HEADER PREMIUM COM LOGO */}
      <div className="max-w-md mx-auto flex items-center justify-between mb-8 pb-4 border-b border-cyan-500/10 relative z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-[#0e364a] border border-cyan-500/25 rounded-full hover:bg-[#124158] text-cyan-300 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <CaretLeft size={20} weight="bold" />
          </button>

          <div className="flex flex-col">
            <h1 className="text-base font-black tracking-wider text-white uppercase font-mono">
              TRANSFERIR
            </h1>
            <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-cyan-200/70">
              Envio Interno 24/7
            </p>
          </div>
        </div>

        {/* LOGO CIRCULADO */}
        <div className="w-11 h-11 rounded-full border border-cyan-500/30 overflow-hidden bg-[#0e364a] p-1 shadow-inner">
          <img 
            src="/logo.png" 
            className="w-full h-full object-contain rounded-full" 
            alt="Logo EMATEA" 
          />
        </div>
      </div>

      {/* CARD DE SALDO ATUAL DISPONÍVEL */}
      <div className="max-w-md mx-auto mb-6 relative z-10">
        <div className="p-6 rounded-[2rem] border bg-[#0e364a] border-cyan-500/20 shadow-xl shadow-cyan-950/20 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30 text-cyan-400">
                <Wallet size={22} weight="bold" />
              </div>
              <div>
                <p className="text-[10px] text-cyan-200/70 uppercase font-black font-mono tracking-widest mb-0.5">
                  Seu Saldo Disponível
                </p>
                <p className="text-xl font-mono font-black text-white tracking-tight">
                  {balanceAoa.toLocaleString('pt-AO')} <span className="text-xs font-sans font-bold text-cyan-400">AOA</span>
                </p>
              </div>
           </div>
        </div>
      </div>

      {/* FORMULÁRIO DE OPERAÇÃO */}
      <form onSubmit={handleTransfer} className="space-y-6 max-w-md mx-auto relative z-10">

        {/* INPUT: DESTINATÁRIO */}
        <div className="bg-[#0e364a] p-6 rounded-[2.5rem] border border-cyan-500/20 focus-within:border-cyan-400 transition-all duration-200 shadow-2xl shadow-cyan-950/20">
          <label className="text-[10px] text-cyan-200/70 uppercase font-black font-mono mb-2 block tracking-[0.2em] ml-1">
            ID de Conta do Destinatário
          </label>

          <input
            type="text"
            placeholder="Ex: 59353316"
            className="w-full bg-[#0a2533] border border-cyan-500/20 focus:border-cyan-400 rounded-2xl p-4 text-base outline-none text-cyan-400 placeholder:text-cyan-200/30 font-mono font-bold tracking-wider shadow-inner"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            required
          />
        </div>

        {/* INPUT: VALOR EM AOA */}
        <div className="bg-[#0e364a] p-6 rounded-[2.5rem] border border-cyan-500/20 focus-within:border-cyan-400 transition-all duration-200 shadow-2xl shadow-cyan-950/20">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] text-cyan-200/70 uppercase font-black font-mono tracking-[0.2em] ml-1">
              Valor a Enviar
            </label>
            <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-lg font-black font-mono">
              AOA
            </span>
          </div>

          <input
            type="number"
            step="0.01"
            placeholder="0,00"
            className="w-full bg-[#0a2533] border border-cyan-500/20 focus:border-cyan-400 rounded-2xl p-4 text-3xl font-black outline-none text-white placeholder:text-cyan-200/20 font-mono shadow-inner"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        {/* BOTÃO DE ENVIO COM EFEITO GLOW */}
        <button
          type="submit"
          disabled={loading || !targetId || !amount}
          className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 disabled:pointer-events-none text-white font-black font-mono text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-cyan-950/30 hover:shadow-cyan-950/50 active:scale-[0.98] cursor-pointer mt-2"
        >
          {loading ? 'Processando Transferência...' : (
            <>
              Confirmar Envio de Fundos
              <ArrowsLeftRight weight="bold" size={18} className="text-cyan-200" />
            </>
          )}
        </button>

      </form>

      {/* FOOTER: NOTA DE SEGURANÇA */}
      <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] flex gap-4 items-start text-xs text-emerald-200/80 font-mono max-w-md mx-auto shadow-xl shadow-emerald-950/20 relative z-10">
        <CheckCircle size={22} className="text-emerald-400 shrink-0 mt-0.5" weight="fill" />
        <p className="leading-relaxed">
          As transferências entre contas da rede <b className="text-white font-semibold">EMATEA</b> são liquidadas instantaneamente, estando disponíveis de imediato no saldo do destinatário, sem qualquer cobrança de taxa de serviço.
        </p>
      </div>

    </div>
  );
}