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
    <div className="min-h-screen px-5 pt-16 pb-24">

      {/* ================= SUPORTE CARD ================= */}
      <button
        onClick={() => setSupportOpen(true)}
        className="
          w-full
          mb-8
          rounded-3xl
          bg-[#1E2329]
          border border-[#2B3139]
          p-5
          shadow-md
          flex
          items-center
          justify-between
          hover:border-emerald-500/40
          hover:bg-[#222831]
          transition
        "
      >
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-500 font-semibold">
            Centro de Apoio
          </p>
          <p className="text-sm text-[#EAECEF] font-medium mt-1">
            Fale com a operadora ou entre no grupo oficial
          </p>
        </div>

        <MessageCircle size={24} className="text-emerald-500" />
      </button>

      {/* ================= SEÇÃO PRINCIPAL ================= */}
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

      {/* ================= NOSSOS SERVIÇOS ================= */}
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

      {/* ================= BLOCO INSTITUCIONAL (COMPLIANCE) ================= */}
      <div className="mt-16 border-t border-[#2B3139] pt-8">

        <div className="bg-[#0F172A] border border-[#1E2329] rounded-2xl p-5 space-y-4">

          <h3 className="text-sm font-semibold text-[#EAECEF]">
            Transparência & Segurança
          </h3>

          <div className="space-y-3">

            <button
              onClick={() => navigate("/privacy-policy")}
              className="
                w-full flex items-center gap-3
                text-sm text-[#848E9C]
                hover:text-white transition
              "
            >
              <ShieldCheck size={18} />
              Política de Privacidade
            </button>

            <button
              onClick={() => navigate("/delete-account")}
              className="
                w-full flex items-center gap-3
                text-sm text-red-400
                hover:text-red-500 transition
              "
            >
              <Trash2 size={18} />
              Solicitar Eliminação de Conta
            </button>

          </div>

        </div>

      </div>

      {/* ================= MODAL SUPORTE ================= */}
      {supportOpen && (
        <div
          onClick={() => setSupportOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              relative
              w-[90%] max-w-sm
              bg-[#0F172A]
              border border-white/10
              rounded-3xl
              p-6
              text-center
              shadow-xl
            "
          >

            <button
              onClick={() => setSupportOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold text-white mb-6">
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
                  hover:bg-green-600
                  transition
                "
              >
                <MessageCircle size={18} />
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
                  hover:bg-emerald-700
                  transition
                "
              >
                <Users size={18} />
                Entrar no Grupo
              </a>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}

/* ================= CARD PADRÃO ================= */

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

      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90" />

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