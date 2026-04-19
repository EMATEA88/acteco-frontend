import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Login() {
  const navigate = useNavigate()

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
    }, 5000)
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-white overflow-y-auto">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0a0a0a] border border-white/5 flex items-center justify-center">
              <img src="/logo.png" className="w-full h-full object-contain p-1 rounded-full" />
            </div>
            <span className="font-black text-xl">EMATEA</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login-user')}
              className="text-gray-400 hover:text-white"
            >
              Entrar
            </button>

            <button
              onClick={() => navigate('/register')}
              className="bg-white text-black px-5 py-2 rounded-full hover:bg-green-500 hover:text-white transition-all"
            >
              Criar conta
            </button>
          </div>

        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-16 flex flex-col gap-12">

        {/* CARD INSTITUCIONAL */}
        <div className="bg-[#141414] border border-white/10 rounded-3xl p-10 shadow-lg">

          <div className="flex flex-col lg:flex-row items-center gap-10">

            <div className="w-28 h-28 rounded-full border border-white/10 bg-[#111] flex items-center justify-center">
              <img src="/logo.png" className="w-full h-full object-contain p-2 rounded-full" />
            </div>

            <div className="text-center lg:text-left max-w-xl">

              <h1 className="text-4xl font-black mb-3">
                EMATEA
              </h1>

              <p className="text-gray-400 mb-6">
                A plataforma inteligente que une finanças e tecnologia para impulsionar o seu dia a dia.
              </p>

              <div className="space-y-2 text-sm">
                <p>• Compra e venda de criptomoedas</p>
                <p>• Recargas eletrónicas em Angola</p>
                <p>• Desenvolvimento de Apps e Websites</p>
                <p>• Design & Identidade Visual</p>
              </div>

            </div>

          </div>

        </div>

        {/* CAROUSEL */}
        <div className="rounded-3xl overflow-hidden border border-white/5">
          <img src={images[index]} className="w-full h-72 object-cover" />
        </div>

        {/* GRID CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

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

      </main>
    </div>
  )
}

/* CARD */
function ServiceCard({ title, desc, tag, img }: any) {
  return (
    <div className="
      bg-[#141414]
      border border-white/10
      rounded-3xl
      overflow-hidden
      transition-all duration-300
      group
      shadow-lg
      hover:shadow-2xl
      hover:-translate-y-1
      hover:border-green-500/40
      flex flex-col
    ">

      {/* IMAGEM */}
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
      </div>

      {/* TEXTO */}
      <div className="p-6 flex flex-col gap-3">

        <h3 className="font-bold text-base tracking-tight group-hover:text-green-400 transition-colors">
          {title}
        </h3>

        <p className="text-sm text-gray-400 leading-relaxed">
          {desc}
        </p>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
            {tag}
          </span>
        </div>

      </div>
    </div>
  )
}