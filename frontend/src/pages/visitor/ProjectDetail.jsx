import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FolderGit2, Github, ExternalLink, ArrowLeft } from 'lucide-react'
import api from '../../services/api'

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        const res = await api.get(`/api/projects/${id}`)
        setProject(res.data.data)
      } catch (err) {
        console.error("Gagal memuat detail proyek", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjectDetail()
  }, [id])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-sky-50/50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center space-y-4">
        <FolderGit2 className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="text-xl font-bold text-slate-800">Proyek tidak ditemukan</h3>
        <p className="text-sm text-slate-500">Proyek yang Anda cari mungkin telah dihapus oleh admin.</p>
        <Link to="/projects" className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-500">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Galeri
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-8">
      
      {/* Back Button */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-all hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      <div className="space-y-6">
        {/* Banner Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-sky-100 bg-white p-2 shadow-md">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="h-full w-full object-cover rounded-xl"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              <FolderGit2 className="h-20 w-20" />
            </div>
          )}
        </div>

        {/* Title, Category */}
        <div className="space-y-2 border-b border-slate-200 pb-4">
          <span className="inline-block rounded-md bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700 border border-primary-100/50">
            {project.category}
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl leading-snug">{project.title}</h2>
        </div>

        {/* Description Body */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Project Description</h3>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
            {project.description}
          </p>
        </div>

        {/* External Action Links */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 shadow-sm"
            >
              <Github className="h-4 w-4" />
              Source Code (GitHub)
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-xs font-bold text-white transition-all hover:bg-primary-500 shadow-md hover:shadow-lg"
            >
              <ExternalLink className="h-4 w-4" />
              Live Demo Website
            </a>
          )}
        </div>

      </div>

    </div>
  )
}
