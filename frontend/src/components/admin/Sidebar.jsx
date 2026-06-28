import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, User, Award, FolderGit2, Mail, LogOut, CheckSquare, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const Sidebar = ({ open, onClose }) => {
  const location = useLocation()
  const { logout } = useAuth()

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Profile Settings', path: '/admin/profile', icon: User },
    { name: 'Manage Skills', path: '/admin/skills', icon: CheckSquare },
    { name: 'Manage Projects', path: '/admin/projects', icon: FolderGit2 },
    { name: 'Manage Certificates', path: '/admin/certificates', icon: Award },
    { name: 'Inbox Messages', path: '/admin/inbox', icon: Mail },
  ]

  const renderSidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo CMS */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6 font-bold text-white tracking-wide">
        <span className="bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent text-lg">
          Portfolio Admin
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-slate-800 hover:text-white md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-500/10 text-primary-400 border-l-4 border-primary-500 pl-3'
                  : 'hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Tombol Logout */}
      <div className="border-t border-slate-800 p-4">
        <button
          onClick={() => {
            if (onClose) onClose()
            logout()
          }}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-rose-400 transition-all hover:bg-rose-500/10"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-[#0d1324] text-slate-300 md:flex">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Sidebar Overlay & Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fadeIn"
            onClick={onClose}
          />
          
          {/* Drawer container */}
          <div className="relative flex w-64 max-w-xs flex-col border-r border-slate-800 bg-[#0d1324] text-slate-300 shadow-2xl animate-slideInLeft">
            {renderSidebarContent()}
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar
