import api from './api'

export const certificateService = {
  // Mengambil semua sertifikat publik
  getAll: async () => {
    const response = await api.get('/api/certificates')
    return response.data
  },

  // Mengambil semua sertifikat admin
  getAllAdmin: async () => {
    const response = await api.get('/api/admin/certificates')
    return response.data
  },

  // Menambah sertifikat baru
  create: async (data) => {
    const response = await api.post('/api/admin/certificates', data)
    return response.data
  },

  // Mengubah data sertifikat
  update: async (id, data) => {
    const response = await api.put(`/api/admin/certificates/${id}`, data)
    return response.data
  },

  // Mengunggah gambar sertifikat
  uploadImage: async (id, imageFile) => {
    const formData = new FormData()
    formData.append('image', imageFile)
    const response = await api.post(`/api/admin/certificates/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Menghapus sertifikat
  delete: async (id) => {
    const response = await api.delete(`/api/admin/certificates/${id}`)
    return response.data
  }
}
