import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { MessageCircle, Users, X, ShieldCheck, Trash2 } from "lucide-react"

const WHATSAPP_MANAGER = "https://wa.me/244928270636"
const WHATSAPP_GROUP = "https://chat.whatsapp.com/CaiU4nncaaa7vUnzO6HTzB?mode=gi_t"

export default function Home() {

  const navigate = useNavigate()
  const [supportOpen, setSupportOpen] = useState(false)

  function openWhatsapp() {
    window.open(WHATSAPP_MANAGER, "_blank")
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] px-5 pt-6 pb-24">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <p className="text-xs text-[#848E9C]">
            Bem-vindo à
          </p>

          <h1 className="text-lg font-semibold tracking-wide">
            EMATEA
          </h1>
        </div>

        <button
          onClick={() => setSupportOpen(true)}
          className="
          h-10 px-4 rounded-xl
          bg-emerald-500/10
          border border-emerald-500/30
          text-emerald-400
          flex items-center gap-2
          text-sm
          hover:bg-emerald-500/20
          transition
        "
        >
          <MessageCircle size={16}/>
          Suporte
        </button>

      </div>

      {/* SESSÃO */}
      <SectionTitle title="SESSÃO" />

      <div className="grid grid-cols-2 gap-5 mb-12">

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

      {/* SERVIÇOS */}
      <SectionTitle title="NOSSOS SERVIÇOS" />

      <div className="grid grid-cols-2 gap-5 mb-12">

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

      {/* COMPLIANCE */}
      <div className="
        rounded-3xl p-6
        bg-gradient-to-br from-[#1E2329] to-[#14181D]
        border border-[#2B3139]
        shadow-[0_15px_40px_rgba(0,0,0,0.7)]
      ">

        <h3 className="text-sm font-semibold tracking-wide mb-6 text-[#EAECEF]">
          Transparência & Segurança
        </h3>

        <div className="space-y-4">

          <button
            onClick={() => navigate("/privacy-policy")}
            className="flex items-center gap-3 text-sm text-[#848E9C] hover:text-white transition"
          >
            <ShieldCheck size={18}/>
            Política de Privacidade
          </button>

          <button
            onClick={() => navigate("/delete-account")}
            className="flex items-center gap-3 text-sm text-red-400 hover:text-red-500 transition"
          >
            <Trash2 size={18}/>
            Solicitar Eliminação de Conta
          </button>

        </div>

      </div>

      {/* MODAL SUPORTE */}
      {supportOpen && (
        <div
          onClick={() => setSupportOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
        >

          <div
            onClick={(e) => e.stopPropagation()}
            className="
              w-[90%] max-w-sm p-6 rounded-3xl
              bg-gradient-to-br from-[#1E2329] to-[#14181D]
              border border-[#2B3139]
              shadow-[0_20px_40px_rgba(0,0,0,0.8)]
              relative
            "
          >

            <button
              onClick={() => setSupportOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20}/>
            </button>

            <h2 className="text-lg font-semibold text-white mb-6 text-center">
              Centro de Apoio EMATEA
            </h2>

            <div className="space-y-4">

              <a
                href={WHATSAPP_MANAGER}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  w-full h-12 rounded-xl
                  bg-green-500 text-white font-semibold
                  flex items-center justify-center gap-2
                  hover:bg-green-600 transition
                "
              >
                <MessageCircle size={18}/>
                Falar com Operadora
              </a>

              <a
                href={WHATSAPP_GROUP}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  w-full h-12 rounded-xl
                  bg-emerald-600 text-white font-semibold
                  flex items-center justify-center gap-2
                  hover:bg-emerald-700 transition
                "
              >
                <Users size={18}/>
                Entrar no Grupo
              </a>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

/* COMPONENTES */

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-sm tracking-widest text-[#848E9C] mb-6">
      {title}
    </h2>
  )
}

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
        h-[185px]
        rounded-2xl
        overflow-hidden
        border border-[#2B3139]
        shadow-[0_8px_20px_rgba(0,0,0,0.6)]
        hover:-translate-y-1
        transition-all
      "
    >

      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90" />

      <div className="relative z-10 p-4 flex flex-col justify-end h-full">

        <h3 className="text-sm font-semibold text-[#EAECEF]">
          {title}
        </h3>

        <p className="text-xs text-[#848E9C] mt-1">
          {subtitle}
        </p>

      </div>

    </button>
  )
}