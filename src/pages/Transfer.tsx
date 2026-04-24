import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowsLeftRight, CaretLeft, CheckCircle } from '@phosphor-icons/react';
import { TransferService } from '../services/transferService';

export function Transfer() {
  const navigate = useNavigate();

  const [targetId, setTargetId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'AOA' | 'USDT'>('AOA'); // 🔥 NOVO
  const [loading, setLoading] = useState(false);

  async function handleTransfer(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    try {
      await TransferService.internal(
        targetId,
        Number(amount),
        currency // 🔥 ENVIA MOEDA
      );

      alert('Transferência realizada com sucesso!');
      navigate('/profile');

    } catch (err: any) {
      alert(err.message || 'Erro ao processar transferência');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080E11] text-white p-6 font-sans">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
        >
          <CaretLeft size={24} />
        </button>

        <h1 className="text-xl font-bold italic tracking-wider">
          TRANSFERIR FUNDOS
        </h1>
      </div>

      {/* FORM */}
      <form onSubmit={handleTransfer} className="space-y-6 max-w-md mx-auto">

        {/* DESTINATÁRIO */}
        <div className="bg-[#161A1F] p-4 rounded-2xl border border-white/5 focus-within:border-cyan-500/50 transition-all">
          <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block tracking-widest">
            ID do Destinatário
          </label>

          <input
            type="text"
            placeholder="Ex: 59353316"
            className="w-full bg-transparent text-xl outline-none text-cyan-400 placeholder:text-gray-700 font-mono"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            required
          />
        </div>

        {/* VALOR */}
        <div className="bg-[#161A1F] p-4 rounded-2xl border border-white/5 focus-within:border-cyan-500/50 transition-all">

          {/* 🔥 SELETOR DE MOEDA */}
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setCurrency('AOA')}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                currency === 'AOA'
                  ? 'bg-cyan-500 text-black'
                  : 'bg-white/5 text-gray-400'
              }`}
            >
              AOA
            </button>

            <button
              type="button"
              onClick={() => setCurrency('USDT')}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                currency === 'USDT'
                  ? 'bg-cyan-500 text-black'
                  : 'bg-white/5 text-gray-400'
              }`}
            >
              USDT
            </button>
          </div>

          <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block tracking-widest">
            Valor a enviar ({currency === 'USDT' ? 'USDT' : 'Kz'})
          </label>

          <input
            type="number"
            step="0.01"
            placeholder="0,00"
            className="w-full bg-transparent text-3xl font-bold outline-none text-white placeholder:text-gray-800"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        {/* BOTÃO */}
        <button
          type="submit"
          disabled={loading || !targetId || !amount}
          className="w-full py-4 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:grayscale text-black font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.2)] active:scale-95"
        >
          {loading ? 'PROCESSANDO...' : (
            <>
              CONFIRMAR ENVIO
              <ArrowsLeftRight weight="bold" />
            </>
          )}
        </button>

      </form>

      {/* INFO */}
      <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex gap-3 items-start text-[11px] text-emerald-400 max-w-md mx-auto">
        <CheckCircle size={20} className="shrink-0" />
        <p>
          Transferências entre usuários <b>EMATEA</b> são processadas em tempo real 24/7 sem taxas extras.
        </p>
      </div>

    </div>
  );
}