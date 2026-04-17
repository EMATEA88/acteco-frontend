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
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 space-y-12 animate-fadeZoom selection:bg-green-500/30">
      
      {/* 1. HEADER INSTITUCIONAL PREMIUM */}
      <section className="relative overflow-hidden bg-[#111] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
        {/* Glow de fundo sutil */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full filter blur-[80px]"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-400">Institucional</span>
            </div>
            
            <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
              EMATEA
            </h1>

            <div className="grid grid-cols-1 gap-2 text-sm text-gray-400 font-medium">
              <p><span className="text-gray-600 mr-2 uppercase text-[10px] tracking-widest">NIF:</span> 5002577666</p>
              <p><span className="text-gray-600 mr-2 uppercase text-[10px] tracking-widest">Contacto:</span> +244 928 270 636</p>
              <p><span className="text-gray-600 mr-2 uppercase text-[10px] tracking-widest">Fundação:</span> 04 de Março de 2023</p>
            </div>
          </div>

          {/* LOGOTIPO TOTALMENTE CIRCULADO (CORREÇÃO DEFINITIVA) */}
          <div className="relative group">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="w-28 h-28 rounded-full border-2 border-white/10 overflow-hidden bg-[#0a0a0a] flex items-center justify-center relative z-10">
              <img
                src="/logo.png"
                alt="EMATEA Logo"
                className="w-full h-full object-cover rounded-full" // Garante o recorte circular
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. GRID DE SERVIÇOS (LAYOUT MODERNO) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Serviços Financeiros */}
        <div className="bg-[#111]/50 border border-white/5 p-8 rounded-[2rem] hover:border-green-500/30 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20 group-hover:scale-110 transition-transform">
            <TrendUp size={28} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold mb-4 tracking-tight">Ecosistema Financeiro</h2>
          <ul className="space-y-3 text-sm text-gray-400 font-medium">
            <li className="flex items-center gap-2">• Exchange de Ativos Digitais (USDT, BTC, BNB)</li>
            <li className="flex items-center gap-2">• Gateway de Recargas Eletrónicas Nacionais</li>
            <li className="flex items-center gap-2">• Gestão de Depósitos a Prazo Estruturados</li>
            <li className="flex items-center gap-2">• Emissão de Cartões VISA (Físicos e Virtuais)</li>
          </ul>
        </div>

        {/* Tecnologia */}
        <div className="bg-[#111]/50 border border-white/5 p-8 rounded-[2rem] hover:border-green-500/30 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20 group-hover:scale-110 transition-transform">
            <Code size={28} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold mb-4 tracking-tight">Hub de Tecnologia</h2>
          <ul className="space-y-3 text-sm text-gray-400 font-medium">
            <li className="flex items-center gap-2">• Software Engineering & Web Development</li>
            <li className="flex items-center gap-2">• Branding & Identidade Visual 3D</li>
            <li className="flex items-center gap-2">• Produção Audiovisual Publicitária</li>
            <li className="flex items-center gap-2">• Consultoria em IA & Engenharia de Prompts</li>
          </ul>
        </div>
      </div>

      {/* 3. HISTÓRIA E POSICIONAMENTO */}
      <section className="bg-gradient-to-b from-[#111] to-transparent border border-white/5 rounded-[2.5rem] p-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Info size={32} className="mx-auto text-gray-600" />
          <p className="text-lg text-gray-300 leading-relaxed font-medium">
            A <span className="text-white font-bold">EMATEA</span> posiciona-se como uma organização moderna, 
            estruturada e orientada para a inovação. Com sede em Malanje, atuamos de forma estratégica 
            nos setores que definem o futuro da economia digital.
          </p>
        </div>
      </section>

      {/* 4. MISSÃO, VISÃO, VALORES (LAYOUT EM COLUNAS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111]/30 border border-white/5 p-8 rounded-3xl space-y-4">
          <RocketLaunch size={32} className="text-green-500" />
          <h3 className="text-lg font-bold">Missão</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Prover infraestrutura tecnológica e financeira que gere confiança e acelere a inclusão digital em Angola.
          </p>
        </div>

        <div className="bg-[#111]/30 border border-white/5 p-8 rounded-3xl space-y-4">
          <Globe size={32} className="text-green-500" />
          <h3 className="text-lg font-bold">Visão</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Ser o principal hub de ativos digitais e desenvolvimento tecnológico da região, expandindo o impacto para todo o território nacional.
          </p>
        </div>

        <div className="bg-[#111]/30 border border-white/5 p-8 rounded-3xl space-y-4">
          <ShieldCheck size={32} className="text-green-500" />
          <h3 className="text-lg font-bold">Valores</h3>
          <div className="flex flex-wrap gap-2 pt-2">
            {['Transparência', 'Inovação', 'Responsabilidade', 'Sustentabilidade'].map(tag => (
              <span key={tag} className="text-[10px] font-bold uppercase bg-white/5 px-3 py-1 rounded-full border border-white/10 text-gray-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 5. LOCALIZAÇÃO E RODAPÉ */}
      <section className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
            <MapPin size={24} className="text-green-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Localização</p>
            <p className="text-sm text-gray-300 font-medium italic">Malanje, Controlo nº 1, Rua direita da Escola Eiffel</p>
          </div>
        </div>
        
        <div className="text-center md:text-right">
          <p className="text-xs text-gray-600 font-bold uppercase tracking-[0.3em]">© 2026 EMATEA SOLUÇÕES</p>
        </div>
      </section>
    </div>
  )
}