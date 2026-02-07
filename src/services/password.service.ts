// src/services/password.service.ts
import { api } from './api'

type ChangeLoginPasswordPayload = {
  currentPassword: string
  newPassword: string
}

type ChangeWithdrawPasswordPayload = {
  currentWithdrawPassword?: string
  newWithdrawPassword: string
}

export class PasswordService {
  /**
   * 🔐 Alterar senha de login
   */
  static async changeLoginPassword(
    data: ChangeLoginPasswordPayload
  ) {
    const res = await api.put(
      '/password/login',
      data
    )
    return res.data
  }

  /**
   * 💰 Definir ou alterar senha de levantamento
   */
  static async changeWithdrawPassword(
    data: ChangeWithdrawPasswordPayload
  ) {
    const res = await api.put(
      '/password/withdraw',
      data
    )
    return res.data
  }
}
