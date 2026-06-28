import React, { useState, useEffect } from 'react'
import { FolderGit2, Award, CheckSquare, Mail, Terminal } from 'lucide-react'
import StatCard from '../../components/admin/StatCard'
import { dashboardService } from '../../services/dashboardService'
import { StatCardSkeleton, SkeletonPulse } from '../../components/common/Skeleton'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const res = await dashboardService.getStats()
      if (res.data) {
        setStats(res.data)
      }
    } catch (err) {
      console.error("Gagal memuat dashboard data", err)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Baru saja'
    if (diffMins < 60) return `${diffMins} menit lalu`
    if (diffHours < 24) return `${diffHours} jam lalu`
    if (diffDays < 7) return `${diffDays} hari lalu`

    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'project':
        return FolderGit2
      case 'skill':
        return CheckSquare
      case 'certificate':
        return Award
      case 'contact':
        return Mail
      default:
        return Terminal
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'project':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'skill':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'certificate':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      case 'contact':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Halaman */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Dashboard Overview</h2>
          <p className="text-sm text-slate-400">Ikhtisar total konten serta log aktivitas terkini dari sistem portofolio Anda.</p>
        </div>

        {/* Widget Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        {/* Konten Log & Aktivitas */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#0d1324] p-6 shadow-md space-y-6">
            <div className="space-y-2 pb-4 border-b border-slate-800">
              <SkeletonPulse className="h-6 w-32" />
              <SkeletonPulse className="h-3 w-56" />
            </div>
            <div className="space-y-4 pl-4 border-l-2 border-slate-800/40">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2 py-1">
                  <SkeletonPulse className="h-4 w-1/3" />
                  <SkeletonPulse className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0d1324] p-6 shadow-md space-y-6">
            <div className="space-y-2 pb-4 border-b border-slate-800">
              <SkeletonPulse className="h-6 w-24" />
              <SkeletonPulse className="h-3 w-32" />
            </div>
            <div className="space-y-4">
              <SkeletonPulse className="h-20 w-full" />
              <SkeletonPulse className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="space-y-6">
      
      {/* Header Halaman */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Dashboard Overview</h2>
        <p className="text-sm text-slate-400">Ikhtisar total konten serta log aktivitas terkini dari sistem portofolio Anda.</p>
      </div>

      {/* Widget Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={stats?.totalProjects || 0}
          icon={FolderGit2}
          colorClass="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          title="Total Certificates"
          value={stats?.totalCertificates || 0}
          icon={Award}
          colorClass="bg-purple-500/10 text-purple-400"
        />
        <StatCard
          title="Total Skills"
          value={stats?.totalSkills || 0}
          icon={CheckSquare}
          colorClass="bg-emerald-500/10 text-emerald-400"
        />
        <StatCard
          title="Unread Messages"
          value={stats?.unreadMessages || 0}
          icon={Mail}
          colorClass="bg-amber-500/10 text-amber-400"
        />
      </div>

      {/* Konten Log & Aktivitas */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Kolom Log Aktivitas Terkini */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#0d1324] p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-850 pb-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Recent Activity</h3>
              <p className="text-xs text-slate-500">Daftar pembaruan konten portofolio Anda secara kronologis.</p>
            </div>
          </div>

          {!stats?.recentActivities || stats.recentActivities.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              Belum ada riwayat aktivitas.
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-850 ml-4 pl-6 space-y-6">
              {stats.recentActivities.map((act) => {
                const IconComponent = getActivityIcon(act.type)
                const colorClass = getActivityColor(act.type)
                return (
                  <div key={act.id} className="relative group">
                    {/* Bullet Indicator Icon */}
                    <span className={`absolute -left-[35px] top-0.5 rounded-full border p-1.5 backdrop-blur-md transition-all group-hover:scale-110 ${colorClass}`}>
                      <IconComponent className="h-3.5 w-3.5" />
                    </span>
                    
                    {/* Activity Text */}
                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <h4 className="text-sm font-bold text-white transition-all group-hover:text-primary-400">{act.title}</h4>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                          {formatTimeAgo(act.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-normal">{act.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Kolom Bantuan & Status CMS */}
        <div className="rounded-xl border border-slate-800 bg-[#0d1324] p-6 shadow-md space-y-6">
          <div className="border-b border-slate-850 pb-4">
            <h3 className="text-lg font-bold text-white">CMS Status</h3>
            <p className="text-xs text-slate-500">Sistem manajemen siap beroperasi.</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg bg-[#0b0f19] p-4 border border-slate-850 flex gap-3 items-start">
              <div className="rounded-md bg-primary-500/10 p-2 text-primary-400 h-fit">
                <Terminal className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Clean Architecture</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Arsitektur sistem backend dirancang modular menggunakan dependency injection.</p>
              </div>
            </div>

            <div className="rounded-lg bg-[#0b0f19] p-4 border border-slate-850 flex gap-3 items-start">
              <div className="rounded-md bg-emerald-500/10 p-2 text-emerald-400 h-fit">
                <CheckSquare className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Default Seeder</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Database otomatis terisi akun admin default pada saat peluncuran awal database.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
