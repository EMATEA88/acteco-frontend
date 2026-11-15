
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ClockCounterClockwise,
  CheckCircle,
  HourglassMedium,
  XCircle,
  Bank,
  CurrencyCircleDollar,
} from '@phosphor-icons/react'

import { RechargeService } from '../services/recharge.service'
import type { RechargeHistory } from '../services/recharge.service'

export default function RechargeHistory() {
  const navigate = useNavigate()

  const [items, setItems] = useState<RechargeHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const res = await RechargeService.myHistory()

        if (mounted) {
          setItems(res as RechargeHistory[])
        }
      } catch (error) {
        console.error('Erro ao carregar histórico:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  function getStatusMeta(status: string) {
    switch (status) {
      case 'APPROVED':
        return {
          label: 'Concluído',
          color: 'text-emerald-400',
          background: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          icon: <CheckCircle size={15} weight="fill" />,
        }

      case 'PENDING':
        return {
          label: 'Pendente',
          color: 'text-amber-400',
          background: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          icon: <HourglassMedium size={15} weight="fill" />,
        }

      case 'REJECTED':
        return {
          label: 'Rejeitado',
          color: 'text-red-400',
          background: 'bg-red-500/10',
          border: 'border-red-500/20',
          icon: <XCircle size={15} weight="fill" />,
        }

      default:
        return {
          label: status,
          color: 'text-[#A9C4CF]',
          background: 'bg-white/5',
          border: 'border-white/10',
          icon: <ClockCounterClockwise size={15} />,
        }
    }
  }

  function formatAmount(amount: number | string) {
    return Number(amount).toLocaleString('pt-AO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-[#0a2533] px-4 py-6 pb-10 text-[#e0f2fe] font-sans sm:px-6">

      <main className="mx-auto w-full max-w-xl">

        {/* LOADING */}
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="h-24 rounded-xl border border-[#24566A] bg-[#103647]"
              />
            ))}
          </div>
        ) : items.length === 0 ? (

          /* EMPTY STATE */
          <div className="rounded-2xl border border-[#24566A] bg-[#103647] px-6 py-12 text-center">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0A2533] text-[#19C5CE]">
              <ClockCounterClockwise size={25} weight="regular" />
            </div>

            <h2 className="text-sm font-semibold text-white">
              Sem movimentos
            </h2>

            <p className="mt-1 text-xs text-[#A9C4CF]">
              O seu histórico de depósitos aparecerá aqui.
            </p>

          </div>

        ) : (

          /* HISTORY */
          <div className="space-y-3">

            {items.map(item => {
              const meta = getStatusMeta(item.status)
              const isCrypto = item.currency === 'USDT'

              return (
                <article
                  key={item.id}
                  className="rounded-xl border border-[#24566A] bg-[#103647] p-4 transition-colors hover:border-[#32758A]"
                >

                  <div className="flex items-center gap-3">

                    {/* ICON */}
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      isCrypto
                        ? 'bg-cyan-500/10 text-cyan-400'
                        : 'bg-[#0A2533] text-[#19C5CE]'
                    }`}>
                      {isCrypto ? (
                        <CurrencyCircleDollar size={22} weight="regular" />
                      ) : (
                        <Bank size={22} weight="regular" />
                      )}
                    </div>

                    {/* DETAILS */}
                    <div className="min-w-0 flex-1">

                      <p className="text-base font-semibold tracking-tight text-white">
                        {formatAmount(item.amount)}{' '}
                        <span className="text-xs font-medium text-[#19C5CE]">
                          {item.currency || 'AOA'}
                        </span>
                      </p>

                      <p className="mt-1 text-xs text-[#A9C4CF]">
                        {formatDate(item.createdAt)}
                      </p>

                    </div>

                    {/* STATUS */}
                    <div className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[10px] font-medium ${meta.color} ${meta.background} ${meta.border}`}>
                      {meta.icon}
                      <span>{meta.label}</span>
                    </div>

                  </div>

                </article>
              )
            })}

          </div>
        )}

        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-5 h-12 w-full rounded-xl border border-[#2A6073] bg-[#103647] px-6 text-sm font-semibold text-[#D8EAF0] transition-colors hover:bg-[#16465A] focus:outline-none focus:ring-2 focus:ring-[#19C5CE]/50"
        >
          Voltar
        </button>

      </main>
    </div>
  )
}
