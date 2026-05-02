import { Plus, CreditCard, ShieldCheck, Timer, Info } from "@phosphor-icons/react"
import { Toaster } from "react-hot-toast"
// Importação da imagem oficial do cartão
import cardVisaImg from "../assets/card/card.jpg"

export default function Cards() {
  // Mock da imagem atual (laranja)
  const cardPreview = "/visa-card-mockup.png"; 

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white font-sans">
      <Toaster position="top-center" />

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-8 border-b border-white/5 bg-[#0B0E11]/50 backdrop-blur-md sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight">Cartão Virtual</h1>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Soluções de Pagamento Globais</p>
        </div>
        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Em Breve</span>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-10">
        
        {/* CONTAINER DE IMAGENS */}
        <div className="flex flex-col items-center gap-6">
          
          {/* IMAGEM ATUAL (REDUZIDA) */}
          <div className="relative w-2/3 group">
            <div className="relative bg-gradient-to-br from-[#1E2329] to-[#0B0E11] border border-white/10 rounded-2xl overflow-hidden shadow-xl grayscale-[0.8] opacity-50">
              <img 
                src={cardPreview} 
                alt="Visa Preview" 
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1540331547168-8b63109225b7?q=80&w=1000&auto=format&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4 text-center">
                <Timer size={20} className="text-cyan-400 mb-1" weight="duotone" />
                <h2 className="text-xs font-black uppercase tracking-tighter">Preview</h2>
              </div>
            </div>
          </div>

          {/* NOVO CARTÃO VISA EMATEA (DESTAQUE) */}
          <div className="relative w-full group perspective-1000">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-[2rem] blur opacity-40"></div>
            <div className="relative border border-white/10 rounded-[1.8rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-[1.02]">
              <img 
                src={cardVisaImg} 
                alt="Cartão Visa Empresarial EMATEA" 
                className="w-full h-auto object-cover"
              />
              {/* Overlay sutil para manter o estilo fintech */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* DESCRIÇÃO PROFISSIONAL E CUSTO */}
        <div className="space-y-6">
          <div className="bg-[#161A1E] border border-white/5 rounded-3xl p-6 space-y-4 shadow-inner">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="p-2 bg-cyan-500/10 text-cyan-500 rounded-lg">
                <CreditCard size={20} weight="fill" />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-widest">Emissão de Cartão Visa Empresarial</h3>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed text-justify">
              O cartão virtual <span className="text-white font-bold italic">EMATEA SOLUÇÕES, LDA</span> oferece total liberdade para gerir os seus ativos. 
              Utilize a bandeira Visa para pagamentos corporativos, assinaturas e compras em milhões de estabelecimentos globais com conversão instantânea.
            </p>

            <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Taxa de Ativação</span>
                <span className="text-xl font-mono font-black text-cyan-400 tracking-tighter">8.00 USDT</span>
              </div>
              <div className="px-3 py-1 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <span className="text-[10px] font-black text-cyan-500 uppercase">Custo Único</span>
              </div>
            </div>
          </div>

          {/* BENEFÍCIOS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3">
              <ShieldCheck size={24} className="text-cyan-500" weight="duotone" />
              <span className="text-[10px] font-bold uppercase tracking-wider leading-tight text-gray-300">Segurança<br/>Bancária</span>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3">
              <Plus size={24} className="text-cyan-500" weight="duotone" />
              <span className="text-[10px] font-bold uppercase tracking-wider leading-tight text-gray-300">Integração<br/>Instantânea</span>
            </div>
          </div>

          {/* AVISO INFORMATIVO */}
          <div className="flex items-start gap-3 bg-yellow-500/5 p-4 rounded-2xl border border-yellow-500/10">
            <Info size={18} className="text-yellow-500 shrink-0" weight="fill" />
            <p className="text-[10px] text-gray-400 font-medium leading-normal">
              A emissão oficial do cartão <span className="text-yellow-500 font-bold">EMATEA SOLUÇÕES, LDA</span> está em fase final de homologação. 
              Fique atento às notificações para garantir o seu no lançamento.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}