import { api } from "./api"

export const otcChat = {

  async get(orderId: number) {
    const res = await api.get(`/otc/orders/${orderId}`)
    return res.data.data
  },

  async uploadImage(orderId: number, file: File) {
  const form = new FormData()
  form.append("image", file)

  const res = await api.post(
    `/otc/chat/${orderId}/image`,
    form
  )

  return res.data.data
}

}