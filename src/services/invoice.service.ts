import { api } from './api';

export const InvoiceService = {
  get() {
    return api.get('/invoice').then(res => res.data);
  },
};
