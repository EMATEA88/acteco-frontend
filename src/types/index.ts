// USER
export type User = {
  id?: string
  fullName?: string
  phone?: string
  email?: string
  publicId?: string
  balance?: number
  createdAt?: string
}

// PRODUCT (já preparado pro teu sistema)
export type Product = {
  id: string
  name: string
  price: number
  dailyRate: number
  duration: number
}

// TRANSACTION
export type Transaction = {
  id: string
  type: 'deposit' | 'withdraw' | 'yield'
  amount: number
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
}