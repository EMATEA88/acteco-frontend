import { api } from "./api"

export interface CreateRedotPayDepositDTO {

  amount: number

  currency?: string

  description?: string

}

export interface RedotPayGatewayData {

  orderSn?: string

  prepayId?: string

  outerOrderSn?: string

  checkoutUrl?: string

  cashierUrl?: string

  payUrl?: string

  paymentMethod?: string

  [key: string]: any

}

export interface CreateRedotPayDepositResponse {

  recharge: any

  transaction: any

  paymentCharge: any

  gateway: {

    code: number

    msg: string

    data: RedotPayGatewayData

  }

}

export class RedotPayService {

  /* =======================================================
     CREATE DEPOSIT
  ======================================================= */

  static async createDeposit(

    payload: CreateRedotPayDepositDTO

  ) {

    const { data } =

      await api.post<CreateRedotPayDepositResponse>(

        "/redotpay/deposit",

        payload

      )

    return data

  }

}