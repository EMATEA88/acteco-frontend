// src/services/product.service.ts
import { api } from './api'

export const ProductService = {
  list() {
    return api.get('/products')
  },

  buy(productId: number) {
    return api.post('/products/buy', { productId })
  },

  // ✅ NOVO — PRODUTOS COMPRADOS
  myProducts() {
    return api.get('/products/my')
  },
}
