import React, { createContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      if (token && storedUser) {
        try {
          // Panggil API backend check untuk memverifikasi token aktif
          await authService.checkSession()
          setUser(JSON.parse(storedUser))
        } catch (err) {
          console.error("Sesi token kadaluwarsa", err)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setUser(null)
        }
      }
      setLoading(false)
    }

    verifySession()
  }, [])

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    setUser({ email })
    return data
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error("Gagal logout di server", err)
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
