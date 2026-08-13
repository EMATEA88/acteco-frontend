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

export interface ThermalPrinterDevice {
  name?: string | null
  address: string
  id?: string | null
  type?: string | null
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

export async function scanPrinters(): Promise<ThermalPrinterDevice[]> {
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
      devices: ThermalPrinterDevice[] = []
    ) => {
      if (finished) return

      finished = true

      await cleanup()

      resolve(devices)
    }

    try {
      discoverListener = await CapacitorThermalPrinter.addListener(
        'discoverDevices',
        ({ devices }: { devices?: ThermalPrinterDevice[] }) => {
          const discovered = Array.isArray(devices)
            ? devices
            : []

          finish(discovered)
        }
      )

      finishListener = await CapacitorThermalPrinter.addListener(
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
  device: ThermalPrinterDevice
): Promise<void> {
  if (!device?.address) {
    throw new Error('A impressora selecionada não possui endereço Bluetooth.')
  }

  try {
    await CapacitorThermalPrinter.connect({
      address: device.address,
    })
  } catch (error: any) {
    throw new Error(
      error?.message ||
        `Não foi possível conectar à impressora ${device.name || device.address}.`
    )
  }
}

// =====================================================
// IMPRIMIR RECIBO
// =====================================================

export async function printReceipt(
  transaction: TransactionDetails,
  device: ThermalPrinterDevice
): Promise<void> {
  try {
    if (!device?.address) {
      throw new Error('Nenhuma impressora foi selecionada.')
    }

    // -------------------------------------------------
    // 1. Conectar à impressora selecionada
    // -------------------------------------------------

    await connectPrinter(device)

    // -------------------------------------------------
    // 2. Dados do recibo
    // -------------------------------------------------

    const receipt = transaction.metadata?.receipt
    const serviceReq = transaction.serviceRequest

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
    ).toLocaleString('pt-AO')} ${transaction.currency || 'AOA'}`

    const dateFormatted = new Date(
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
    // 3. Construir recibo
    // -------------------------------------------------

    const printer = CapacitorThermalPrinter
      .begin()
      .align('center')
      .bold()
      .text(
        normalizeText(
          'EMATEA COMERCIO GERAL\n'
        )
      )
      .text(
        normalizeText(
          'NIF: 5000000000\n'
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
      .text(
        normalizeText(
          'COMPROVATIVO DE VENDA\n'
        )
      )
      .text(
        '--------------------------------\n'
      )
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

    if (serviceName) {
      printer.text(
        normalizeText(
          `Servico: ${serviceName}\n`
        )
      )
    }

    if (customerReference) {
      printer.text(
        normalizeText(
          `Referencia: ${customerReference}\n`
        )
      )
    }

    if (customerName) {
      printer.text(
        normalizeText(
          `Cliente: ${customerName}\n`
        )
      )
    }

    printer
      .text(
        normalizeText(
          `Data: ${dateFormatted}\n`
        )
      )
      .text(
        '--------------------------------\n'
      )
      .align('center')
      .bold()
      .text(
        normalizeText(
          `TOTAL: ${formattedAmount}\n`
        )
      )

    if (voucherPin) {
      printer
        .text('\n')
        .text(
          normalizeText(
            `PIN: ${voucherPin}\n`
          )
        )
    }

    printer
      .text('\n')
      .text(
        normalizeText(
          'Obrigado pela preferencia\n'
        )
      )
      .text('\n\n\n')

    // -------------------------------------------------
    // 4. ENVIAR PARA A IMPRESSORA
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