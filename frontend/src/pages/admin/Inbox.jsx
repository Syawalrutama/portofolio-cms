import React, { useState, useEffect } from 'react'
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal'
import { Mail, MailOpen, Trash2, Calendar, User, Eye, EyeOff, Info, CheckSquare } from 'lucide-react'
import { contactService } from '../../services/contactService'
import { useToast } from '../../context/ToastContext'
import { ListSkeleton } from '../../components/common/Skeleton'

export default function Inbox() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const res = await contactService.getAllAdmin()
      setMessages(res.data || [])
    } catch (err) {
      showNotification('error', 'Gagal mengambil data pesan masuk.')
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

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleMarkRead = async (e, id) => {
    e.stopPropagation() // Prevent expanding card when clicking mark read
    try {
      await contactService.markRead(id)
      showNotification('success', 'Pesan ditandai sebagai terbaca!')
      
      // Update local state directly
      setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m))
    } catch (err) {
      showNotification('error', 'Gagal memperbarui status pesan.')
    }
  }

  const openDeleteModal = (e, id) => {
    e.stopPropagation(); // Prevent expanding card
    setDeleteTargetId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await contactService.delete(deleteTargetId);
      showNotification('success', 'Pesan berhasil dihapus!');
      setMessages(prev => prev.filter(m => m.id !== deleteTargetId));
    } catch (err) {
      showNotification('error', 'Gagal menghapus pesan.');
    } finally {
      setDeleteModalOpen(false);
      setDeleteTargetId(null);
    }
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (e) {
      return dateString
    }
  }

  const totalMessages = messages.length
  const unreadMessages = messages.filter(m => !m.isRead).length

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Halaman */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-900 pb-5">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Inbox Messages</h2>
          <p className="text-sm text-slate-400">Baca dan kelola pesan saran/pertanyaan masuk dari visitor web.</p>
        </div>
        
        {/* Stats Indicator */}
        <div className="flex gap-4">
          <div className="rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-2.5 text-center min-w-[100px]">
            <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total</span>
            <span className="text-lg font-bold text-white">{totalMessages}</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-2.5 text-center min-w-[100px] relative">
            <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Unread</span>
            <span className="text-lg font-bold text-white">{unreadMessages}</span>
            {unreadMessages > 0 && (
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
            )}
          </div>
        </div>
      </div>

      {/* Tampilan Loading */}
      {loading ? (
        <ListSkeleton count={4} />
      ) : messages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-[#0d1324] py-16 text-center">
          <Mail className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Kotak masuk kosong</h3>
          <p className="text-sm text-slate-400">Belum ada pesan masuk dari pengunjung situs Anda saat ini.</p>
        </div>
      ) : (
        /* List Pesan Masuk */
        <div className="space-y-4">
          {messages.map((msg) => {
            const isExpanded = expandedId === msg.id
            return (
              <div 
                key={msg.id} 
                onClick={() => toggleExpand(msg.id)}
                className={`group rounded-xl border transition-all cursor-pointer overflow-hidden bg-[#0d1324] ${
                  msg.isRead 
                    ? 'border-slate-900 hover:border-slate-800' 
                    : 'border-amber-500/25 shadow-md shadow-amber-500/5 hover:border-amber-500/40 bg-[#0d1324]/85'
                }`}
              >
                {/* Header Summary */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex gap-4 items-start md:items-center flex-1 min-w-0">
                    {/* Read / Unread Icon Indicator */}
                    <div className={`rounded-lg p-2.5 border h-fit w-fit flex-shrink-0 ${
                      msg.isRead 
                        ? 'bg-slate-950 border-slate-850 text-slate-500' 
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                      {msg.isRead ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className={`text-sm font-bold truncate ${msg.isRead ? 'text-slate-300' : 'text-white'}`}>
                          {msg.subject}
                        </h3>
                        {!msg.isRead && (
                          <span className="inline-block rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                            New
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" /> {msg.name} ({msg.email})
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {formatDateDisplay(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Panel */}
                  <div className="flex items-center gap-3 self-end md:self-auto flex-shrink-0">
                    {!msg.isRead && (
                      <button
                        onClick={(e) => handleMarkRead(e, msg.id)}
                        title="Tandai sudah dibaca"
                        className="flex items-center justify-center p-2 rounded-lg border border-slate-800 bg-[#0b0f19] text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => openDeleteModal(e, msg.id)}
                      title="Hapus pesan"
                      className="flex items-center justify-center p-2 rounded-lg border border-rose-950/20 bg-[#0b0f19] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Expandable Body */}
                {isExpanded && (
                  <div className="border-t border-slate-900 bg-[#0b0f19]/40 p-5 md:px-8 space-y-4 animate-fadeIn">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Message Content</span>
                      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                    
                    {/* Mark read helper banner inside details */}
                    {!msg.isRead && (
                      <div className="flex justify-end pt-2 border-t border-slate-900">
                        <button
                          onClick={(e) => handleMarkRead(e, msg.id)}
                          className="flex items-center gap-1.5 rounded-lg bg-[#0b0f19] border border-slate-850 px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-slate-800"
                        >
                          <Eye className="h-3.5 w-3.5 text-slate-400" />
                          Mark as Read
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>
            )
          })}
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Pesan"
        message="Apakah Anda yakin ingin menghapus pesan ini?"
      />

    </div>
  )
}
