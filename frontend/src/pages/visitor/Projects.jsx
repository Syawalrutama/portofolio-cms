import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FolderGit2, Github, ExternalLink, ArrowRight, Search } from 'lucide-react'
import api from '../../services/api'
import { getImageUrl } from '../../utils/url'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/api/projects')
        const data = res.data.data || []
        setProjects(data)
        setFilteredProjects(data)

        // Dapatkan semua kategori unik
        const uniqueCategories = ['All', ...new Set(data.map(p => p.category))]
        setCategories(uniqueCategories)
      } catch (err) {
        console.error("Gagal memuat proyek", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Efek filter pencarian dan kategori
  useEffect(() => {
    let result = projects

    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory)
    }

    if (searchQuery.trim() !== '') {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProjects(result)
  }, [activeCategory, searchQuery, projects])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-sky-50/50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-12">
      
      {/* Header Halaman */}
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">My Projects</h2>
        <p className="text-sm text-slate-500">Jelajahi portofolio proyek perangkat lunak dan desain karya saya.</p>
      </div>

      {/* Kontrol Filter & Cari */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6">
        
        {/* Tab Kategori */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                activeCategory === category
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Input Cari */}
        <div className="relative w-full max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Cari proyek..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-primary-400"
          />
        </div>

      </div>

      {/* Grid Proyek */}
      {filteredProjects.length === 0 ? (
        <div className="py-20 text-center rounded-xl border border-sky-100 bg-white/50">
          <FolderGit2 className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">Proyek tidak ditemukan</h3>
          <p className="text-sm text-slate-500">Coba ubah kata kunci pencarian atau filter kategori Anda.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div key={project.id} className="flex flex-col overflow-hidden rounded-xl border border-sky-100 bg-white/70 shadow-md transition-all hover:border-sky-200 hover:shadow-lg">
              
              {/* Thumbnail */}
              <div className="aspect-video w-full border-b border-sky-100/60 bg-sky-50/50 overflow-hidden">
                {project.imageUrl ? (
                  <img
                    src={getImageUrl(project.imageUrl)}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <FolderGit2 className="h-12 w-12" />
                  </div>
                )}
              </div>

              {/* Detail Content */}
              <div className="flex-1 p-5 space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-primary-600 uppercase tracking-wider">{project.category}</span>
                  <h4 className="font-bold text-slate-800 text-lg line-clamp-1">{project.title}</h4>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex gap-4 pt-1 text-slate-500 text-xs font-semibold">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-slate-800 transition-all">
                      <Github className="h-3.5 w-3.5" /> Code
                    </a>
                  )}
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-slate-800 transition-all">
                      <ExternalLink className="h-3.5 w-3.5" /> Demo
                    </a>
                  )}
                </div>
              </div>

              {/* Link detail */}
              <div className="border-t border-slate-100 bg-slate-50/40 px-5 py-3 flex justify-end">
                <Link
                  to={`/projects/${project.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-500"
                >
                  Detail Info
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}
