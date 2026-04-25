import { useState, useEffect } from "react";
import { UserService } from "../services/user.service";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft, ShieldCheck, Wallet as WalletIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Wallet() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  // Carrega o endereço salvo no banco de dados assim que o componente monta
  useEffect(() => {
    if (user?.withdrawWalletAddress) {
      setAddress(user.withdrawWalletAddress);
    }
  }, [user]);

  const handleSave = async () => {

    if (!address.trim()) {
  return toast.error("Informe um endereço")
}

    // Validação da rede Tron TRC20
    const cleanAddress = address.trim()

if (!cleanAddress.startsWith("T") || cleanAddress.length < 34) {
  return toast.error("Endereço TRC20 inválido!")
}

    setSaving(true);
    try {
      // Chama o serviço para atualizar o perfil no backend
      await UserService.updateProfile({ withdrawWalletAddress: cleanAddress });
      
      // Atualiza o contexto global para refletir os novos dados
      await refreshUser(); 
      
      toast.success("Endereço salvo com sucesso!");

      // 🟢 Redireciona para o perfil após 1.5 segundos
      setTimeout(() => {
        navigate("/profile"); // Ou o caminho exato da sua rota de perfil
      }, 1500);

    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Erro ao salvar endereço";
      toast.error(message);
      console.error("Erro detalhado no salvamento:", err);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 pb-32">
      
      {/* HEADER COM NAVEGAÇÃO CORRETA */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-[#161A1F] rounded-xl border border-white/5 active:scale-95 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold">Minha Carteira</h1>
      </div>

      <div className="space-y-6">
        
        {/* CARD DE CONFIGURAÇÃO */}
        <div className="bg-[#161A1F] p-6 rounded-[1.75rem] border border-white/5 space-y-4 shadow-2xl">
          <div className="flex items-center gap-3 text-cyan-400">
            <ShieldCheck size={24} weight="fill" />
            <span className="text-xs font-bold uppercase tracking-widest">Rede Segura: TRON (TRC20)</span>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-400">
              Insira seu endereço USDT para receber pagamentos da empresa.
            </p>
            
            <div className="relative">
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: TAbc123..."
                className="w-full bg-[#0B0E11] border border-white/10 rounded-2xl p-4 pr-12 text-cyan-400 font-mono text-sm focus:outline-none focus:border-cyan-500 transition shadow-inner"
              />
              <WalletIcon size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700" />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full h-14 bg-white text-black rounded-2xl font-bold active:scale-95 transition disabled:opacity-50 shadow-lg shadow-white/5 flex items-center justify-center gap-2"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                PROCESSANDO...
              </span>
            ) : (
              "SALVAR ENDEREÇO"
            )}
          </button>
        </div>

        {/* AVISO DE SEGURANÇA */}
        <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
          <p className="text-[10px] text-amber-500 leading-relaxed uppercase font-black text-center tracking-wider">
            Atenção: A EMATEA opera exclusivamente via USDT na rede Tron. 
            O envio para outras redes resultará em perda permanente.
          </p>
        </div>

      </div>
    </div>
  );
}