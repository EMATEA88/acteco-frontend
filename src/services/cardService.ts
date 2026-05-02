import { api } from "./api"

// 🔥 criar cartão
export const createCard = async () => {
  try {
    const { data } = await api.post("/cards")

    if (!data.success) {
      throw new Error(data.message || "Erro ao criar cartão")
    }

    return data.card
  } catch (err: any) {
    console.error("CREATE CARD ERROR:", err.response?.data || err.message)
    throw new Error(err.response?.data?.error || "Falha ao criar cartão")
  }
}

// 🔥 listar cartões
export const getCards = async () => {
  try {
    const { data } = await api.get("/cards")

    if (!data.success) {
      throw new Error("Erro ao buscar cartões")
    }

    return data.cards
  } catch (err: any) {
    console.error("GET CARDS ERROR:", err.response?.data || err.message)
    return [] // fallback seguro
  }
}

// 🔥 carregar cartão
export const fundCard = async (cardId: string, amount: number) => {
  try {
    const { data } = await api.post("/cards/fund", {
      cardId,
      amount
    })

    if (!data.success) {
      throw new Error(data.message || "Erro ao carregar cartão")
    }

    return data
  } catch (err: any) {
    console.error("FUND CARD ERROR:", err.response?.data || err.message)
    throw new Error(err.response?.data?.error || "Falha ao carregar cartão")
  }
}