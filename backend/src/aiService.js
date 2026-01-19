/**
 * AI服务 - 对接真实AI API
 * 支持OpenAI、Claude等主流AI服务
 */

const config = require('./config')
// 尝试加载dotenv，如果没有安装则忽略
try {
    require('dotenv').config()
} catch (e) {
    // dotenv未安装，使用默认配置
}

// AI服务配置
const AI_PROVIDER = config.ai.provider || process.env.AI_PROVIDER || 'zhipu' // 'zhipu' | 'openai' | 'claude' | 'qianwen'
const AI_API_KEY = config.ai.apiKey || process.env.AI_API_KEY || ''
const AI_BASE_URL = config.ai.baseUrl || process.env.AI_BASE_URL || ''

/**
 * 调用OpenAI API
 */
async function callOpenAI(prompt) {
    if (!AI_API_KEY || AI_API_KEY === '') {
        throw new Error('AI_API_KEY未配置')
    }

    // 检查fetch是否可用（Node.js 18+内置，旧版本需要node-fetch）
    if (typeof fetch === 'undefined') {
        throw new Error('当前Node.js版本不支持fetch，请升级到Node.js 18+或安装node-fetch')
    }

    const systemPrompt = `你是一位专业的军事装备设计专家，擅长分析装备设计需求并提供详细的技术参数评估。

请根据用户的设计需求，分析并返回以下JSON格式的数据：
{
    "equipmentType": "装备类型（tank/drone/artillery/armor等）",
    "modelType": "模型类型（tank/drone/armor/exoskeleton）",
    "name": "装备名称",
    "description": "装备描述",
    "stats": {
        "speed": 机动性评分(0-100),
        "armor": 防护力评分(0-100),
        "firepower": 火力指数(0-100),
        "stealth": 隐身性能(0-100)
    },
    "designSuggestions": [
        "设计建议1",
        "设计建议2",
        "设计建议3"
    ],
    "technicalSpecs": {
        "weight": "重量",
        "power": "动力",
        "range": "射程/航程",
        "crew": "乘员数"
    },
    "analysis": "详细的技术分析和评估"
}

请确保返回的是有效的JSON格式，不要包含其他文字说明。`

    try {
        const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // 使用更经济的模型，也可以改为 gpt-4
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`OpenAI API错误: ${response.status} - ${error}`)
        }

        const data = await response.json()
        const content = data.choices[0].message.content.trim()

        // 尝试解析JSON（AI可能返回带markdown代码块的JSON）
        let jsonContent = content
        if (content.includes('```json')) {
            jsonContent = content.split('```json')[1].split('```')[0].trim()
        } else if (content.includes('```')) {
            jsonContent = content.split('```')[1].split('```')[0].trim()
        }

        const result = JSON.parse(jsonContent)
        return result
    } catch (error) {
        console.error('OpenAI API调用失败:', error)
        throw error
    }
}

/**
 * 调用智谱AI API (GLM) - 国内免费AI
 */
async function callZhipuAI(prompt) {
    if (!AI_API_KEY || AI_API_KEY === '') {
        throw new Error('ZHIPU_API_KEY未配置，请访问 https://open.bigmodel.cn/ 获取免费API密钥')
    }

    const systemPrompt = `你是一位专业的军事装备设计专家，擅长分析装备设计需求并提供详细的技术参数评估。

请根据用户的设计需求，分析并返回以下JSON格式的数据：
{
    "equipmentType": "装备类型（tank/drone/artillery/armor等）",
    "modelType": "模型类型（tank/drone/armor/exoskeleton）",
    "name": "装备名称",
    "description": "装备描述",
    "stats": {
        "speed": 机动性评分(0-100),
        "armor": 防护力评分(0-100),
        "firepower": 火力指数(0-100),
        "stealth": 隐身性能(0-100)
    },
    "designSuggestions": [
        "设计建议1",
        "设计建议2",
        "设计建议3"
    ],
    "technicalSpecs": {
        "weight": "重量",
        "power": "动力",
        "range": "射程/航程",
        "crew": "乘员数"
    },
    "analysis": "详细的技术分析和评估"
}

请确保返回的是有效的JSON格式，不要包含其他文字说明。`

    try {
        const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'glm-4', // 智谱AI GLM-4模型
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`智谱AI API错误: ${response.status} - ${error}`)
        }

        const data = await response.json()
        const content = data.choices[0].message.content.trim()

        // 尝试解析JSON
        let jsonContent = content
        if (content.includes('```json')) {
            jsonContent = content.split('```json')[1].split('```')[0].trim()
        } else if (content.includes('```')) {
            jsonContent = content.split('```')[1].split('```')[0].trim()
        }

        const result = JSON.parse(jsonContent)
        return result
    } catch (error) {
        console.error('智谱AI API调用失败:', error)
        throw error
    }
}

/**
 * 调用Claude API (Anthropic)
 */
async function callClaude(prompt) {
    if (!AI_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY未配置')
    }

    const systemPrompt = `你是一位专业的军事装备设计专家。请根据用户的设计需求，返回JSON格式的分析结果，包含equipmentType、modelType、name、description、stats（speed/armor/firepower/stealth）、designSuggestions、technicalSpecs和analysis字段。`

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': AI_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 2000,
                system: systemPrompt,
                messages: [
                    { role: 'user', content: prompt }
                ]
            })
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Claude API错误: ${response.status} - ${error}`)
        }

        const data = await response.json()
        const content = data.content[0].text.trim()

        // 解析JSON
        let jsonContent = content
        if (content.includes('```json')) {
            jsonContent = content.split('```json')[1].split('```')[0].trim()
        } else if (content.includes('```')) {
            jsonContent = content.split('```')[1].split('```')[0].trim()
        }

        const result = JSON.parse(jsonContent)
        return result
    } catch (error) {
        console.error('Claude API调用失败:', error)
        throw error
    }
}

/**
 * 智能规则分析（降级方案 - 当没有API密钥时使用）
 */
function analyzeWithRules(prompt) {
    const lowerPrompt = prompt.toLowerCase()
    
    // 判断装备类型
    let equipmentType = 'tank'
    let modelType = 'tank'
    let name = '主战坦克'
    
    if (lowerPrompt.includes('无人') || lowerPrompt.includes('drone') || lowerPrompt.includes('飞机') || lowerPrompt.includes('uav')) {
        equipmentType = 'drone'
        modelType = 'drone'
        name = '察打一体无人机'
    } else if (lowerPrompt.includes('装甲') || lowerPrompt.includes('armor') || lowerPrompt.includes('防护')) {
        equipmentType = 'armor'
        modelType = 'armor'
        name = '复合装甲系统'
    } else if (lowerPrompt.includes('外骨骼') || lowerPrompt.includes('exoskeleton')) {
        equipmentType = 'exoskeleton'
        modelType = 'exoskeleton'
        name = '单兵外骨骼系统'
    }
    
    // 根据关键词分析性能参数
    let speed = 50, armor = 50, firepower = 50, stealth = 50
    
    // 机动性分析
    if (lowerPrompt.includes('高机动') || lowerPrompt.includes('快速') || lowerPrompt.includes('高速')) {
        speed = 85
    } else if (lowerPrompt.includes('机动')) {
        speed = 70
    } else if (lowerPrompt.includes('重型') || lowerPrompt.includes('heavy')) {
        speed = 35
    }
    
    // 防护力分析
    if (lowerPrompt.includes('高防护') || lowerPrompt.includes('重装甲') || lowerPrompt.includes('防护')) {
        armor = 90
    } else if (lowerPrompt.includes('装甲')) {
        armor = 75
    } else if (lowerPrompt.includes('轻') || lowerPrompt.includes('light')) {
        armor = 30
    }
    
    // 火力分析
    if (lowerPrompt.includes('强火力') || lowerPrompt.includes('重火力') || lowerPrompt.includes('火力')) {
        firepower = 95
    } else if (lowerPrompt.includes('侦察') || lowerPrompt.includes('recon')) {
        firepower = 40
    } else {
        firepower = 70
    }
    
    // 隐身分析
    if (lowerPrompt.includes('隐身') || lowerPrompt.includes('stealth') || lowerPrompt.includes('隐形')) {
        stealth = 90
    } else if (lowerPrompt.includes('低可探测')) {
        stealth = 75
    } else if (lowerPrompt.includes('无人机') || lowerPrompt.includes('drone')) {
        stealth = 60
    } else {
        stealth = 25
    }
    
    // 生成设计建议
    const suggestions = []
    if (lowerPrompt.includes('隐身')) {
        suggestions.push('采用雷达吸波材料和隐身外形设计')
        suggestions.push('优化红外特征抑制系统')
    }
    if (lowerPrompt.includes('机动')) {
        suggestions.push('采用大功率动力系统提升机动性')
        suggestions.push('优化悬挂系统适应复杂地形')
    }
    if (lowerPrompt.includes('防护')) {
        suggestions.push('采用复合装甲和反应装甲技术')
        suggestions.push('优化车体结构提升防护能力')
    }
    if (suggestions.length === 0) {
        suggestions.push('根据需求优化动力系统')
        suggestions.push('集成先进传感器和火控系统')
        suggestions.push('采用模块化设计便于升级')
    }
    
    return {
        equipmentType,
        modelType,
        name: name + ' - ' + (prompt.length > 20 ? prompt.substring(0, 20) + '...' : prompt),
        description: `基于需求"${prompt}"的${name}设计方案，采用先进技术优化性能参数。`,
        stats: { speed, armor, firepower, stealth },
        designSuggestions: suggestions,
        technicalSpecs: {
            weight: equipmentType === 'drone' ? '1.5吨' : equipmentType === 'armor' ? '200kg' : '35-45吨',
            power: equipmentType === 'drone' ? '45kW' : '1200kW',
            range: equipmentType === 'drone' ? '6000km' : '600km',
            crew: equipmentType === 'drone' ? '0人（无人）' : equipmentType === 'armor' ? 'N/A' : '3-4人'
        },
        analysis: `根据设计需求"${prompt}"，系统分析了${name}的关键性能指标。${equipmentType === 'drone' ? '无人机系统注重隐身和侦察能力。' : equipmentType === 'armor' ? '装甲系统注重防护性能。' : '主战装备注重火力、防护和机动的平衡。'}`
    }
}

/**
 * 智能装备设计分析 - 主入口
 */
async function analyzeEquipmentDesign(prompt) {
    if (!prompt || !prompt.trim()) {
        throw new Error('设计需求不能为空')
    }

    // 如果没有配置API密钥，使用规则分析
    if (!AI_API_KEY || AI_API_KEY === '') {
        console.log('⚠️  AI_API_KEY未配置，使用智能规则分析')
        return analyzeWithRules(prompt)
    }

    try {
        let result
        switch (AI_PROVIDER) {
            case 'zhipu':
                result = await callZhipuAI(prompt)
                break
            case 'qianwen':
                result = await callQianwenAI(prompt)
                break
            case 'openai':
                result = await callOpenAI(prompt)
                break
            case 'claude':
                result = await callClaude(prompt)
                break
            default:
                console.log('⚠️  不支持的AI服务，使用智能规则分析')
                return analyzeWithRules(prompt)
        }

        // 验证和标准化返回数据
        return {
            equipmentType: result.equipmentType || 'tank',
            modelType: result.modelType || 'tank',
            name: result.name || 'AI设计装备',
            description: result.description || '基于AI分析的装备设计方案',
            stats: {
                speed: Math.max(0, Math.min(100, result.stats?.speed || 50)),
                armor: Math.max(0, Math.min(100, result.stats?.armor || 50)),
                firepower: Math.max(0, Math.min(100, result.stats?.firepower || 50)),
                stealth: Math.max(0, Math.min(100, result.stats?.stealth || 50))
            },
            designSuggestions: result.designSuggestions || [],
            technicalSpecs: result.technicalSpecs || {},
            analysis: result.analysis || ''
        }
    } catch (error) {
        console.error('❌ AI API调用失败，降级使用智能规则分析:', error.message)
        // API调用失败时，降级使用规则分析
        return analyzeWithRules(prompt)
    }
}

module.exports = {
    analyzeEquipmentDesign
}

