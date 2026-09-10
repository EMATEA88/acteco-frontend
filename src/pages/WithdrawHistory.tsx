import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import {
  ArrowLeft,
  CheckCircle,
  HourglassMedium,
  XCircle,
  Receipt,
  CalendarBlank,
  DownloadSimple,
  Copy,
  Bank,
  User,
  IdentificationCard,
  X,
  CaretRight
} from '@phosphor-icons/react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

interface Withdrawal {
  id: number
  type: 'AOA'
  operationType: 'LEVANTAMENTO'
  currency: 'AOA'

  amount: number
  fee: number
  netAmount: number

  status: string

  createdAt: string
  approvedAt?: string | null
  rejectedAt?: string | null
  processedAt?: string | null

  fullName?: string | null
  bankName?: string | null
  iban?: string | null

  externalTransferId?: string | null
  failureReason?: string | null
}

export default function WithdrawHistory() {
  const navigate = useNavigate()

  const [items, setItems] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)

  const [filter, setFilter] =
    useState<'ALL' | 'PENDING' | 'SUCCESS' | 'REJECTED'>('ALL')

  const [selected, setSelected] =
    useState<Withdrawal | null>(null)

  useEffect(() => {
    loadHistory()
  }, [])

  async function loadHistory() {
    try {
      setLoading(true)

      const res = await api.get('/withdrawals')

      setItems(
        Array.isArray(res.data)
          ? res.data
          : []
      )

    } catch (error) {

      console.error(
        'WITHDRAW_HISTORY_LOAD_ERROR:',
        error
      )

      toast.error(
        'Erro ao carregar histórico'
      )

    } finally {
      setLoading(false)
    }
  }

  /* =====================================================
     FILTRO
  ===================================================== */

  const filteredItems =
    items.filter(item => {

      if (filter === 'ALL') {
        return true
      }

      const status =
        item.status.toUpperCase()

      if (filter === 'SUCCESS') {
        return [
          'SUCCESS',
          'APPROVED',
          'CONCLUÍDO',
          'COMPLETED'
        ].includes(status)
      }

      if (filter === 'REJECTED') {
        return [
          'REJECTED',
          'FAILED'
        ].includes(status)
      }

      return status === filter
    })

  /* =====================================================
     FORMATAÇÃO
  ===================================================== */

  function formatMoney(
    value: number
  ) {
    return Number(value || 0)
      .toLocaleString('pt-AO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
  }

  function formatDate(
    value: string
  ) {
    return new Date(value)
      .toLocaleString('pt-AO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
  }

  function formatShortDate(
    value: string
  ) {
    return new Date(value)
      .toLocaleDateString('pt-AO', {
        day: '2-digit',
        month: 'short'
      })
  }

  /* =====================================================
     STATUS
  ===================================================== */

  function getStatusMeta(
    status: string
  ) {

    switch (
      status.toUpperCase()
    ) {

      case 'SUCCESS':
      case 'APPROVED':
      case 'COMPLETED':
      case 'CONCLUÍDO':

        return {
          label: 'Concluído',
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          icon: (
            <CheckCircle
              size={19}
              weight="duotone"
            />
          )
        }

      case 'PENDING':
      case 'PROCESSING':
      case 'IN_PROGRESS':

        return {
          label:
            status.toUpperCase() ===
            'PROCESSING'
              ? 'Processando'
              : 'Em análise',

          color: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',

          icon: (
            <HourglassMedium
              size={19}
              weight="duotone"
            />
          )
        }

      case 'REJECTED':
      case 'FAILED':

        return {
          label: 'Recusado',

          color: 'text-red-400',
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',

          icon: (
            <XCircle
              size={19}
              weight="duotone"
            />
          )
        }

      default:

        return {
          label: status,

          color:
            'text-cyan-200/70',

          bg:
            'bg-cyan-500/5',

          border:
            'border-cyan-500/10',

          icon: (
            <Receipt
              size={19}
              weight="duotone"
            />
          )
        }
    }
  }

  /* =====================================================
     COPIAR IBAN
  ===================================================== */

  async function copyIban(
    iban?: string | null
  ) {

    if (!iban) {
      return
    }

    try {

      await navigator.clipboard.writeText(
        iban
      )

      toast.success(
        'IBAN copiado',
        {
          style: {
            background: '#0e364a',
            color: '#fff',
            fontSize: '12px',
            border:
              '1px solid rgba(6, 182, 212, 0.2)'
          }
        }
      )

    } catch {

      toast.error(
        'Não foi possível copiar o IBAN'
      )
    }
  }

  /* =====================================================
     LOGOTIPO CIRCULAR
  ===================================================== */

  async function loadCircularLogo(): Promise<string | null> {
  try {
    const response = await fetch('/logo.png')

    if (!response.ok) {
      return null
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)

    const image = new Image()
    image.src = url

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error('LOGO_LOAD_ERROR'))
    })

    /*
     * =====================================================
     * AVATAR IGUAL AO PROFILE
     *
     * Profile:
     * w-14 h-14
     * rounded-full
     * border
     * overflow-hidden
     * bg-[#144863]
     * p-1
     * img rounded-full object-contain
     * =====================================================
     */

    const size = 600

    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size

    const ctx = canvas.getContext('2d')

    if (!ctx) {
      URL.revokeObjectURL(url)
      return null
    }

    const center = size / 2

    /*
     * Fundo do avatar
     * equivalente ao bg-[#144863] do Profile
     */
    ctx.beginPath()
    ctx.arc(
      center,
      center,
      290,
      0,
      Math.PI * 2
    )

    ctx.fillStyle = '#144863'
    ctx.fill()

    /*
     * Borda do avatar
     * equivalente ao border-cyan-500/30
     */
    ctx.beginPath()
    ctx.arc(
      center,
      center,
      290,
      0,
      Math.PI * 2
    )

    ctx.strokeStyle = 'rgba(6, 182, 212, 0.30)'
    ctx.lineWidth = 8
    ctx.stroke()

    /*
     * =====================================================
     * IMAGEM DO LOGO
     *
     * Aqui está a diferença importante:
     *
     * Não criamos outro círculo.
     * A própria imagem é recortada em círculo,
     * exatamente como:
     *
     * <img
     *   src="/logo.png"
     *   className="w-full h-full object-contain rounded-full"
     * />
     * =====================================================
     */

    ctx.save()

    ctx.beginPath()
    ctx.arc(
      center,
      center,
      270,
      0,
      Math.PI * 2
    )

    ctx.clip()

    const iw = image.naturalWidth || image.width
    const ih = image.naturalHeight || image.height

    /*
     * object-contain
     *
     * Mantém a proporção original do logo.
     */
    const scale = Math.min(
      540 / iw,
      540 / ih
    )

    const drawWidth = iw * scale
    const drawHeight = ih * scale

    const drawX = center - drawWidth / 2
    const drawY = center - drawHeight / 2

    ctx.drawImage(
      image,
      drawX,
      drawY,
      drawWidth,
      drawHeight
    )

    ctx.restore()

    URL.revokeObjectURL(url)

    return canvas.toDataURL('image/png')

  } catch (error) {

    console.error(
      'LOGO_PDF_ERROR:',
      error
    )

    return null
  }
}


  /* =====================================================
     PDF
  ===================================================== */

  async function exportPDF(withdrawal: Withdrawal) {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      // Paleta única azul-bebé / azul EMATEA.
      const BG = [225, 242, 252]
      const PANEL = [238, 248, 253]
      const BORDER = [145, 197, 222]
      const BLUE = [21, 88, 166]
      const DARK = [10, 37, 51]
      const MUTED = [82, 112, 131]
      const GREEN = [25, 135, 84]
      const AMBER = [184, 119, 0]
      const RED = [190, 50, 50]

      // Fundo integral azul-bebé — sem cartões brancos.
      pdf.setFillColor(BG[0], BG[1], BG[2])
      pdf.rect(0, 0, pageWidth, pageHeight, 'F')

      // Cabeçalho.
      pdf.setFillColor(PANEL[0], PANEL[1], PANEL[2])
      pdf.roundedRect(16, 14, pageWidth - 32, 43, 6, 6, 'F')

      pdf.setDrawColor(BORDER[0], BORDER[1], BORDER[2])
      pdf.setLineWidth(0.45)
      pdf.roundedRect(16, 14, pageWidth - 32, 43, 6, 6, 'S')

      const logo = await loadCircularLogo()

      if (logo) {
        pdf.addImage(logo, 'PNG', 23, 19, 32, 32, undefined, 'FAST')
      } else {
        pdf.setFillColor(143, 198, 227)
        pdf.circle(39, 35, 16, 'F')
        pdf.setTextColor(255, 255, 255)
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(7)
        pdf.text('EMATEA', 39, 37, { align: 'center' })
      }

      pdf.setTextColor(BLUE[0], BLUE[1], BLUE[2])
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(18)
      pdf.text('EMATEA', 64, 29)

      pdf.setTextColor(DARK[0], DARK[1], DARK[2])
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      pdf.text('Comprovativo de Levantamento', 64, 38)

      pdf.setTextColor(MUTED[0], MUTED[1], MUTED[2])
      pdf.setFontSize(8)
      pdf.text(`Operação #${withdrawal.id}`, 64, 46)

      // Estado.
      const meta = getStatusMeta(withdrawal.status)
      const normalizedStatus = withdrawal.status.toUpperCase()

      let statusRGB = AMBER
      if (['SUCCESS', 'APPROVED', 'COMPLETED', 'CONCLUÍDO'].includes(normalizedStatus)) {
        statusRGB = GREEN
      }
      if (['REJECTED', 'FAILED'].includes(normalizedStatus)) {
        statusRGB = RED
      }

      pdf.setFillColor(PANEL[0], PANEL[1], PANEL[2])
      pdf.roundedRect(16, 65, pageWidth - 32, 25, 5, 5, 'F')
      pdf.setDrawColor(BORDER[0], BORDER[1], BORDER[2])
      pdf.roundedRect(16, 65, pageWidth - 32, 25, 5, 5, 'S')

      pdf.setTextColor(MUTED[0], MUTED[1], MUTED[2])
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(7)
      pdf.text('ESTADO DA OPERAÇÃO', 24, 75)

      pdf.setTextColor(DARK[0], DARK[1], DARK[2])
      pdf.setFontSize(11)
      pdf.text(meta.label, 24, 83)

      pdf.setFillColor(statusRGB[0], statusRGB[1], statusRGB[2])
      pdf.circle(pageWidth - 28, 77.5, 3, 'F')

      let y = 101

      const section = (title: string) => {
        pdf.setTextColor(BLUE[0], BLUE[1], BLUE[2])
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(11)
        pdf.text(title, 20, y)
        pdf.setDrawColor(BORDER[0], BORDER[1], BORDER[2])
        pdf.line(20, y + 4, pageWidth - 20, y + 4)
        y += 14
      }

      const label = (text: string, x: number, yy: number) => {
        pdf.setTextColor(MUTED[0], MUTED[1], MUTED[2])
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(8)
        pdf.text(text, x, yy)
      }

      const value = (text: string, x: number, yy: number, size = 9) => {
        pdf.setTextColor(DARK[0], DARK[1], DARK[2])
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(size)
        pdf.text(text, x, yy)
      }

      section('DETALHES DA OPERAÇÃO')

      label('ID DA OPERAÇÃO', 20, y)
      label('TIPO', 85, y)
      label('MOEDA', 145, y)
      y += 6

      value(`#${withdrawal.id}`, 20, y)
      value('Levantamento', 85, y)
      value('AOA / Kz', 145, y)
      y += 8

      label('DATA E HORA', 20, y)
      y += 6
      value(formatDate(withdrawal.createdAt), 20, y)

      y += 17
      section('TITULAR DA CONTA')

      label('NOME COMPLETO', 20, y)
      y += 6
      value(withdrawal.fullName || 'Não informado', 20, y, 10)

      y += 17
      section('DADOS BANCÁRIOS')

      label('BANCO', 20, y)
      label('IBAN', 105, y)
      y += 6

      value(withdrawal.bankName || 'Não informado', 20, y)

      const ibanLines = pdf.splitTextToSize(withdrawal.iban || 'Não informado', 82)
      value(ibanLines.join('\n'), 105, y, 9)
      y += Math.max(8, ibanLines.length * 4.5)

      y += 8
      section('RESUMO FINANCEIRO')

      label('Valor solicitado', 20, y)
      value(`${formatMoney(withdrawal.amount)} Kz`, pageWidth - 20, y)
      pdf.setTextColor(DARK[0], DARK[1], DARK[2])
      pdf.text(`${formatMoney(withdrawal.amount)} Kz`, pageWidth - 20, y, { align: 'right' })

      y += 8
      label('Taxa de levantamento', 20, y)
      pdf.setTextColor(RED[0], RED[1], RED[2])
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(9)
      pdf.text(`- ${formatMoney(withdrawal.fee)} Kz`, pageWidth - 20, y, { align: 'right' })

      y += 10
      pdf.setDrawColor(BORDER[0], BORDER[1], BORDER[2])
      pdf.line(20, y, pageWidth - 20, y)
      y += 9

      pdf.setTextColor(BLUE[0], BLUE[1], BLUE[2])
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(10)
      pdf.text('VALOR LÍQUIDO', 20, y)

      pdf.setFontSize(14)
      pdf.text(`${formatMoney(Number(withdrawal.netAmount))} Kz`, pageWidth - 20, y, { align: 'right' })

      if (withdrawal.externalTransferId) {
        y += 17
        section('REFERÊNCIA DA OPERAÇÃO')

        const referenceLines = pdf.splitTextToSize(withdrawal.externalTransferId, pageWidth - 40)
        pdf.setTextColor(DARK[0], DARK[1], DARK[2])
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(8)
        pdf.text(referenceLines, 20, y)
      }

      if (withdrawal.failureReason) {
        y += 17
        section('OBSERVAÇÃO')

        const reasonLines = pdf.splitTextToSize(withdrawal.failureReason, pageWidth - 40)
        pdf.setTextColor(RED[0], RED[1], RED[2])
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(8)
        pdf.text(reasonLines, 20, y)
      }

      // Rodapé.
      pdf.setDrawColor(BORDER[0], BORDER[1], BORDER[2])
      pdf.line(20, pageHeight - 28, pageWidth - 20, pageHeight - 28)

      pdf.setTextColor(MUTED[0], MUTED[1], MUTED[2])
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(7.5)

      pdf.text(
        'Este documento é um comprovativo de levantamento emitido pela EMATEA.',
        20,
        pageHeight - 19
      )

      pdf.text(
        `Operação #${withdrawal.id}`,
        pageWidth - 20,
        pageHeight - 19,
        { align: 'right' }
      )

      pdf.save(`EMATEA-Levantamento-${withdrawal.id}.pdf`)

      toast.success('Comprovativo exportado em PDF')
    } catch (error) {
      console.error('WITHDRAWAL_PDF_ERROR:', error)
      toast.error('Erro ao gerar comprovativo PDF')
    }
  }

  /* =====================================================
     CARD
  ===================================================== */

  function WithdrawalCard({
    withdrawal
  }: {
    withdrawal: Withdrawal
  }) {

    const meta =
      getStatusMeta(
        withdrawal.status
      )

    return (
      <button
        type="button"
        onClick={() =>
          setSelected(withdrawal)
        }
        className="
          w-full text-left
          group
          bg-[#0e364a]
          hover:bg-[#124158]
          border border-cyan-500/20
          hover:border-cyan-400/50
          p-5
          rounded-[2rem]
          transition-all
          duration-300
          shadow-xl
          shadow-cyan-950/20
          cursor-pointer
        "
      >

        <div className="flex items-start gap-4">

          {/* ÍCONE */}

          <div
            className={`
              w-12 h-12
              rounded-2xl
              flex items-center
              justify-center
              shrink-0
              border
              ${meta.bg}
              ${meta.color}
              ${meta.border}
            `}
          >
            {meta.icon}
          </div>

          {/* CONTEÚDO */}

          <div className="flex-1 min-w-0">

            <div className="flex justify-between items-start gap-3">

              <div>

                <p className="
                  text-base
                  font-mono
                  font-black
                  text-white
                  tracking-tight
                ">
                  {formatMoney(
                    withdrawal.amount
                  )}{' '}
                  Kz
                </p>

                <div className="
                  flex
                  items-center
                  gap-1.5
                  mt-1
                ">

                  <CalendarBlank
                    size={13}
                    weight="duotone"
                    className="text-cyan-300/70"
                  />

                  <span className="
                    text-[11px]
                    text-cyan-200/70
                    font-mono
                  ">
                    {formatShortDate(
                      withdrawal.createdAt
                    )}
                  </span>

                </div>

              </div>

              <span
                className={`
                  text-[10px]
                  px-3 py-1
                  rounded-xl
                  font-black
                  font-mono
                  uppercase
                  tracking-wider
                  border
                  ${meta.bg}
                  ${meta.color}
                  ${meta.border}
                `}
              >
                {meta.label}
              </span>

            </div>

            {/* LINHA INFERIOR */}

            <div className="
              mt-4
              pt-3
              border-t
              border-cyan-500/10
              flex
              items-center
              justify-between
              gap-3
            ">

              <div className="
                flex
                items-center
                gap-2
                text-cyan-200/70
                font-mono
              ">

                <Receipt
                  size={14}
                  weight="duotone"
                  className="text-cyan-400"
                />

                <span className="text-xs">
                  Líquido:{' '}
                  <strong className="text-white">
                    {formatMoney(
                      withdrawal.netAmount
                    )}{' '}
                    Kz
                  </strong>
                </span>

              </div>

              <div className="
                flex
                items-center
                gap-1
                text-cyan-300/50
              ">

                <span className="
                  text-[10px]
                  font-mono
                  font-bold
                ">
                  #{withdrawal.id}
                </span>

                <CaretRight
                  size={14}
                  weight="bold"
                />

              </div>

            </div>

          </div>

        </div>

      </button>
    )
  }

  /* =====================================================
     MODAL / COMPROVATIVO
  ===================================================== */

  function DetailsModal() {

    if (!selected) {
      return null
    }

    const meta =
      getStatusMeta(
        selected.status
      )

    return (
      <div
        className="
          fixed
          inset-0
          z-50
          bg-black/70
          backdrop-blur-sm
          flex
          items-center
          justify-center
          p-4
        "
        onClick={() =>
          setSelected(null)
        }
      >

        <div
          className="
            w-full
            max-w-lg
            max-h-[90vh]
            overflow-y-auto
            bg-[#e1f2fc]
            text-[#0a2533]
            rounded-[2rem]
            shadow-2xl
          "
          onClick={e =>
            e.stopPropagation()
          }
        >

          {/* HEADER */}

          <div className="
            bg-[#dff1fb]
            rounded-t-[2rem]
            p-6
            border-b
            border-[#b9d9ea]
          ">

            <div className="
              flex
              items-start
              justify-between
            ">

              <div>

                <p className="
                  text-2xl
                  font-black
                  tracking-tight
                  text-[#1558a6]
                ">
                  EMATEA
                </p>

                <p className="
                  text-xs
                  uppercase
                  tracking-[0.18em]
                  font-mono
                  text-[#547083]
                  mt-1
                ">
                  Comprovativo de Levantamento
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelected(null)
                }
                className="
                  p-2
                  rounded-full
                  bg-[#e1f2fc]
                  text-[#1558a6]
                  hover:bg-[#cde8f5]
                  cursor-pointer
                "
              >
                <X
                  size={20}
                  weight="bold"
                />
              </button>

            </div>

          </div>

          <div className="p-6 space-y-6">

            {/* STATUS */}

            <div className="
              flex
              items-center
              justify-between
              gap-3
            ">

              <div>

                <p className="
                  text-[10px]
                  uppercase
                  tracking-widest
                  text-[#607887]
                  font-mono
                ">
                  Operação
                </p>

                <p className="
                  text-lg
                  font-black
                  font-mono
                ">
                  LEVANTAMENTO
                </p>

              </div>

              <span
                className={`
                  flex
                  items-center
                  gap-1.5
                  px-3
                  py-2
                  rounded-xl
                  text-xs
                  font-bold
                  border
                  ${meta.bg}
                  ${meta.color}
                  ${meta.border}
                `}
              >
                {meta.icon}
                {meta.label}
              </span>

            </div>

            {/* ID / DATA */}

            <div className="
              grid
              grid-cols-2
              gap-3
            ">

              <div className="
                bg-[#dff1fb]
                rounded-2xl
                p-4
              ">

                <p className="
                  text-[10px]
                  uppercase
                  text-[#718594]
                  font-mono
                ">
                  ID da operação
                </p>

                <p className="
                  mt-1
                  font-black
                  font-mono
                ">
                  #{selected.id}
                </p>

              </div>

              <div className="
                bg-[#dff1fb]
                rounded-2xl
                p-4
              ">

                <p className="
                  text-[10px]
                  uppercase
                  text-[#718594]
                  font-mono
                ">
                  Data
                </p>

                <p className="
                  mt-1
                  font-bold
                  text-sm
                ">
                  {new Date(
                    selected.createdAt
                  ).toLocaleDateString(
                    'pt-AO'
                  )}
                </p>

              </div>

            </div>

            {/* TITULAR */}

            <div>

              <div className="
                flex
                items-center
                gap-2
                mb-3
              ">

                <User
                  size={18}
                  weight="duotone"
                  className="text-[#1558a6]"
                />

                <h3 className="
                  font-black
                  uppercase
                  text-sm
                  tracking-wide
                ">
                  Titular da conta
                </h3>

              </div>

              <div className="
                bg-[#dff1fb]
                rounded-2xl
                p-4
              ">

                <p className="
                  text-[10px]
                  uppercase
                  text-[#718594]
                  font-mono
                ">
                  Nome cadastrado
                </p>

                <p className="
                  mt-1
                  font-bold
                ">
                  {selected.fullName ||
                    'Não informado'}
                </p>

              </div>

            </div>

            {/* BANCO */}

            <div>

              <div className="
                flex
                items-center
                gap-2
                mb-3
              ">

                <Bank
                  size={18}
                  weight="duotone"
                  className="text-[#1558a6]"
                />

                <h3 className="
                  font-black
                  uppercase
                  text-sm
                  tracking-wide
                ">
                  Dados bancários
                </h3>

              </div>

              <div className="space-y-3">

                <div className="
                  bg-[#dff1fb]
                  rounded-2xl
                  p-4
                ">

                  <p className="
                    text-[10px]
                    uppercase
                    text-[#718594]
                    font-mono
                  ">
                    Banco
                  </p>

                  <p className="
                    mt-1
                    font-bold
                  ">
                    {selected.bankName ||
                      'Não informado'}
                  </p>

                </div>

                <div className="
                  bg-[#dff1fb]
                  rounded-2xl
                  p-4
                ">

                  <div className="
                    flex
                    items-center
                    justify-between
                    gap-2
                  ">

                    <div className="min-w-0">

                      <p className="
                        text-[10px]
                        uppercase
                        text-[#718594]
                        font-mono
                      ">
                        IBAN
                      </p>

                      <p className="
                        mt-1
                        font-bold
                        font-mono
                        text-sm
                        break-all
                      ">
                        {selected.iban ||
                          'Não informado'}
                      </p>

                    </div>

                    {selected.iban && (

                      <button
                        type="button"
                        onClick={() =>
                          copyIban(
                            selected.iban
                          )
                        }
                        className="
                          shrink-0
                          p-2
                          rounded-xl
                          bg-[#e1f2fc]
                          text-[#1558a6]
                          hover:bg-[#cde8f5]
                          cursor-pointer
                        "
                        title="Copiar IBAN"
                      >
                        <Copy
                          size={17}
                          weight="bold"
                        />
                      </button>

                    )}

                  </div>

                </div>

              </div>

            </div>

            {/* FINANCEIRO */}

            <div>

              <div className="
                flex
                items-center
                gap-2
                mb-3
              ">

                <Receipt
                  size={18}
                  weight="duotone"
                  className="text-[#1558a6]"
                />

                <h3 className="
                  font-black
                  uppercase
                  text-sm
                  tracking-wide
                ">
                  Resumo financeiro
                </h3>

              </div>

              <div className="
                bg-[#dff1fb]
                rounded-2xl
                p-5
                space-y-4
              ">

                <div className="
                  flex
                  justify-between
                  gap-3
                  text-sm
                ">

                  <span className="
                    text-[#657b89]
                  ">
                    Valor solicitado
                  </span>

                  <strong>
                    {formatMoney(
                      selected.amount
                    )}{' '}
                    Kz
                  </strong>

                </div>

                <div className="
                  flex
                  justify-between
                  gap-3
                  text-sm
                ">

                  <span className="
                    text-[#657b89]
                  ">
                    Taxa de levantamento
                  </span>

                  <strong className="
                    text-red-500
                  ">
                    - {formatMoney(
                      selected.fee
                    )}{' '}
                    Kz
                  </strong>

                </div>

                <div className="
                  border-t
                  border-[#d7e7ef]
                  pt-4
                  flex
                  justify-between
                  gap-3
                ">

                  <span className="
                    font-black
                  ">
                    Valor líquido
                  </span>

                  <strong className="
                    text-lg
                    text-[#1558a6]
                  ">
                    {formatMoney(
                      selected.netAmount
                    )}{' '}
                    Kz
                  </strong>

                </div>

              </div>

            </div>

            {/* REFERÊNCIA */}

            {selected.externalTransferId && (

              <div>

                <div className="
                  flex
                  items-center
                  gap-2
                  mb-3
                ">

                  <IdentificationCard
                    size={18}
                    weight="duotone"
                    className="text-[#1558a6]"
                  />

                  <h3 className="
                    font-black
                    uppercase
                    text-sm
                    tracking-wide
                  ">
                    Referência
                  </h3>

                </div>

                <div className="
                  bg-[#dff1fb]
                  rounded-2xl
                  p-4
                ">

                  <p className="
                    font-mono
                    text-sm
                    break-all
                  ">
                    {selected.externalTransferId}
                  </p>

                </div>

              </div>

            )}

            {/* DATA DETALHADA */}

            <div className="
              flex
              items-center
              gap-2
              text-xs
              text-[#647b89]
            ">

              <CalendarBlank
                size={16}
                weight="duotone"
              />

              <span>
                {formatDate(
                  selected.createdAt
                )}
              </span>

            </div>

            {/* BOTÃO PDF */}

            <button
              type="button"
              onClick={() =>
                exportPDF(selected)
              }
              className="
                w-full
                flex
                items-center
                justify-center
                gap-2
                py-4
                rounded-2xl
                bg-[#1558a6]
                hover:bg-[#124d91]
                text-white
                font-black
                uppercase
                tracking-wide
                text-sm
                shadow-lg
                cursor-pointer
                transition
              "
            >

              <DownloadSimple
                size={20}
                weight="bold"
              />

              Exportar comprovativo PDF

            </button>

          </div>

        </div>

      </div>
    )
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="
      min-h-screen
      bg-[#0a2533]
      text-[#e0f2fe]
      font-sans
      selection:bg-cyan-500/30
    ">

      {/* GLOW */}

      <div className="
        absolute
        top-0
        right-0
        w-96
        h-96
        bg-cyan-500/[0.06]
        rounded-full
        filter
        blur-[120px]
        pointer-events-none
      " />

      {/* HEADER */}

      <div className="
        sticky
        top-0
        z-20
        bg-[#0a2533]/90
        backdrop-blur-xl
        border-b
        border-cyan-500/10
        px-6
        py-5
      ">

        <div className="
          flex
          items-center
          gap-4
        ">

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="
              p-2.5
              bg-[#0e364a]
              border
              border-cyan-500/25
              rounded-full
              text-cyan-300
              hover:bg-[#124158]
              hover:text-white
              transition-all
              cursor-pointer
            "
          >

            <ArrowLeft
              size={20}
              weight="bold"
            />

          </button>

          <div>

            <h1 className="
              text-xl
              font-black
              tracking-tighter
              uppercase
              font-mono
              text-white
            ">
              Histórico
            </h1>

            <p className="
              text-[10px]
              font-mono
              text-cyan-200/70
              uppercase
              tracking-[0.2em]
            ">
              Movimentações de saída
            </p>

          </div>

        </div>

        {/* FILTROS */}

        <div className="
          flex
          gap-2
          mt-6
          overflow-x-auto
        ">

          {[
            ['ALL', 'Todos'],
            ['PENDING', 'Pendentes'],
            ['SUCCESS', 'Concluídos'],
            ['REJECTED', 'Recusados']
          ].map(
            ([value, label]) => (

              <button
                key={value}
                type="button"
                onClick={() =>
                  setFilter(
                    value as
                      | 'ALL'
                      | 'PENDING'
                      | 'SUCCESS'
                      | 'REJECTED'
                  )
                }
                className={`
                  px-4
                  py-2
                  rounded-xl
                  text-xs
                  font-bold
                  font-mono
                  uppercase
                  tracking-wider
                  transition-all
                  cursor-pointer
                  whitespace-nowrap
                  ${
                    filter === value
                      ? `
                        bg-cyan-600
                        text-white
                        shadow-lg
                        shadow-cyan-950/40
                        border
                        border-cyan-400/50
                      `
                      : `
                        bg-[#0e364a]
                        text-cyan-200/70
                        hover:text-white
                        border
                        border-cyan-500/20
                      `
                  }
                `}
              >
                {label}
              </button>

            )
          )}

        </div>

      </div>

      {/* CONTEÚDO */}

      <div className="
        px-6
        py-6
        pb-28
        max-w-2xl
        mx-auto
        relative
        z-10
      ">

        {loading ? (

          <div className="space-y-4">

            {[1, 2, 3, 4].map(
              item => (

                <div
                  key={item}
                  className="
                    h-28
                    w-full
                    bg-[#0e364a]
                    rounded-[2rem]
                    animate-pulse
                    border
                    border-cyan-500/10
                    shadow-xl
                  "
                />

              )
            )}

          </div>

        ) : filteredItems.length === 0 ? (

          <div className="
            flex
            flex-col
            items-center
            justify-center
            py-20
            text-center
          ">

            <div className="
              p-4
              bg-[#0e364a]
              border
              border-cyan-500/20
              rounded-2xl
              mb-4
              shadow-xl
            ">

              <Receipt
                size={32}
                weight="duotone"
                className="text-cyan-400"
              />

            </div>

            <h3 className="
              text-white
              font-mono
              font-bold
            ">
              Nenhum levantamento
            </h3>

            <p className="
              text-cyan-200/70
              font-mono
              text-xs
              mt-1
            ">
              Não encontramos levantamentos
              para este filtro.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {filteredItems.map(
              withdrawal => (

                <WithdrawalCard
                  key={withdrawal.id}
                  withdrawal={withdrawal}
                />

              )
            )}

          </div>

        )}

      </div>

      {/* MODAL */}

      {selected && (
        <DetailsModal />
      )}

    </div>
  )
}