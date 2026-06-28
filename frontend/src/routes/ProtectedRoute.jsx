import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const ProtectedRoute = () => {
  const { user, loading } = useAuth()

  // Tampilkan loading spinner jika verifikasi token sedang berjalan
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0f1d]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  // Jika tidak terotentikasi, redirect visitor kembali ke login
  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
