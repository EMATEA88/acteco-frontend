import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bank, CurrencyCircleDollar, CaretRight, ClockCounterClockwise } from '@phosphor-icons/react'

export default function Withdraw() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe] font-sans selection:bg-cyan-500/30">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-500/[0.06] rounded-full filter blur-[120px] pointer-events-none"></div>

      {/* HEADER AJUSTADO COM BOTÃO DE HISTÓRICO */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-cyan-500/10 bg-[#0a2533]/90 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 bg-[#0e364a] border border-cyan-500/25 rounded-full text-cyan-300 hover:bg-[#124158] hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
          <h1 className="text-xl font-black tracking-tighter uppercase font-mono text-white">Método de Saque</h1>
        </div>

        <button 
          onClick={() => navigate('/withdraw-history')}
          className="p-3 bg-[#0e364a] hover:bg-[#124158] rounded-2xl transition-all active:scale-95 border border-cyan-500/25 flex items-center justify-center group shadow-sm cursor-pointer"
        >
          <ClockCounterClockwise 
            size={20} 
            weight="bold" 
            className="text-cyan-400 group-hover:text-white transition-colors" 
          />
        </button>
      </div>

      <div className="px-6 py-8 max-w-md mx-auto relative z-10">
        <h2 className="text-2xl font-black font-mono tracking-tight text-white mb-2">Levantar Fundos</h2>
        <p className="text-cyan-200/70 text-xs font-mono mb-8 leading-relaxed">Selecione a moeda que deseja retirar da sua conta.</p>

        <div className="grid gap-4">
          {/* OPÇÃO KWANZA */}
          <button 
            onClick={() => navigate('/withdraw/aoa')}
            className="flex items-center justify-between w-full p-6 bg-[#0e364a] border border-cyan-500/20 rounded-[2rem] hover:bg-[#124158] hover:border-cyan-400/50 transition-all group shadow-xl shadow-cyan-950/20 cursor-pointer"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
                <Bank size={24} weight="duotone" />
              </div>
              <div>
                <p className="font-bold text-white text-sm font-mono uppercase tracking-wider">Kwanza (AOA)</p>
                <p className="text-[10px] font-bold font-mono text-cyan-200/70 uppercase tracking-widest mt-0.5">Transferência Bancária</p>
              </div>
            </div>
            <CaretRight size={20} weight="bold" className="text-cyan-500/40 group-hover:text-white transition-colors" />
          </button>

          {/* OPÇÃO USDT */}
          <button 
            onClick={() => navigate('/withdraw/usdt')}
            className="flex items-center justify-between w-full p-6 bg-[#0e364a] border border-cyan-500/20 rounded-[2rem] hover:bg-[#124158] hover:border-cyan-400/50 transition-all group shadow-xl shadow-cyan-950/20 cursor-pointer"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
                <CurrencyCircleDollar size={24} weight="duotone" />
              </div>
              <div>
                <p className="font-bold text-white text-sm font-mono uppercase tracking-wider">Tether (USDT)</p>
                <p className="text-[10px] font-bold font-mono text-cyan-200/70 uppercase tracking-widest mt-0.5">Rede TRC20 / Cripto</p>
              </div>
            </div>
            <CaretRight size={20} weight="bold" className="text-cyan-500/40 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* NOTA DE RODAPÉ ESTILIZADA */}
        <div className="mt-12 p-6 rounded-[2rem] bg-[#0e364a]/50 border border-cyan-500/10 shadow-inner">
          <p className="text-[11px] text-cyan-200/70 font-mono text-center leading-relaxed">
            Certifique-se de que os seus dados de pagamento estão atualizados no perfil antes de solicitar o levantamento.
          </p>
        </div>
      </div>
    </div>
  )
}