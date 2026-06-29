import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, FolderGit2, Award, CheckSquare, Mail, Github, 
  Linkedin, ExternalLink, Calendar, BookOpen, Layers, Cpu, 
  Database, Terminal, MessageSquare, Send, Check, Phone,
  AlertCircle, RefreshCw
} from 'lucide-react'
import api from '../../services/api'
import { contactService } from '../../services/contactService'
import { useToast } from '../../context/ToastContext'
import { getImageUrl } from '../../utils/url'
import SmartImage from '../../components/common/SmartImage'

export default function Home() {
  const [profile, setProfile] = useState(null)
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  
  const { showSuccess, showError } = useToast()

  const isMounted = useRef(true)
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const fetchPublicData = async () => {
    setLoading(true)
    setError(null)
    
    const maxAttempts = 6 // 1 initial + 5 retries
    const delayMs = 2000

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const [profileRes, skillsRes, projectsRes, certsRes] = await Promise.all([
          api.get('/api/profile'),
          api.get('/api/skills'),
          api.get('/api/projects'),
          api.get('/api/certificates')
        ])

        if (!isMounted.current) return

        if (profileRes && profileRes.data && profileRes.data.data) {
          setProfile(profileRes.data.data)
        }
        setSkills(skillsRes.data.data || [])
        setProjects(projectsRes.data.data || [])
        setCertificates(certsRes.data.data || [])
        
        setError(null)
        setLoading(false)
        return // Successful fetch, exit loop
      } catch (err) {
        if (!isMounted.current) return
        console.warn(`Gagal memuat data portofolio pada percobaan ke-${attempt}.`, err)
        
        if (attempt < maxAttempts) {
          await delay(delayMs)
        } else {
          setError(err)
          setLoading(false)
        }
      }
    }
  }

  useEffect(() => {
    isMounted.current = true
    fetchPublicData()
    return () => {
      isMounted.current = false
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showError('Semua kolom formulir wajib diisi.')
      return
    }

    setSubmitting(true)
    try {
      await contactService.submit(formData)
      showSuccess('Pesan Anda berhasil terkirim!')
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (err) {
      showError(err.response?.data?.message || 'Gagal mengirim pesan. Silakan coba kembali.')
    } finally {
      setSubmitting(false)
    }
  }

  // Dynamic skill categorization helper
  const categorizeSkill = (skill) => {
    if (skill.category) {
      const cat = skill.category.toLowerCase()
      if (cat === 'frontend') return 'Frontend'
      if (cat === 'backend') return 'Backend'
      if (cat === 'database') return 'Database'
      if (cat === 'tools') return 'Tools'
    }

    const n = skill.name.toLowerCase()
    if (
      n.includes('react') || n.includes('vue') || n.includes('html') || 
      n.includes('css') || n.includes('js') || n.includes('javascript') || 
      n.includes('tailwind') || n.includes('next') || n.includes('sass') || 
      n.includes('bootstrap') || n.includes('typescript') || 
      n.includes('angular') || n.includes('svelte') || n.includes('frontend')
    ) {
      return 'Frontend'
    }
    if (
      n.includes('go') || n.includes('golang') || n.includes('python') || 
      n.includes('node') || n.includes('express') || n.includes('php') || 
      n.includes('laravel') || n.includes('ruby') || n.includes('java') || 
      n.includes('spring') || n.includes('backend') || n.includes('c#') || 
      n.includes('.net') || n.includes('rest') || n.includes('graphql')
    ) {
      return 'Backend'
    }
    if (
      n.includes('sql') || n.includes('postgres') || n.includes('mysql') || 
      n.includes('sqlite') || n.includes('mongo') || n.includes('redis') || 
      n.includes('db') || n.includes('database') || n.includes('mariadb')
    ) {
      return 'Database'
    }
    return 'Tools'
  }

  const frontendSkills = skills.filter(s => categorizeSkill(s) === 'Frontend')
  const backendSkills = skills.filter(s => categorizeSkill(s) === 'Backend')
  const databaseSkills = skills.filter(s => categorizeSkill(s) === 'Database')
  const toolsSkills = skills.filter(s => categorizeSkill(s) === 'Tools')

  const getTechBadges = () => {
    if (profile && profile.techStack !== undefined && profile.techStack !== null) {
      return profile.techStack.split(',').map(s => s.trim()).filter(Boolean)
    }
    return ['React.js', 'Go / Golang', 'Tailwind CSS', 'PostgreSQL', 'Vite', 'Docker']
  }

  const techBadges = getTechBadges()

  if (loading) {
    return <HomeSkeleton />
  }

  if (error) {
    return <HomeError onRetry={fetchPublicData} />
  }

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative py-12 lg:py-20">
        {/* Glow meshes background */}
        <div className="absolute top-10 left-10 -z-10 h-72 w-72 rounded-full bg-primary-300/20 blur-[100px]" />
        <div className="absolute bottom-10 right-10 -z-10 h-80 w-80 rounded-full bg-indigo-300/25 blur-[110px]" />

        <div className="mx-auto max-w-6xl px-6 grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-block rounded-full bg-primary-100/50 px-4 py-1.5 text-xs font-semibold text-primary-700 border border-primary-200/30">
              ⚡ Available for Freelance & Full-time Roles
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
              Hi, I'm <span className="bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-black">
                {profile?.fullName || "Developer"}
              </span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              {profile?.title || "Professional Developer"} — specializing in constructing clean, scalable APIs, and building modern responsive frontends.
            </p>

            {/* Technology Badges Row */}
            {techBadges.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Main Tech Stack</span>
                <div className="flex flex-wrap gap-2">
                  {techBadges.map((badge) => (
                    <span key={badge} className="rounded-lg border border-sky-100 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Call to action buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/20"
              >
                View Portfolio
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#contact-form"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm"
              >
                Let's Talk
              </a>
            </div>
          </div>

          {/* Hero Right Avatar Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group">
              {/* Outer decorative glowing ring */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary-400 to-indigo-400 opacity-30 blur-lg transition duration-1000 group-hover:opacity-55" />
              
              <div className="relative aspect-square w-72 md:w-80 rounded-2xl overflow-hidden border border-sky-100 bg-white p-2 shadow-2xl">
                {profile?.avatarUrl ? (
                  <SmartImage
                    src={getImageUrl(profile.avatarUrl)}
                    alt={profile.fullName}
                    className="h-full w-full object-cover rounded-xl transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
                    <BookOpen className="h-16 w-16 mb-2" />
                    <span className="text-sm">No Photo Uploaded</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 pt-16 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-sky-100 bg-white/70 p-6 flex items-center gap-4 shadow-md backdrop-blur-md hover:shadow-lg transition">
            <div className="rounded-lg bg-blue-50 p-3 text-blue-500 shrink-0">
              <FolderGit2 className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <span className="text-2xl font-bold text-slate-800 tracking-tight">{projects.length}</span>
              <span className="block text-xs font-medium text-slate-500">Completed Projects</span>
            </div>
          </div>

          <div className="rounded-xl border border-sky-100 bg-white/70 p-6 flex items-center gap-4 shadow-md backdrop-blur-md hover:shadow-lg transition">
            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-500 shrink-0">
              <Cpu className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <span className="text-2xl font-bold text-slate-800 tracking-tight">{skills.length}</span>
              <span className="block text-xs font-medium text-slate-500">Skills Mastered</span>
            </div>
          </div>

          <div className="rounded-xl border border-sky-100 bg-white/70 p-6 flex items-center gap-4 shadow-md backdrop-blur-md hover:shadow-lg transition">
            <div className="rounded-lg bg-purple-50 p-3 text-purple-500 shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <span className="text-2xl font-bold text-slate-800 tracking-tight">{certificates.length}</span>
              <span className="block text-xs font-medium text-slate-500">Credentials & Certs</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About Section */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          
          {/* About Highlights Left */}
          <div className="lg:col-span-5 grid gap-4 grid-cols-2">
            <div className="col-span-2 rounded-xl border border-sky-100 bg-white/60 p-5 space-y-2 shadow-sm">
              <h4 className="text-xs font-bold text-primary-600 uppercase tracking-wider">Expertise</h4>
              <p className="text-sm text-slate-600 leading-relaxed">Full-stack web application development, optimizing API database response, and layout design.</p>
            </div>
            <div className="rounded-xl border border-sky-100 bg-white/60 p-5 space-y-1 shadow-sm">
              <h5 className="text-lg font-bold text-slate-800">100%</h5>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Client Rating</p>
            </div>
            <div className="rounded-xl border border-sky-100 bg-white/60 p-5 space-y-1 shadow-sm">
              <h5 className="text-lg font-bold text-slate-800">24/7</h5>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Clean Code Support</p>
            </div>
          </div>

          {/* About Bio Right */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-xs font-semibold text-primary-600 uppercase tracking-widest">ABOUT ME</h2>
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Biography</h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
              {profile?.bio || "Halo, saya adalah pengembang profesional yang fokus menciptakan solusi inovatif berbasis teknologi."}
            </p>

            {/* Social channels */}
            <div className="flex items-center gap-4 pt-2 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Connect online:</span>
              <div className="flex gap-3">
                {profile?.socialLinks?.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-slate-400 hover:text-slate-950 shadow-sm"
                  >
                    <Github className="h-4.5 w-4.5" />
                  </a>
                )}
                {profile?.socialLinks?.linkedin && (
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-slate-400 hover:text-slate-950 shadow-sm"
                  >
                    <Linkedin className="h-4.5 w-4.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Skills Section */}
      <section className="mx-auto max-w-6xl px-6 space-y-8 py-8">
        <div className="text-center space-y-1.5">
          <h2 className="text-xs font-semibold text-primary-600 uppercase tracking-widest">SKILLS</h2>
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Technical Stack</h3>
        </div>

        {skills.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white/50 py-10 text-center text-slate-500 text-sm">
            Belum ada data keahlian.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Category 1: Frontend */}
            <div className="rounded-xl border border-sky-100 bg-white/80 p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Layers className="h-5 w-5 text-blue-500 shrink-0" />
                <h4 className="font-bold text-slate-800 text-sm">Frontend Development</h4>
              </div>
              <div className="space-y-3">
                {frontendSkills.length === 0 ? (
                  <span className="text-xs text-slate-500">No skills specified</span>
                ) : (
                  frontendSkills.map(skill => (
                    <div key={skill.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-600">{skill.name}</span>
                        <span className="text-primary-600">{skill.percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${skill.percentage}%` }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Category 2: Backend */}
            <div className="rounded-xl border border-sky-100 bg-white/80 p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Cpu className="h-5 w-5 text-emerald-600 shrink-0" />
                <h4 className="font-bold text-slate-800 text-sm">Backend Development</h4>
              </div>
              <div className="space-y-3">
                {backendSkills.length === 0 ? (
                  <span className="text-xs text-slate-400">No skills specified</span>
                ) : (
                  backendSkills.map(skill => (
                    <div key={skill.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-600">{skill.name}</span>
                        <span className="text-primary-600">{skill.percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${skill.percentage}%` }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Category 3: Database */}
            <div className="rounded-xl border border-sky-100 bg-white/80 p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Database className="h-5 w-5 text-purple-600 shrink-0" />
                <h4 className="font-bold text-slate-800 text-sm">Database & Storage</h4>
              </div>
              <div className="space-y-3">
                {databaseSkills.length === 0 ? (
                  <span className="text-xs text-slate-400">No skills specified</span>
                ) : (
                  databaseSkills.map(skill => (
                    <div key={skill.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-600">{skill.name}</span>
                        <span className="text-primary-600">{skill.percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-purple-500" style={{ width: `${skill.percentage}%` }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Category 4: Tools */}
            <div className="rounded-xl border border-sky-100 bg-white/80 p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Terminal className="h-5 w-5 text-amber-600 shrink-0" />
                <h4 className="font-bold text-slate-800 text-sm">DevOps & Tools</h4>
              </div>
              <div className="space-y-3">
                {toolsSkills.length === 0 ? (
                  <span className="text-xs text-slate-400">No skills specified</span>
                ) : (
                  toolsSkills.map(skill => (
                    <div key={skill.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-600">{skill.name}</span>
                        <span className="text-primary-600">{skill.percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-amber-500" style={{ width: `${skill.percentage}%` }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}
      </section>

      {/* 4. Projects Section */}
      <section className="mx-auto max-w-6xl px-6 space-y-8 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1.5">
            <h2 className="text-xs font-semibold text-primary-600 uppercase tracking-widest">PORTFOLIO</h2>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Recent Projects</h3>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition hover:text-primary-500"
          >
            All Projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white/50 py-16 text-center">
            <FolderGit2 className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">Belum ada proyek</h3>
            <p className="text-xs text-slate-500">Silakan tambahkan proyek di panel admin.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="flex flex-col overflow-hidden rounded-xl border border-sky-100 bg-white/70 shadow-md transition hover:border-sky-200 hover:shadow-lg group">
                <div className="relative aspect-video w-full border-b border-sky-100/60 bg-sky-50/50 overflow-hidden">
                  {project.imageUrl ? (
                    <SmartImage
                      src={getImageUrl(project.imageUrl)}
                      alt={project.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <FolderGit2 className="h-10 w-10" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 rounded-md bg-white/90 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 tracking-wider uppercase shadow-sm border border-sky-100">
                    {project.category}
                  </span>
                </div>
                
                <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 text-lg leading-snug line-clamp-1">{project.title}</h4>
                    <p className="text-xs text-slate-650 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="flex gap-4 pt-1 text-slate-500 text-xs font-semibold">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-slate-800 transition">
                        <Github className="h-4 w-4" /> Code
                      </a>
                    )}
                    {project.demoUrl && (
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-slate-800 transition">
                        <ExternalLink className="h-4 w-4" /> Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Certificates Section */}
      <section className="mx-auto max-w-6xl px-6 space-y-8 py-8">
        <div className="text-center space-y-1.5">
          <h2 className="text-xs font-semibold text-primary-600 uppercase tracking-widest">CREDENTIALS</h2>
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Certifications</h3>
        </div>

        {certificates.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white/50 py-12 text-center text-slate-500 text-sm">
            <Award className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">Belum ada sertifikat</h3>
            <p className="text-xs text-slate-500">Piagam sertifikasi Anda belum diunggah.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certificates.slice(0, 3).map((cert) => (
              <div key={cert.id} className="flex flex-col border border-sky-100 bg-white/70 rounded-xl p-5 shadow-md transition hover:border-sky-200 hover:shadow-lg group">
                
                {/* Certificate Image Frame / Icon */}
                <div className="aspect-video w-full rounded-lg bg-sky-50/50 border border-sky-100 flex items-center justify-center overflow-hidden mb-4 relative">
                  {cert.imageUrl ? (
                    <SmartImage
                      src={getImageUrl(cert.imageUrl)}
                      alt={cert.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-103"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <Award className="h-10 w-10 mb-1" />
                      <span className="text-[10px]">No Certificate File</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 leading-snug line-clamp-2 text-sm">{cert.name}</h4>
                    <p className="text-xs text-slate-500 font-semibold">{cert.organization}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Issued {new Date(cert.issueDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. Contact Section */}
      <section id="contact-form" className="mx-auto max-w-6xl px-6 space-y-8 py-8 border-t border-slate-200">
        <div className="space-y-1.5">
          <h2 className="text-xs font-semibold text-primary-600 uppercase tracking-widest">GET IN TOUCH</h2>
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Contact Me</h3>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 items-start">
          
          {/* Quick contact info cards (Left) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Email */}
            {profile?.socialLinks?.email && (
              <a 
                href={`mailto:${profile.socialLinks.email}`}
                className="flex gap-4 p-4 rounded-xl border border-sky-100 bg-white/70 hover:border-sky-200 shadow-sm transition group"
              >
                <div className="rounded-lg bg-primary-50 p-3 text-primary-600 shrink-0 group-hover:bg-primary-100/50">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</span>
                  <span className="text-sm text-slate-800 font-semibold break-all">{profile.socialLinks.email}</span>
                </div>
              </a>
            )}

            {/* WhatsApp */}
            {profile?.socialLinks?.whatsapp && (
              <a 
                href={`https://wa.me/${profile.socialLinks.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-4 p-4 rounded-xl border border-sky-100 bg-white/70 hover:border-sky-200 shadow-sm transition group"
              >
                <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600 shrink-0 group-hover:bg-emerald-100/50">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">WhatsApp</span>
                  <span className="text-sm text-slate-800 font-semibold">+{profile.socialLinks.whatsapp}</span>
                </div>
              </a>
            )}

            {/* LinkedIn */}
            {profile?.socialLinks?.linkedin && (
              <a 
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-4 p-4 rounded-xl border border-sky-100 bg-white/70 hover:border-sky-200 shadow-sm transition group"
              >
                <div className="rounded-lg bg-blue-50 p-3 text-blue-600 shrink-0 group-hover:bg-blue-100/50">
                  <Linkedin className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">LinkedIn Profile</span>
                  <span className="text-sm text-slate-800 font-semibold line-clamp-1">{profile.socialLinks.linkedin.replace('https://', '')}</span>
                </div>
              </a>
            )}

          </div>

          {/* Contact Message Form (Right) */}
          <form onSubmit={handleContactSubmit} className="lg:col-span-7 rounded-xl border border-sky-100 bg-white/80 p-6 md:p-8 space-y-6 shadow-lg backdrop-blur-md">
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition focus:border-primary-400 focus:ring-1 focus:ring-primary-100 focus:outline-none"
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition focus:border-primary-400 focus:ring-1 focus:ring-primary-100 focus:outline-none"
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Collaboration Opportunity"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition focus:border-primary-400 focus:ring-1 focus:ring-primary-100 focus:outline-none"
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                placeholder="Tell me about your project or inquiry..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition focus:border-primary-400 focus:ring-1 focus:ring-primary-100 focus:outline-none resize-none"
                disabled={submitting}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/20 disabled:opacity-50"
            >
              {submitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </button>

          </form>

        </div>
      </section>

    </div>
  )
}

// Skeleton screen that overlays the layout for a seamless experience
function HomeSkeleton() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-gradient-to-b from-sky-100 via-sky-50 to-white overflow-y-auto pb-20">
      {/* Navbar Skeleton */}
      <header className="sticky top-0 z-50 border-b border-sky-100/60 bg-white/75 py-4 backdrop-blur-lg shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <div className="h-6 w-32 rounded bg-slate-350 animate-pulse bg-gradient-to-r from-slate-200 to-slate-300" />
          <div className="hidden items-center gap-8 md:flex">
            <div className="h-4 w-12 rounded bg-slate-200 animate-pulse" />
            <div className="h-4 w-16 rounded bg-slate-200 animate-pulse" />
            <div className="h-4 w-14 rounded bg-slate-200 animate-pulse" />
          </div>
          <div className="hidden md:block">
            <div className="h-8 w-28 rounded-lg bg-slate-200 animate-pulse" />
          </div>
          <div className="h-8 w-8 rounded-lg bg-slate-200 animate-pulse md:hidden" />
        </div>
      </header>

      {/* Main Skeleton Content */}
      <div className="space-y-20 flex-1">
        {/* 1. Hero Section Skeleton */}
        <section className="relative py-12 lg:py-20">
          {/* Glow meshes background */}
          <div className="absolute top-10 left-10 -z-10 h-72 w-72 rounded-full bg-primary-300/20 blur-[100px]" />
          <div className="absolute bottom-10 right-10 -z-10 h-80 w-80 rounded-full bg-indigo-300/25 blur-[110px]" />

          <div className="mx-auto max-w-6xl px-6 grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Hero Left Content Skeleton */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Available Badge */}
              <div className="h-6 w-64 rounded-full bg-slate-200 animate-pulse" />
              
              {/* Judul Skeleton */}
              <div className="space-y-3">
                <div className="h-10 w-3/4 rounded-lg bg-slate-200 animate-pulse" />
                <div className="h-10 w-1/2 rounded-lg bg-slate-200 animate-pulse" />
              </div>
              
              {/* Subtitle Skeleton */}
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full rounded bg-slate-200 animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-slate-200 animate-pulse" />
              </div>

              {/* Tech Stack Skeleton */}
              <div className="space-y-2 pt-2">
                <div className="h-3 w-28 rounded bg-slate-200 animate-pulse" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-6 w-20 rounded-lg bg-slate-200 animate-pulse" />
                  ))}
                </div>
              </div>

              {/* Button Skeleton */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="h-12 w-36 rounded-xl bg-slate-300 animate-pulse" />
                <div className="h-12 w-32 rounded-xl bg-slate-200 animate-pulse" />
              </div>
            </div>

            {/* Avatar/Profile Image Skeleton */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative aspect-square w-72 md:w-80 rounded-2xl border border-sky-100 bg-white p-2 shadow-2xl">
                <div className="h-full w-full rounded-xl bg-slate-200 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Stats Bar Skeleton */}
          <div className="mx-auto max-w-6xl px-6 pt-16 grid gap-6 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-sky-100 bg-white/70 p-6 flex items-center gap-4 shadow-md backdrop-blur-md">
                <div className="rounded-lg bg-slate-200 h-12 w-12 shrink-0 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-6 w-12 rounded bg-slate-300 animate-pulse" />
                  <div className="h-3 w-24 rounded bg-slate-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. About Section Skeleton */}
        <section className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            {/* About Highlights Left */}
            <div className="lg:col-span-5 grid gap-4 grid-cols-2">
              <div className="col-span-2 rounded-xl border border-sky-100 bg-white/60 p-5 space-y-3 shadow-sm">
                <div className="h-3 w-16 rounded bg-slate-200 animate-pulse" />
                <div className="h-4 w-full rounded bg-slate-200 animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-slate-200 animate-pulse" />
              </div>
              <div className="rounded-xl border border-sky-100 bg-white/60 p-5 space-y-2 shadow-sm">
                <div className="h-6 w-12 rounded bg-slate-300 animate-pulse" />
                <div className="h-3 w-16 rounded bg-slate-200 animate-pulse" />
              </div>
              <div className="rounded-xl border border-sky-100 bg-white/60 p-5 space-y-2 shadow-sm">
                <div className="h-6 w-12 rounded bg-slate-300 animate-pulse" />
                <div className="h-3 w-24 rounded bg-slate-200 animate-pulse" />
              </div>
            </div>

            {/* About Bio Right */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="h-3 w-20 rounded bg-slate-200 animate-pulse" />
                <div className="h-8 w-44 rounded bg-slate-300 animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-full rounded bg-slate-200 animate-pulse" />
                <div className="h-4 w-full rounded bg-slate-200 animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-slate-200 animate-pulse" />
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                <div className="h-3 w-28 rounded bg-slate-200 animate-pulse" />
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-200 animate-pulse" />
                  <div className="h-8 w-8 rounded-lg bg-slate-200 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Skills Section Skeleton */}
        <section className="mx-auto max-w-6xl px-6 space-y-8 py-8">
          <div className="flex flex-col items-center space-y-2">
            <div className="h-3 w-16 rounded bg-slate-200 animate-pulse" />
            <div className="h-8 w-48 rounded bg-slate-300 animate-pulse" />
          </div>

          {/* Skill Columns */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-sky-100 bg-white/80 p-5 space-y-5 shadow-sm">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="h-5 w-5 rounded bg-slate-200 animate-pulse shrink-0" />
                  <div className="h-4 w-28 rounded bg-slate-300 animate-pulse" />
                </div>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="h-3 w-16 rounded bg-slate-200 animate-pulse" />
                        <div className="h-3 w-8 rounded bg-slate-200 animate-pulse" />
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-slate-200 animate-pulse" style={{ width: '60%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Projects Section Skeleton */}
        <section className="mx-auto max-w-6xl px-6 space-y-8 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-slate-200 animate-pulse" />
              <div className="h-8 w-44 rounded bg-slate-300 animate-pulse" />
            </div>
            <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
          </div>

          {/* Project Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col overflow-hidden rounded-xl border border-sky-100 bg-white/70 shadow-md space-y-4 pb-5">
                {/* Image aspect-video */}
                <div className="relative aspect-video w-full bg-slate-200 animate-pulse" />
                <div className="px-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-5 w-3/4 rounded bg-slate-300 animate-pulse" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-full rounded bg-slate-200 animate-pulse" />
                      <div className="h-3 w-5/6 rounded bg-slate-200 animate-pulse" />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-3 border-t border-slate-100">
                    <div className="h-4 w-12 rounded bg-slate-200 animate-pulse" />
                    <div className="h-4 w-12 rounded bg-slate-200 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Certificates Section Skeleton */}
        <section className="mx-auto max-w-6xl px-6 space-y-8 py-8">
          <div className="flex flex-col items-center space-y-2">
            <div className="h-3 w-20 rounded bg-slate-200 animate-pulse" />
            <div className="h-8 w-48 rounded bg-slate-300 animate-pulse" />
          </div>

          {/* Certificate Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col border border-sky-100 bg-white/70 rounded-xl p-5 shadow-md space-y-4">
                <div className="aspect-video w-full rounded-lg bg-slate-200 animate-pulse" />
                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="h-4 w-5/6 rounded bg-slate-300 animate-pulse" />
                    <div className="h-3 w-1/2 rounded bg-slate-200 animate-pulse" />
                  </div>
                  <div className="h-3 w-28 rounded bg-slate-200 animate-pulse pt-2 border-t border-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Contact Section Skeleton */}
        <section className="mx-auto max-w-6xl px-6 space-y-8 py-8 border-t border-slate-200">
          <div className="space-y-2">
            <div className="h-3 w-24 rounded bg-slate-200 animate-pulse" />
            <div className="h-8 w-40 rounded bg-slate-300 animate-pulse" />
          </div>

          <div className="grid gap-12 lg:grid-cols-12 items-start">
            {/* Quick contact info cards (Left) */}
            <div className="lg:col-span-5 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-sky-100 bg-white/70 shadow-sm">
                  <div className="rounded-lg bg-slate-200 animate-pulse h-11 w-11 shrink-0" />
                  <div className="space-y-2 flex-1 pt-1">
                    <div className="h-3.5 w-20 rounded bg-slate-200 animate-pulse" />
                    <div className="h-4 w-32 rounded bg-slate-300 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Message Form (Right) */}
            <div className="lg:col-span-7 rounded-xl border border-sky-100 bg-white/85 p-6 md:p-8 space-y-6 shadow-lg">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="h-3 w-20 rounded bg-slate-200 animate-pulse" />
                  <div className="h-11 w-full rounded-xl bg-slate-100 border border-slate-200/60" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-24 rounded bg-slate-200 animate-pulse" />
                  <div className="h-11 w-full rounded-xl bg-slate-100 border border-slate-200/60" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-16 rounded bg-slate-200 animate-pulse" />
                <div className="h-11 w-full rounded-xl bg-slate-100 border border-slate-200/60" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-16 rounded bg-slate-200 animate-pulse" />
                <div className="h-36 w-full rounded-xl bg-slate-100 border border-slate-200/60 animate-pulse" />
              </div>
              <div className="h-12 w-full rounded-xl bg-slate-200 animate-pulse" />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

// Error screen that displays if any request fails
function HomeError({ onRetry }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-b from-sky-100 via-sky-50 to-white px-6">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-sky-100 bg-white shadow-xl backdrop-blur-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 animate-pulse">
          <AlertCircle className="h-10 w-10 text-red-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-800">Gagal Memuat Data</h2>
          <p className="text-sm text-slate-650 leading-relaxed">
            Gagal memuat data portofolio. Silakan periksa koneksi internet Anda atau coba beberapa saat lagi.
          </p>
        </div>
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/20 active:scale-95"
        >
          <RefreshCw className="h-4 w-4 animate-spin" />
          Coba Lagi
        </button>
      </div>
    </div>
  )
}
