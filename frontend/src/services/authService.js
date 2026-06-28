import api from './api'

export const authService = {
  // Login admin ke backend
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password })
    if (response.data && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token)
      localStorage.setItem('user', JSON.stringify({ email }))
    }
    return response.data
  },

  // Logout admin
  logout: async () => {
    await api.post('/api/auth/logout')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // Cek validitas sesi token ke backend terproteksi
  checkSession: async () => {
    const response = await api.get('/api/admin/check')
    return response.data
  }
}
