import { useNavigate } from "react-router-dom"

export default function Home() {

  const navigate = useNavigate()

  function openWhatsapp() {
    window.open("https://wa.me/244928270636", "_blank")
  }

  return (
    <div className="min-h-screen px-5 pt-16 pb-24">

      {/* SEÇÃO PRINCIPAL */}
      <div className="grid grid-cols-2 gap-4">

        <ImageCard
          image="/assets/home/fundos.png"
          title="Fundos & Juros"
          subtitle="Invista por prazos e reembolse com juros"
          onClick={() => navigate("/applications")}
        />

        <ImageCard
          image="/assets/home/cripto.png"
          title="Compra & Venda"
          subtitle="USDT, BTC, BNB e ativos digitais"
          onClick={() => navigate("/otc")}
        />

        <ImageCard
          image="/assets/home/marketing.png"
          title="Marketing"
          subtitle="Vídeos e campanhas"
          onClick={() => navigate("/marketing")}
        />

        <ImageCard
          image="/assets/home/tecnologia.png"
          title="Tecnologia"
          subtitle="Web, apps e design"
          onClick={openWhatsapp}
        />

      </div>

      {/* NOSSOS SERVIÇOS */}
      <div className="mt-12">

        <h2 className="text-lg font-semibold tracking-wide text-[#848E9C] mb-6">
          NOSSOS SERVIÇOS
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <ImageCard
            image="/assets/home/deposito.png"
            title="Depósito"
            subtitle="Adicionar saldo"
            onClick={() => navigate("/deposit")}
          />

          <ImageCard
            image="/assets/home/levantamento.png"
            title="Levantamento"
            subtitle="Retirar fundos"
            onClick={() => navigate("/withdraw")}
          />

          <ImageCard
            image="/assets/home/aplicacoes.png"
            title="Aplicações"
            subtitle="Fundos por prazo"
            onClick={() => navigate("/applications")}
          />

          <ImageCard
            image="/assets/home/design.png"
            title="Design"
            subtitle="Identidade visual"
            onClick={() => navigate("/about")}
          />

        </div>

      </div>

    </div>
  )
}

/* ================= CARD PADRÃO BINANCE ================= */

function ImageCard({
  image,
  title,
  subtitle,
  onClick
}: {
  image: string
  title: string
  subtitle: string
  onClick: () => void
}) {

  return (
    <button
      onClick={onClick}
      className="
        relative
        rounded-xl
        overflow-hidden
        border border-[#2B3139]
        bg-[#1E2329]
        h-[180px]
        flex
        shadow-md
        transition
        active:scale-[0.98]
      "
    >

      {/* IMAGEM */}
      <img
        src={image}
        alt={title}
        className="
          absolute inset-0
          w-full h-full
          object-cover
        "
      />

      {/* OVERLAY PROFISSIONAL */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90" />

      {/* CONTEÚDO */}
      <div className="relative z-10 p-4 flex flex-col justify-end w-full">

        <h3 className="text-sm font-semibold leading-tight text-[#EAECEF]">
          {title}
        </h3>

        <p className="text-xs text-[#848E9C] mt-1 leading-tight">
          {subtitle}
        </p>

      </div>

    </button>
  )
}