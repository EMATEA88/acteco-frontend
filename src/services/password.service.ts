import { api } from './api'

type ChangeLoginPasswordPayload = {
  currentPassword: string
  newPassword: string
  otp: string
}

type ChangeWithdrawPasswordPayload = {
  currentWithdrawPassword?: string
  newWithdrawPassword: string
  otp: string
}

export class PasswordService {

  static async changeLoginPassword(
    data: ChangeLoginPasswordPayload
  ) {
    const res = await api.put(
      '/password/login',
      data
    )
    return res.data
  }

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