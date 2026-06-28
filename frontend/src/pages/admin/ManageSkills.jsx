import React, { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Award } from 'lucide-react'
import { skillService } from '../../services/skillService'
import { useToast } from '../../context/ToastContext'
import { CardSkeleton } from '../../components/common/Skeleton'
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal'

export default function ManageSkills() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentSkill, setCurrentSkill] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState(null)
  
  // State Form Input
  const [formData, setFormData] = useState({
    name: '',
    percentage: 80,
    category: 'Frontend'
  })
  
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    setLoading(true)
    try {
      const res = await skillService.getAll()
      setSkills(res.data || [])
    } catch (err) {
      showNotification('error', 'Gagal mengambil data keahlian.')
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
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'percentage' ? parseInt(value) || 0 : value 
    }))
  }

  const openAddModal = () => {
    setCurrentSkill(null)
    setFormData({
      name: '',
      percentage: 80,
      category: 'Frontend'
    })
    setIsModalOpen(true)
  }

  const openEditModal = (skill) => {
    setCurrentSkill(skill)
    setFormData({
      name: skill.name,
      percentage: skill.percentage,
      category: skill.category || 'Frontend'
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name) {
      showNotification('error', 'Nama skill wajib diisi.')
      return
    }

    if (formData.percentage < 0 || formData.percentage > 100) {
      showNotification('error', 'Persentase kemahiran harus di antara 0 dan 100.')
      return
    }

    try {
      if (currentSkill) {
        // Edit Mode
        await skillService.update(currentSkill.id, formData)
        showNotification('success', 'Skill berhasil diperbarui!')
      } else {
        // Add Mode
        await skillService.create(formData)
        showNotification('success', 'Skill berhasil ditambahkan!')
      }
      setIsModalOpen(false)
      fetchSkills()
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Gagal menyimpan skill.')
    }
  }

  const openDeleteModal = (id) => {
    setDeleteTargetId(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteTargetId) return
    try {
      await skillService.delete(deleteTargetId)
      showNotification('success', 'Skill berhasil dihapus!')
      fetchSkills()
    } catch (err) {
      showNotification('error', 'Gagal menghapus skill.')
    } finally {
      setIsDeleteModalOpen(false)
      setDeleteTargetId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Manage Skills</h2>
          <p className="text-sm text-slate-400">Tambah, edit, atau hapus daftar keahlian teknologi Anda.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-500"
        >
          <Plus className="h-4 w-4" />
          Add Skill
        </button>
      </div>

      {/* Tampilan Loading */}
      {loading ? (
        <CardSkeleton count={6} />
      ) : skills.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-[#0d1324] py-12 text-center">
          <Award className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Belum ada skill</h3>
          <p className="text-sm text-slate-400 mb-4">Mulai tambahkan keahlian teknis Anda sekarang.</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-500"
          >
            <Plus className="h-4 w-4" />
            Add Skill
          </button>
        </div>
      ) : (
        /* Grid Keahlian */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <div key={skill.id} className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#0d1324] p-5 shadow-md transition-all hover:border-slate-700/50 space-y-4">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white leading-none">{skill.name}</h3>
                    <span className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {skill.category || 'Frontend'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-primary-400 bg-primary-500/10 px-2.5 py-0.5 rounded-md">
                    {skill.percentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full rounded-full bg-[#0b0f19] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-indigo-500"
                    style={{ width: `${skill.percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Panel Tombol Aksi */}
              <div className="flex pt-2 gap-4 border-t border-slate-850">
                <button
                  onClick={() => openEditModal(skill)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-800 bg-[#0b0f19] py-2 text-xs font-bold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(skill.id)}
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
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-885 bg-[#0d1324] shadow-2xl">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <h3 className="text-lg font-bold text-white">
                {currentSkill ? 'Edit Skill Details' : 'Add New Skill'}
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
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skill Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: ReactJS, Golang, Docker"
                  className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-all outline-none focus:border-primary-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skill Category</label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-800 bg-[#0b0f19] px-4 py-2.5 text-sm text-white transition-all outline-none focus:border-primary-500"
                >
                  <option value="Frontend">Frontend Development</option>
                  <option value="Backend">Backend Development</option>
                  <option value="Database">Database & Caching</option>
                  <option value="Tools">Tools & DevOps</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Proficiency ({formData.percentage}%)</label>
                </div>
                <input
                  type="range"
                  name="percentage"
                  min="0"
                  max="100"
                  value={formData.percentage}
                  onChange={handleInputChange}
                  className="w-full h-2 rounded-lg bg-[#0b0f19] accent-primary-500 cursor-pointer appearance-none outline-none focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  <span>Beginner (0%)</span>
                  <span>Expert (100%)</span>
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
                  {currentSkill ? 'Save Changes' : 'Create Skill'}
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
        title="Hapus Skill"
        message="Apakah Anda yakin ingin menghapus skill ini?"
      />

    </div>
  )
}
