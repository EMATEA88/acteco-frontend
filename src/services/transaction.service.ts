import { api } from './api';

export const TransactionService = {
  list() {
    return api.get('/transactions').then(res => res.data);
  },
};
