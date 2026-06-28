import axios from 'axios'

const api = axios.create({
  baseURL: '', // Menggunakan base domain (vite proxy akan meneruskannya ke backend Go)
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Menyematkan token JWT ke header Authorization untuk semua request ke backend
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor response untuk menangani 401 Unauthorized otomatis
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
