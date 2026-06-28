import api from './api'

export const projectService = {
  // Mengambil semua proyek untuk publik visitor
  getAll: async () => {
    const response = await api.get('/api/projects')
    return response.data
  },

  // Mengambil semua proyek milik admin
  getAllAdmin: async () => {
    const response = await api.get('/api/admin/projects')
    return response.data
  },

  // Mengambil detail satu proyek berdasarkan ID
  getByID: async (id) => {
    const response = await api.get(`/api/projects/${id}`)
    return response.data
  },

  // Menambahkan proyek baru
  create: async (projectData) => {
    const response = await api.post('/api/admin/projects', projectData)
    return response.data
  },

  // Mengubah rincian proyek
  update: async (id, projectData) => {
    const response = await api.put(`/api/admin/projects/${id}`, projectData)
    return response.data
  },

  // Mengunggah gambar/foto proyek ke server
  uploadImage: async (id, imageFile) => {
    const formData = new FormData()
    formData.append('image', imageFile)
    const response = await api.post(`/api/admin/projects/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Menghapus proyek
  delete: async (id) => {
    const response = await api.delete(`/api/admin/projects/${id}`)
    return response.data
  }
}
