import { useNavigate } from 'react-router-dom';
import { CaretLeft, ShieldCheck, Database, LockKey, Fingerprint } from '@phosphor-icons/react';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-green-500/30">
      
      {/* BACKGROUND DECORATION */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-green-600/5 rounded-full filter blur-[150px] pointer-events-none"></div>
      
      {/* HEADER PREMIUM COM LOGO CIRCULADO (CORRIGIDO) */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <CaretLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Voltar</span>
          </button>
          
          <div className="flex items-center gap-2">
            {/* LOGO TOTALMENTE CIRCULADO - SEM QUADRADO INTERNO */}
            <div className="w-9 h-9 rounded-full border border-green-500/30 overflow-hidden bg-[#111] flex items-center justify-center">
              <img 
                src="/logo.png" 
                className="w-full h-full object-cover rounded-full" 
                alt="Logo" 
              />
            </div>
            <span className="text-sm font-black tracking-tighter">EMATEA</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 relative z-10">
        
        {/* TITULO COM GRADIENTE FINTECH */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 mb-4">
            Política de Privacidade
          </h1>
          <p className="text-gray-500 font-medium tracking-wide text-sm uppercase">Privacidade de Dados e Segurança de Infraestrutura</p>
        </div>

        {/* SEÇÕES DE PRIVACIDADE DETALHADAS */}
        <div className="space-y-8">
          
          <PrivacySection 
            icon={<Database size={24} className="text-green-500" />}
            title="1. Recolha e Processamento de Dados"
            content="A EMATEA recolhe dados estritamente necessários para a viabilidade das operações financeiras e conformidade legal (KYC). Isto inclui, mas não se limita a: Nome Completo, Número de Identificação Fiscal (NIF), detalhes de contacto e registos de transações eletrónicas. O tratamento destes dados é realizado sob os princípios da licitude e transparência."
          />

          <PrivacySection 
            icon={<LockKey size={24} className="text-green-500" />}
            title="2. Segurança de Camada de Dados"
            content="Implementamos protocolos de segurança de vanguarda, incluindo encriptação AES-256 e autenticação multifator. Os dados sensíveis são armazenados em infraestruturas isoladas para prevenir acessos não autorizados, garantindo que a sua integridade financeira e pessoal permaneça inalterada."
          />

          <PrivacySection 
            icon={<Fingerprint size={24} className="text-green-500" />}
            title="3. Não Partilha com Terceiros"
            content="A EMATEA rege-se por uma política de confidencialidade absoluta. Não comercializamos, alugamos ou partilhamos os seus dados pessoais com terceiros para fins publicitários. A partilha ocorre exclusivamente com parceiros regulatórios e bancários essenciais para a execução das suas transações."
          />

          <PrivacySection 
            icon={<ShieldCheck size={24} className="text-green-500" />}
            title="4. Direitos do Utilizador"
            content="De acordo com a Lei de Proteção de Dados Pessoais de Angola, o utilizador tem o direito de aceder, retificar ou solicitar a eliminação dos seus dados. No entanto, reservamo-nos o direito de reter informações necessárias para o cumprimento de obrigações fiscais e regulatórias vigentes."
          />

        </div>

        {/* BOX DE SEGURANÇA FINAL */}
        <div className="mt-20 p-10 rounded-[2.5rem] bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 flex flex-col md:flex-row items-center gap-8 shadow-2xl group hover:border-green-500/20 transition-all duration-500">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 border border-green-500/20 group-hover:scale-110 transition-transform">
            <ShieldCheck size={40} className="text-green-500" />
          </div>
          <div>
            <h3 className="text-white font-bold text-xl mb-2 tracking-tight">Privacidade como Prioridade</h3>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              Na EMATEA, a privacidade não é uma opção, é a estrutura do nosso software. Utilizamos auditorias constantes para garantir que a sua confiança seja retribuída com o mais alto nível de proteção digital.
            </p>
          </div>
        </div>

        <footer className="mt-20 text-center py-10 border-t border-white/5">
          <p className="text-gray-700 text-[10px] font-bold uppercase tracking-[0.4em]">
            PROTEÇÃO DE DADOS • EMATEA SOLUÇÕES • 2026
          </p>
        </footer>
      </main>
    </div>
  );
}

/* COMPONENTE DE SEÇÃO REUTILIZÁVEL */
function PrivacySection({ icon, title, content }: { icon: any, title: string, content: string }) {
  return (
    <div className="group p-8 rounded-[2rem] bg-[#111111]/40 border border-white/5 hover:border-green-500/20 transition-all duration-300">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/5 group-hover:border-green-500/20 transition-colors shadow-xl flex-shrink-0">
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