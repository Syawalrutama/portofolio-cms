import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Menu, LogOut } from 'lucide-react'

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-800 bg-[#0d1324]/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* Tombol menu mobile */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-800 hover:text-white md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xs font-semibold text-slate-400 md:text-sm">
          Welcome back, <span className="text-white font-medium">{user?.email}</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Tombol Logout (Desktop) */}
        <button
          onClick={logout}
          className="hidden items-center gap-2 rounded-lg border border-slate-800 bg-[#0b0f19] px-4 py-2 text-xs font-semibold text-rose-400 transition-all hover:bg-rose-500/10 hover:border-rose-500/20 md:flex"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </header>
  )
}

export default Navbar
