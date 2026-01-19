import { API_BASE } from '../config/api'

export interface AuthUser {
    id: string
    username: string
    name: string
    role: string
    department?: string
    position?: string
}

export const authApi = {
    async login(username: string, password: string) {
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data?.error || `登录失败 (${res.status})`)
            }
            
            return await res.json()
        } catch (error: any) {
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                throw new Error('无法连接到后端服务，请确保后端服务已启动')
            }
            throw error
        }
    },

    async register(username: string, password: string, name: string, department?: string, position?: string) {
        try {
            const url = `${API_BASE}/auth/register`
            console.log('📝 发送注册请求到:', url)
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, name, department, position })
            })
            
            console.log('📝 注册响应状态:', res.status, res.statusText)
            
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                console.error('❌ 注册失败:', data)
                throw new Error(data?.error || `注册失败 (${res.status})`)
            }
            
            const result = await res.json()
            console.log('✅ 注册成功:', result)
            return result
        } catch (error: any) {
            console.error('❌ 注册异常:', error)
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                throw new Error('无法连接到后端服务，请确保后端服务已启动')
            }
            throw error
        }
    },

    async me(token: string): Promise<AuthUser> {
        const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('获取用户信息失败')
        return res.json()
    },

    async logout(token: string) {
        const res = await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('退出失败')
        return res.json()
    },

    async updateProfile(token: string, payload: { name?: string; department?: string; position?: string }) {
        const res = await fetch(`${API_BASE}/auth/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload)
        })
        if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            throw new Error(data?.error || '更新个人信息失败')
        }
        return res.json()
    },

    async changePassword(token: string, oldPassword: string, newPassword: string) {
        const res = await fetch(`${API_BASE}/auth/change-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ oldPassword, newPassword })
        })
        if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            throw new Error(data?.error || '修改密码失败')
        }
        return res.json()
    }
}

export const adminApi = {
    async listUsers(token: string, page = 1, limit = 20, keyword = '') {
        const res = await fetch(`${API_BASE}/admin/users?page=${page}&limit=${limit}&keyword=${encodeURIComponent(keyword)}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('获取用户失败')
        return res.json()
    },

    async createUser(token: string, payload: any) {
        const res = await fetch(`${API_BASE}/admin/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('创建用户失败')
        return res.json()
    },

    async updateUser(token: string, id: string, payload: any) {
        const res = await fetch(`${API_BASE}/admin/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('更新用户失败')
        return res.json()
    },

    async updateUserStatus(token: string, id: string, isActive: boolean) {
        const res = await fetch(`${API_BASE}/admin/users/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ isActive })
        })
        if (!res.ok) throw new Error('更新状态失败')
        return res.json()
    },

    async resetPassword(token: string, id: string, newPassword: string) {
        const res = await fetch(`${API_BASE}/admin/users/${id}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ newPassword })
        })
        if (!res.ok) throw new Error('重置密码失败')
        return res.json()
    }
}

