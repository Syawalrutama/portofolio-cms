import api from './api'

export const profileService = {
  // Mengambil data profil untuk admin
  getAdminProfile: async () => {
    const response = await api.get('/api/admin/profile')
    return response.data
  },

  // Mengubah data profil admin
  updateProfile: async (profileData) => {
    const response = await api.put('/api/admin/profile', profileData)
    return response.data
  },

  // Mengunggah foto profil admin
  uploadAvatar: async (avatarFile) => {
    const formData = new FormData()
    formData.append('avatar', avatarFile)
    const response = await api.post('/api/admin/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }
}
