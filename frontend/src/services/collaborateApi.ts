/**
 * 装备操控 - API服务层
 * 提供与后端API的完整交互
 */

import { COLLABORATE_API_BASE, SOCKET_URL } from '../config/api'

const API_BASE = COLLABORATE_API_BASE

// ==========================================
// 类型定义
// ==========================================

export interface Project {
    id: string
    name: string
    modelType: 'tank' | 'drone' | 'armor' | 'exoskeleton'
    description: string
    status: string
    members: string[]
    createdAt: string
    updatedAt: string
}

export interface Annotation {
    id: string
    projectId: string
    partId: string
    position: { x: number; y: number; z: number }
    content: string
    type: 'info' | 'warning' | 'error' | 'success'
    author: string
    authorName: string
    createdAt: string
    resolved: boolean
    resolvedAt?: string
    resolvedBy?: string
}

export interface DisassemblyState {
    parts: Array<{
        id: string
        name: string
        visible: boolean
        exploded: boolean
    }>
    explodeLevel: number
}

export interface Version {
    id: string
    projectId: string
    version: string
    branch: string
    commitMessage: string
    author: string
    authorName: string
    createdAt: string
    changes: Array<{
        type: 'add' | 'modify' | 'delete' | 'rollback'
        part?: string
        description: string
    }>
    parentVersion: string | null
    isRollback?: boolean
}

export interface GJBRule {
    id: string
    name: string
    category: string
    description: string
    standard: string
}

export interface GJBCheckResult {
    id: string
    projectId: string
    ruleId: string
    ruleName?: string
    category?: string
    standard?: string
    status: 'passed' | 'warning' | 'failed'
    score: number
    details: string
    checkedAt: string
    checkedBy: string
    suggestions?: string[]
}

export interface GJBCheckSummary {
    projectId: string
    totalChecks: number
    passed: number
    warning: number
    failed: number
    complianceRate: number
    checkedAt: string
    results: GJBCheckResult[]
}

export interface SyncRecord {
    id: string
    projectId: string
    type: 'upload' | 'download'
    status: 'uploading' | 'downloading' | 'completed' | 'failed'
    fileSize: number
    fileName: string
    progress?: number
    syncedAt?: string
    syncedBy: string
    startedAt?: string
}

export interface MonitoringData {
    structuralStress: number
    thermalLoad: number
    collaborationDelay: number
    powerOutput: number
    systemEfficiency: number
    vibrationAmplitude: number
    systemPressure: number
    coolingFlow: number
}

// ==========================================
// 项目管理 API
// ==========================================

export const projectApi = {
    // 获取所有项目
    async getAll(): Promise<Project[]> {
        const res = await fetch(`${API_BASE}/projects`)
        if (!res.ok) throw new Error('获取项目列表失败')
        return res.json()
    },

    // 获取单个项目
    async getById(id: string): Promise<Project> {
        const res = await fetch(`${API_BASE}/projects/${id}`)
        if (!res.ok) throw new Error('获取项目详情失败')
        return res.json()
    },

    // 创建项目
    async create(project: Partial<Project>): Promise<Project> {
        const res = await fetch(`${API_BASE}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project)
        })
        if (!res.ok) throw new Error('创建项目失败')
        return res.json()
    },

    // 更新项目
    async update(id: string, project: Partial<Project>): Promise<Project> {
        const res = await fetch(`${API_BASE}/projects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project)
        })
        if (!res.ok) throw new Error('更新项目失败')
        return res.json()
    }
}

// ==========================================
// 3D标注 API
// ==========================================

export const annotationApi = {
    // 获取项目的所有标注
    async getByProject(projectId: string): Promise<Annotation[]> {
        const res = await fetch(`${API_BASE}/annotations?projectId=${projectId}`)
        if (!res.ok) throw new Error('获取标注失败')
        return res.json()
    },

    // 创建标注
    async create(annotation: Partial<Annotation>, token?: string): Promise<Annotation> {
        const headers: HeadersInit = { 'Content-Type': 'application/json' }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }
        const res = await fetch(`${API_BASE}/annotations`, {
            method: 'POST',
            headers,
            body: JSON.stringify(annotation)
        })
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            const errorMsg = errorData?.error || errorData?.message || '创建标注失败'
            throw new Error(errorMsg)
        }
        return res.json()
    },

    // 更新标注
    async update(id: string, annotation: Partial<Annotation>): Promise<Annotation> {
        const res = await fetch(`${API_BASE}/annotations/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(annotation)
        })
        if (!res.ok) throw new Error('更新标注失败')
        return res.json()
    },

    // 删除标注
    async delete(id: string): Promise<{ success: boolean; id: string }> {
        const res = await fetch(`${API_BASE}/annotations/${id}`, {
            method: 'DELETE'
        })
        if (!res.ok) throw new Error('删除标注失败')
        return res.json()
    },

    // 解决标注
    async resolve(id: string, userId: string): Promise<Annotation> {
        const res = await fetch(`${API_BASE}/annotations/${id}/resolve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        })
        if (!res.ok) throw new Error('解决标注失败')
        return res.json()
    }
}

// ==========================================
// 拆解功能 API
// ==========================================

export const disassemblyApi = {
    // 获取拆解状态
    async getState(projectId: string): Promise<DisassemblyState> {
        const res = await fetch(`${API_BASE}/disassembly/${projectId}`)
        if (!res.ok) throw new Error('获取拆解状态失败')
        return res.json()
    },

    // 切换部件可见性
    async togglePart(projectId: string, partId: string, visible?: boolean): Promise<DisassemblyState> {
        const res = await fetch(`${API_BASE}/disassembly/${projectId}/toggle-part`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ partId, visible })
        })
        if (!res.ok) throw new Error('切换部件失败')
        return res.json()
    },

    // 设置爆炸视图级别
    async setExplodeLevel(projectId: string, level: number): Promise<DisassemblyState> {
        const res = await fetch(`${API_BASE}/disassembly/${projectId}/explode`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ level })
        })
        if (!res.ok) throw new Error('设置爆炸视图失败')
        return res.json()
    },

    // 重置拆解状态
    async reset(projectId: string): Promise<DisassemblyState> {
        const res = await fetch(`${API_BASE}/disassembly/${projectId}/reset`, {
            method: 'POST'
        })
        if (!res.ok) throw new Error('重置失败')
        return res.json()
    }
}

// ==========================================
// 版本控制 API
// ==========================================

export const versionApi = {
    // 获取项目的版本历史
    async getByProject(projectId: string, branch?: string): Promise<Version[]> {
        let url = `${API_BASE}/versions?projectId=${projectId}`
        if (branch) url += `&branch=${branch}`
        const res = await fetch(url)
        if (!res.ok) throw new Error('获取版本历史失败')
        return res.json()
    },

    // 获取版本详情
    async getById(id: string): Promise<Version> {
        const res = await fetch(`${API_BASE}/versions/${id}`)
        if (!res.ok) throw new Error('获取版本详情失败')
        return res.json()
    },

    // 创建新版本
    async create(version: {
        projectId: string
        commitMessage: string
        author: string
        authorName: string
        branch?: string
        changeType?: 'major' | 'minor' | 'patch'
        changes?: Array<{ type: string; part?: string; description: string }>
    }): Promise<Version> {
        const res = await fetch(`${API_BASE}/versions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(version)
        })
        if (!res.ok) throw new Error('创建版本失败')
        return res.json()
    },

    // 回滚到指定版本
    async rollback(id: string, author: string, authorName: string): Promise<Version> {
        const res = await fetch(`${API_BASE}/versions/${id}/rollback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author, authorName })
        })
        if (!res.ok) throw new Error('版本回滚失败')
        return res.json()
    },

    // 获取版本差异
    async getDiff(id: string): Promise<{ current: Version; parent: Version | null; changes: any[] }> {
        const res = await fetch(`${API_BASE}/versions/${id}/diff`)
        if (!res.ok) throw new Error('获取版本差异失败')
        return res.json()
    }
}

// ==========================================
// GJB合规检查 API
// ==========================================

export const gjbApi = {
    // 获取所有规则
    async getRules(category?: string, standard?: string): Promise<GJBRule[]> {
        let url = `${API_BASE}/gjb/rules`
        const params = new URLSearchParams()
        if (category) params.append('category', category)
        if (standard) params.append('standard', standard)
        if (params.toString()) url += `?${params.toString()}`
        
        const res = await fetch(url)
        if (!res.ok) throw new Error('获取GJB规则失败')
        return res.json()
    },

    // 获取检查结果
    async getResults(projectId: string, status?: string): Promise<GJBCheckResult[]> {
        let url = `${API_BASE}/gjb/results?projectId=${projectId}`
        if (status) url += `&status=${status}`
        
        const res = await fetch(url)
        if (!res.ok) throw new Error('获取检查结果失败')
        return res.json()
    },

    // 执行GJB检查
    async runCheck(projectId: string, ruleIds?: string[]): Promise<GJBCheckSummary> {
        const res = await fetch(`${API_BASE}/gjb/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectId, ruleIds })
        })
        if (!res.ok) throw new Error('执行GJB检查失败')
        return res.json()
    },

    // 获取合规报告
    async getReport(projectId: string): Promise<{
        project: Project
        summary: {
            totalChecks: number
            passed: number
            warning: number
            failed: number
            complianceRate: number
        }
        byCategory: Record<string, any>
        results: GJBCheckResult[]
        generatedAt: string
    }> {
        const res = await fetch(`${API_BASE}/gjb/report/${projectId}`)
        if (!res.ok) throw new Error('获取合规报告失败')
        return res.json()
    }
}

// ==========================================
// 云同步 API
// ==========================================

export const syncApi = {
    // 获取同步记录
    async getRecords(projectId: string, type?: 'upload' | 'download'): Promise<SyncRecord[]> {
        let url = `${API_BASE}/sync/records?projectId=${projectId}`
        if (type) url += `&type=${type}`
        
        const res = await fetch(url)
        if (!res.ok) throw new Error('获取同步记录失败')
        return res.json()
    },

    // 上传同步
    async upload(projectId: string, fileName: string, fileSize: number, userId: string): Promise<SyncRecord> {
        const res = await fetch(`${API_BASE}/sync/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectId, fileName, fileSize, userId })
        })
        if (!res.ok) throw new Error('上传失败')
        return res.json()
    },

    // 下载同步
    async download(projectId: string, versionId: string, userId: string): Promise<SyncRecord> {
        const res = await fetch(`${API_BASE}/sync/download`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectId, versionId, userId })
        })
        if (!res.ok) throw new Error('下载失败')
        return res.json()
    },

    // 获取同步状态
    async getStatus(projectId: string): Promise<{
        projectId: string
        lastSync: string | null
        pendingOperations: number
        totalUploads: number
        totalDownloads: number
        totalSize: number
    }> {
        const res = await fetch(`${API_BASE}/sync/status/${projectId}`)
        if (!res.ok) throw new Error('获取同步状态失败')
        return res.json()
    }
}

// ==========================================
// 实时监控 API
// ==========================================

export const monitoringApi = {
    // 获取实时监控数据
    async getData(projectId: string): Promise<{
        projectId: string
        timestamp: string
        data: MonitoringData
        params: any
    }> {
        const res = await fetch(`${API_BASE}/monitoring/${projectId}`)
        if (!res.ok) throw new Error('获取监控数据失败')
        return res.json()
    }
}

// ==========================================
// WebSocket 实时协作
// ==========================================

import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const collaborateSocket = {
    // 连接WebSocket
    connect(): Socket {
        if (!socket) {
            socket = io(SOCKET_URL, {
                transports: ['websocket', 'polling']
            })
        }
        return socket
    },

    // 断开连接
    disconnect() {
        if (socket) {
            socket.disconnect()
            socket = null
        }
    },

    // 加入项目协作
    joinProject(projectId: string, userId: string, userName: string) {
        if (socket) {
            socket.emit('join-project', { projectId, userId, userName })
        }
    },

    // 离开项目
    leaveProject(projectId: string, userId: string) {
        if (socket) {
            socket.emit('leave-project', { projectId, userId })
        }
    },

    // 同步光标位置
    syncCursor(projectId: string, userId: string, userName: string, position: { x: number; y: number; z: number }, target?: string) {
        if (socket) {
            socket.emit('cursor-move', { projectId, userId, userName, position, target })
        }
    },

    // 同步选中部件
    syncPartSelection(projectId: string, userId: string, userName: string, partId: string) {
        if (socket) {
            socket.emit('part-selected', { projectId, userId, userName, partId })
        }
    },

    // 同步标注操作
    syncAnnotation(projectId: string, action: string, annotation: any) {
        if (socket) {
            socket.emit('annotation-action', { projectId, action, annotation })
        }
    },

    // 同步视图
    syncView(projectId: string, userId: string, camera: any, target: any) {
        if (socket) {
            socket.emit('view-sync', { projectId, userId, camera, target })
        }
    },

    // 发送聊天消息
    sendMessage(projectId: string, userId: string, userName: string, content: string) {
        if (socket) {
            socket.emit('chat-message', { projectId, userId, userName, content })
        }
    },

    // 监听事件
    on(event: string, callback: (...args: any[]) => void) {
        if (socket) {
            socket.on(event, callback)
        }
    },

    // 移除事件监听
    off(event: string, callback?: (...args: any[]) => void) {
        if (socket) {
            socket.off(event, callback)
        }
    },

    // 获取socket实例
    getSocket(): Socket | null {
        return socket
    }
}

// 导出所有API
export default {
    project: projectApi,
    annotation: annotationApi,
    disassembly: disassemblyApi,
    version: versionApi,
    gjb: gjbApi,
    sync: syncApi,
    monitoring: monitoringApi,
    socket: collaborateSocket
}



