import { useState, useEffect, useRef } from "react";
import { UserService } from "../services/user.service";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft, Wallet as WalletIcon, ShieldCheck, Info } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Wallet() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (user?.withdrawWalletAddress) {
      setAddress(user.withdrawWalletAddress);
    }
  }, [user]);

  const otp = otpArray.join('');

  function handleOtpChange(value: string, index: number) {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otpArray];
    newOtp[index] = value;
    setOtpArray(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === 'Backspace' && !otpArray[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  async function sendOtp() {
    try {
      if (!user?.email) {
        return toast.error("Email não carregado");
      }

      await UserService.sendOtp('WITHDRAW', user.email);
      setOtpSent(true);
      toast.success("Código enviado para seu email");

    } catch (err: any) {
      toast.error("Erro ao enviar OTP");
    }
  }

  const handleSave = async () => {
    const cleanAddress = address.trim();

    if (!cleanAddress) {
      return toast.error("Informe um endereço");
    }

    const bscRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!bscRegex.test(cleanAddress)) {
      return toast.error("Endereço BEP20 inválido");
    }

    if (!otpSent) {
      await sendOtp();
      return;
    }

    if (otp.length !== 6) {
      return toast.error("Digite o código de 6 dígitos");
    }

    try {
      setSaving(true);

      await UserService.updateProfile({
        withdrawWalletAddress: cleanAddress.toLowerCase(),
        otp
      });

      await refreshUser();
      toast.success("Carteira vinculada com sucesso!");

      setTimeout(() => {
        navigate("/profile");
      }, 1200);

    } catch (err: any) {
      const message = err.response?.data?.message || "Erro ao atualizar carteira";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      <Toaster position="top-center" />

      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-6 border-b border-white/5">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={18} weight="bold" />
        </button>
        <h1 className="text-lg font-bold">Vincular Carteira</h1>
        <div className="w-9" />
      </div>

      <div className="px-5 py-8 max-w-md mx-auto space-y-8">
        
        {/* INFO CARD */}
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-5 flex items-start gap-4">
          <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg">
            <WalletIcon size={24} weight="duotone" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-cyan-400">Rede Suportada: BEP20</h3>
            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
              Use apenas endereços da Binance Smart Chain. O envio para outras redes resultará em perda permanente.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* INPUT ADDRESS */}
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1">Endereço de Destino</label>
            <div className="relative group">
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                className="w-full bg-[#161A1E] border border-white/5 rounded-2xl p-5 font-mono text-xs outline-none focus:border-cyan-500/50 transition-all placeholder:text-gray-700"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <ShieldCheck size={20} className={address ? "text-cyan-500" : "text-gray-800"} weight="fill" />
              </div>
            </div>
          </div>

          {/* OTP INTERFACE */}
          {otpSent && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 ml-1">
                <Info size={14} className="text-cyan-400" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Código de Confirmação</p>
              </div>
              
              <div className="flex justify-between gap-2">
                {otpArray.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputsRef.current[i] = el }}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    maxLength={1}
                    className="w-full h-14 text-center text-xl font-bold bg-[#161A1E] border border-white/10 rounded-xl focus:border-cyan-500 outline-none transition-all shadow-inner"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2
            ${otpSent 
              ? 'bg-cyan-500 text-white shadow-xl shadow-cyan-500/20 active:scale-95' 
              : 'bg-white text-black hover:bg-gray-100 active:scale-95'} 
            disabled:opacity-20`}
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            otpSent ? "CONFIRMAR ALTERAÇÃO" : "ENVIAR CÓDIGO OTP"
          )}
        </button>

      </div>
    </div>
  );
}