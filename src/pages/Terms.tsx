import { useNavigate } from 'react-router-dom';
import { CaretLeft, ShieldCheck, Scales, FileText, LockKey } from '@phosphor-icons/react';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-green-500/30">
      
      {/* BACKGROUND DECORATION */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-green-600/5 rounded-full filter blur-[150px] pointer-events-none"></div>
      
      {/* HEADER MINIMALISTA */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <CaretLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Voltar</span>
          </button>
          
          <div className="flex items-center gap-2">
            {/* LOGO TOTALMENTE CIRCULADO - CORREÇÃO AQUI */}
            <div className="w-9 h-9 rounded-full border border-green-500/30 overflow-hidden bg-[#111] flex items-center justify-center">
              <img 
                src="/logo.png" 
                className="w-full h-full object-cover rounded-full" // rounded-full na imagem mata o quadrado
                alt="Logo" 
              />
            </div>
            <span className="text-sm font-black tracking-tighter">EMATEA</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 relative z-10">
        
        {/* TITULO PRINCIPAL */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 mb-4">
            Termos de Serviço
          </h1>
          <p className="text-gray-500 font-medium tracking-wide text-sm uppercase">Última atualização: 16 de Abril de 2026</p>
        </div>

        {/* GRID DE REGRAS */}
        <div className="space-y-8">
          
          <TermSection 
            icon={<Scales size={24} className="text-green-500" />}
            title="1. Aceitação dos Termos e Jurisdição"
            content="Ao aceder e utilizar a plataforma EMATEA, o utilizador declara ter plena capacidade jurídica e concorda de forma irrevogável com estes Termos de Serviço. Operamos sob a égide das leis da República de Angola, e o uso continuado da plataforma após atualizações constitui aceitação tácita das novas condições estabelecidas."
          />

          <TermSection 
            icon={<LockKey size={24} className="text-green-500" />}
            title="2. Segurança e Responsabilidade Patrimonial"
            content="A custódia das credenciais de acesso (e-mail e palavra-passe) é de responsabilidade indelegável do utilizador. A EMATEA implementa criptografia de nível militar, contudo, não se responsabiliza por perdas patrimoniais decorrentes de phishing, engenharia social ou dispositivos de terceiros comprometidos."
          />

          <TermSection 
            icon={<ShieldCheck size={24} className="text-green-500" />}
            title="3. Natureza dos Ativos e Risco de Mercado"
            content="O utilizador reconhece que os ativos digitais e criptomoedas são instrumentos de alta volatilidade. A EMATEA atua exclusivamente como interface tecnológica e prestadora de serviços de facilitação, não garantindo rentabilidade nem se responsabilizando por desvalorizações abruptas inerentes ao mercado financeiro digital."
          />

          <TermSection 
            icon={<FileText size={24} className="text-green-500" />}
            title="4. Compliance, KYC e Combate ao Branqueamento"
            content="Em estrita observância às normas de compliance, a EMATEA reserva-se o direito de solicitar verificação de identidade (Know Your Customer) a qualquer momento. Transações que apresentem indícios de irregularidades ou origem ilícita serão bloqueadas e reportadas às autoridades reguladoras competentes para investigação."
          />

          <TermSection 
            icon={<ShieldCheck size={24} className="text-green-500" />}
            title="5. Propriedade Intelectual e Exploração"
            content="Todos os direitos sobre o software, interface, logótipos e algoritmos são de titularidade exclusiva da EMATEA. Qualquer tentativa de engenharia reversa, extração de dados (scraping) ou uso da marca para fins comerciais não autorizados resultará na rescisão imediata da conta e sanções legais cabíveis."
          />

        </div>

        {/* NOTA FINAL */}
        <div className="mt-20 p-10 rounded-[2.5rem] bg-[#111] border border-white/5 text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-white font-bold text-xl mb-3 relative z-10">Dúvidas Jurídicas?</h3>
          <p className="text-gray-400 text-sm mb-6 relative z-10 max-w-lg mx-auto leading-relaxed">
            A nossa equipa de compliance está disponível para esclarecer qualquer cláusula destes termos e garantir uma experiência segura.
          </p>
          <a href="mailto:ematea8800088@gmail.com" className="relative z-10 inline-block bg-white text-black px-8 py-3 rounded-full font-bold text-sm hover:bg-green-500 hover:text-white transition-all active:scale-95">
            Contactar Apoio Jurídico
          </a>
        </div>

        <footer className="mt-20 text-center py-10 border-t border-white/5">
          <p className="text-gray-700 text-[10px] font-bold uppercase tracking-[0.4em]">
            © 2026 EMATEA Soluções Tecnológicas • NIF: 5002577666
          </p>
        </footer>
      </main>
    </div>
  );
}

/* COMPONENTE DE SEÇÃO DE TERMO */
function TermSection({ icon, title, content }: { icon: any, title: string, content: string }) {
  return (
    <div className="group p-8 rounded-[2rem] bg-[#111111]/50 border border-white/5 hover:border-green-500/20 transition-all duration-300">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/5 group-hover:border-green-500/20 transition-colors shadow-inner flex-shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-green-400 transition-colors">{title}</h2>
          <p className="text-gray-400 text-sm leading-relaxed font-medium">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}