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
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] p-6 font-sans antialiased">
      <Toaster position="top-center" reverseOrder={false} />

      {/* HEADER PREMIUM COM LOGO */}
      <div className="max-w-md mx-auto flex items-center justify-between mb-8 pb-4 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white/[0.03] border border-white/[0.05] rounded-full hover:bg-white/[0.08] text-gray-400 hover:text-white transition-all active:scale-95"
          >
            <CaretLeft size={20} weight="bold" />
          </button>

          <div className="flex flex-col">
            <h1 className="text-base font-black tracking-wider text-white uppercase font-mono">
              TRANSFERIR
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              Envio Interno 24/7
            </p>
          </div>
        </div>

        {/* LOGO CIRCULADO (Sincronizado com Profile e Sidebar) */}
        <div className="w-11 h-11 rounded-full border border-white/[0.08] overflow-hidden bg-white/[0.02] p-1 shadow-inner">
          <img 
            src="/logo.png" 
            className="w-full h-full object-contain rounded-full" 
            alt="Logo EMATEA" 
          />
        </div>
      </div>

      {/* CARD DE SALDO ATUAL DISPONÍVEL */}
      <div className="max-w-md mx-auto mb-6">
        <div className="p-4 rounded-2xl border bg-[#161A1E] border-white/[0.04] shadow-xl flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
                <Wallet size={20} weight="bold" />
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-wider mb-0.5">
                  Seu Saldo Disponível
                </p>
                <p className="text-xl font-mono font-black text-cyan-400 tracking-tight">
                  {balanceAoa.toLocaleString('pt-AO')} <span className="text-[11px] font-sans font-bold text-gray-400">AOA</span>
                </p>
              </div>
           </div>
        </div>
      </div>

      {/* FORMULÁRIO DE OPERAÇÃO */}
      <form onSubmit={handleTransfer} className="space-y-4 max-w-md mx-auto">

        {/* INPUT: DESTINATÁRIO */}
        <div className="bg-[#161A1E] p-4 rounded-2xl border border-white/[0.04] focus-within:border-cyan-500/40 focus-within:bg-[#1a1f24] transition-all duration-200">
          <label className="text-[9px] text-gray-500 uppercase font-black mb-1.5 block tracking-widest">
            ID de Conta do Destinatário
          </label>

          <input
            type="text"
            placeholder="Ex: 59353316"
            className="w-full bg-transparent text-lg outline-none text-cyan-400 placeholder:text-gray-700 font-mono font-bold tracking-wider"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            required
          />
        </div>

        {/* INPUT: VALOR EM AOA */}
        <div className="bg-[#161A1E] p-4 rounded-2xl border border-white/[0.04] focus-within:border-cyan-500/40 focus-within:bg-[#1a1f24] transition-all duration-200">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[9px] text-gray-500 uppercase font-black tracking-widest">
              Valor a Enviar
            </label>
            <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded font-black font-mono">
              AOA
            </span>
          </div>

          <input
            type="number"
            step="0.01"
            placeholder="0,00"
            className="w-full bg-transparent text-3xl font-black outline-none text-white placeholder:text-white/[0.05] font-mono"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        {/* BOTÃO DE ENVIO COM EFEITO GLOW */}
        <button
          type="submit"
          disabled={loading || !targetId || !amount}
          className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-10 disabled:pointer-events-none text-black font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.15)] active:scale-[0.98] mt-2"
        >
          {loading ? 'Processando Transferência...' : (
            <>
              Confirmar Envio de Fundos
              <ArrowsLeftRight weight="bold" size={16} />
            </>
          )}
        </button>

      </form>

      {/* FOOTER: NOTA DE SEGURANÇA */}
      <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex gap-3 items-start text-[11px] text-gray-400 max-w-md mx-auto shadow-sm">
        <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" weight="fill" />
        <p className="leading-relaxed">
          As transferências entre contas da rede <b className="text-white font-semibold">EMATEA</b> são liquidadas instantaneamente, estando disponíveis de imediato no saldo do destinatário, sem qualquer cobrança de taxa de serviço.
        </p>
      </div>

    </div>
  );
}