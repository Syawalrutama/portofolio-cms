import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/admin/Sidebar'
import Navbar from '../components/common/Navbar'

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-[#0b0f19]">
      {/* Sidebar navigasi kiri */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Konten Utama */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Header atas */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Konten Halaman */}
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
