import axios from 'axios'

/* =========================
   DEVICE ID (ANTI-FRAUDE)
========================= */

function getDeviceId() {
  let id = localStorage.getItem('device_id')

  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('device_id', id)
  }

  return id
}

/* =========================
   AXIOS INSTANCE
========================= */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
})

/* =========================
   INTERCEPTOR TOKEN + DEVICE
========================= */

api.interceptors.request.use(config => {
  // Ajuste a chave do token caso no seu login use outra nomenclatura (ex: '@EMATEA:token')
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // 🔐 DEVICE ID obrigatório
  config.headers['x-device-id'] = getDeviceId()

  return config
})

/* =========================
   INTERCEPTOR RESPONSE
========================= */

api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    const code = error.response?.data?.code;

    // O bloqueio de vendas não termina a sessão.
    if (code === "SUB_AGENT_SALES_CLOSED") {
      return Promise.reject(error);
    }

    // Credenciais inválidas no login: manter a página e mostrar a mensagem.
    if (
      error.config?.url?.includes("/auth/login") &&
      status === 401
    ) {
      return Promise.reject(error);
    }

    // Apenas erros de autenticação/autorização fora do login
    // seguem o comportamento de sessão já existente.
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      delete api.defaults.headers.common.Authorization;

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

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
  code: string,
  fullName: string,
  role: 'CLIENT' | 'AGENT'
) => {
  const { data } = await api.post('/auth/register', {
    phone,
    email,
    password,
    code,
    fullName,
    role
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
  const { data } = await api.post(
    "/auth/login",
    {
      identifier,
      password
    }
  )

  // Salva o token no localStorage no momento do login
  if (data.token) {
    localStorage.setItem("token", data.token)
  }

  return {
    token: data.token,
    user: data.user
  }
}

/* =========================
   LOGOUT
========================= */

export const logoutUser = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")

  delete api.defaults.headers.common.Authorization

  window.location.href = "/login"
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