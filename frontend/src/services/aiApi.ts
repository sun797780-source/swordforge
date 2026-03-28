/**
 * AI服务 API
 * 对接真实AI接口进行装备设计分析
 */

import { API_BASE } from '../config/api'

export interface AIDesignResult {
    equipmentType: string
    modelType: 'tank' | 'drone' | 'armor' | 'exoskeleton'
    name: string
    description: string
    stats: {
        speed: number
        armor: number
        firepower: number
        stealth: number
    }
    designSuggestions: string[]
    technicalSpecs: {
        weight?: string
        power?: string
        range?: string
        crew?: string
    }
    analysis: string
}

export interface SavedDesign {
    id: string
    name: string
    prompt: string
    createdAt: string
    result: AIDesignResult
}

export const aiApi = {
    /**
     * 分析装备设计需求
     */
    async analyzeDesign(token: string, prompt: string): Promise<AIDesignResult & { designId?: string }> {
        const res = await fetch(`${API_BASE}/ai/analyze-design`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ prompt })
        })

        const data = await res.json()
        if (!res.ok) {
            throw new Error(data.error || 'AI分析失败')
        }

        return { ...data.data, designId: data.designId }
    },

    /**
     * 获取保存的设计方案列表
     */
    async getDesigns(token: string): Promise<SavedDesign[]> {
        const res = await fetch(`${API_BASE}/ai/designs`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const data = await res.json()
        if (!res.ok) {
            throw new Error(data.error || '获取设计方案失败')
        }

        // 确保 data.data 存在且是数组
        if (!data.data || !Array.isArray(data.data)) {
            console.warn('⚠️  设计方案数据格式不正确:', data)
            return []
        }

        const mapped = data.data.map((d: any) => {
            // 确保 stats 是对象，如果是字符串则解析
            let stats = d.stats
            if (typeof stats === 'string') {
                try {
                    stats = JSON.parse(stats)
                } catch (e) {
                    console.warn('解析stats失败:', e)
                    stats = { speed: 0, armor: 0, firepower: 0, stealth: 0 }
                }
            }

            // 确保其他字段也是对象
            let designSuggestions = d.designSuggestions
            if (typeof designSuggestions === 'string' && designSuggestions) {
                try {
                    designSuggestions = JSON.parse(designSuggestions)
                } catch (e) {
                    designSuggestions = null
                }
            }

            let technicalSpecs = d.technicalSpecs
            if (typeof technicalSpecs === 'string' && technicalSpecs) {
                try {
                    technicalSpecs = JSON.parse(technicalSpecs)
                } catch (e) {
                    technicalSpecs = null
                }
            }

            let analysis = d.analysis
            if (typeof analysis === 'string' && analysis) {
                try {
                    analysis = JSON.parse(analysis)
                } catch (e) {
                    analysis = null
                }
            }

            return {
                id: d.id,
                name: d.name || '未命名方案',
                prompt: d.prompt || '',
                createdAt: d.createdAt || new Date().toISOString(),
                result: {
                    equipmentType: d.equipmentType || 'UNKNOWN',
                    modelType: d.modelType || 'tank',
                    name: d.name || '未命名方案',
                    description: d.description || '',
                    stats: stats || { speed: 0, armor: 0, firepower: 0, stealth: 0 },
                    designSuggestions: designSuggestions,
                    technicalSpecs: technicalSpecs,
                    analysis: analysis
                }
            }
        })

        console.log('📋 映射后的设计方案:', mapped.length, '个')
        return mapped
    },

    /**
     * 获取单个设计方案
     */
    async getDesign(token: string, id: string): Promise<AIDesignResult> {
        const res = await fetch(`${API_BASE}/ai/designs/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const data = await res.json()
        if (!res.ok) {
            throw new Error(data.error || '获取设计方案失败')
        }

        return data.data
    },

    /**
     * 删除设计方案
     */
    async deleteDesign(token: string, id: string): Promise<void> {
        const res = await fetch(`${API_BASE}/ai/designs/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (!res.ok) {
            const data = await res.json()
            throw new Error(data.error || '删除设计方案失败')
        }
    }
}

