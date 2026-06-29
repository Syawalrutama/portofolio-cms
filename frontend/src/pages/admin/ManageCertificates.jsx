import React, { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Upload, Calendar, Award, X, Image as ImageIcon } from 'lucide-react'
import { certificateService } from '../../services/certificateService'
import { useToast } from '../../context/ToastContext'
import { getImageUrl } from '../../utils/url'
import { CardSkeleton } from '../../components/common/Skeleton'
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal'

export default function ManageCertificates() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentCert, setCurrentCert] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState(null)
  
  // State Form Input
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    issueDate: ''
  })
  
  // State Upload
  const [uploadingCertId, setUploadingCertId] = useState(null)
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    setLoading(true)
    try {
      const res = await certificateService.getAllAdmin()
      setCertificates(res.data || [])
    } catch (err) {
      showNotification('error', 'Gagal mengambil data sertifikat.')
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

  const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toISOString().split('T')[0]
    } catch (e) {
      return ''
    }
  }

  const formatDateDisplay = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    } catch (e) {
      return dateString
    }
  }

  const openAddModal = () => {
    setCurrentCert(null)
    setFormData({
      name: '',
      organization: '',
      issueDate: ''
    })
    setIsModalOpen(true)
  }

  const openEditModal = (cert) => {
    setCurrentCert(cert)
    setFormData({
      name: cert.name,
      organization: cert.organization,
      issueDate: formatDateForInput(cert.issueDate)
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.organization || !formData.issueDate) {
      showNotification('error', 'Nama sertifikat, organisasi, dan tanggal terbit wajib diisi.')
      return
    }

    try {
      if (currentCert) {
        // Edit Mode
        await certificateService.update(currentCert.id, formData)
        showNotification('success', 'Sertifikat berhasil diperbarui!')
      } else {
        // Add Mode
        await certificateService.create(formData)
        showNotification('success', 'Sertifikat berhasil ditambahkan!')
      }
      setIsModalOpen(false)
      fetchCertificates()
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Gagal menyimpan sertifikat.')
    }
  }

  const openDeleteModal = (id) => {
    setDeleteTargetId(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteTargetId) return
    try {
      await certificateService.delete(deleteTargetId)
      showNotification('success', 'Sertifikat berhasil dihapus!')
      fetchCertificates()
    } catch (err) {
      showNotification('error', 'Gagal menghapus sertifikat.')
    } finally {
      setIsDeleteModalOpen(false)
      setDeleteTargetId(null)
    }
  }

  const handleImageUpload = async (e, certId) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingCertId(certId)
    try {
      await certificateService.uploadImage(certId, file)
      showNotification('success', 'Berkas sertifikat berhasil diunggah!')
      fetchCertificates()
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Gagal mengunggah gambar.')
    } finally {
      setUploadingCertId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Manage Certificates</h2>
          <p className="text-sm text-slate-400">Kelola dan unggah piagam sertifikat kompetensi profesional Anda.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-500"
        >
          <Plus className="h-4 w-4" />
          Add Certificate
        </button>
      </div>

      {/* Tampilan Loading */}
      {loading ? (
        <CardSkeleton count={6} />
      ) : certificates.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-[#0d1324] py-12 text-center">
          <Award className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Belum ada sertifikat</h3>
          <p className="text-sm text-slate-400 mb-4">Mulai tambahkan sertifikat prestasi atau kompetensi pertama Anda sekarang.</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-500"
          >
            <Plus className="h-4 w-4" />
            Add Certificate
          </button>
        </div>
      ) : (
        /* Grid Sertifikat */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <div key={cert.id} className="flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#0d1324] shadow-md transition-all hover:border-slate-700/50">
              
              {/* Image Preview Area */}
              <div className="relative aspect-[4/3] w-full border-b border-slate-800 bg-[#0b0f19] flex items-center justify-center overflow-hidden">
                {cert.imageUrl ? (
                  <img
                    src={getImageUrl(cert.imageUrl)}
                    alt={cert.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-600">
                    <ImageIcon className="h-10 w-10 mb-1" />
                    <span className="text-xs">No Certificate Image</span>
                  </div>
                )}

                {/* Upload Image Overlay Button */}
                <label className="absolute bottom-3 right-3 cursor-pointer rounded-lg bg-slate-900/90 p-2 text-slate-300 transition-all hover:bg-slate-800 hover:text-white backdrop-blur-sm">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, cert.id)}
                    disabled={uploadingCertId === cert.id}
                  />
                  <Upload className={`h-4 w-4 ${uploadingCertId === cert.id ? 'animate-pulse' : ''}`} />
                </label>
              </div>

              {/* Detail Content */}
              <div className="flex-1 p-5 space-y-3">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white line-clamp-1">{cert.name}</h3>
                  <p className="text-xs text-primary-400 font-semibold">{cert.organization}</p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Issued: {formatDateDisplay(cert.issueDate)}</span>
                </div>
              </div>

              {/* Panel Tombol Aksi */}
              <div className="flex border-t border-slate-800/80 bg-[#0b0f19]/35 px-5 py-3.5 gap-4">
                <button
                  onClick={() => openEditModal(cert)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-800 bg-[#0b0f19] py-2 text-xs font-bold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(cert.id)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-rose-950/20 bg-[#0b0f19] py-2 text-xs font-bold text-rose-400 transition-all hover:bg-rose-500/10 hover:border-rose-500/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal Form Tambah / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1324] shadow-2xl">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <h3 className="text-lg font-bold text-white">
                {currentCert ? 'Edit Certificate Details' : 'Add New Certificate'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-slate-850 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form Modal */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Certificate Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: Certified Kubernetes Administrator (CKA)"
                  className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-all outline-none focus:border-primary-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Issuing Organization</label>
                <input
                  type="text"
                  name="organization"
                  required
                  value={formData.organization}
                  onChange={handleInputChange}
                  placeholder="Contoh: CNCF, Google Cloud, Cisco"
                  className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-all outline-none focus:border-primary-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Issue Date</label>
                <input
                  type="date"
                  name="issueDate"
                  required
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-4 py-2.5 text-sm text-white transition-all outline-none focus:border-primary-500"
                />
              </div>

              {/* Buttons Footer */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-lg border border-slate-800 bg-[#0b0f19] py-2.5 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-850"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-500"
                >
                  {currentCert ? 'Save Changes' : 'Create Certificate'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Sertifikat"
        message="Apakah Anda yakin ingin menghapus sertifikat ini?"
      />

    </div>
  )
}
