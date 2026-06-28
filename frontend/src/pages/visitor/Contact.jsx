import React, { useState, useEffect } from 'react'
import { Mail, MessageSquare, Linkedin, Github, Send, Check } from 'lucide-react'
import { contactService } from '../../services/contactService'
import api from '../../services/api'

export default function Contact() {
  const [profile, setProfile] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const res = await api.get('/api/profile')
        if (res.data && res.data.data) {
          setProfile(res.data.data)
        }
      } catch (err) {
        console.error("Gagal memuat kontak admin", err)
      }
    }
    fetchContactDetails()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Semua kolom formulir wajib diisi.')
      return
    }

    setSubmitting(true)
    try {
      await contactService.submit(formData)
      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim pesan. Silakan coba beberapa saat lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-12">
      
      {/* Header Halaman */}
      <div className="space-y-2 text-center md:text-left">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Get In Touch</h2>
        <p className="text-sm text-slate-500">Silakan hubungi saya melalui form di bawah atau media sosial resmi saya.</p>
      </div>

      <div className="grid gap-12 md:grid-cols-12 md:items-start">
        
        {/* Info Kontak Kiri */}
        <div className="md:col-span-5 space-y-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Contact Information</h3>

          <div className="space-y-4">
            
            {/* Email */}
            {profile?.socialLinks?.email && (
              <div className="flex gap-4 p-4 rounded-xl border border-sky-100 bg-white/70 shadow-sm">
                <div className="rounded-lg bg-primary-50 p-3 text-primary-600 h-fit">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Email</span>
                  <p className="text-sm text-slate-800 font-semibold">{profile.socialLinks.email}</p>
                </div>
              </div>
            )}

            {/* WhatsApp */}
            {profile?.socialLinks?.whatsapp && (
              <div className="flex gap-4 p-4 rounded-xl border border-sky-100 bg-white/70 shadow-sm">
                <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600 h-fit">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">WhatsApp</span>
                  <p className="text-sm text-slate-800 font-semibold">+{profile.socialLinks.whatsapp}</p>
                </div>
              </div>
            )}

            {/* LinkedIn */}
            {profile?.socialLinks?.linkedin && (
              <div className="flex gap-4 p-4 rounded-xl border border-sky-100 bg-white/70 shadow-sm">
                <div className="rounded-lg bg-blue-50 p-3 text-blue-600 h-fit">
                  <Linkedin className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">LinkedIn</span>
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 font-semibold hover:underline">
                    View LinkedIn Profile
                  </a>
                </div>
              </div>
            )}

            {/* GitHub */}
            {profile?.socialLinks?.github && (
              <div className="flex gap-4 p-4 rounded-xl border border-sky-100 bg-white/70 shadow-sm">
                <div className="rounded-lg bg-slate-100 p-3 text-slate-600 h-fit">
                  <Github className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">GitHub</span>
                  <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 font-semibold hover:underline">
                    View GitHub Projects
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Formulir Kontak Kanan */}
        <div className="md:col-span-7 rounded-2xl border border-sky-100 bg-white/80 p-6 md:p-8 shadow-xl">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">Send Me a Message</h3>

          {success ? (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto rounded-full bg-emerald-500/10 p-3 text-emerald-400 h-fit w-fit">
                <Check className="h-10 w-10 animate-bounce" />
              </div>
              <h4 className="text-lg font-bold text-slate-800">Pesan Terkirim!</h4>
              <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                Terima kasih atas tanggapan Anda. Pesan Anda telah kami simpan dan akan segera kami respon melalui email secepatnya.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-500"
              >
                Kirim pesan lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400 text-center font-medium">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Contoh: John Doe"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-primary-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-primary-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Contoh: Penawaran Kerja, Kerja Sama Proyek"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-primary-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Isi pesan detail Anda..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-primary-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-3 text-xs font-semibold text-white transition-all hover:bg-primary-500 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Kirim Pesan
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  )
}
