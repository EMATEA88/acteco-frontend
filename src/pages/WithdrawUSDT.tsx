import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Wallet, ShieldCheck, Timer } from '@phosphor-icons/react'
import toast from 'react-hot-toast'
import { UserService } from '../services/user.service'
import { api } from '../services/api'

/* Componente Interno para Skeleton */
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-white/5 rounded-lg ${className}`} />
)

export default function WithdrawUSDT() {
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [email, setEmail] = useState('')
  const [balance, setBalance] = useState<number | null>(null)

  const [loading, setLoading] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  const [otpArray, setOtpArray] = useState(['', '', '', '', '', ''])
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])
  const [timer, setTimer] = useState(0)

  // --- LÓGICA DE TAXA ---
  const FEE = 1 
  const amountNumber = Number(amount || 0)
  const fee = amountNumber > 0 ? FEE : 0
  const receiveAmount = amountNumber - fee
  // ----------------------

  useEffect(() => {
    async function load() {
      try {
        const res = await UserService.me()
        setAddress(res.data.walletAddress || '')
        setEmail(res.data.email || '')
        setBalance(Number(res.data.balanceUSDT ?? res.data.cryptoBalance ?? 0))
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
    if (otpArray[index] === '' && index > 0) inputsRef.current[index - 1]?.focus()
  }

  async function sendOtpAuto() {
    try {
      setSendingOtp(true)
      await api.post('/otp/send', { type: 'WITHDRAW', target: email })
      setOtpSent(true)
      setTimer(60)
      toast.success('Código de segurança enviado ao email')
    } catch {
      toast.error('Erro ao enviar código')
    } finally {
      setSendingOtp(false)
    }
  }

  async function handleWithdraw() {
    if (!address) return toast.error("Endereço TRC20 não configurado")
    if (!amount) return toast.error("Insira o valor")
    
    const value = Number(amount)
    if (value <= 0) return toast.error("Valor inválido")
    if (balance !== null && value > balance) return toast.error("Saldo insuficiente")

    // --- VALIDAÇÃO DE TAXA CRÍTICA ---
    if (receiveAmount <= 0) {
      toast.error('Valor muito baixo para saque (deve ser maior que a taxa)')
      return
    }

    if (!otpSent) {
      await sendOtpAuto()
      return
    }

    if (otp.length !== 6) return toast.error("Insira o código de 6 dígitos")

    try {
      setLoading(true)
      // Mantendo o request original conforme solicitado
      await api.post('/withdraw/usdt', {
        amount,
        toAddress: address,
        otp
      })
      
      toast.success("Levantamento solicitado com sucesso!")
      navigate('/profile')
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro no processamento")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      <div className="flex items-center gap-4 px-5 py-6 border-b border-white/5">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full">
          <ArrowLeft size={18} weight="bold" />
        </button>
        <h1 className="text-lg font-bold">Saque USDT (TRC20)</h1>
      </div>

      <div className="px-5 py-8 max-w-md mx-auto space-y-6">
        
        <div className="bg-[#161A1E] border border-white/5 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
              <Wallet size={24} weight="duotone" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Saldo USDT</p>
              <div className="text-xl font-mono font-bold text-cyan-400">
                {balance !== null ? `${balance.toFixed(2)} USDT` : <Skeleton className="w-24 h-6 mt-1" />}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-2 ml-1">Carteira de Destino</p>
          <div className="bg-black/20 p-3 rounded-xl border border-white/5 text-[11px] font-mono text-gray-300 break-all">
            {address || "Nenhum endereço vinculado"}
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-black mb-3 ml-1">Valor do Saque</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full h-16 bg-[#161A1E] border border-white/5 rounded-2xl px-5 text-2xl font-mono font-bold outline-none focus:border-cyan-500/50 transition-all"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 font-bold text-xs">USDT</div>
          </div>

          {/* EXIBIÇÃO DA TAXA E VALOR LÍQUIDO */}
          <div className="mt-3 px-1 space-y-1">
            <div className="text-[11px] text-gray-400 flex justify-between">
              <span>Taxa de processamento:</span>
              <span className="font-bold text-red-400">-{fee} USDT</span>
            </div>
            <div className="text-[11px] text-cyan-400 flex justify-between border-t border-white/5 pt-1">
              <span className="font-medium uppercase tracking-wider">Você receberá:</span>
              <span className="font-bold">{receiveAmount > 0 ? receiveAmount.toFixed(2) : '0.00'} USDT</span>
            </div>
          </div>
        </div>

        {otpSent && (
          <div className="pt-4 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <ShieldCheck size={20} weight="fill" />
              <span className="text-xs font-bold uppercase tracking-wider">Verificação de Segurança</span>
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
                  inputMode="numeric"
                  className="w-full h-14 text-center text-xl font-bold bg-[#161A1E] border border-white/10 rounded-xl focus:border-cyan-500 outline-none transition-all"
                />
              ))}
            </div>

            <div className="flex justify-center items-center gap-2 text-[11px] text-gray-500">
              <Timer size={14} />
              {timer > 0 ? (
                <span>Reenviar em <strong className="text-white">{timer}s</strong></span>
              ) : (
                <button onClick={sendOtpAuto} className="text-cyan-400 font-bold hover:underline">REENVIAR CÓDIGO</button>
              )}
            </div>
          </div>
        )}

        <div className="pt-6">
          <button
            onClick={handleWithdraw}
            disabled={loading || sendingOtp}
            className={`w-full h-14 rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center gap-3
              ${otpSent ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-white text-black'}
              disabled:opacity-20`}
          >
            {sendingOtp || loading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              otpSent ? "CONFIRMAR SAQUE AGORA" : "SOLICITAR CÓDIGO OTP"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}