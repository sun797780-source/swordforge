import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi, AuthUser } from '../services/authApi'

interface AuthContextType {
    user: AuthUser | null
    token: string | null
    login: (username: string, password: string) => Promise<void>
    logout: () => Promise<void>
    isAuthenticated: boolean
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem('admin_token')
            if (savedToken) {
                try {
                    const userData = await authApi.me(savedToken)
                    setUser(userData)
                    setToken(savedToken)
                } catch {
                    localStorage.removeItem('admin_token')
                    setToken(null)
                    setUser(null)
                }
            }
            setLoading(false)
        }
        initAuth()
    }, [])

    const login = async (username: string, password: string) => {
        const res = await authApi.login(username, password)
        localStorage.setItem('admin_token', res.token)
        setToken(res.token)
        setUser(res.user)
    }

    const logout = async () => {
        if (token) {
            try {
                await authApi.logout(token)
            } catch {
                // ignore
            }
        }
        localStorage.removeItem('admin_token')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated: !!user && !!token,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}















