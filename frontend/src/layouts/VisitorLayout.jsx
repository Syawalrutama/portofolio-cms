import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight, Github, Linkedin, MessageCircle, Mail } from 'lucide-react'

const VisitorLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-100 via-sky-50 to-white text-slate-800">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-sky-100/60 bg-white/75 py-4 backdrop-blur-lg shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
            <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
              MyPortfolio
            </span>
          </Link>

          {/* Desktop Nav links */}
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-semibold transition-all hover:text-slate-900 ${
                    isActive ? 'text-primary-600' : 'text-slate-500'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Desktop CTA Admin Button */}
          <div className="hidden md:block">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200/50 bg-white/60 px-4 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-white hover:text-slate-950 shadow-sm"
            >
              Admin Panel
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-500 transition-all hover:bg-sky-100/50 hover:text-slate-900 md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="absolute left-0 top-16 z-50 w-full border-b border-sky-100 bg-white px-6 py-6 shadow-xl md:hidden">
            <nav className="flex flex-col gap-5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-sm font-semibold ${isActive ? 'text-primary-600' : 'text-slate-600'}`}
                  >
                    {item.name}
                  </Link>
                )
              })}
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50"
              >
                Admin Panel
                <ArrowRight className="h-4 w-4" />
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Modern Footer */}
      <footer className="border-t border-sky-100 bg-white/70 py-12">
        <div className="mx-auto max-w-6xl px-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between text-center md:text-left">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 tracking-wide">MyPortfolio</h4>
            <p className="text-xs text-slate-500">Website portofolio pribadi & CMS terintegrasi.</p>
          </div>
          <div className="flex justify-center gap-5 text-slate-500 text-xs">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-800 transition-all">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-800 transition-all">LinkedIn</a>
            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-800 transition-all">WhatsApp</a>
          </div>
          <p className="text-[10px] text-slate-500 tracking-wide">
            © {new Date().getFullYear()} MyPortfolio. Created for college assignment. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  )
}

export default VisitorLayout
