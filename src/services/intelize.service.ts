
import { api } from './api'

export interface IntelizeReference {
  entityCode: string
  reference: string
  provider: 'INTELIZE'
  isActive: boolean
}

interface IntelizeReferenceResponse {
  success: boolean
  message: string
  data: IntelizeReference
}

export const IntelizeService = {
  async getReference(): Promise<IntelizeReference> {
    const response = await api.get<IntelizeReferenceResponse>(
      '/intelize/reference'
    )

    const result = response.data

    if (
      !result?.success ||
      !result.data ||
      !result.data.entityCode ||
      !result.data.reference ||
      result.data.provider !== 'INTELIZE' ||
      typeof result.data.isActive !== 'boolean'
    ) {
      throw new Error(
        'Resposta inválida ao consultar a referência Intelize.'
      )
    }

    return result.data
  },
}
