import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
})

// 🔐 Injeta token automaticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/* =========================
   AUTH
========================= */

// 📧 Solicitar OTP de registro
export const requestRegisterOtp = async (email: string) => {
  const { data } = await api.post('/auth/request-register-otp', { email })
  return data
}

// 📝 Registrar com OTP
export const registerUser = async (
  phone: string,
  email: string,
  password: string,
  code: string
) => {
  const { data } = await api.post('/auth/register', {
    phone,
    email,
    password,
    code
  })
  return data
}

// 🔁 Solicitar OTP reset
export const requestResetOtp = async (email: string) => {
  const { data } = await api.post('/auth/request-reset-otp', { email })
  return data
}

// 🔐 Resetar senha
export const resetPassword = async (
  email: string,
  newPassword: string,
  code: string
) => {
  const { data } = await api.post('/auth/reset-password', {
    email,
    newPassword,
    code
  })
  return data
}

// 🔓 Login (email ou phone)
export const loginUser = async (
  identifier: string,
  password: string
) => {
  const { data } = await api.post('/auth/login', {
    identifier,
    password
  })

  if (data.token) {
    localStorage.setItem('token', data.token)
  }

  return data
}

export { api }