import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bank, CurrencyCircleDollar, CaretRight, ClockCounterClockwise } from '@phosphor-icons/react'

export default function Withdraw() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      {/* HEADER AJUSTADO COM BOTÃO DE HISTÓRICO */}
      <div className="flex items-center justify-between px-5 py-6 border-b border-white/5 bg-[#0B0E11]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={18} weight="bold" />
          </button>
          <h1 className="text-lg font-bold">Método de Saque</h1>
        </div>

        {/* Substitua o botão de histórico por este: */}
<button 
  onClick={() => navigate('/withdraw-history')} // <-- Corrigido para usar hífen
  className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-90 border border-white/5 flex items-center justify-center group"
>
  <ClockCounterClockwise 
    size={20} 
    weight="bold" 
    className="text-gray-400 group-hover:text-cyan-400 transition-colors" 
  />
</button>
      </div>

      <div className="px-5 py-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-2">Levantar Fundos</h2>
        <p className="text-gray-400 text-sm mb-8">Selecione a moeda que deseja retirar da sua conta.</p>

        <div className="grid gap-4">
          {/* OPÇÃO KWANZA */}
          <button 
            onClick={() => navigate('/withdraw/aoa')}
            className="flex items-center justify-between w-full p-5 bg-[#161A1E] border border-white/5 rounded-2xl hover:bg-[#1C2127] hover:border-emerald-500/30 transition-all group shadow-lg"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl group-hover:scale-110 transition-transform">
                <Bank size={24} weight="duotone" />
              </div>
              <div>
                <p className="font-bold text-white">Kwanza (AOA)</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Transferência Bancária</p>
              </div>
            </div>
            <CaretRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />
          </button>

          {/* OPÇÃO USDT */}
          <button 
            onClick={() => navigate('/withdraw/usdt')}
            className="flex items-center justify-between w-full p-5 bg-[#161A1E] border border-white/5 rounded-2xl hover:bg-[#1C2127] hover:border-cyan-500/30 transition-all group shadow-lg"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl group-hover:scale-110 transition-transform">
                <CurrencyCircleDollar size={24} weight="duotone" />
              </div>
              <div>
                <p className="font-bold text-white">Tether (USDT)</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Rede TRC20 / Cripto</p>
              </div>
            </div>
            <CaretRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* NOTA DE RODAPÉ ESTILIZADA */}
        <div className="mt-12 p-4 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-[10px] text-gray-500 text-center leading-relaxed">
            Certifique-se de que os seus dados de pagamento estão atualizados no perfil antes de solicitar o levantamento.
          </p>
        </div>
      </div>
    </div>
  )
}