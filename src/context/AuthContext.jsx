import { createContext, useContext, useState } from 'react'

// Kredensial default untuk demo. Di produksi, ganti dengan otentikasi server.
export const ADMIN_EMAIL = 'admin@pijatnusantara.id'
export const ADMIN_PASSWORD = 'admin123'

const STORAGE_KEY = 'pijatnusantara:auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  const login = (email, password) => {
    if (
      email.trim().toLowerCase() === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      const session = {
        email: ADMIN_EMAIL,
        name: 'Admin Pijat Nusantara',
        loggedInAt: new Date().toISOString(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
      setUser(session)
      return { ok: true }
    }
    return { ok: false, message: 'Email atau kata sandi salah.' }
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}