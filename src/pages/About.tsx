import { 
  Info, 
  TrendUp, 
  Code, 
  MapPin, 
  ShieldCheck,  
  RocketLaunch,
  Globe
} from '@phosphor-icons/react'

export default function About() {
  return (
    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe] p-6 space-y-12 animate-fadeZoom selection:bg-cyan-500/30 pb-28">
      
      {/* 1. HEADER INSTITUCIONAL PREMIUM */}
      <section className="relative overflow-hidden bg-[#0e364a] border border-cyan-500/20 rounded-[2.5rem] p-8 shadow-2xl shadow-cyan-950/20">
        {/* Glow de fundo sutil */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/[0.06] rounded-full filter blur-[80px]"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] text-cyan-400">Institucional</span>
            </div>
            
            <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-cyan-200/60 font-mono">
              EMATEA
            </h1>

            <div className="grid grid-cols-1 gap-2 text-sm text-cyan-200/80 font-medium font-mono">
              <p><span className="text-cyan-200/50 mr-2 uppercase text-[10px] tracking-widest">NIF:</span> 5002577666</p>
              <p><span className="text-cyan-200/50 mr-2 uppercase text-[10px] tracking-widest">Contacto:</span> +244 928 270 636</p>
              <p><span className="text-cyan-200/50 mr-2 uppercase text-[10px] tracking-widest">Fundação:</span> 04 de Março de 2023</p>
            </div>
          </div>

          {/* LOGOTIPO TOTALMENTE CIRCULADO (CORREÇÃO DEFINITIVA) */}
          <div className="relative group">
            <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="w-28 h-28 rounded-full border-2 border-cyan-500/30 overflow-hidden bg-[#0a2533] flex items-center justify-center relative z-10 shadow-lg">
              <img
                src="/logo.png"
                alt="EMATEA Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. GRID DE SERVIÇOS (LAYOUT MODERNO) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Serviços Financeiros */}
        <div className="bg-[#0e364a] border border-cyan-500/20 p-8 rounded-[2rem] hover:border-cyan-400/50 transition-all group shadow-xl shadow-cyan-950/20">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 border border-cyan-500/30 group-hover:scale-110 transition-transform">
            <TrendUp size={28} className="text-cyan-400" />
          </div>
          <h2 className="text-xl font-bold mb-4 tracking-tight font-mono text-white">Eossistema Financeiro</h2>
          <ul className="space-y-3 text-sm text-cyan-200/80 font-medium font-mono">
            <li className="flex items-center gap-2">• Exchange de Ativos Digitais (USDT, BTC, BNB)</li>
            <li className="flex items-center gap-2">• Gateway de Recargas Eletrónicas Nacionais</li>
            <li className="flex items-center gap-2">• Gestão de Depósitos a Prazo Estruturados</li>
            <li className="flex items-center gap-2">• Emissão de Cartões VISA (Físicos e Virtuais)</li>
          </ul>
        </div>

        {/* Tecnologia */}
        <div className="bg-[#0e364a] border border-cyan-500/20 p-8 rounded-[2rem] hover:border-cyan-400/50 transition-all group shadow-xl shadow-cyan-950/20">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 border border-cyan-500/30 group-hover:scale-110 transition-transform">
            <Code size={28} className="text-cyan-400" />
          </div>
          <h2 className="text-xl font-bold mb-4 tracking-tight font-mono text-white">Hub de Tecnologia</h2>
          <ul className="space-y-3 text-sm text-cyan-200/80 font-medium font-mono">
            <li className="flex items-center gap-2">• Software Engineering & Web Development</li>
            <li className="flex items-center gap-2">• Branding & Identidade Visual 3D</li>
            <li className="flex items-center gap-2">• Produção Audiovisual Publicitária</li>
            <li className="flex items-center gap-2">• Consultoria em IA & Engenharia de Prompts</li>
          </ul>
        </div>
      </div>

      {/* 3. HISTÓRIA E POSICIONAMENTO */}
      <section className="bg-gradient-to-b from-[#0e364a] to-[#0a2533] border border-cyan-500/20 rounded-[2.5rem] p-10 shadow-xl shadow-cyan-950/20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Info size={32} className="mx-auto text-cyan-400/70" />
          <p className="text-lg text-cyan-100 leading-relaxed font-medium font-mono">
            A <span className="text-white font-bold">EMATEA</span> posiciona-se como uma organização moderna, 
            estruturada e orientada para a inovação. Com sede em Malanje, atuamos de forma estratégica 
            nos setores que definem o futuro da economia digital.
          </p>
        </div>
      </section>

      {/* 4. MISSÃO, VISÃO, VALORES (LAYOUT EM COLUNAS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0e364a]/60 border border-cyan-500/20 p-8 rounded-3xl space-y-4 shadow-lg shadow-cyan-950/20">
          <RocketLaunch size={32} className="text-cyan-400" />
          <h3 className="text-lg font-bold font-mono text-white">Missão</h3>
          <p className="text-sm text-cyan-200/80 leading-relaxed font-mono">
            Prover infraestrutura tecnológica e financeira que gere confiança e acelere a inclusão digital em Angola.
          </p>
        </div>

        <div className="bg-[#0e364a]/60 border border-cyan-500/20 p-8 rounded-3xl space-y-4 shadow-lg shadow-cyan-950/20">
          <Globe size={32} className="text-cyan-400" />
          <h3 className="text-lg font-bold font-mono text-white">Visão</h3>
          <p className="text-sm text-cyan-200/80 leading-relaxed font-mono">
            Ser o principal hub de ativos digitais e desenvolvimento tecnológico da região, expandindo o impacto para todo o território nacional.
          </p>
        </div>

        <div className="bg-[#0e364a]/60 border border-cyan-500/20 p-8 rounded-3xl space-y-4 shadow-lg shadow-cyan-950/20">
          <ShieldCheck size={32} className="text-cyan-400" />
          <h3 className="text-lg font-bold font-mono text-white">Valores</h3>
          <div className="flex flex-wrap gap-2 pt-2">
            {['Transparência', 'Inovação', 'Responsabilidade', 'Sustentabilidade'].map(tag => (
              <span key={tag} className="text-[10px] font-bold font-mono uppercase bg-[#0a2533] px-3 py-1 rounded-full border border-cyan-500/30 text-cyan-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 5. LOCALIZAÇÃO E RODAPÉ */}
      <section className="bg-[#0e364a] border border-cyan-500/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-cyan-950/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <MapPin size={24} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-xs text-cyan-200/60 uppercase font-mono font-bold tracking-widest">Localização</p>
            <p className="text-sm text-cyan-100 font-medium font-mono italic">Malanje, Controlo nº 1, Rua direita da Escola Eiffel</p>
          </div>
        </div>
        
        <div className="text-center md:text-right">
          <p className="text-xs text-cyan-200/50 font-bold font-mono uppercase tracking-[0.3em]">© 2026 EMATEA SOLUÇÕES</p>
        </div>
      </section>
    </div>
  )
}