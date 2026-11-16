
import { api } from './api'

export interface IntelizeReference {
  entityCode: string
  reference: string
  provider: 'INTELIZE'
  isActive: boolean
}

export const IntelizeService = {
  async getReference(): Promise<IntelizeReference> {
    const { data } = await api.get<IntelizeReference>(
      '/intelize/reference'
    )

    return data
  },
}
