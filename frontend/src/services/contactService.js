import api from './api'

export const contactService = {
  // Mengirim pesan kontak masuk dari visitor
  submit: async (contactData) => {
    const response = await api.post('/api/contacts', contactData)
    return response.data
  },

  // Mengambil semua pesan masuk admin
  getAllAdmin: async () => {
    const response = await api.get('/api/admin/contacts')
    return response.data
  },

  // Menandai pesan masuk sebagai terbaca
  markRead: async (id) => {
    const response = await api.patch(`/api/admin/contacts/${id}/read`)
    return response.data
  },

  // Menghapus pesan masuk
  delete: async (id) => {
    const response = await api.delete(`/api/admin/contacts/${id}`)
    return response.data
  }
}
