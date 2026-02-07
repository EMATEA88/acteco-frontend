import { api } from './api'

export class GiftService {
  static redeem(code: string) {
    return api.post('/gift/redeem', {
      code,
    })
  }
}
