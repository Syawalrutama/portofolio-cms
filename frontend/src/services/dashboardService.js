import api from './api'

export const dashboardService = {
  // Mengambil data statistik dashboard
  getStats: async () => {
    const response = await api.get('/api/admin/dashboard')
    return response.data
  }
}
