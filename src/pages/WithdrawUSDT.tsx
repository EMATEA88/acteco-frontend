import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Wallet, User, Users, Info, ShieldCheck } from '@phosphor-icons/react'
import toast, { Toaster } from 'react-hot-toast'
import { UserService } from '../services/user.service'
import { api } from '../services/api'
import { isAddress } from 'ethers'

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

  // ================= TAXA & CÁLCULOS =================
  const FEE = 0
  const amountNumber = Number(amount || 0)
  const fee = amountNumber > 0 ? FEE : 0
  const total = amountNumber + fee
  const receiveAmount = amountNumber - fee

  const finalAddress = targetType === 'ME' ? savedAddress : manualAddress

  useEffect(() => {
    async function load() {
      try {
        const user = await UserService.me()
        setSavedAddress(user.withdrawWalletAddress || '')
        setEmail(user.email || '')
        setBalance(Number(user.balanceUSDT ?? user.cryptoBalance ?? 0))
      } catch {
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
    if (otpArray[index] === '' && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
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

  // ================= VALIDAÇÃO =================
  function validate() {
    const address = finalAddress?.trim()

    if (!address) {
      toast.error('Informe um endereço de destino')
      return false
    }

    if (!isAddress(address)) {
      toast.error('Endereço BEP20 inválido')
      return false
    }

    if (targetType === 'OTHERS' && address === savedAddress) {
      toast.error('Use a opção "Meu endereço" para este destino')
      return false
    }

    if (!amount || amountNumber <= 0) {
      toast.error('Valor inválido')
      return false
    }

    if (amountNumber <= fee) {
      toast.error(`O valor deve ser maior que ${fee} USDT`)
      return false
    }

    if (balance !== null && total > balance) {
      toast.error(`Saldo insuficiente (necessário ${total.toFixed(2)} USDT)`)
      return false
    }

    return true
  }

  // ================= SAQUE =================
  async function handleWithdraw() {
    if (loading) return 

    if (targetType === 'ME' && !savedAddress) {
      return toast.error('Configure sua carteira antes')
    }

    if (!validate()) return

    if (!otpSent) {
      await sendOtpAuto()
      return
    }

    if (otp.length !== 6) {
      return toast.error("Insira o código de 6 dígitos")
    }

    try {
      setLoading(true)

      // Mantive a chave 'address' conforme seu backend exige
      await api.post('/withdrawals/usdt', {
        amount: amountNumber,
        address: finalAddress.trim(),
        otp,
        email
      })

      setBalance(prev => prev !== null ? prev - total : prev)
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
    <div className="min-h-screen bg-[#0B0E11] text-white font-sans">
      <Toaster position="top-center" />

      {/* HEADER */}
      <div className="flex items-center gap-4 px-5 py-6 border-b border-white/5">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={18} weight="bold" />
        </button>
        <h1 className="text-lg font-bold">Saque USDT</h1>
        <span className="ml-auto text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-md font-bold border border-cyan-500/20">BEP20</span>
      </div>

      <div className="px-5 py-8 max-w-md mx-auto space-y-6">
        
        {/* CARD DE SALDO */}
        <div className="bg-[#161A1E] border border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
              <Wallet size={24} weight="duotone" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Saldo Disponível</p>
              <div className="text-xl font-mono font-bold text-cyan-400">
                {balance !== null ? `${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT` : '---'}
              </div>
            </div>
          </div>
        </div>

        {/* SELETOR DE DESTINO */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setTargetType('ME')} 
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold transition-all ${targetType === 'ME' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <User size={16} weight={targetType === 'ME' ? "bold" : "regular"} /> MEU ENDEREÇO
          </button>
          <button 
            onClick={() => setTargetType('OTHERS')} 
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold transition-all ${targetType === 'OTHERS' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Users size={16} weight={targetType === 'OTHERS' ? "bold" : "regular"} /> OUTRA PESSOA
          </button>
        </div>

        {/* INPUT DE ENDEREÇO */}
        <div className="space-y-2">
          {targetType === 'ME' ? (
            <div className="bg-black/20 border border-white/5 rounded-2xl p-4">
              <p className="text-[10px] text-gray-600 uppercase font-bold mb-1 tracking-widest">Destino Vinculado</p>
              <p className="text-xs font-mono break-all text-cyan-400/80 italic">
                {savedAddress || "Configure sua carteira no perfil"}
              </p>
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value.trim())}
                placeholder="0x..."
                className="w-full bg-[#161A1E] border border-white/5 rounded-2xl p-4 text-xs font-mono outline-none focus:border-cyan-500/50 transition-all placeholder:text-gray-700"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold text-yellow-500/40 uppercase tracking-tighter">BNB Smart Chain</div>
            </div>
          )}
          
          <div className="flex gap-2 p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
            <Info size={16} className="text-yellow-500 shrink-0" />
            <p className="text-[10px] text-yellow-500/70 leading-tight uppercase font-bold">
              Verifique se o endereço é compatível com a rede BEP20 para evitar perda de fundos.
            </p>
          </div>
        </div>

        {/* VALOR DO SAQUE */}
        <div className="relative group">
          <label className="block text-[10px] text-gray-500 uppercase font-black mb-2 ml-1 tracking-widest">Quanto deseja sacar?</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full h-16 bg-[#161A1E] border border-white/5 rounded-2xl px-5 text-2xl font-mono font-bold outline-none group-focus-within:border-cyan-500/50 transition-all"
          />
          <div className="absolute right-5 top-[46px] text-gray-600 font-bold text-xs">USDT</div>
        </div>

        {/* RESUMO FINANCEIRO */}
        <div className="bg-white/5 rounded-2xl p-4 space-y-3 border border-white/5">
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
            <span className="text-gray-500">Taxa Administrativa</span>
            <span className="text-red-400">-{fee.toFixed(2)} USDT</span>
          </div>
          <div className="h-px bg-white/5 w-full" />
          <div className="flex justify-between items-center font-black uppercase tracking-widest">
            <span className="text-[11px] text-gray-400">Total a receber</span>
            <span className="text-lg text-cyan-400 font-mono">
              {receiveAmount > 0 ? receiveAmount.toFixed(2) : '0.00'} <span className="text-[10px]">USDT</span>
            </span>
          </div>
        </div>

        {/* INTERFACE OTP */}
        {otpSent && (
          <div className="pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={18} className="text-cyan-400" weight="duotone" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verificação de Segurança</p>
             </div>
            <div className="flex justify-between gap-2">
              {otpArray.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputsRef.current[i] = el }}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => e.key === 'Backspace' && handleBackspace(i)}
                  maxLength={1}
                  className="w-full h-14 text-center text-xl font-bold bg-[#161A1E] border border-white/10 rounded-xl focus:border-cyan-500 outline-none transition-all shadow-inner"
                />
              ))}
            </div>
            <div className="text-center mt-4">
               {timer > 0 ? (
                 <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Novo código em {timer}s</span>
               ) : (
                 <button onClick={sendOtpAuto} className="text-[10px] text-cyan-400 font-bold uppercase underline tracking-widest">Reenviar E-mail</button>
               )}
            </div>
          </div>
        )}

        {/* BOTÃO DE AÇÃO */}
        <button
          onClick={handleWithdraw}
          disabled={loading || sendingOtp}
          className={`w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2
            ${otpSent 
              ? 'bg-cyan-500 text-white shadow-xl shadow-cyan-500/20 active:scale-95' 
              : 'bg-white text-black hover:bg-gray-100 active:scale-95'} 
            disabled:opacity-20`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            otpSent ? "CONFIRMAR TRANSAÇÃO" : "SOLICITAR CÓDIGO"
          )}
        </button>

      </div>
    </div>
  )
}