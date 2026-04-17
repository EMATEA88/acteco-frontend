import { useNavigate } from "react-router-dom"

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#070d1a] text-white flex flex-col lg:flex-row">

      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6">

        <div>
          {/* LOGO */}
          <div className="flex justify-center mb-6">
            <img
              src="/logo.png"
              alt="EMATEA"
              className="w-28 h-28 rounded-full shadow-lg"
            />
          </div>

          {/* TITLE */}
          <h1 className="text-center text-3xl font-semibold text-gray-300">
            Bem-vindo à
          </h1>

          <h2 className="text-center text-5xl font-bold text-blue-500 mb-4">
            EMATEA
          </h2>

          <p className="text-center text-gray-400 mb-6">
            Soluções financeiras e tecnológicas para o seu dia a dia.
          </p>

          {/* LOGIN BOX */}
          <div className="bg-[#0b1220] p-5 rounded-2xl border border-gray-800 shadow-lg">

            <h3 className="text-xl font-semibold mb-1">Entrar</h3>
            <p className="text-gray-400 text-sm mb-4">
              Aceda à sua conta
            </p>

            <input
              type="text"
              placeholder="923 000 000 ou email"
              className="w-full mb-3 p-3 rounded-lg bg-[#070d1a] border border-gray-700 focus:outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mb-3 p-3 rounded-lg bg-[#070d1a] border border-gray-700 focus:outline-none"
            />

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold"
            >
              Entrar
            </button>

            <p className="text-center text-sm mt-3 text-gray-400">
              Não tem uma conta?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-green-400 cursor-pointer"
              >
                Criar uma conta
              </span>
            </p>

            {/* LEGAL */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Ao entrar, concorda com os Termos e Política de Privacidade.
            </p>
          </div>
        </div>

        {/* FOOTER INFO */}
        <div className="text-sm text-gray-400 mt-6 space-y-2">
          <p>📍 Malanje, Controlo nº1</p>
          <p>📞 +244 928 270 636</p>
          <p>✉️ ematea8800088@gmail.com</p>

          <div className="mt-3 text-xs text-gray-500">
            Empresa registada • NIF: 5002577666
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">

        {services.map((service, index) => (
          <div
            key={index}
            className="bg-[#0b1220] p-4 rounded-xl border border-gray-800 hover:border-blue-500 transition"
          >
            <h3 className="font-semibold mb-1">{service.title}</h3>
            <p className="text-sm text-gray-400">{service.desc}</p>
          </div>
        ))}

        {/* IA */}
        <div className="col-span-1 md:col-span-2 bg-[#0b1220] p-4 rounded-xl border border-gray-800">
          <h3 className="font-semibold mb-1">Inteligência Artificial</h3>
          <p className="text-sm text-gray-400">
            Soluções inovadoras com IA para impulsionar o seu negócio.
          </p>
        </div>

        {/* BANNER */}
        <div className="col-span-1 md:col-span-2 bg-[#0b1220] p-4 rounded-xl border border-gray-800">
          <h3 className="text-lg font-semibold mb-2">
            Confiança, Inovação e Resultados
          </h3>
          <p className="text-sm text-gray-400">
            A EMATEA está pronta para levar o seu projeto ao próximo nível.
          </p>
        </div>

        {/* FOOTER RIGHT */}
        <div className="col-span-1 md:col-span-2 text-center text-xs text-gray-500 mt-4">
          © 2025 EMATEA. Todos os direitos reservados.
        </div>
      </div>
    </div>
  )
}

const services = [
  {
    title: "Serviços Financeiros",
    desc: "Compra e venda de USDT, BTC, BNB e outras criptomoedas."
  },
  {
    title: "Recargas Eletrónicas",
    desc: "Recargas para todos os serviços em Angola."
  },
  {
    title: "Tecnologia & Desenvolvimento",
    desc: "Criação de Websites e Apps profissionais."
  },
  {
    title: "Design & Identidade Visual",
    desc: "Logotipos 3D e identidade profissional."
  }
]