import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Wallet, Info, Receipt } from '@phosphor-icons/react'
import toast from 'react-hot-toast'
import { WithdrawalService } from '../services/withdrawal.service'
import { UserService } from '../services/user.service'

/* ================= COMPONENTES DE APOIO ================= */

function Skeleton({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse bg-cyan-500/10 rounded ${className}`}
    />
  )
}

/* ================= CONFIGURAÇÕES ================= */

const WITHDRAWAL_FEE_PERCENT = 0.03 // 3%

const MIN_WITHDRAWAL = 50
const MAX_WITHDRAWAL_TRANSACTION = 10_000_000
const MAX_WITHDRAWAL_DAILY = 25_000_000

export default function WithdrawAOA() {
  const navigate = useNavigate()

  const [amount, setAmount] = useState('')
  const [balance, setBalance] = useState<number | null>(null)
  const [email, setEmail] = useState('')

  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const [loading, setLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)

  /* ================= CARREGAR UTILIZADOR ================= */

  useEffect(() => {
    async function load() {
      try {
        const res = await UserService.me()

        setBalance(res.balance || 0)
        setEmail(res.email || '')
      } catch {
        toast.error('Erro ao carregar dados da conta')
      }
    }

    load()
  }, [])

  /* ================= CÁLCULOS ================= */

  const stats = useMemo(() => {
    const gross = Number(amount) || 0
    const fee = gross * WITHDRAWAL_FEE_PERCENT
    const net = gross - fee

    return {
      gross,
      fee,
      net
    }
  }, [amount])

  /* ================= SOLICITAR OTP ================= */

  async function handleRequestOtp() {
    if (!amount) {
      return toast.error('Insira o valor do levantamento')
    }

    if (stats.gross <= 0) {
      return toast.error('Valor inválido')
    }

    if (stats.gross < MIN_WITHDRAWAL) {
      return toast.error(
        'O valor mínimo para levantamento é de 50 Kz'
      )
    }

    if (stats.gross > MAX_WITHDRAWAL_TRANSACTION) {
      return toast.error(
        'O máximo por transação é de 10.000.000 Kz'
      )
    }

    if (balance !== null && stats.gross > balance) {
      return toast.error('Saldo insuficiente')
    }

    try {
      setOtpLoading(true)

      await WithdrawalService.requestOtp()

      setOtpSent(true)
      setOtp('')

      toast.success(
        'Código OTP enviado para o seu email'
      )
    } catch (err: any) {
      toast.error(
        err.message ||
        'Erro ao enviar código OTP'
      )
    } finally {
      setOtpLoading(false)
    }
  }

  /* ================= CONFIRMAR LEVANTAMENTO ================= */

  async function handleWithdraw() {
    if (!amount) {
      return toast.error('Insira o valor do levantamento')
    }

    if (stats.gross <= 0) {
      return toast.error('Valor inválido')
    }

    if (stats.gross < MIN_WITHDRAWAL) {
      return toast.error(
        'O valor mínimo para levantamento é de 50 Kz'
      )
    }

    if (stats.gross > MAX_WITHDRAWAL_TRANSACTION) {
      return toast.error(
        'O máximo por transação é de 10.000.000 Kz'
      )
    }

    if (balance !== null && stats.gross > balance) {
      return toast.error('Saldo insuficiente')
    }

    if (!otp) {
      return toast.error(
        'Informe o código OTP recebido por email'
      )
    }

    if (otp.length !== 6) {
      return toast.error(
        'O código OTP deve conter 6 dígitos'
      )
    }

    if (!email) {
      return toast.error(
        'Email da conta não localizado'
      )
    }

    try {
      setLoading(true)

      await WithdrawalService.create(
        stats.gross,
        otp,
        email
      )

      toast.success(
        'Levantamento solicitado com sucesso!'
      )

      setAmount('')
      setOtp('')
      setOtpSent(false)

      const me = await UserService.me()

      setBalance(me.balance || 0)

      navigate('/profile')
    } catch (err: any) {
      toast.error(
        err.message ||
        'Erro ao solicitar levantamento'
      )
    } finally {
      setLoading(false)
    }
  }

  /* ================= FORMATADOR ================= */

  const format = (value: number) =>
    value.toLocaleString('pt-AO', {
      minimumFractionDigits: 2
    })

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe] font-sans selection:bg-cyan-500/30">

      {/* BACKGROUND GLOW */}

      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/[0.06] rounded-full filter blur-[120px] pointer-events-none" />

      {/* HEADER */}

      <div className="flex items-center gap-4 px-6 py-5 border-b border-cyan-500/10 bg-[#0a2533]/90 backdrop-blur-xl sticky top-0 z-10">

        <button
          onClick={() => navigate(-1)}
          className="p-2.5 bg-[#0e364a] border border-cyan-500/25 rounded-full text-cyan-300 hover:bg-[#124158] hover:text-white transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft
            size={20}
            weight="bold"
          />
        </button>

        <h1 className="text-xl font-black tracking-tighter uppercase font-mono text-white">
          Levantamento AOA
        </h1>

      </div>

      <div className="px-6 py-8 max-w-md mx-auto relative z-10">

        {/* CARD DE SALDO */}

        <div className="bg-[#0e364a] border border-cyan-500/20 rounded-[2rem] p-6 mb-8 flex items-center justify-between relative overflow-hidden shadow-xl shadow-cyan-950/20">

          <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-400" />

          <div className="flex items-center gap-4">

            <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-2xl shadow-inner">
              <Wallet
                size={24}
                weight="duotone"
              />
            </div>

            <div>

              <p className="text-[10px] text-cyan-200/70 uppercase font-black font-mono tracking-[0.2em]">
                Saldo Disponível
              </p>

              <div className="text-xl font-mono font-black text-white tracking-tight mt-0.5">

                {balance !== null ? (
                  `${balance.toLocaleString('pt-AO')} Kz`
                ) : (
                  <Skeleton className="w-28 h-6 mt-1" />
                )}

              </div>

            </div>

          </div>

        </div>

        <div className="space-y-6">

          {/* INPUT */}

          <div>

            <label className="block text-[10px] text-cyan-200/70 uppercase font-black font-mono tracking-[0.2em] mb-3 ml-1">
              Quanto deseja levantar?
            </label>

            <div className="relative">

              <input
                type="number"
                min={MIN_WITHDRAWAL}
                max={MAX_WITHDRAWAL_TRANSACTION}
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                placeholder="0.00"
                className="w-full h-16 bg-[#0e364a] border border-cyan-500/20 focus:border-cyan-400 rounded-[2rem] px-6 text-2xl font-mono font-bold outline-none transition-all text-white placeholder:text-cyan-200/20 shadow-inner"
              />

              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-cyan-300 font-bold font-mono text-xs uppercase">
                Kz
              </div>

            </div>

            <div className="flex justify-between px-2 mt-2 text-[9px] text-cyan-200/40 font-mono uppercase">
              <span>
                Mín. 50 Kz
              </span>

              <span>
                Máx. 10.000.000 Kz/transação
              </span>
            </div>

          </div>

          {/* DETALHAMENTO DE TAXAS */}

          {stats.gross > 0 && (

            <div className="bg-[#0e364a]/70 border border-cyan-500/20 rounded-[2rem] p-6 space-y-4 shadow-xl shadow-cyan-950/20">

              <div className="flex items-center gap-2 mb-1">

                <Receipt
                  size={18}
                  weight="duotone"
                  className="text-cyan-400"
                />

                <span className="text-[10px] font-black uppercase text-cyan-200/70 tracking-[0.2em] font-mono">
                  Resumo do Levantamento
                </span>

              </div>

              <div className="flex justify-between text-xs font-mono">

                <span className="text-cyan-200/70">
                  Valor Solicitado
                </span>

                <span className="font-bold text-white">
                  {format(stats.gross)} Kz
                </span>

              </div>

              <div className="flex justify-between text-xs font-mono">

                <span className="text-cyan-200/70">
                  Taxa Administrativa (3%)
                </span>

                <span className="font-bold text-orange-400">
                  -{format(stats.fee)} Kz
                </span>

              </div>

              <div className="pt-3 border-t border-cyan-500/10 flex justify-between items-center">

                <span className="text-[10px] font-black uppercase text-cyan-400 font-mono tracking-widest">
                  Valor Líquido
                </span>

                <span className="text-lg font-mono font-black text-white">
                  {format(stats.net)} Kz
                </span>

              </div>

            </div>

          )}

          {/* INFORMAÇÕES */}

          <div className="bg-[#0e364a]/50 border border-cyan-500/10 rounded-[1.5rem] p-5 flex gap-4 items-center shadow-inner">

            <Info
              size={22}
              weight="duotone"
              className="text-cyan-400 shrink-0"
            />

            <div className="text-xs text-cyan-200/80 font-mono leading-relaxed">

              O valor líquido será o montante depositado na sua conta bancária após a dedução da taxa de 3%.

              <br />
              <br />

              Limite diário de levantamentos:
             <strong className="text-white ml-1">
              {MAX_WITHDRAWAL_DAILY.toLocaleString('pt-AO')} Kz
              </strong>

            </div>

          </div>

          {/* OTP / BOTÕES */}

          <div className="pt-2 space-y-4">

            {!otpSent ? (

              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={
                  otpLoading ||
                  loading ||
                  !amount ||
                  stats.gross <= 0
                }
                className="w-full h-14 bg-cyan-600 hover:bg-cyan-500 text-white font-black font-mono text-xs uppercase tracking-widest rounded-2xl transition-all active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-xl shadow-cyan-950/30 hover:shadow-cyan-950/50 cursor-pointer"
              >

                {otpLoading ? (

                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />

                ) : (

                  'ENVIAR CÓDIGO OTP'

                )}

              </button>

            ) : (

              <>

                {/* OTP */}

                <div>

                  <label className="block text-[10px] text-cyan-200/70 uppercase font-black font-mono tracking-[0.2em] mb-3 ml-1">
                    Código de verificação
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value
                          .replace(/\D/g, '')
                          .slice(0, 6)
                      )
                    }
                    placeholder="000000"
                    className="w-full h-16 bg-[#0e364a] border border-cyan-500/20 focus:border-cyan-400 rounded-[2rem] px-6 text-2xl text-center tracking-[0.5em] font-mono font-bold outline-none transition-all text-white placeholder:text-cyan-200/20"
                  />

                  <p className="text-[10px] text-cyan-200/50 font-mono text-center mt-3">
                    Código enviado para {email}
                  </p>

                </div>

                {/* CONFIRMAR */}

                <button
                  type="button"
                  onClick={handleWithdraw}
                  disabled={
                    loading ||
                    otp.length !== 6
                  }
                  className="w-full h-14 bg-cyan-600 hover:bg-cyan-500 text-white font-black font-mono text-xs uppercase tracking-widest rounded-2xl transition-all active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-xl shadow-cyan-950/30 hover:shadow-cyan-950/50 cursor-pointer"
                >

                  {loading ? (

                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />

                  ) : (

                    'CONFIRMAR LEVANTAMENTO'

                  )}

                </button>

                {/* REENVIAR OTP */}

                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={otpLoading || loading}
                  className="w-full text-[10px] text-cyan-300 hover:text-white font-mono uppercase tracking-widest transition-colors disabled:opacity-30"
                >
                  {otpLoading
                    ? 'A ENVIAR...'
                    : 'REENVIAR CÓDIGO OTP'}
                </button>

              </>

            )}

            <p className="text-[10px] text-cyan-200/50 font-mono text-center mt-6 uppercase tracking-[0.2em] font-medium">
              Pagamento via transferência bancária
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}