import React, { useState, useEffect } from 'react'
import { Save, Upload, User, Globe, MessageSquare, Linkedin, Github, Mail } from 'lucide-react'
import { profileService } from '../../services/profileService'
import { useToast } from '../../context/ToastContext'
import { getImageUrl } from '../../utils/url'
import { FormSkeleton } from '../../components/common/Skeleton'

export default function ProfileSettings() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  // State Form
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    bio: '',
    email: '',
    whatsapp: '',
    linkedin: '',
    github: '',
    techStack: ''
  })
  
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const res = await profileService.getAdminProfile()
      if (res.data) {
        setProfile(res.data)
        setFormData({
          fullName: res.data.fullName || '',
          title: res.data.title || '',
          bio: res.data.bio || '',
          email: res.data.socialLinks?.email || '',
          whatsapp: res.data.socialLinks?.whatsapp || '',
          linkedin: res.data.socialLinks?.linkedin || '',
          github: res.data.socialLinks?.github || '',
          techStack: res.data.techStack || ''
        })
      }
    } catch (err) {
      showNotification('error', 'Gagal mengambil data profil admin.')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (type, message) => {
    if (type === 'success') {
      showSuccess(message)
    } else {
      showError(message)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.fullName || !formData.title || !formData.bio) {
      showNotification('error', 'Nama lengkap, judul profesi, dan biografi wajib diisi.')
      return
    }

    setSaving(true)
    try {
      const updateData = {
        full_name: formData.fullName,
        title: formData.title,
        bio: formData.bio,
        social_links: {
          email: formData.email,
          whatsapp: formData.whatsapp,
          linkedin: formData.linkedin,
          github: formData.github
        },
        tech_stack: formData.techStack
      }

      const res = await profileService.updateProfile(updateData)
      if (res.data) {
        setProfile(res.data)
        showNotification('success', 'Profil berhasil disimpan!')
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Gagal menyimpan rincian profil.')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const res = await profileService.uploadAvatar(file)
      if (res.data) {
        setProfile(prev => ({ ...prev, avatarUrl: res.data.avatarUrl }))
        showNotification('success', 'Foto profil berhasil diunggah!')
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Gagal mengunggah foto profil.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="space-y-1 border-b border-slate-900 pb-5">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Profile Settings</h2>
          <p className="text-sm text-slate-400">Kelola detail informasi profil publik Anda.</p>
        </div>
        <FormSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Header Halaman */}
      <div className="space-y-1 border-b border-slate-900 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Profile Settings</h2>
        <p className="text-sm text-slate-400">Kelola detail informasi profil publik Anda.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-12 items-start">
        
        {/* Avatar Upload Card */}
        <div className="md:col-span-4 rounded-xl border border-slate-800 bg-[#0d1324] p-6 text-center space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Photo Profile</h3>
          
          <div className="relative mx-auto aspect-square w-40 rounded-full border border-slate-800 bg-[#0b0f19] flex items-center justify-center overflow-hidden group">
            {profile?.avatarUrl ? (
              <img
                src={getImageUrl(profile.avatarUrl)}
                alt={profile.fullName}
                className="h-full w-full object-cover transition-all group-hover:opacity-70"
              />
            ) : (
              <User className="h-16 w-16 text-slate-600" />
            )}
            
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-all">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={uploading}
              />
              <Upload className={`h-6 w-6 text-white ${uploading ? 'animate-pulse' : ''}`} />
            </label>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">{profile?.fullName || 'Administrator'}</h4>
            <p className="text-xs text-slate-500 leading-normal">Dimensi foto direkomendasikan 1:1 format JPG, PNG, atau WEBP.</p>
          </div>
        </div>

        {/* Form Details Card */}
        <form onSubmit={handleSubmit} className="md:col-span-8 rounded-xl border border-slate-800 bg-[#0d1324] p-6 md:p-8 space-y-6">
          
          {/* General Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-primary-400 uppercase tracking-wider border-b border-slate-850 pb-2">Informasi Umum</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Contoh: Muhammad Rafli"
                  className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-4 py-2.5 text-sm text-white placeholder-slate-650 transition-all outline-none focus:border-primary-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Professional Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Contoh: Senior Full Stack Engineer"
                  className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-4 py-2.5 text-sm text-white placeholder-slate-650 transition-all outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Biography</label>
              <textarea
                name="bio"
                required
                rows={5}
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tulis biografi lengkap, keahlian utama, latar belakang, dan riwayat profesional..."
                className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-4 py-2.5 text-sm text-white placeholder-slate-650 transition-all outline-none focus:border-primary-500 resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Main Tech Stack (Pisahkan dengan koma)</label>
              <input
                type="text"
                name="techStack"
                value={formData.techStack}
                onChange={handleInputChange}
                placeholder="Contoh: React.js, Go / Golang, Tailwind CSS, PostgreSQL, Vite, Docker"
                className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-4 py-2.5 text-sm text-white placeholder-slate-650 transition-all outline-none focus:border-primary-500"
              />
            </div>
          </div>

          {/* Social Channels Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-primary-400 uppercase tracking-wider border-b border-slate-850 pb-2">Saluran Kontak & Media Sosial</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@example.com"
                  className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-4 py-2.5 text-sm text-white placeholder-slate-650 transition-all outline-none focus:border-primary-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  placeholder="Contoh: 6281234567890"
                  className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-4 py-2.5 text-sm text-white placeholder-slate-650 transition-all outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Linkedin className="h-3.5 w-3.5" /> LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-4 py-2.5 text-sm text-white placeholder-slate-650 transition-all outline-none focus:border-primary-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Github className="h-3.5 w-3.5" /> GitHub URL
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username"
                  className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-4 py-2.5 text-sm text-white placeholder-slate-650 transition-all outline-none focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Profile Details'}
            </button>
          </div>

        </form>

      </div>

    </div>
  )
}
