import api from './api'

export const skillService = {
  // Mengambil semua skill publik
  getAll: async () => {
    const response = await api.get('/api/skills')
    return response.data
  },

  // Menambah skill baru
  create: async (data) => {
    const response = await api.post('/api/admin/skills', data)
    return response.data
  },

  // Mengubah data skill
  update: async (id, data) => {
    const response = await api.put(`/api/admin/skills/${id}`, data)
    return response.data
  },

  // Menghapus skill
  delete: async (id) => {
    const response = await api.delete(`/api/admin/skills/${id}`)
    return response.data
  }
}
