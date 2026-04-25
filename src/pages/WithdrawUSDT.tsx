import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Wallet, User, Users, Info } from '@phosphor-icons/react'
import toast, { Toaster } from 'react-hot-toast'
import { UserService } from '../services/user.service'
import { api } from '../services/api'

export default function WithdrawUSDT() {
  const navigate = useNavigate()
  
  const [savedAddress, setSavedAddress] = useState('')
  const [manualAddress, setManualAddress] = useState('')
  const [targetType, setTargetType] = useState<'ME' | 'OTHERS'>('ME')
  
  const [amount, setAmount] = useState('')
  const [email, setEmail] = useState('')
  const [balance, setBalance] = useState<number | null>(null)

  const [loading, setLoading] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpArray, setOtpArray] = useState(['', '', '', '', '', ''])
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])
  const [timer, setTimer] = useState(0)

  const FEE = 1 
  const amountNumber = Number(amount || 0)
  const fee = amountNumber > 0 ? FEE : 0
  const receiveAmount = amountNumber - fee

  const finalAddress = targetType === 'ME' ? savedAddress : manualAddress

  useEffect(() => {
    async function load() {
      try {
        const res = await UserService.me()
        const user = res
        setSavedAddress(user.withdrawWalletAddress || '')
        setEmail(user.email || '')
        setBalance(Number(user.balanceUSDT ?? user.cryptoBalance ?? 0))
      } catch (err: any) {
        toast.error("Erro ao carregar dados")
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => setTimer((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timer])

  const otp = otpArray.join('')

  function handleOtpChange(value: string, index: number) {
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otpArray]
    newOtp[index] = value
    setOtpArray(newOtp)
    if (value && index < 5) inputsRef.current[index + 1]?.focus()
  }

  function handleBackspace(index: number) {
    if (otpArray[index] === '' && index > 0) inputsRef.current[index - 1]?.focus()
  }

  async function sendOtpAuto() {
    try {
      setSendingOtp(true)
      await api.post('/otp/send', { type: 'WITHDRAW', target: email })
      setOtpSent(true)
      setTimer(60)
      toast.success('Código de segurança enviado')
    } catch {
      toast.error('Erro ao enviar código')
    } finally {
      setSendingOtp(false)
    }
  }

  // 🔥 VALIDAÇÃO ATUALIZADA (CONFORME SOLICITADO)
  function validate() {
    const address = finalAddress?.trim()

    if (!address) {
      toast.error('Informe um endereço de destino')
      return false
    }

    if (address.length < 34 || !address.startsWith('T')) {
      toast.error('Endereço TRC20 inválido')
      return false
    }

    if (targetType === 'OTHERS' && address === savedAddress) {
      toast.error('Use a opção "Meu endereço" para este destino')
      return false
    }

    if (!amount || Number(amount) <= 0) {
      toast.error('Valor inválido')
      return false
    }

    if (balance !== null && Number(amount) > balance) {
      toast.error('Saldo insuficiente')
      return false
    }

    return true
  }

  async function handleWithdraw() {
    if (!validate()) return

    if (!otpSent) {
      await sendOtpAuto()
      return
    }

    if (otp.length !== 6) return toast.error("Insira o código de 6 dígitos")

    try {
      setLoading(true)
      await api.post('/withdrawals/usdt', {
        amount: Number(amount),
        address: finalAddress.trim(),
        otp,
        email 
      })
      
      toast.success("Levantamento solicitado!")
      navigate('/profile')
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Erro no processamento"
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      <Toaster position="top-center" />
      <div className="flex items-center gap-4 px-5 py-6 border-b border-white/5">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full text-gray-400">
          <ArrowLeft size={18} weight="bold" />
        </button>
        <h1 className="text-lg font-bold">Saque USDT (TRC20)</h1>
      </div>

      <div className="px-5 py-8 max-w-md mx-auto space-y-6">
        
        {/* SALDO */}
        <div className="bg-[#161A1E] border border-white/5 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
              <Wallet size={24} weight="duotone" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Saldo Disponível</p>
              <div className="text-xl font-mono font-bold text-cyan-400">
                {balance !== null ? `${balance.toFixed(2)} USDT` : '...'}
              </div>
            </div>
          </div>
        </div>

        {/* SELETOR */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-2xl">
          <button onClick={() => setTargetType('ME')} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold transition-all ${targetType === 'ME' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-gray-500'}`}>
            <User size={16} /> MEU ENDEREÇO
          </button>
          <button onClick={() => setTargetType('OTHERS')} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold transition-all ${targetType === 'OTHERS' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-gray-500'}`}>
            <Users size={16} /> OUTRA PESSOA
          </button>
        </div>

        {/* ENDEREÇO */}
        <div className="space-y-3">
          {targetType === 'ME' ? (
            <div className="bg-black/20 border border-white/5 rounded-2xl p-4">
              <p className="text-[10px] text-gray-600 uppercase font-bold mb-1 tracking-widest">Carteira Vinculada</p>
              <p className={`text-xs font-mono break-all ${savedAddress ? 'text-cyan-400' : 'text-red-400 italic'}`}>
                {savedAddress || "Nenhuma carteira configurada"}
              </p>
            </div>
          ) : (
            <input
              type="text"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value.trim())}
              placeholder="Endereço TRC20 (Binance, Trust Wallet...)"
              className="w-full bg-[#161A1E] border border-white/5 rounded-2xl p-4 text-xs font-mono outline-none focus:border-cyan-500/50"
            />
          )}

          {/* 🔥 MELHORIA VISUAL (OPCIONAL MAS PROFISSIONAL) */}
          {targetType === 'ME' && !savedAddress && (
            <p className="text-[10px] text-red-400 mt-2 font-bold uppercase tracking-tighter">
              ⚠️ Nenhuma carteira vinculada. Configure no perfil antes de sacar.
            </p>
          )}

          <div className="flex gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <Info size={20} className="text-yellow-500 shrink-0" />
            <p className="text-[10px] text-yellow-500/80 leading-relaxed font-bold uppercase">
              Aviso: Envie apenas para redes TRC20. O uso de outras redes resultará em perda permanente.
            </p>
          </div>
        </div>

        {/* VALOR */}
        <div className="relative">
          <label className="block text-[10px] text-gray-500 uppercase font-black mb-3 ml-1">Valor do Saque</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full h-16 bg-[#161A1E] border border-white/5 rounded-2xl px-5 text-2xl font-mono font-bold outline-none focus:border-cyan-500/50"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 font-bold text-xs mt-4">USDT</div>
        </div>

        {/* TAXA */}
        <div className="px-1 space-y-1.5">
          <div className="text-[11px] text-gray-500 flex justify-between">
            <span>Taxa de Rede:</span>
            <span className="font-bold text-red-400">-{fee.toFixed(2)} USDT</span>
          </div>
          <div className="text-[11px] text-cyan-400 flex justify-between border-t border-white/5 pt-2 font-bold tracking-widest">
            <span>LÍQUIDO A RECEBER:</span>
            <span>{receiveAmount > 0 ? receiveAmount.toFixed(2) : '0.00'} USDT</span>
          </div>
        </div>

        {/* OTP */}
        {otpSent && (
          <div className="pt-4 space-y-4 animate-in fade-in duration-300">
            <div className="flex justify-between gap-2">
              {otpArray.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputsRef.current[i] = el }}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => e.key === 'Backspace' && handleBackspace(i)}
                  maxLength={1}
                  className="w-full h-14 text-center text-xl font-bold bg-[#161A1E] border border-white/10 rounded-xl focus:border-cyan-500 outline-none"
                />
              ))}
            </div>
            <div className="text-center">
               {timer > 0 ? (
                <span className="text-[10px] text-gray-500 uppercase font-bold">Reenviar em {timer}s</span>
              ) : (
                <button onClick={sendOtpAuto} className="text-[10px] text-cyan-400 font-bold uppercase underline">Reenviar Código</button>
              )}
            </div>
          </div>
        )}

        {/* 🔥 BOTÃO COM TRAVA DE SEGURANÇA UX */}
        <div className="pt-4">
          <button
            onClick={handleWithdraw}
            disabled={
              loading || 
              sendingOtp || 
              !finalAddress ||
              (targetType === 'ME' && !savedAddress)
            }
            className={`w-full h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${otpSent ? 'bg-cyan-500 text-white shadow-xl shadow-cyan-500/20' : 'bg-white text-black'} disabled:opacity-20`}
          >
            {loading ? "Processando..." : (otpSent ? "FINALIZAR TRANSAÇÃO" : "SOLICITAR CÓDIGO OTP")}
          </button>
        </div>
      </div>
    </div>
  )
}