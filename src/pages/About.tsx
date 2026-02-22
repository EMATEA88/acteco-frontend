export default function About() {
  return (
    <div className="p-6 space-y-10 animate-fadeZoom">

      {/* HEADER INSTITUCIONAL COM LOGO */}
      <section className="
        bg-white/5 border border-white/10
        rounded-3xl p-6
        flex justify-between items-center
      ">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">
            EMATEA
          </h1>

          <p className="text-sm text-gray-400">
            <span className="text-white font-medium">Empresa:</span> EMATEA
          </p>

          <p className="text-sm text-gray-400">
            <span className="text-white font-medium">NIF:</span> 5002577666
          </p>

          <p className="text-sm text-gray-400">
            <span className="text-white font-medium">Contacto:</span> +244 928 270 636
          </p>
        </div>

        {/* LOGOTIPO CIRCULAR */}
        <div className="
          w-20 h-20 rounded-full
          border border-white/10
          overflow-hidden
          shadow-lg
        ">
          <img
            src="/logo.png"
            alt="EMATEA Logo"
            className="w-full h-full object-cover"
          />
        </div>
      </section>


      {/* SERVIÇOS FINANCEIROS */}
      <section className="
        bg-white/5 border border-white/10
        rounded-3xl p-6
        transition-all duration-300
        hover:bg-white/10 hover:scale-[1.01]
        space-y-4
      ">
        <h2 className="text-lg font-semibold text-emerald-400">
          Serviços Financeiros
        </h2>

        <ul className="text-sm text-gray-400 space-y-2">
          <li>• Compra e venda de USDT, BTC, BNB e outros ativos digitais</li>
          <li>• Recargas eletrónicas para todos serviços em Angola</li>
        </ul>
      </section>


      {/* TECNOLOGIA & DESENVOLVIMENTO */}
      <section className="
        bg-white/5 border border-white/10
        rounded-3xl p-6
        transition-all duration-300
        hover:bg-white/10 hover:scale-[1.01]
        space-y-4
      ">
        <h2 className="text-lg font-semibold text-emerald-400">
          Tecnologia & Desenvolvimento
        </h2>

        <ul className="text-sm text-gray-400 space-y-2">
          <li>• Criação de websites profissionais</li>
          <li>• Desenvolvimento de aplicações (APPs)</li>
          <li>• Design & identidade visual</li>
          <li>• Logotipos 3D e tradicionais</li>
        </ul>
      </section>


      {/* LOCALIZAÇÃO */}
      <section className="
        bg-white/5 border border-white/10
        rounded-3xl p-6
        transition-all duration-300
        hover:bg-white/10 hover:scale-[1.01]
        space-y-4
      ">
        <h2 className="text-lg font-semibold text-emerald-400">
          Localização & Contacto
        </h2>

        <div className="text-sm text-gray-400 space-y-2">
          <p>
            <span className="text-white font-medium">Endereço:</span> 
            {" "}Malanje, Controlo nº 1, rua direita da Escola Eiffel, junto ao Consórcio
          </p>

          <p>
            <span className="text-white font-medium">E-mail:</span> 
            {" "}ematea8800088@gmail.com
          </p>
        </div>
      </section>


      {/* ============================= */}
      {/* SECÇÕES INSTITUCIONAIS ANTIGAS */}
      {/* ============================= */}

      <section className="
        bg-white/5 border border-white/10
        rounded-3xl p-6 space-y-4
      ">
        <p className="text-sm text-gray-300 leading-relaxed">
          A EMATEA é uma empresa angolana fundada em 04 de março de 2023,
          sediada em Malanje – Controlo nº1, atuando de forma estratégica
          nos setores de tecnologia, ativos digitais e comércio diversificado.
        </p>

        <p className="text-sm text-gray-400 leading-relaxed">
          Desde a sua criação, posiciona-se como organização moderna,
          estruturada e orientada para inovação, oferecendo soluções
          que combinam segurança e crescimento sustentável.
        </p>
      </section>


      {/* MISSÃO */}
      <section className="
        bg-white/5 border border-white/10
        rounded-3xl p-6
        transition-all duration-300
        hover:bg-white/10 hover:scale-[1.02]
      ">
        <h2 className="text-lg font-semibold text-emerald-400 mb-2">
          Missão
        </h2>
        <p className="text-sm text-gray-400">
          Oferecer soluções tecnológicas, financeiras e comerciais inovadoras,
          promovendo crescimento sustentável e confiança no mercado.
        </p>
      </section>


      {/* VISÃO */}
      <section className="
        bg-white/5 border border-white/10
        rounded-3xl p-6
        transition-all duration-300
        hover:bg-white/10 hover:scale-[1.02]
      ">
        <h2 className="text-lg font-semibold text-emerald-400 mb-2">
          Visão
        </h2>
        <p className="text-sm text-gray-400">
          Tornar-se referência regional em tecnologia e ativos digitais,
          expandindo a atuação institucional em Angola.
        </p>
      </section>


      {/* VALORES */}
      <section className="
        bg-white/5 border border-white/10
        rounded-3xl p-6
        transition-all duration-300
        hover:bg-white/10 hover:scale-[1.02]
      ">
        <h2 className="text-lg font-semibold text-emerald-400 mb-2">
          Valores
        </h2>

        <ul className="text-sm text-gray-400 space-y-2">
          <li>• Transparência</li>
          <li>• Inovação</li>
          <li>• Responsabilidade</li>
          <li>• Compromisso com o cliente</li>
          <li>• Crescimento sustentável</li>
        </ul>
      </section>

    </div>
  )
}