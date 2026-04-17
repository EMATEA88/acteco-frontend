import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowRight, CaretLeft, CaretRight } from '@phosphor-icons/react'

export default function Login() {
  const navigate = useNavigate()

  /* ================= CAROUSEL ================= */
  // Mantendo a chamada das imagens originais
  const images = [
    '/images/ematea1.jpg',
    '/images/ematea2.jpg',
    '/images/ematea3.jpg',
    '/images/ematea4.jpg',
    '/images/ematea5.jpg',
    '/images/ematea6.jpg',
    '/images/ematea7.jpg',
    '/images/ematea8.jpg',
  ]

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 5000) // Aumentado para 5s para leitura mais calma

    return () => clearInterval(interval)
  }, [images.length])

  const nextImage = () => setIndex((prev) => (prev + 1) % images.length)
  const prevImage = () => setIndex((prev) => (prev - 1 + images.length) % images.length)

  return (
    // Fundo Preto Absoluto e Texto Branco
    <div className="w-full min-h-screen bg-[#0a0a0a] text-white overflow-y-auto font-sans selection:bg-green-500/30">
      
      {/* Luzes de Fundo Estilo Vidro (Consistência com login-user) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-600/5 rounded-full filter blur-[150px] z-0"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full filter blur-[150px] z-0"></div>

      {/* ================= HEADER PREMIUM ================= */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Logo Circular com Brilho Verde Sutil */}
           <div className="flex items-center gap-3">
  {/* Logo Circular Recortado (Sem Luz Verde) */}
  <div className="relative w-10 h-10 rounded-full bg-[#0a0a0a] flex items-center justify-center border border-white/5">
    <img 
      src="/logo.png" 
      className="w-full h-full object-contain rounded-full p-1" // 'object-contain' e 'p-1' evitam que o logo toque a borda
      alt="Logo" 
    />
  </div>
  <span className="text-white font-black text-xl tracking-tighter">
    EMATEA
  </span>
</div>
</div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login-user')}
              className="text-gray-400 hover:text-white text-sm font-semibold transition-colors px-4 py-2"
            >
              Entrar
            </button>

            <button
              onClick={() => navigate('/register')}
              className="bg-white text-black text-sm font-bold px-5 py-2.5 rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 active:scale-95"
            >
              Criar conta gratuita
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 my-12 lg:my-16">
        
        {/* Container Principal com Bordas Suaves e Fundo Grafite */}
        <div className="flex flex-col lg:flex-row rounded-[2.5rem] bg-[#111111] border border-white/5 shadow-3xl overflow-hidden">

          {/* ================= LEFT: APRESENTAÇÃO INSTITUCIONAL ================= */}
          <div className="lg:w-[45%] p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/5 bg-[#111111]">
            
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-8">
                {/* Logo Grande com Brilho Neon Pulsante */}
               <div className="flex justify-center lg:justify-start mb-8 group">
  {/* Logo Grande com Recorte Circular (Sem Luz Verde) */}
  <div className="relative inline-block">
    {/* Contêiner do Logo com Borda Minimalista (Sem Sombra/Brilho) */}
    <div className="relative w-28 h-28 rounded-full border-2 border-white/5 overflow-hidden bg-[#111111] flex items-center justify-center transition-all duration-300 group-hover:border-green-500/30">
      <img 
        src="/logo.png" 
        className="w-full h-full object-contain rounded-full p-1.5" // 'object-contain' e 'p-1.5' garantem que o símbolo flutue
        alt="EMATEA Logo Large" 
      />
    </div>
  </div>
</div>
              </div>

              {/* Título com Gradiente Moderno (Consistência) */}
              <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 mb-4">
                EMATEA
              </h1>

              <p className="text-gray-400 text-lg font-medium mb-10 max-w-md mx-auto lg:mx-0">
                A plataforma inteligente que une finanças e tecnologia para impulsionar o seu dia a dia.
              </p>

              {/* Lista de Recursos com Ícones Verdes */}
              <div className="space-y-4 text-gray-200 text-sm font-medium inline-block text-left">
                {[
                  'Compra e venda de criptomoedas',
                  'Recargas eletrónicas em Angola',
                  'Desenvolvimento de Apps e Websites',
                  'Design & Identidade Visual'
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                      <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CONTATOS ESTILO MINIMALISTA */}
            <div className="mt-16 pt-10 border-t border-white/5 text-center lg:text-left space-y-3">
              <p className="text-gray-500 text-xs font-mono tracking-tight">SOLUÇÕES LOCAIS, IMPACTO GLOBAL</p>
              <div className="text-gray-600 text-xs space-y-1.5 font-medium">
                <p>Malanje, Controlo nº1 • Angola</p>
                <p>+244 928 270 636 • ematea8800088@gmail.com</p>
                <p className="text-[11px] text-gray-700">Empresa registada • NIF: 5002577666</p>
              </div>
            </div>
          </div>

          {/* ================= RIGHT: CAROUSEL E SERVIÇOS ================= */}
          <div className="lg:w-[55%] p-12 lg:p-16 bg-[#161616] flex flex-col gap-10">
            
            {/* CAROUSEL PREMIUM */}
            <div className="relative group rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-[#0a0a0a]">
              <img
                src={images[index]}
                alt={`Slide ${index + 1}`}
                className="w-full h-72 object-cover transition-all duration-1000 ease-in-out transform group-hover:scale-105"
              />
              {/* Overlay de Gradiente Sutil para Texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Controles do Carousel (Visíveis no Hover) */}
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-500">
                <CaretLeft size={20} weight="bold" />
              </button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-500">
                <CaretRight size={20} weight="bold" />
              </button>

              {/* Indicadores Visuais */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-green-500 w-5' : 'bg-gray-600'}`}></div>
                ))}
              </div>
            </div>

            {/* TITLE & DESC */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-extrabold tracking-tighter mb-3">
                Soluções que impulsionam o seu crescimento
              </h2>
              <p className="text-gray-400 text-base font-medium max-w-xl">
                Tecnologia de ponta, inovação constante e segurança rigorosa combinadas para entregar resultados reais no mercado digital.
              </p>
            </div>

            {/* GRID DE SERVIÇOS REESTILIZADO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ServiceCard
                title="Serviços Financeiros"
                desc="Invista, compre e venda ativos digitais com total segurança e liquidez imediata."
                tag="Cripto & Ativos"
                img="/images/ematea1.jpg"
              />
              <ServiceCard
                title="Recargas Inteligentes"
                desc="Pagamentos e recargas rápidas com integração total ao sistema bancário nacional."
                tag="Instantâneo"
                img="/images/ematea2.jpg"
              />
              <ServiceCard
                title="Desenvolvimento Tech"
                desc="Criamos plataformas robustas, escaláveis e prontas para o mercado global."
                tag="Alta performance"
                img="/images/ematea3.jpg"
              />
              <ServiceCard
                title="Design Estratégico"
                desc="Marcas fortes, experiências modernas e identidade visual premium de alto impacto."
                tag="Identidade"
                img="/images/ematea4.jpg"
              />
            </div>

            {/* BLOCO FINAL DE DESTAQUE (Glow Verde) */}
            <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden group hover:border-green-500/30 transition-all duration-300 shadow-xl">
              <div className="relative h-44 overflow-hidden">
                <img src="/images/ematea5.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Plataforma Escalável" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/40 to-transparent"></div>
              </div>
              <div className="p-6 relative">
                <h3 className="text-xl font-bold text-green-400 mb-2 tracking-tight">
                  Infraestrutura preparada para escalar
                </h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                  A EMATEA foi construída sobre pilares de performance, segurança de nível bancário e crescimento sustentável, garantindo estabilidade para o seu negócio.
                </p>
                <ArrowRight size={24} className="absolute right-6 bottom-6 text-gray-700 group-hover:text-green-500 transition-colors" />
              </div>
            </div>

          </div>
        </div>

        {/* FOOTER SIMPLES */}
        <footer className="mt-20 py-8 border-t border-white/5 text-center">
          <p className="text-gray-600 text-xs font-medium">
            © 2024 EMATEA Soluções Tecnológicas. Todos os direitos reservados.
          </p>
        </footer>

      </main>
    </div>
  )
}

/* ================= SERVICE CARD PREMIUM ================= */
function ServiceCard({
  title,
  desc,
  tag,
  img
}: {
  title: string
  desc: string
  tag: string
  img: string
}) {
  return (
    // Card com Fundo Preto, Hover com Borda Verde e Brilho Interno
    <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-green-500/40 transition-all duration-300 group shadow-lg flex flex-col h-full active:scale-[0.98]">
      
      <div className="relative h-36 overflow-hidden">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Overlay para Escurecer a Imagem Consistentemente */}
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors"></div>
      </div>

      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="font-bold text-base mb-1.5 tracking-tight group-hover:text-green-400 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed font-medium">
            {desc}
          </p>
        </div>

        {/* Tag Verde Minimalista */}
        <div className="flex justify-start">
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
            {tag}
          </span>
        </div>
      </div>
    </div>
  )
}