import { CapacitorThermalPrinter } from 'capacitor-thermal-printer'

// =====================================================
// TIPAGEM DA TRANSAÇÃO
// =====================================================

interface TransactionReceipt {
  provider?: string | null
  service?: string | null
  partner?: string | null
  plan?: string | null
  customerReference?: string | null
  customerName?: string | null
  voucherPin?: string | null
  voucherValue?: number | string | null
  voucherUnits?: string | null
  voucherVat?: number | string | null
  transactionId?: string | null
  orderId?: string | null
  amount?: number | null
  currency?: string | null
  status?: string | null
}

interface TransactionDetails {
  id: number
  amount: number
  currency?: string | null
  createdAt: string
  status?: string | null
  reference?: string | null
  externalId?: string | null
  description?: string | null

  serviceRequest?: {
    customerName?: string | null
    customerReference?: string | null
    providerName?: string | null
    partnerName?: string | null
    planName?: string | null
    serviceName?: string | null
    status?: string | null
    externalProviderRef?: string | null
  }

  metadata?: {
    partnerName?: string
    providerName?: string
    planName?: string
    customerReference?: string
    receipt?: TransactionReceipt
    extraInfo?: any
  }
}

// =====================================================
// TIPAGEM DA IMPRESSORA
// =====================================================

export interface PairedPrinter {
  name: string
  address: string
}

// =====================================================
// NORMALIZAÇÃO DE TEXTO
// =====================================================

function normalizeText(text: string): string {
  if (!text) return ''

  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E\n]/g, '?')
}

// =====================================================
// BUSCAR DISPOSITIVOS EMPARELHADOS
// =====================================================

export async function getPairedPrinters(): Promise<PairedPrinter[]> {
  return new Promise(async (resolve, reject) => {
    let finished = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    let discoverListener: any = null
    let finishListener: any = null

    const cleanup = async () => {
      try {
        if (discoverListener?.remove) {
          await discoverListener.remove()
        }
      } catch {}

      try {
        if (finishListener?.remove) {
          await finishListener.remove()
        }
      } catch {}

      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    }

    const finish = async (
      devices: PairedPrinter[] = []
    ) => {
      if (finished) return

      finished = true

      await cleanup()

      resolve(devices)
    }

    try {
      discoverListener =
        await CapacitorThermalPrinter.addListener(
          'discoverDevices',
          ({ devices }: { devices?: PairedPrinter[] }) => {
            const discovered = Array.isArray(devices)
              ? devices
              : []

            finish(discovered)
          }
        )

      finishListener =
        await CapacitorThermalPrinter.addListener(
          'discoveryFinish',
          () => {
            if (!finished) {
              finish([])
            }
          }
        )

      timeoutId = setTimeout(() => {
        finish([])
      }, 10000)

      await CapacitorThermalPrinter.startScan()

    } catch (error: any) {
      await cleanup()

      reject(
        new Error(
          error?.message ||
            'Não foi possível procurar as impressoras Bluetooth.'
        )
      )
    }
  })
}

// =====================================================
// CONECTAR À IMPRESSORA
// =====================================================

export async function connectPrinter(
  device: PairedPrinter
): Promise<void> {
  if (!device?.address) {
    throw new Error(
      'A impressora selecionada não possui endereço Bluetooth.'
    )
  }

  try {
    await CapacitorThermalPrinter.connect({
      address: device.address,
    })
  } catch (error: any) {
    throw new Error(
      error?.message ||
        `Não foi possível conectar à impressora ${
          device.name || device.address
        }.`
    )
  }
}

// =====================================================
// IMPRIMIR RECIBO
// =====================================================

export async function printReceipt(
  transaction: TransactionDetails,
  device: PairedPrinter
): Promise<void> {
  try {
    if (!device?.address) {
      throw new Error(
        'Nenhuma impressora foi selecionada.'
      )
    }

    // -------------------------------------------------
    // 1. CONECTAR À IMPRESSORA SELECIONADA
    // -------------------------------------------------

    await connectPrinter(device)

    // -------------------------------------------------
    // 2. DADOS DO RECIBO
    // -------------------------------------------------

    const receipt =
      transaction.metadata?.receipt

    const serviceReq =
      transaction.serviceRequest

    const operatorName = (
      receipt?.provider ??
      serviceReq?.providerName ??
      'EMATEA'
    ).toUpperCase()

    const operationId =
      receipt?.transactionId ??
      transaction.externalId ??
      transaction.id

    const formattedAmount = `${Number(
      transaction.amount
    ).toLocaleString('pt-AO')} ${
      transaction.currency || 'AOA'
    }`

    const dateFormatted =
      new Date(
        transaction.createdAt
      ).toLocaleString('pt-AO')

    const customerReference =
      receipt?.customerReference ??
      serviceReq?.customerReference ??
      transaction.reference ??
      null

    const customerName =
      receipt?.customerName ??
      serviceReq?.customerName ??
      null

    const serviceName =
      receipt?.plan ??
      serviceReq?.planName ??
      serviceReq?.serviceName ??
      null

    const voucherPin =
      receipt?.voucherPin ??
      null

    // -------------------------------------------------
    // 3. URL DO LOGOTIPO
    // -------------------------------------------------

    const logoUrl =
      `${window.location.origin}/logo.png`

    // -------------------------------------------------
    // 4. CONSTRUIR RECIBO
    // -------------------------------------------------

    const printer =
      CapacitorThermalPrinter
        .begin()
        .align('center')

        // -------------------------------------------------
        // LOGOTIPO EMATEA
        // -------------------------------------------------
        //
        // O logo deve ser preparado como imagem circular
        // no próprio arquivo public/logo.png.
        //
        // -------------------------------------------------

        .image(logoUrl)

        .text('\n')

        // -------------------------------------------------
        // CABEÇALHO
        // -------------------------------------------------

        .bold()
        .text(
          normalizeText(
            'EMATEA COMERCIO GERAL\n'
          )
        )
        .text(
          normalizeText(
            'NIF: 5002577666\n'
          )
        )
        .text(
          normalizeText(
            'Malanje - Angola\n'
          )
        )

        .text(
          '--------------------------------\n'
        )

        .bold()
        .text(
          normalizeText(
            'COMPROVATIVO DE VENDA\n'
          )
        )

        .text(
          '--------------------------------\n'
        )

        // -------------------------------------------------
        // DADOS DA TRANSAÇÃO
        // -------------------------------------------------

        .align('left')
        .clearFormatting()

        .text(
          normalizeText(
            `ID: ${operationId}\n`
          )
        )

        .text(
          normalizeText(
            `Operadora: ${operatorName}\n`
          )
        )

    // -------------------------------------------------
    // SERVIÇO
    // -------------------------------------------------

    if (serviceName) {
      printer.text(
        normalizeText(
          `Servico: ${serviceName}\n`
        )
      )
    }

    // -------------------------------------------------
    // REFERÊNCIA DO CLIENTE
    // -------------------------------------------------

    if (customerReference) {
      printer.text(
        normalizeText(
          `Referencia: ${customerReference}\n`
        )
      )
    }

    // -------------------------------------------------
    // NOME DO CLIENTE
    // -------------------------------------------------

    if (customerName) {
      printer.text(
        normalizeText(
          `Cliente: ${customerName}\n`
        )
      )
    }

    // -------------------------------------------------
    // DATA
    // -------------------------------------------------

    printer
      .text(
        normalizeText(
          `Data: ${dateFormatted}\n`
        )
      )

      .text(
        '--------------------------------\n'
      )

      // -------------------------------------------------
      // TOTAL
      // -------------------------------------------------

      .align('center')
      .bold()
      .text(
        normalizeText(
          `TOTAL: ${formattedAmount}\n`
        )
      )

    // -------------------------------------------------
    // PIN DO VOUCHER
    // -------------------------------------------------

    if (voucherPin) {
      printer
        .text('\n')
        .text(
          normalizeText(
            `PIN: ${voucherPin}\n`
          )
        )
    }

    // -------------------------------------------------
    // RODAPÉ
    // -------------------------------------------------

    printer
      .text('\n')
      .clearFormatting()
      .text(
        normalizeText(
          'Obrigado pela preferencia\n'
        )
      )
      .text(
        normalizeText(
          'EMATEA\n'
        )
      )
      .text('\n\n\n')

    // -------------------------------------------------
    // 5. ENVIAR PARA A IMPRESSORA
    // -------------------------------------------------

    await printer.write()

  } catch (error: any) {
    console.error(
      'Erro na impressão:',
      error
    )

    throw new Error(
      error?.message ||
        'Não foi possível imprimir o recibo.'
    )
  }
}

// =====================================================
// DESCONECTAR
// =====================================================

export async function disconnectPrinter(): Promise<void> {
  try {
    await CapacitorThermalPrinter.disconnect()
  } catch (error) {
    console.warn(
      'Não foi possível desconectar a impressora:',
      error
    )
  }
}