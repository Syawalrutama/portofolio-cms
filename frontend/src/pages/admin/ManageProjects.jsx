import React, { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Upload, Github, ExternalLink, X, Image as ImageIcon, FolderGit2 } from 'lucide-react'
import { projectService } from '../../services/projectService'
import { useToast } from '../../context/ToastContext'
import { getImageUrl } from '../../utils/url'
import { CardSkeleton } from '../../components/common/Skeleton'
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal'

export default function ManageProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState(null)
  
  // State Form Input
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    githubUrl: '',
    demoUrl: ''
  })
  
  // State Upload
  const [uploadingProjectId, setUploadingProjectId] = useState(null)
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await projectService.getAllAdmin()
      setProjects(res.data || [])
    } catch (err) {
      showNotification('error', 'Gagal mengambil data proyek.')
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

  const openAddModal = () => {
    setCurrentProject(null)
    setFormData({
      title: '',
      description: '',
      category: '',
      githubUrl: '',
      demoUrl: ''
    })
    setIsModalOpen(true)
  }

  const openEditModal = (project) => {
    setCurrentProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      githubUrl: project.githubUrl || '',
      demoUrl: project.demoUrl || ''
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.description || !formData.category) {
      showNotification('error', 'Judul, deskripsi, dan kategori wajib diisi.')
      return
    }

    try {
      if (currentProject) {
        // Edit Mode
        const res = await projectService.update(currentProject.id, formData)
        showNotification('success', 'Proyek berhasil diperbarui!')
      } else {
        // Add Mode
        const res = await projectService.create(formData)
        showNotification('success', 'Proyek berhasil ditambahkan!')
      }
      setIsModalOpen(false)
      fetchProjects()
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Gagal menyimpan proyek.')
    }
  }

  const openDeleteModal = (id) => {
    setDeleteTargetId(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteTargetId) return
    try {
      await projectService.delete(deleteTargetId)
      showNotification('success', 'Proyek berhasil dihapus!')
      fetchProjects()
    } catch (err) {
      showNotification('error', 'Gagal menghapus proyek.')
    } finally {
      setIsDeleteModalOpen(false)
      setDeleteTargetId(null)
    }
  }

  const handleImageUpload = async (e, projectId) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingProjectId(projectId)
    try {
      await projectService.uploadImage(projectId, file)
      showNotification('success', 'Gambar proyek berhasil diunggah!')
      fetchProjects()
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Gagal mengunggah gambar.')
    } finally {
      setUploadingProjectId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Manage Projects</h2>
          <p className="text-sm text-slate-400">Tambah, ubah, atau hapus portofolio proyek karya Anda.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-500"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      {/* Tampilan Loading */}
      {loading ? (
        <CardSkeleton count={6} />
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-[#0d1324] py-12 text-center">
          <FolderGit2 className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Belum ada proyek</h3>
          <p className="text-sm text-slate-400 mb-4">Mulai tambahkan proyek pertama Anda sekarang.</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-500"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </button>
        </div>
      ) : (
        /* Grid Proyek */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#0d1324] shadow-md transition-all hover:border-slate-700/50">
              
              {/* Thumbnail Area */}
              <div className="relative aspect-video w-full border-b border-slate-800 bg-[#0b0f19] flex items-center justify-center overflow-hidden">
                {project.imageUrl ? (
                  <img
                    src={getImageUrl(project.imageUrl)}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-600">
                    <ImageIcon className="h-10 w-10 mb-1" />
                    <span className="text-xs">No Thumbnail</span>
                  </div>
                )}

                {/* Upload Image Overlay Button */}
                <label className="absolute bottom-3 right-3 cursor-pointer rounded-lg bg-slate-900/90 p-2 text-slate-300 transition-all hover:bg-slate-800 hover:text-white backdrop-blur-sm">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, project.id)}
                    disabled={uploadingProjectId === project.id}
                  />
                  <Upload className={`h-4 w-4 ${uploadingProjectId === project.id ? 'animate-pulse' : ''}`} />
                </label>
              </div>

              {/* Detail Content */}
              <div className="flex-1 p-5 space-y-3">
                <div className="space-y-1">
                  <span className="inline-block rounded-md bg-primary-500/10 px-2.5 py-0.5 text-xs font-semibold text-primary-400">
                    {project.category}
                  </span>
                  <h3 className="text-lg font-bold text-white line-clamp-1">{project.title}</h3>
                </div>

                <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>

                {/* Tautan Proyek */}
                <div className="flex gap-4 pt-2 text-slate-400 text-xs font-semibold">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 transition-all hover:text-white"
                    >
                      <Github className="h-3.5 w-3.5" />
                      Repository
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 transition-all hover:text-white"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>

              {/* Panel Tombol Aksi */}
              <div className="flex border-t border-slate-800/80 bg-[#0b0f19]/35 px-5 py-3.5 gap-4">
                <button
                  onClick={() => openEditModal(project)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-800 bg-[#0b0f19] py-2 text-xs font-bold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(project.id)}
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
                {currentProject ? 'Edit Project Details' : 'Add New Project'}
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
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Project Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Contoh: Sistem E-Commerce CMS"
                  className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-all outline-none focus:border-primary-500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</label>
                  <input
                    type="text"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Contoh: Web App, Mobile"
                    className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-all outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detail penjelasan proyek, fitur utama, dan arsitektur..."
                  className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-all outline-none focus:border-primary-500 resize-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">GitHub URL (Optional)</label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username/project"
                    className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-all outline-none focus:border-primary-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Demo URL (Optional)</label>
                  <input
                    type="url"
                    name="demoUrl"
                    value={formData.demoUrl}
                    onChange={handleInputChange}
                    placeholder="https://projectdemo.com"
                    className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-all outline-none focus:border-primary-500"
                  />
                </div>
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
                  {currentProject ? 'Save Changes' : 'Create Project'}
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
        title="Hapus Proyek"
        message="Apakah Anda yakin ingin menghapus proyek ini?"
      />

    </div>
  )
}
