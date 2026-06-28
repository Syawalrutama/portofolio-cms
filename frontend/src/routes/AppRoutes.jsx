import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AdminLayout from '../layouts/AdminLayout'

import VisitorLayout from '../layouts/VisitorLayout'

// Komponen Halaman Admin
import Login from '../pages/admin/Login'
import Dashboard from '../pages/admin/Dashboard'
import ProfileSettings from '../pages/admin/ProfileSettings'
import ManageSkills from '../pages/admin/ManageSkills'
import ManageProjects from '../pages/admin/ManageProjects'
import ManageCertificates from '../pages/admin/ManageCertificates'
import Inbox from '../pages/admin/Inbox'

// Komponen Halaman Visitor
import Home from '../pages/visitor/Home'
import Projects from '../pages/visitor/Projects'
import ProjectDetail from '../pages/visitor/ProjectDetail'
import Contact from '../pages/visitor/Contact'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rute Publik Visitor */}
      <Route element={<VisitorLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Rute Login Admin */}
      <Route path="/admin/login" element={<Login />} />

      {/* Rute Terproteksi Panel Admin */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          {/* Otomatis mengarahkan /admin ke /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="skills" element={<ManageSkills />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="certificates" element={<ManageCertificates />} />
          <Route path="inbox" element={<Inbox />} />
        </Route>
      </Route>

      {/* Rute Fallback 404 (Redirect ke Home) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
