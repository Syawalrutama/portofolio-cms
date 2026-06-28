import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

// Custom hook useAuth mempermudah pemanggilan sesi otentikasi di mana saja
export const useAuth = () => {
  return useContext(AuthContext)
}
