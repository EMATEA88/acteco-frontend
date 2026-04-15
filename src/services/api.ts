import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
})

/* =========================
   INTERCEPTOR TOKEN
========================= */

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/* =========================
   INTERCEPTOR RESPONSE
========================= */

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

/* =========================
   AUTH
========================= */

export const requestRegisterOtp = async (email: string) => {
  const { data } = await api.post('/auth/register/otp', { email })
  return data
}

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

export const requestResetOtp = async (email: string) => {
  const { data } = await api.post('/auth/reset-password/otp', { email })
  return data
}

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

/* =========================
   LOGOUT
========================= */

export const logoutUser = () => {
  localStorage.removeItem('token')
  window.location.href = '/login'
}

/* =========================
   TASKS (CRÍTICO)
========================= */

export const getTasks = async () => {
  const { data } = await api.get('/tasks')
  return data
}

export const completeTask = async (taskId: number, proof: string) => {
  const { data } = await api.post(`/tasks/complete/${taskId}`, {
    proof
  })
  return data
}

export { api }