import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Wallet, 
  Cpu, 
  Globe, 
  Palette, 
  ArrowRight, 
  MapPin, 
  Phone, 
  Mail 
} from "lucide-react";
import toast from "react-hot-toast";
// IMPORTANTE: Ajuste o caminho abaixo para onde está a sua função/serviço de login real
import { loginUser } from "../services/api"; 

export default function Landing() {
  const navigate = useNavigate();
  
  // 1. ADICIONADOS: Estados para capturar os dados do formulário
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. ADICIONADA: Função que processa o login real com a API
  async function handleLogin(e: FormEvent) {
    e.preventDefault(); // Evita que a página recarregue

    if (!identity || !password) {
      return toast.error("Por favor, preencha todos os campos.");
    }

    try {
      setLoading(true);
      
      // Envia os dados para a sua API (ajuste conforme o formato esperado pelo seu backend)
      // Geralmente, isso salva o Token no localStorage de forma automática por dentro do serviço.
      await loginUser(identity, password); 
      
      toast.success("Acesso autorizado!");
      navigate("/dashboard"); // Redireciona com sucesso após autenticar
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Credenciais incorretas ou erro no servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#070d1a] text-white flex flex-col lg:flex-row antialiased selection:bg-blue-500/30">
      
      {/* LEFT SIDE: VISUAL & SERVICES */}
      <div className="w-full lg:w-7/12 bg-gradient-to-br from-[#0a1428] via-[#070d1a] to-[#040811] p-8 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.03]">
        
        {/* BRAND HEADER */}
        <div className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="EMATEA Logo"
            className="w-12 h-12 rounded-full border border-white/10 shadow-md object-cover"
          />
          <div>
            <h2 className="text-xl font-black tracking-wider text-white italic">EMATEA</h2>
            <p className="text-[10px] uppercase tracking-widest text-blue-400 font-mono">Fintech & Tech Solutions</p>
          </div>
        </div>

        {/* HERO TEXT & SERVICES */}
        <div className="my-12 lg:my-0 space-y-8 max-w-xl">
          <div className="space-y-3">
            <h1 className="text-3xl lg:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
              Soluções financeiras e tecnológicas para o seu dia a dia.
            </h1>
            <p className="text-sm text-gray-400 max-w-sm">
              Conectamos inovação, agilidade e segurança para impulsionar o ecossistema digital em Angola.
            </p>
          </div>

          {/* SERVICES MINI-GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white/[0.01] border border-white/[0.03] p-4 rounded-xl flex items-start gap-3 transition-all duration-300 hover:border-blue-500/20 hover:bg-white/[0.02]"
                >
                  <div className="p-2 rounded-lg bg-blue-500/5 text-blue-400 border border-blue-500/10 mt-0.5">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">{service.title}</h3>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{service.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COMPACT FOOTER INFO */}
        <div className="pt-6 border-t border-white/[0.03] flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-mono text-gray-500">
          <span className="flex items-center gap-1.5"><MapPin size={12} className="text-blue-500/70" /> Malanje, Controlo nº1</span>
          <span className="flex items-center gap-1.5"><Phone size={12} className="text-blue-500/70" /> +244 928 270 636</span>
          <span className="flex items-center gap-1.5"><Mail size={12} className="text-blue-500/70" /> comercial@ematea.org</span>
          <span className="block w-full mt-2 text-[10px] text-gray-600">NIF: 5002577666 • © 2026 EMATEA</span>
        </div>
      </div>

      {/* RIGHT SIDE: CLEAN CONVERSION FORM */}
      <div className="w-full lg:w-5/12 p-8 lg:p-16 flex flex-col justify-center items-center bg-[#070d1a]">
        <div className="w-full max-w-sm space-y-6">
          
          <div className="space-y-1 text-center lg:text-left">
            <h3 className="text-2xl font-bold tracking-tight text-white">Aceder à Plataforma</h3>
            <p className="text-xs text-gray-400">Insira as suas credenciais para entrar na sua conta.</p>
          </div>

          {/* 3. MUDANÇA: Agora envolvemos os inputs numa tag <form> */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-mono text-gray-400 font-bold">Identificação</label>
              <input
                type="text"
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                placeholder="923 000 000 ou email"
                className="w-full p-3.5 rounded-xl bg-[#0b1220] border border-white/[0.05] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all duration-200 placeholder:text-gray-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-mono text-gray-400 font-bold">Palavra-passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3.5 rounded-xl bg-[#0b1220] border border-white/[0.05] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all duration-200 placeholder:text-gray-600 focus:outline-none"
              />
            </div>

            {/* 4. MUDANÇA: O botão agora é do tipo submit e desativa se estiver carregando */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Entrar no Sistema
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="space-y-4 text-center">
            <p className="text-xs text-gray-400">
              Não tem uma conta?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-blue-400 hover:text-blue-300 cursor-pointer font-semibold underline underline-offset-4"
              >
                Criar conta gratuita
              </span>
            </p>

            <p className="text-[10px] text-gray-600 leading-relaxed">
              Ao entrar, confirma estar de acordo com os nossos <br />
              <span className="underline cursor-pointer hover:text-gray-500">Termos de Uso</span> e <span className="underline cursor-pointer hover:text-gray-500">Políticas de Privacidade</span>.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

const services = [
  {
    title: "Mercado Crypto",
    desc: "Compra e venda ágil de USDT, BTC, BNB e outras criptomoedas em Angola.",
    icon: Wallet
  },
  {
    title: "Recargas Globais",
    desc: "Distribuição instantânea de recargas eletrónicas para todos os serviços nacionais.",
    icon: Cpu
  },
  {
    title: "Web & Mobile",
    desc: "Desenvolvimento de aplicações robustas, websites corporativos e e-commerce.",
    icon: Globe
  },
  {
    title: "Design & Brand",
    desc: "Construção de identidades visuais de impacto, logótipos 3D e branding corporativo.",
    icon: Palette
  }
];