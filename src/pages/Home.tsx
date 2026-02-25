import { useNavigate } from "react-router-dom"

export default function Home() {

  const navigate = useNavigate()

  function openWhatsapp() {
    window.open("https://wa.me/244928270636", "_blank")
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-white px-6 py-10 space-y-12">

      {/* 4 CARDS SUPERIORES */}
      <div className="grid grid-cols-2 gap-6">

        <ImageCard
          image="/assets/home/fundos.png"
          title="Fundos & Juros"
          subtitle="Invista por prazos e reembolse com juros"
          onClick={() => navigate("/applications")}
        />

        <ImageCard
          image="/assets/home/cripto.png"
          title=""
          subtitle="USDT, BTC, BNB e outros ativos digitais"
          onClick={() => navigate("/otc")}
        />

        <ImageCard
          image="/assets/home/marketing.png"
          title="Marketing & Publicidade"
          subtitle="Criação de vídeos e campanhas publicitárias"
          onClick={() => navigate("/marketing")}
        />

        <ImageCard
          image="/assets/home/tecnologia.png"
          title="Tecnologia & Apps"
          subtitle="Desenvolvimento web, apps e design"
          onClick={openWhatsapp}
        />

      </div>

      {/* NOSSOS SERVIÇOS */}
      <div className="space-y-6">

        <h2 className="text-2xl font-semibold">
          Nossos Serviços
        </h2>

        <div className="grid grid-cols-2 gap-6">

          <ImageCard
            image="/assets/home/deposito.png"
            title="Depósito"
            subtitle="Depósito"
            onClick={() => navigate("/deposit")}
          />

          <ImageCard
            image="/assets/home/levantamento.png"
            title=""
            subtitle="Levantamento"
            onClick={() => navigate("/withdraw")}
          />

          <ImageCard
            image="/assets/home/aplicacoes.png"
            title="Sobre"
            subtitle="EMATEA"
            onClick={() => navigate("/about")}
          />

          <ImageCard
            image="/assets/home/design.png"
            title=""
            subtitle="Design & identidade"
            onClick={() => navigate("/about")}
          />

        </div>

      </div>

    </div>
  )
}

function ImageCard({ image, title, subtitle, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="
        relative
        rounded-3xl
        overflow-hidden
        border border-white/10
        bg-[#111827]
        h-[230px]
        text-left
        group
        shadow-xl
        transition
        hover:scale-[1.03]
      "
    >

      {/* IMAGEM FUNDO */}
      <img
        src={image}
        alt={title}
        className="
          absolute inset-0 w-full h-full object-cover
          opacity-80
          group-hover:scale-110
          transition duration-500
        "
      />

      {/* OVERLAY ESCURO */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />

      {/* TEXTO */}
      <div className="relative z-10 p-5 h-full flex flex-col justify-end">

        <h3 className="text-lg font-semibold">
          {title}
        </h3>

        <p className="text-sm text-gray-300 mt-2">
          {subtitle}
        </p>

      </div>

    </button>
  )
}