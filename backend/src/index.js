const config = require('./config')
// 启动调试
console.log('=== 铸剑乾坤后端启动 ===')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('PORT:', process.env.PORT)
console.log('DATABASE_URL:', process.env.DATABASE_URL)

const express = require('express')
const cors = require('cors')
const { createServer } = require('http')
const { Server } = require('socket.io')
const fs = require('fs')
const path = require('path')
const { analyzeEquipmentDesign } = require('./aiService')

// 初始化Prisma客户端 - 延迟初始化，不阻塞启动
let prisma = null
let prismaReady = false

// 异步初始化数据库
async function initDatabase() {
    try {
        const { PrismaClient } = require('@prisma/client')
        prisma = new PrismaClient()
        await prisma.$connect()
        prismaReady = true
        console.log('✅ Prisma客户端已初始化，数据库连接成功')
    } catch (e) {
        console.warn('⚠️  Prisma初始化失败，使用内存存储:', e.message)
        prisma = null
        prismaReady = false
    }
}

// 后台初始化数据库，不阻塞服务启动
initDatabase()

// 配置 CORS 允许的源
const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173']

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: corsOrigins,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
})

// 配置CORS - 动态反射来源以确保 100% 连通性
app.use(cors({
    origin: function (origin, callback) {
        // 允许所有来源请求，这对部署调试最稳妥
        callback(null, true)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))
app.use(express.json())

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err)
    res.status(500).json({ error: err.message || '服务器内部错误' })
})

// ==========================================
// 密码哈希和验证（支持SHA256和bcrypt）
// ==========================================
const crypto = require('crypto')
let bcrypt = null
try {
    bcrypt = require('bcryptjs')
} catch (e) {
    // bcrypt未安装，只使用SHA256
}

const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password + config.jwtSecret).digest('hex')
}

const verifyPassword = async (password, hash) => {
    // 如果hash看起来像bcrypt哈希（以$2a$、$2b$或$2y$开头），使用bcrypt验证
    if (hash && (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$'))) {
        if (bcrypt) {
            try {
                return await bcrypt.compare(password, hash)
            } catch (e) {
                console.error('bcrypt验证失败:', e)
                return false
            }
        }
        return false
    }
    // 否则使用SHA256验证
    return hashPassword(password) === hash
}

// ==========================================
// 简单的JWT实现（不需要jsonwebtoken依赖）
// ==========================================
const base64url = (str) => Buffer.from(str).toString('base64url')
const generateToken = (payload, expiresIn = '2h') => {
    const header = { alg: 'HS256', typ: 'JWT' }
    const now = Math.floor(Date.now() / 1000)
    let exp = now + 2 * 60 * 60 // 默认2小时
    if (expiresIn === '7d') exp = now + 7 * 24 * 60 * 60
    const tokenPayload = { ...payload, iat: now, exp }
    const headerB64 = base64url(JSON.stringify(header))
    const payloadB64 = base64url(JSON.stringify(tokenPayload))
    const signature = crypto.createHmac('sha256', config.jwtSecret)
        .update(`${headerB64}.${payloadB64}`)
        .digest('base64url')
    return `${headerB64}.${payloadB64}.${signature}`
}
const verifyToken = (token) => {
    try {
        const [headerB64, payloadB64, signature] = token.split('.')
        const expectedSig = crypto.createHmac('sha256', config.jwtSecret)
            .update(`${headerB64}.${payloadB64}`)
            .digest('base64url')
        if (signature !== expectedSig) return null
        const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString())
        if (payload.exp < Math.floor(Date.now() / 1000)) return null
        return payload
    } catch {
        return null
    }
}

// ==========================================
// 内存数据存储
// ==========================================

// 用户数据
const users = new Map()
const sessions = new Map()
const loginLogs = []

// 初始化超级管理员
const adminId = 'admin-' + Date.now()
users.set(adminId, {
    id: adminId,
    username: config.admin.username,
    password: hashPassword(config.admin.password),
    name: config.admin.name,
    role: 'SUPER_ADMIN',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: null
})
console.log('✅ 已创建超级管理员:', config.admin.username, '/', config.admin.password)

// 装备数据
const equipmentData = [
    { id: '1', name: '56式半自动步枪', type: 'LIGHT_WEAPON', year: 1956, manufacturer: '国营296厂', description: '56式半自动步枪是中国仿制苏联SKS半自动步枪制造的武器。', specs: { caliber: '7.62mm', weight: '3.85kg' } },
    { id: '2', name: '59式中型坦克', type: 'ARMORED_VEHICLE', year: 1959, manufacturer: '包头第一机械厂', description: '59式中型坦克是中国第一代主战坦克。', specs: { weight: '36t', crew: 4 } },
    { id: '3', name: '81式自动步枪', type: 'LIGHT_WEAPON', year: 1981, manufacturer: '国营296厂', description: '81式自动步枪是中国人民解放军装备的制式步枪。', specs: { caliber: '7.62mm', weight: '3.4kg' } },
    { id: '4', name: '15式轻型坦克', type: 'ARMORED_VEHICLE', year: 2015, manufacturer: '中国兵器工业集团', description: '15式轻型坦克是中国新一代轻型坦克。', specs: { weight: '33-36t', crew: 3 } }
]

const historyEvents = [
    { id: '1', title: '官田中央兵工厂成立', year: 1931, month: 10, description: '中国共产党在江西瑞金成立官田中央兵工厂。', importance: 5 },
    { id: '2', title: '第一支56式步枪下线', year: 1956, month: 7, description: '中国成功仿制苏联SKS步枪。', importance: 4 },
    { id: '3', title: '59式坦克定型', year: 1959, description: '中国第一代主战坦克59式正式定型投产。', importance: 5 }
]

let ideas = []
let simulations = []

// AI设计方案数据存储
const DESIGNS_FILE = path.join(__dirname, '../data/ai-designs.json')

// 确保数据目录存在
const dataDir = path.dirname(DESIGNS_FILE)
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
}

// 加载保存的设计方案
let aiDesigns = []
try {
    if (fs.existsSync(DESIGNS_FILE)) {
        const data = fs.readFileSync(DESIGNS_FILE, 'utf8')
        aiDesigns = JSON.parse(data)
    }
} catch (e) {
    console.log('⚠️  加载设计方案失败，使用空数组:', e.message)
    aiDesigns = []
}

// 保存设计方案到文件
function saveDesigns() {
    try {
        fs.writeFileSync(DESIGNS_FILE, JSON.stringify(aiDesigns, null, 2), 'utf8')
    } catch (e) {
        console.error('保存设计方案失败:', e)
    }
}

// 协同项目数据
let collaborateProjects = [
    { id: 'proj-001', name: '新型主战坦克动力系统', modelType: 'tank', description: 'T-99主战坦克V12柴油发动机优化项目', status: 'active', members: ['user-001'], createdAt: '2025-12-01T08:00:00.000Z' },
    { id: 'proj-002', name: '察打一体无人机集群', modelType: 'drone', description: '彩虹-5无人机精确制导武器挂载系统', status: 'active', members: ['user-001'], createdAt: '2025-11-15T10:00:00.000Z' },
    { id: 'proj-003', name: '复合装甲防护系统', modelType: 'armor', description: 'ERA爆炸反应装甲模块化设计', status: 'active', members: ['user-002'], createdAt: '2025-10-20T14:00:00.000Z' },
    { id: 'proj-004', name: '单兵外骨骼系统', modelType: 'exoskeleton', description: '碳纤维复合材料外骨骼动力系统', status: 'active', members: ['user-001'], createdAt: '2025-09-10T09:00:00.000Z' }
]

let annotations = []
let versionHistory = []
let gjbCheckResults = []
let syncRecords = []

const gjbRules = [
    { id: 'GJB150A-2009-01', name: '高温试验', category: '环境适应性', standard: 'GJB150A-2009' },
    { id: 'GJB150A-2009-02', name: '低温试验', category: '环境适应性', standard: 'GJB150A-2009' },
    { id: 'GJB150A-2009-04', name: '振动试验', category: '力学环境', standard: 'GJB150A-2009' },
    { id: 'GJB9001C-01', name: '设计和开发策划', category: '质量管理', standard: 'GJB9001C' },
    { id: 'GJB9001C-02', name: '设计和开发验证', category: '质量管理', standard: 'GJB9001C' }
]

// ==========================================
// 鉴权中间件
// ==========================================
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: '未提供认证信息' })
    const token = authHeader.replace('Bearer ', '')

    const payload = verifyToken(token)
    if (!payload) return res.status(401).json({ error: '认证失败或已过期' })

    const session = sessions.get(token)
    if (!session) return res.status(401).json({ error: '会话已失效' })

    req.user = payload
    req.token = token
    next()
}

const requireRole = (roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: '权限不足' })
    }
    next()
}

// ==========================================
// 认证 API
// ==========================================
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ error: '用户名或密码不能为空' })
    }

    // 查找用户 - 先从内存查找，如果不存在且使用Prisma，则从数据库查找
    let foundUser = null
    for (const user of users.values()) {
        if (user.username === username) {
            foundUser = user
            break
        }
    }

    // 如果内存中没找到且使用Prisma，尝试从数据库加载
    if (!foundUser && prisma) {
        try {
            const dbUser = await prisma.user.findUnique({ where: { username } })
            if (dbUser && dbUser.isActive) {
                // 将数据库用户加载到内存
                foundUser = {
                    id: dbUser.id,
                    username: dbUser.username,
                    password: dbUser.password,
                    name: dbUser.name,
                    role: dbUser.role,
                    department: dbUser.department,
                    position: dbUser.position,
                    isActive: dbUser.isActive,
                    createdAt: dbUser.createdAt.toISOString(),
                    lastLoginAt: dbUser.lastLoginAt ? dbUser.lastLoginAt.toISOString() : null
                }
                users.set(dbUser.id, foundUser)
                console.log('✅ 从数据库加载用户到内存:', username)
            }
        } catch (error) {
            console.error('从数据库加载用户失败:', error)
        }
    }

    if (!foundUser) {
        return res.status(401).json({ error: '用户名或密码错误' })
    }

    if (!foundUser.isActive) {
        return res.status(401).json({ error: '账户已被禁用' })
    }

    const passwordValid = await verifyPassword(password, foundUser.password)
    if (!passwordValid) {
        loginLogs.push({ userId: foundUser.id, success: false, message: '密码错误', createdAt: new Date().toISOString() })
        return res.status(401).json({ error: '用户名或密码错误' })
    }

    // 生成令牌
    const accessToken = generateToken({ userId: foundUser.id, role: foundUser.role }, '2h')
    const refreshToken = generateToken({ userId: foundUser.id, role: foundUser.role }, '7d')

    // 保存会话
    sessions.set(accessToken, {
        userId: foundUser.id,
        token: accessToken,
        refreshToken,
        createdAt: new Date().toISOString()
    })

    // 更新最后登录时间
    foundUser.lastLoginAt = new Date().toISOString()

    // 如果使用Prisma，确保用户同步到数据库
    if (prisma) {
        try {
            // 检查用户是否存在于数据库
            const dbUser = await prisma.user.findUnique({ where: { id: foundUser.id } })
            if (!dbUser) {
                // 用户不存在，创建到数据库
                await prisma.user.create({
                    data: {
                        id: foundUser.id,
                        username: foundUser.username,
                        password: foundUser.password,
                        name: foundUser.name,
                        role: foundUser.role,
                        department: foundUser.department || null,
                        position: foundUser.position || null,
                        isActive: foundUser.isActive,
                        lastLoginAt: foundUser.lastLoginAt ? new Date(foundUser.lastLoginAt) : null
                    }
                })
                console.log('✅ 用户已同步到数据库:', foundUser.username, foundUser.id)
            } else {
                // 用户存在，更新最后登录时间
                await prisma.user.update({
                    where: { id: foundUser.id },
                    data: { lastLoginAt: new Date() }
                })
            }
        } catch (error) {
            console.error('⚠️  同步用户到数据库失败:', error)
            // 继续登录流程，不阻止登录
        }
    }

    loginLogs.push({ userId: foundUser.id, success: true, message: '登录成功', createdAt: new Date().toISOString() })

    res.json({
        token: accessToken,
        refreshToken,
        user: {
            id: foundUser.id,
            username: foundUser.username,
            name: foundUser.name,
            role: foundUser.role,
            department: foundUser.department,
            position: foundUser.position
        }
    })
})

app.get('/api/auth/me', authenticateToken, (req, res) => {
    const user = users.get(req.user.userId)
    if (!user) return res.status(404).json({ error: '用户不存在' })
    res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        department: user.department,
        position: user.position
    })
})

app.post('/api/auth/logout', authenticateToken, (req, res) => {
    sessions.delete(req.token)
    res.json({ success: true })
})

app.post('/api/auth/refresh', (req, res) => {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(400).json({ error: '缺少刷新令牌' })

    const payload = verifyToken(refreshToken)
    if (!payload) return res.status(401).json({ error: '刷新令牌无效' })

    const user = users.get(payload.userId)
    if (!user) return res.status(401).json({ error: '用户不存在' })

    const newAccessToken = generateToken({ userId: user.id, role: user.role }, '2h')
    const newRefreshToken = generateToken({ userId: user.id, role: user.role }, '7d')

    sessions.set(newAccessToken, {
        userId: user.id,
        token: newAccessToken,
        refreshToken: newRefreshToken,
        createdAt: new Date().toISOString()
    })

    res.json({ token: newAccessToken, refreshToken: newRefreshToken })
})

// 用户注册
app.post('/api/auth/register', async (req, res) => {
    console.log('📝 收到注册请求:', req.body)
    const { username, password, name, department, position } = req.body

    if (!username || !password || !name) {
        console.log('❌ 注册失败: 必填字段为空')
        return res.status(400).json({ error: '用户名、密码和姓名不能为空' })
    }

    if (password.length < 6) {
        return res.status(400).json({ error: '密码长度至少6位' })
    }

    // 检查用户名是否已存在（内存中）
    for (const user of users.values()) {
        if (user.username === username) {
            return res.status(400).json({ error: '用户名已存在' })
        }
    }

    // 如果使用Prisma，检查数据库中是否已存在
    if (prisma) {
        try {
            const existingUser = await prisma.user.findUnique({ where: { username } })
            if (existingUser) {
                return res.status(400).json({ error: '用户名已存在' })
            }
        } catch (error) {
            console.error('检查用户是否存在失败:', error)
        }
    }

    // 创建新用户
    const userId = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)

    // 生成密码哈希
    let passwordHash
    if (bcrypt) {
        try {
            passwordHash = await bcrypt.hash(password, 10)
        } catch (e) {
            console.error('bcrypt哈希失败，使用SHA256:', e)
            passwordHash = hashPassword(password)
        }
    } else {
        passwordHash = hashPassword(password)
    }

    const newUser = {
        id: userId,
        username,
        password: passwordHash,
        name,
        role: 'USER', // 新注册用户默认为普通用户
        department: department || null,
        position: position || null,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: null
    }

    // 保存到内存
    users.set(userId, newUser)

    // 同步到数据库
    if (prisma) {
        try {
            await prisma.user.create({
                data: {
                    id: newUser.id,
                    username: newUser.username,
                    password: newUser.password,
                    name: newUser.name,
                    role: newUser.role,
                    department: newUser.department || null,
                    position: newUser.position || null,
                    isActive: newUser.isActive,
                    createdAt: new Date(newUser.createdAt),
                    lastLoginAt: null
                }
            })
            console.log('✅ 新用户已注册并同步到数据库:', username)
        } catch (error) {
            console.error('⚠️  同步用户到数据库失败:', error)
            // 继续注册流程，不阻止注册
        }
    }

    res.status(201).json({
        success: true,
        message: '注册成功',
        user: {
            id: newUser.id,
            username: newUser.username,
            name: newUser.name,
            role: newUser.role
        }
    })
})

// 更新个人信息（普通用户只能修改自己的信息）
app.put('/api/auth/profile', authenticateToken, (req, res) => {
    const user = users.get(req.user.userId)
    if (!user) return res.status(404).json({ error: '用户不存在' })

    const { name, department, position } = req.body
    if (name !== undefined) user.name = name
    if (department !== undefined) user.department = department
    if (position !== undefined) user.position = position

    // 同步到数据库
    if (prisma) {
        prisma.user.update({
            where: { id: user.id },
            data: {
                name: user.name,
                department: user.department || null,
                position: user.position || null
            }
        }).catch(err => console.error('更新用户信息到数据库失败:', err))
    }

    res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        department: user.department,
        position: user.position
    })
})

// 修改密码（普通用户只能修改自己的密码）
app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
    const user = users.get(req.user.userId)
    if (!user) return res.status(404).json({ error: '用户不存在' })

    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: '旧密码和新密码不能为空' })
    }

    // 验证旧密码
    const passwordValid = await verifyPassword(oldPassword, user.password)
    if (!passwordValid) {
        return res.status(400).json({ error: '旧密码错误' })
    }

    // 更新密码 - 优先使用bcrypt，否则使用SHA256
    let newPasswordHash
    if (bcrypt) {
        try {
            newPasswordHash = await bcrypt.hash(newPassword, 10)
        } catch (e) {
            console.error('bcrypt哈希失败，使用SHA256:', e)
            newPasswordHash = hashPassword(newPassword)
        }
    } else {
        newPasswordHash = hashPassword(newPassword)
    }

    user.password = newPasswordHash

    // 同步到数据库
    if (prisma) {
        try {
            await prisma.user.update({
                where: { id: user.id },
                data: { password: user.password }
            })
        } catch (err) {
            console.error('更新密码到数据库失败:', err)
        }
    }

    res.json({ success: true })
})

// ==========================================
// 管理员 API
// ==========================================
app.get('/api/admin/users', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), (req, res) => {
    const { page = 1, limit = 20, keyword = '' } = req.query
    let userList = Array.from(users.values())

    if (keyword) {
        const kw = keyword.toLowerCase()
        userList = userList.filter(u =>
            u.username.toLowerCase().includes(kw) ||
            u.name.toLowerCase().includes(kw)
        )
    }

    const start = (parseInt(page) - 1) * parseInt(limit)
    const data = userList.slice(start, start + parseInt(limit)).map(u => ({
        id: u.id,
        username: u.username,
        name: u.name,
        role: u.role,
        department: u.department,
        position: u.position,
        isActive: u.isActive,
        lastLoginAt: u.lastLoginAt,
        createdAt: u.createdAt
    }))

    res.json({ data, total: userList.length, page: parseInt(page), limit: parseInt(limit) })
})

app.post('/api/admin/users', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), (req, res) => {
    const { username, password, name, role = 'USER', department, position } = req.body
    if (!username || !password || !name) {
        return res.status(400).json({ error: '用户名、密码和姓名不能为空' })
    }

    // 检查用户名是否已存在
    for (const user of users.values()) {
        if (user.username === username) {
            return res.status(400).json({ error: '用户名已存在' })
        }
    }

    const id = 'user-' + Date.now()
    const newUser = {
        id,
        username,
        password: hashPassword(password),
        name,
        role,
        department,
        position,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: null
    }
    users.set(id, newUser)

    res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        role: newUser.role,
        department: newUser.department,
        position: newUser.position,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt
    })
})

app.put('/api/admin/users/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), (req, res) => {
    const user = users.get(req.params.id)
    if (!user) return res.status(404).json({ error: '用户不存在' })

    const { name, role, department, position } = req.body
    if (name) user.name = name
    if (role) user.role = role
    if (department !== undefined) user.department = department
    if (position !== undefined) user.position = position

    res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        department: user.department,
        position: user.position,
        isActive: user.isActive
    })
})

app.patch('/api/admin/users/:id/status', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), (req, res) => {
    const user = users.get(req.params.id)
    if (!user) return res.status(404).json({ error: '用户不存在' })

    const { isActive } = req.body
    user.isActive = isActive

    res.json({ id: user.id, isActive: user.isActive })
})

app.post('/api/admin/users/:id/reset-password', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), (req, res) => {
    const user = users.get(req.params.id)
    if (!user) return res.status(404).json({ error: '用户不存在' })

    const { newPassword } = req.body
    if (!newPassword) return res.status(400).json({ error: '新密码不能为空' })

    user.password = hashPassword(newPassword)
    res.json({ success: true })
})

// ==========================================
// 基础数据 API
// ==========================================
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head><title>铸剑乾坤 - API</title>
        <style>body{font-family:sans-serif;background:#1a1a2e;color:#fff;padding:40px}h1{color:#c9a55c}a{color:#c9a55c}.api{background:#252540;padding:15px;border-radius:8px;margin:10px 0}</style>
        </head>
        <body>
            <h1>🗡️ 铸剑乾坤 - 后端 API</h1>
            <p>服务运行正常！</p>
            <p>默认管理员: <strong>${config.admin.username}</strong> / <strong>${config.admin.password}</strong></p>
            <h2>可用接口：</h2>
            <div class="api"><a href="/api/health">/api/health</a> - 健康检查</div>
            <div class="api"><a href="/api/equipment">/api/equipment</a> - 装备列表</div>
            <div class="api"><a href="/api/history">/api/history</a> - 历史事件</div>
            <div class="api">POST /api/auth/login - 用户登录</div>
            <div class="api">POST /api/auth/register - 用户注册</div>
            <div class="api">GET /api/admin/users - 用户管理（需认证）</div>
        </body>
        </html>
    `)
})

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), users: users.size })
})

app.get('/api/equipment', (req, res) => {
    const { type, year } = req.query
    let result = equipmentData
    if (type) result = result.filter(e => e.type === type)
    if (year) result = result.filter(e => e.year === parseInt(year))
    res.json(result)
})

app.get('/api/equipment/:id', (req, res) => {
    const equipment = equipmentData.find(e => e.id === req.params.id)
    if (!equipment) return res.status(404).json({ error: '装备不存在' })
    res.json(equipment)
})

app.get('/api/history', (req, res) => {
    res.json(historyEvents)
})

app.get('/api/ideas', (req, res) => {
    res.json(ideas)
})

app.post('/api/ideas', (req, res) => {
    const idea = { id: String(ideas.length + 1), ...req.body, votes: 0, status: 'pending', createdAt: new Date().toISOString() }
    ideas.push(idea)
    res.status(201).json(idea)
})

// ==========================================
// 协同项目 API
// ==========================================
app.get('/api/collaborate/projects', (req, res) => {
    res.json(collaborateProjects)
})

app.get('/api/collaborate/projects/:id', (req, res) => {
    const project = collaborateProjects.find(p => p.id === req.params.id)
    if (!project) return res.status(404).json({ error: '项目不存在' })
    res.json(project)
})

app.get('/api/collaborate/annotations', async (req, res) => {
    const { projectId } = req.query
    try {
        if (prisma) {
            const where = projectId ? { projectId } : {}
            const dbAnnotations = await prisma.annotation.findMany({
                where,
                include: {
                    author: {
                        select: { id: true, name: true, username: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })
            // 转换为前端期望的格式
            const result = dbAnnotations.map(a => ({
                id: a.id,
                projectId: a.projectId,
                partId: a.partId,
                position: { x: a.positionX, y: a.positionY, z: a.positionZ },
                content: a.content,
                type: a.type,
                author: a.authorId,
                authorName: a.author.name,
                createdAt: a.createdAt.toISOString(),
                resolved: a.resolved,
                resolvedAt: a.resolvedAt?.toISOString(),
                resolvedBy: a.resolvedBy
            }))
            return res.json(result)
        } else {
            // 降级到内存存储
            let result = annotations
            if (projectId) result = result.filter(a => a.projectId === projectId)
            res.json(result)
        }
    } catch (error) {
        console.error('获取标注失败:', error)
        res.status(500).json({ error: '获取标注失败' })
    }
})

// 标注API - 需要认证，但允许可选（如果没有token则使用系统用户）
app.post('/api/collaborate/annotations', async (req, res, next) => {
    // 尝试获取认证信息，但不强制要求
    if (req.headers.authorization) {
        const token = req.headers.authorization.replace('Bearer ', '')
        const payload = verifyToken(token)
        if (payload) {
            const session = sessions.get(token)
            if (session) {
                req.user = payload
            }
        }
    }
    next()
}, async (req, res) => {
    try {
        const { projectId, partId, position, content, type, author, authorId } = req.body

        // 验证必要字段
        if (!projectId) {
            return res.status(400).json({ error: '项目ID不能为空' })
        }
        if (!content || !content.trim()) {
            return res.status(400).json({ error: '标注内容不能为空' })
        }

        console.log('📝 创建标注请求:', {
            projectId,
            partId,
            content: content.substring(0, 20),
            type,
            author,
            authorId,
            reqUser: req.user?.userId,
            hasAuth: !!req.user
        })

        if (prisma) {
            // 检查项目是否存在，如果不存在则创建
            let project = await prisma.project.findUnique({ where: { id: projectId } })
            if (!project) {
                // 项目不存在，尝试创建
                try {
                    project = await prisma.project.create({
                        data: {
                            id: projectId,
                            name: projectId,
                            modelType: 'tank',
                            status: 'active'
                        }
                    })
                    console.log('✅ 自动创建项目:', projectId)
                } catch (projectError) {
                    console.error('创建项目失败:', projectError)
                    // 如果创建失败，尝试使用第一个项目
                    const firstProject = await prisma.project.findFirst()
                    if (firstProject) {
                        project = firstProject
                        console.log('⚠️  使用现有项目:', firstProject.id)
                    } else {
                        throw new Error(`项目 ${projectId} 不存在且无法创建新项目`)
                    }
                }
            }
            const actualProjectId = project.id

            // 获取用户ID的优先级：
            // 1. 从认证token获取（最可靠，优先使用）
            // 2. 从请求体获取 authorId
            // 3. 从请求体获取 author
            let userId = req.user?.userId || authorId || author

            // 验证并获取最终的用户ID
            let finalUserId = null
            if (userId) {
                // 检查用户是否存在
                const existingUser = await prisma.user.findUnique({ where: { id: userId } })
                if (existingUser) {
                    finalUserId = existingUser.id
                    console.log('✅ 使用指定用户:', existingUser.name, existingUser.id)
                } else {
                    console.warn('⚠️  指定的用户不存在:', userId)
                }
            }

            // 如果用户ID无效，优先使用认证token中的用户
            if (!finalUserId && req.user?.userId) {
                const authUser = await prisma.user.findUnique({ where: { id: req.user.userId } })
                if (authUser) {
                    finalUserId = authUser.id
                    console.log('✅ 使用认证用户:', authUser.name, authUser.id)
                }
            }

            // 如果还是没有，使用admin用户
            if (!finalUserId) {
                const adminUser = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } })
                if (adminUser) {
                    finalUserId = adminUser.id
                    console.log('✅ 使用管理员用户:', adminUser.name, adminUser.id)
                } else {
                    // 最后使用第一个用户
                    const firstUser = await prisma.user.findFirst()
                    if (firstUser) {
                        finalUserId = firstUser.id
                        console.log('✅ 使用第一个用户:', firstUser.name, firstUser.id)
                    } else {
                        throw new Error('数据库中没有任何用户，请先创建用户')
                    }
                }
            }

            console.log('👤 最终使用用户ID:', finalUserId)

            // 保存到数据库
            const annotation = await prisma.annotation.create({
                data: {
                    projectId: actualProjectId,
                    partId: partId || null,
                    positionX: position?.x || 0,
                    positionY: position?.y || 0,
                    positionZ: position?.z || 0,
                    content,
                    type: type || 'info',
                    authorId: finalUserId,
                    resolved: false
                },
                include: {
                    author: {
                        select: { id: true, name: true, username: true }
                    }
                }
            })

            const result = {
                id: annotation.id,
                projectId: annotation.projectId,
                partId: annotation.partId,
                position: { x: annotation.positionX, y: annotation.positionY, z: annotation.positionZ },
                content: annotation.content,
                type: annotation.type,
                author: annotation.authorId,
                authorName: annotation.author.name,
                createdAt: annotation.createdAt.toISOString(),
                resolved: annotation.resolved
            }

            io.to(actualProjectId).emit('annotation-added', result)
            console.log('✅ 标注创建成功:', result.id)
            return res.status(201).json(result)
        } else {
            // 降级到内存存储
            const annotation = {
                id: `anno-${Date.now()}`,
                ...req.body,
                createdAt: new Date().toISOString(),
                resolved: false
            }
            annotations.push(annotation)
            io.to(projectId).emit('annotation-added', annotation)
            console.log('✅ 标注创建成功（内存存储）:', annotation.id)
            res.status(201).json(annotation)
        }
    } catch (error) {
        console.error('❌ 创建标注失败:', error)
        console.error('错误详情:', {
            code: error.code,
            message: error.message,
            meta: error.meta
        })

        const errorMessage = error.message || '创建标注失败'
        const errorDetails = process.env.NODE_ENV === 'development' ? error.stack : undefined

        // 如果是数据库相关错误，提供更详细的错误信息
        if (error.code === 'P2002') {
            return res.status(400).json({
                error: '标注已存在',
                message: errorMessage,
                details: errorDetails
            })
        }
        if (error.code === 'P2003') {
            return res.status(400).json({
                error: '关联的项目或用户不存在',
                message: errorMessage,
                details: errorDetails,
                hint: '请确保项目和用户已创建'
            })
        }

        res.status(500).json({
            error: errorMessage,
            message: errorMessage,
            code: error.code,
            details: errorDetails
        })
    }
})

app.put('/api/collaborate/annotations/:id', async (req, res) => {
    try {
        if (prisma) {
            const { id } = req.params
            const { content, type, partId, position } = req.body

            const updateData = {}
            if (content !== undefined) updateData.content = content
            if (type !== undefined) updateData.type = type
            if (partId !== undefined) updateData.partId = partId
            if (position) {
                updateData.positionX = position.x || 0
                updateData.positionY = position.y || 0
                updateData.positionZ = position.z || 0
            }

            const annotation = await prisma.annotation.update({
                where: { id },
                data: updateData,
                include: {
                    author: {
                        select: { id: true, name: true, username: true }
                    }
                }
            })

            const result = {
                id: annotation.id,
                projectId: annotation.projectId,
                partId: annotation.partId,
                position: { x: annotation.positionX, y: annotation.positionY, z: annotation.positionZ },
                content: annotation.content,
                type: annotation.type,
                author: annotation.authorId,
                authorName: annotation.author.name,
                createdAt: annotation.createdAt.toISOString(),
                updatedAt: annotation.updatedAt.toISOString(),
                resolved: annotation.resolved
            }

            io.to(annotation.projectId).emit('annotation-updated', result)
            return res.json(result)
        } else {
            // 降级到内存存储
            const index = annotations.findIndex(a => a.id === req.params.id)
            if (index === -1) return res.status(404).json({ error: '标注不存在' })
            annotations[index] = { ...annotations[index], ...req.body, updatedAt: new Date().toISOString() }
            io.to(annotations[index].projectId).emit('annotation-updated', annotations[index])
            res.json(annotations[index])
        }
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: '标注不存在' })
        }
        console.error('更新标注失败:', error)
        res.status(500).json({ error: '更新标注失败' })
    }
})

app.delete('/api/collaborate/annotations/:id', async (req, res) => {
    try {
        if (prisma) {
            const annotation = await prisma.annotation.findUnique({
                where: { id: req.params.id },
                select: { id: true, projectId: true }
            })

            if (!annotation) {
                return res.status(404).json({ error: '标注不存在' })
            }

            await prisma.annotation.delete({
                where: { id: req.params.id }
            })

            io.to(annotation.projectId).emit('annotation-deleted', annotation.id)
            return res.json({ success: true, id: annotation.id })
        } else {
            // 降级到内存存储
            const index = annotations.findIndex(a => a.id === req.params.id)
            if (index === -1) return res.status(404).json({ error: '标注不存在' })
            const deleted = annotations.splice(index, 1)[0]
            io.to(deleted.projectId).emit('annotation-deleted', deleted.id)
            res.json({ success: true })
        }
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: '标注不存在' })
        }
        console.error('删除标注失败:', error)
        res.status(500).json({ error: '删除标注失败' })
    }
})

app.post('/api/collaborate/annotations/:id/resolve', async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body

        if (prisma) {
            const annotation = await prisma.annotation.update({
                where: { id },
                data: {
                    resolved: true,
                    resolvedAt: new Date(),
                    resolvedBy: userId || null
                },
                include: {
                    author: {
                        select: { id: true, name: true, username: true }
                    }
                }
            })

            const result = {
                id: annotation.id,
                projectId: annotation.projectId,
                partId: annotation.partId,
                position: { x: annotation.positionX, y: annotation.positionY, z: annotation.positionZ },
                content: annotation.content,
                type: annotation.type,
                author: annotation.authorId,
                authorName: annotation.author.name,
                createdAt: annotation.createdAt.toISOString(),
                resolved: annotation.resolved,
                resolvedAt: annotation.resolvedAt?.toISOString(),
                resolvedBy: annotation.resolvedBy
            }

            io.to(annotation.projectId).emit('annotation-updated', result)
            return res.json(result)
        } else {
            // 降级到内存存储
            const index = annotations.findIndex(a => a.id === id)
            if (index === -1) return res.status(404).json({ error: '标注不存在' })
            annotations[index] = {
                ...annotations[index],
                resolved: true,
                resolvedAt: new Date().toISOString(),
                resolvedBy: userId
            }
            io.to(annotations[index].projectId).emit('annotation-updated', annotations[index])
            res.json(annotations[index])
        }
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: '标注不存在' })
        }
        console.error('解决标注失败:', error)
        res.status(500).json({ error: '解决标注失败' })
    }
})

app.get('/api/collaborate/versions', (req, res) => {
    const { projectId } = req.query
    let result = versionHistory
    if (projectId) result = result.filter(v => v.projectId === projectId)
    res.json(result)
})

app.post('/api/collaborate/versions', (req, res) => {
    const version = {
        id: `ver-${Date.now()}`,
        ...req.body,
        createdAt: new Date().toISOString()
    }
    versionHistory.unshift(version)
    res.status(201).json(version)
})

app.get('/api/collaborate/disassembly/:projectId', (req, res) => {
    res.json({
        parts: [
            { id: 'part1', name: '动力核心', visible: true, exploded: false },
            { id: 'part2', name: '冷却系统', visible: true, exploded: false },
            { id: 'part3', name: '传动装置', visible: true, exploded: false },
            { id: 'part4', name: '控制模块', visible: true, exploded: false }
        ],
        explodeLevel: 0
    })
})

app.post('/api/collaborate/disassembly/:projectId/toggle-part', (req, res) => {
    res.json({ success: true })
})

app.post('/api/collaborate/disassembly/:projectId/explode', (req, res) => {
    res.json({ success: true, level: req.body.level })
})

app.post('/api/collaborate/disassembly/:projectId/reset', (req, res) => {
    res.json({ success: true })
})

app.get('/api/collaborate/gjb/rules', (req, res) => {
    res.json(gjbRules)
})

app.get('/api/collaborate/gjb/results', (req, res) => {
    const { projectId } = req.query
    let result = gjbCheckResults
    if (projectId) result = result.filter(r => r.projectId === projectId)
    res.json(result)
})

app.post('/api/collaborate/gjb/check', (req, res) => {
    const { projectId } = req.body
    const newResults = gjbRules.map(rule => {
        const score = Math.floor(Math.random() * 40) + 60
        return {
            id: `check-${Date.now()}-${rule.id}`,
            projectId,
            ruleId: rule.id,
            ruleName: rule.name,
            category: rule.category,
            standard: rule.standard,
            status: score >= 80 ? 'passed' : score >= 60 ? 'warning' : 'failed',
            score,
            details: `${rule.name}检查${score >= 80 ? '通过' : score >= 60 ? '存在风险' : '未通过'}，评分${score}分`,
            checkedAt: new Date().toISOString(),
            checkedBy: 'AI-Agent'
        }
    })
    gjbCheckResults = gjbCheckResults.filter(r => r.projectId !== projectId)
    gjbCheckResults.push(...newResults)

    const passed = newResults.filter(r => r.status === 'passed').length
    const warning = newResults.filter(r => r.status === 'warning').length
    const failed = newResults.filter(r => r.status === 'failed').length

    res.json({
        projectId,
        totalChecks: newResults.length,
        passed, warning, failed,
        complianceRate: Math.round((passed / newResults.length) * 100),
        checkedAt: new Date().toISOString(),
        results: newResults
    })
})

app.get('/api/collaborate/sync/records', (req, res) => {
    const { projectId } = req.query
    let result = syncRecords
    if (projectId) result = result.filter(r => r.projectId === projectId)
    res.json(result)
})

app.post('/api/collaborate/sync/upload', (req, res) => {
    const record = {
        id: `sync-${Date.now()}`,
        ...req.body,
        type: 'upload',
        status: 'completed',
        progress: 100,
        syncedAt: new Date().toISOString()
    }
    syncRecords.unshift(record)
    res.json(record)
})

app.post('/api/collaborate/sync/download', (req, res) => {
    const record = {
        id: `sync-${Date.now()}`,
        ...req.body,
        type: 'download',
        status: 'completed',
        progress: 100,
        syncedAt: new Date().toISOString()
    }
    syncRecords.unshift(record)
    res.json(record)
})

app.get('/api/collaborate/sync/status/:projectId', (req, res) => {
    const projectRecords = syncRecords.filter(r => r.projectId === req.params.projectId)
    res.json({
        projectId: req.params.projectId,
        lastSync: projectRecords[0]?.syncedAt || null,
        pendingOperations: 0,
        totalUploads: projectRecords.filter(r => r.type === 'upload').length,
        totalDownloads: projectRecords.filter(r => r.type === 'download').length,
        totalSize: projectRecords.reduce((sum, r) => sum + (r.fileSize || 0), 0)
    })
})

app.get('/api/collaborate/monitoring/:projectId', (req, res) => {
    const timestamp = Date.now()
    const elapsed = timestamp / 1000
    res.json({
        projectId: req.params.projectId,
        timestamp: new Date().toISOString(),
        data: {
            structuralStress: Math.round((45 + Math.sin(elapsed * 0.5) * 10) * 10) / 10,
            thermalLoad: Math.round((65 + Math.sin(elapsed * 0.3) * 15) * 10) / 10,
            collaborationDelay: Math.round((12 + Math.random() * 5) * 10) / 10,
            powerOutput: Math.round((1100 + Math.sin(elapsed * 0.2) * 100) * 10) / 10,
            systemEfficiency: 85,
            vibrationAmplitude: Math.round((0.35 + Math.sin(elapsed * 2) * 0.1) * 100) / 100,
            systemPressure: Math.round((6.5 + Math.sin(elapsed * 0.4) * 0.5) * 10) / 10,
            coolingFlow: 280
        }
    })
})

// ==========================================
// AI 装备设计 API
// ==========================================
app.post('/api/ai/analyze-design', authenticateToken, async (req, res) => {
    const { prompt } = req.body
    if (!prompt || !prompt.trim()) {
        return res.status(400).json({ error: '设计需求不能为空' })
    }

    try {
        const result = await analyzeEquipmentDesign(prompt)

        if (prisma) {
            // 获取用户ID，确保用户存在
            let userId = req.user?.userId

            // 如果用户ID不存在，尝试使用admin用户或创建系统用户
            if (!userId) {
                const adminUser = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } })
                if (adminUser) {
                    userId = adminUser.id
                } else {
                    // 尝试创建或使用系统用户
                    try {
                        const systemUser = await prisma.user.upsert({
                            where: { id: 'system' },
                            update: {},
                            create: {
                                id: 'system',
                                username: 'system',
                                password: hashPassword('system'),
                                name: '系统用户',
                                role: 'USER'
                            }
                        })
                        userId = systemUser.id
                    } catch (createError) {
                        console.error('创建系统用户失败:', createError)
                        // 如果创建失败，尝试使用第一个用户
                        const firstUser = await prisma.user.findFirst()
                        if (firstUser) {
                            userId = firstUser.id
                        } else {
                            throw new Error('数据库中没有任何用户，请先创建用户')
                        }
                    }
                }
            } else {
                // 检查用户是否存在
                const existingUser = await prisma.user.findUnique({ where: { id: userId } })
                if (!existingUser) {
                    // 用户不存在，使用admin用户
                    const adminUser = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } })
                    if (adminUser) {
                        userId = adminUser.id
                    } else {
                        // 如果连admin都没有，创建系统用户
                        const systemUser = await prisma.user.upsert({
                            where: { id: 'system' },
                            update: {},
                            create: {
                                id: 'system',
                                username: 'system',
                                password: hashPassword('system'),
                                name: '系统用户',
                                role: 'USER'
                            }
                        })
                        userId = systemUser.id
                    }
                }
            }

            console.log('💾 保存AI设计，用户ID:', userId)

            // 保存到数据库
            const design = await prisma.aIDesign.create({
                data: {
                    userId: userId,
                    prompt: prompt,
                    name: result.name,
                    equipmentType: result.equipmentType,
                    modelType: result.modelType,
                    description: result.description || null,
                    stats: JSON.stringify(result.stats),
                    designSuggestions: result.designSuggestions ? JSON.stringify(result.designSuggestions) : null,
                    technicalSpecs: result.technicalSpecs ? JSON.stringify(result.technicalSpecs) : null,
                    analysis: result.analysis ? JSON.stringify(result.analysis) : null
                }
            })

            console.log('✅ AI设计保存成功:', design.id)

            res.json({
                success: true,
                data: result,
                designId: design.id
            })
        } else {
            // 降级到文件存储
            const design = {
                id: `design-${Date.now()}`,
                userId: req.user.userId,
                prompt: prompt,
                name: result.name,
                equipmentType: result.equipmentType,
                modelType: result.modelType,
                description: result.description,
                stats: result.stats,
                designSuggestions: result.designSuggestions,
                technicalSpecs: result.technicalSpecs,
                analysis: result.analysis,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            aiDesigns.unshift(design) // 添加到开头
            saveDesigns() // 持久化到文件

            res.json({
                success: true,
                data: result,
                designId: design.id
            })
        }
    } catch (error) {
        console.error('❌ AI分析/保存失败:', error)
        console.error('错误详情:', {
            code: error.code,
            message: error.message,
            meta: error.meta
        })

        const errorMessage = error.message || 'AI分析失败，请检查AI服务配置'
        const errorDetails = process.env.NODE_ENV === 'development' ? error.stack : undefined

        // 如果是数据库相关错误，提供更详细的错误信息
        if (error.code === 'P2003') {
            return res.status(400).json({
                error: '关联的用户不存在',
                message: errorMessage,
                details: errorDetails,
                hint: '请确保用户已创建'
            })
        }

        res.status(500).json({
            error: errorMessage,
            message: errorMessage,
            code: error.code,
            details: errorDetails
        })
    }
})

// 获取设计方案列表
app.get('/api/ai/designs', authenticateToken, async (req, res) => {
    try {
        let userId = req.user?.userId

        if (prisma) {
            // 验证用户是否存在，如果不存在则使用实际存在的用户
            if (userId) {
                const existingUser = await prisma.user.findUnique({ where: { id: userId } })
                if (!existingUser) {
                    console.warn('⚠️  查询用户不存在:', userId, '，尝试查找其他用户')
                    // 使用admin用户或第一个用户
                    const adminUser = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } })
                    if (adminUser) {
                        userId = adminUser.id
                        console.log('✅ 使用管理员用户查询:', adminUser.name, adminUser.id)
                    } else {
                        const firstUser = await prisma.user.findFirst()
                        if (firstUser) {
                            userId = firstUser.id
                            console.log('✅ 使用第一个用户查询:', firstUser.name, firstUser.id)
                        } else {
                            userId = null
                        }
                    }
                } else {
                    console.log('✅ 使用认证用户查询:', existingUser.name, existingUser.id)
                }
            }

            // 如果还是没有用户ID，查询所有设计方案（或者返回空）
            // 注意：如果认证用户不存在，可能保存时用了system用户，所以也要查询system用户的设计
            let whereClause = userId ? { userId } : {}

            // 如果用户不存在，尝试查询system用户的设计（因为保存时可能用了system）
            if (!userId || !await prisma.user.findUnique({ where: { id: userId } })) {
                const systemUser = await prisma.user.findFirst({ where: { id: 'system' } })
                if (systemUser) {
                    whereClause = { userId: 'system' }
                    console.log('🔍 用户不存在，查询system用户的设计方案')
                } else {
                    // 如果连system都没有，查询所有
                    whereClause = {}
                    console.log('🔍 查询所有设计方案')
                }
            } else {
                console.log('🔍 查询用户的设计方案:', userId)
            }

            const designs = await prisma.aIDesign.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' }
            })

            console.log('📊 查询到设计方案:', designs.length, '个')

            const result = designs.map(d => ({
                id: d.id,
                userId: d.userId,
                prompt: d.prompt,
                name: d.name,
                equipmentType: d.equipmentType,
                modelType: d.modelType,
                description: d.description,
                stats: JSON.parse(d.stats),
                designSuggestions: d.designSuggestions ? JSON.parse(d.designSuggestions) : null,
                technicalSpecs: d.technicalSpecs ? JSON.parse(d.technicalSpecs) : null,
                analysis: d.analysis ? JSON.parse(d.analysis) : null,
                createdAt: d.createdAt.toISOString(),
                updatedAt: d.updatedAt.toISOString()
            }))

            console.log('📤 返回设计方案列表:', result.length, '个')
            console.log('📤 返回的数据示例:', result.length > 0 ? JSON.stringify(result[0], null, 2) : '无数据')
            return res.json({
                success: true,
                data: result,
                total: result.length
            })
        } else {
            // 降级到文件存储
            const userDesigns = aiDesigns.filter(d => d.userId === userId)
            res.json({
                success: true,
                data: userDesigns,
                total: userDesigns.length
            })
        }
    } catch (error) {
        console.error('获取设计方案失败:', error)
        res.status(500).json({ error: '获取设计方案失败' })
    }
})

// 获取单个设计方案
app.get('/api/ai/designs/:id', authenticateToken, async (req, res) => {
    try {
        let userId = req.user?.userId
        const { id } = req.params

        if (prisma) {
            // 验证用户是否存在，如果不存在则使用实际存在的用户
            if (userId) {
                const existingUser = await prisma.user.findUnique({ where: { id: userId } })
                if (!existingUser) {
                    // 用户不存在，使用system用户
                    const systemUser = await prisma.user.findFirst({ where: { id: 'system' } })
                    if (systemUser) {
                        userId = 'system'
                    } else {
                        userId = null
                    }
                }
            }

            // 如果用户不存在，查询时不限制userId（因为可能保存时用了system）
            const whereClause = userId ? { id, userId } : { id }
            const design = await prisma.aIDesign.findFirst({
                where: whereClause
            })

            if (!design) {
                return res.status(404).json({ error: '设计方案不存在' })
            }

            return res.json({
                success: true,
                data: {
                    equipmentType: design.equipmentType,
                    modelType: design.modelType,
                    name: design.name,
                    description: design.description,
                    stats: JSON.parse(design.stats),
                    designSuggestions: design.designSuggestions ? JSON.parse(design.designSuggestions) : null,
                    technicalSpecs: design.technicalSpecs ? JSON.parse(design.technicalSpecs) : null,
                    analysis: design.analysis ? JSON.parse(design.analysis) : null
                }
            })
        } else {
            // 降级到文件存储
            const design = aiDesigns.find(d => d.id === id && d.userId === userId)
            if (!design) {
                return res.status(404).json({ error: '设计方案不存在' })
            }
            res.json({
                success: true,
                data: {
                    equipmentType: design.equipmentType,
                    modelType: design.modelType,
                    name: design.name,
                    description: design.description,
                    stats: design.stats,
                    designSuggestions: design.designSuggestions,
                    technicalSpecs: design.technicalSpecs,
                    analysis: design.analysis
                }
            })
        }
    } catch (error) {
        console.error('获取设计方案失败:', error)
        res.status(500).json({ error: '获取设计方案失败' })
    }
})

// 删除设计方案
app.delete('/api/ai/designs/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params

        console.log('🗑️  删除设计方案请求:', { id, userId: req.user?.userId })

        if (prisma) {
            // 直接按ID查找设计方案（不限制userId，因为保存时可能用了不同用户）
            const design = await prisma.aIDesign.findUnique({
                where: { id }
            })

            if (!design) {
                console.error('❌ 删除：设计方案不存在:', id)
                return res.status(404).json({ error: '设计方案不存在' })
            }

            console.log('✅ 删除：找到设计方案:', design.id, design.name)

            await prisma.aIDesign.delete({
                where: { id }
            })

            console.log('✅ 删除：设计方案已删除')
            return res.json({ success: true })
        } else {
            // 降级到文件存储
            const index = aiDesigns.findIndex(d => d.id === id)
            if (index === -1) {
                return res.status(404).json({ error: '设计方案不存在' })
            }
            aiDesigns.splice(index, 1)
            saveDesigns()
            res.json({ success: true })
        }
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: '设计方案不存在' })
        }
        console.error('删除设计方案失败:', error)
        res.status(500).json({ error: '删除设计方案失败' })
    }
})

// ==========================================
// 问题反馈 API
// ==========================================

// 简单的邮件发送功能（使用QQ邮箱SMTP）
let nodemailer = null
try {
    nodemailer = require('nodemailer')
} catch (e) {
    console.warn('⚠️  nodemailer未安装，问题反馈将不会发送邮件')
    console.warn('   请运行: cd backend && npm install nodemailer')
}

// 创建邮件传输器
let mailTransporter = null
let emailConfig = null
if (nodemailer) {
    // 配置QQ邮箱SMTP（需要用户配置自己的邮箱和授权码）
    // 注意：这里使用环境变量，如果没有配置则使用控制台输出
    emailConfig = {
        host: process.env.SMTP_HOST || 'smtp.qq.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER || '', // QQ邮箱
            pass: process.env.SMTP_PASS || '' // QQ邮箱授权码
        }
    }

    if (emailConfig.auth.user && emailConfig.auth.pass) {
        try {
            mailTransporter = nodemailer.createTransport(emailConfig)
            console.log('✅ 邮件服务已配置')
        } catch (e) {
            console.warn('⚠️  邮件服务配置失败:', e.message)
        }
    } else {
        console.warn('⚠️  邮件服务未配置，问题反馈将只保存到控制台')
        console.warn('   请设置环境变量: SMTP_USER 和 SMTP_PASS')
    }
}

// 发送邮件到指定邮箱
async function sendFeedbackEmail(description, userEmail) {
    const targetEmail = '3022339344@qq.com'
    const subject = '【铸剑乾坤】用户问题反馈'
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #c9a55c;">用户问题反馈</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>用户邮箱：</strong>${userEmail || '未提供'}</p>
                <p><strong>反馈时间：</strong>${new Date().toLocaleString('zh-CN')}</p>
            </div>
            <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h3 style="color: #333; margin-top: 0;">问题描述：</h3>
                <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${description}</p>
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
                此邮件由铸剑乾坤技术支持中心自动发送
            </p>
        </div>
    `

    if (mailTransporter && emailConfig) {
        try {
            await mailTransporter.sendMail({
                from: emailConfig.auth.user,
                to: targetEmail,
                subject: subject,
                html: html
            })
            console.log('✅ 问题反馈邮件已发送到:', targetEmail)
            return true
        } catch (error) {
            console.error('❌ 发送邮件失败:', error)
            return false
        }
    } else {
        // 如果没有配置邮件服务，输出到控制台
        console.log('')
        console.log('==========================================')
        console.log('   收到新的问题反馈')
        console.log('==========================================')
        console.log('用户邮箱:', userEmail || '未提供')
        console.log('反馈时间:', new Date().toLocaleString('zh-CN'))
        console.log('问题描述:', description)
        console.log('==========================================')
        console.log('')
        return true
    }
}

// 提交问题反馈
app.post('/api/support/feedback', async (req, res) => {
    try {
        const { description, email } = req.body

        if (!description || !description.trim()) {
            return res.status(400).json({ error: '问题描述不能为空' })
        }

        if (!email || !email.trim()) {
            return res.status(400).json({ error: '联系邮箱不能为空' })
        }

        // 简单的邮箱格式验证
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: '邮箱格式不正确' })
        }

        // 发送邮件
        const emailSent = await sendFeedbackEmail(description.trim(), email.trim())

        // 保存反馈到数据库（如果使用Prisma）
        if (prisma) {
            try {
                // 这里可以创建一个Feedback表来保存反馈记录
                // 暂时先不实现，因为schema中可能没有这个表
            } catch (error) {
                console.error('保存反馈到数据库失败:', error)
            }
        }

        res.json({
            success: true,
            message: emailSent ? '问题反馈已提交，我们会尽快处理' : '问题反馈已提交（邮件发送失败，但已记录）'
        })
    } catch (error) {
        console.error('处理问题反馈失败:', error)
        res.status(500).json({ error: '提交失败，请稍后重试' })
    }
})

// ==========================================
// WebSocket
// ==========================================
io.on('connection', (socket) => {
    console.log('🔗 用户连接:', socket.id)

    socket.on('join-project', (data) => {
        socket.join(data.projectId)
        console.log(`👤 用户加入项目 ${data.projectId}`)
    })

    socket.on('leave-project', (data) => {
        socket.leave(data.projectId)
    })

    socket.on('disconnect', () => {
        console.log('❌ 用户断开:', socket.id)
    })
})

// ==========================================
// 启动服务
// ==========================================
// 优先从环境变量读取端口，如果没有则使用默认端口（开发环境通常由 .env 提供 3001）
// 这样可以同时兼容本地开发和 Zeabur (8080) 部署
const PORT = process.env.PORT || 8080

// Vercel 环境下不需要调用 listen，由平台接管应用生命周期
if (!process.env.VERCEL) {
    httpServer.listen(PORT, '0.0.0.0', () => {
        console.log('🚀 后端服务已启动')
        console.log(`🌐 监听端口: ${PORT}`)
        console.log(`🔑 管理员: ${config.admin.username} / ${config.admin.password}`)
    })
}

// 导出 app 以供 Vercel Serverless Function 使用
module.exports = app

// 添加错误处理
if (!process.env.VERCEL) {
    httpServer.on('error', (err) => {
        console.error('❌ 服务器启动失败:', err)
        process.exit(1)
    })
}

process.on('uncaughtException', (err) => {
    console.error('❌ 未捕获的异常:', err)
    process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ 未处理的 Promise 拒绝:', reason)
})

// 优雅关闭 - 关闭数据库连接
process.on('SIGINT', async () => {
    console.log('\n正在关闭服务器...')
    if (prisma) {
        await prisma.$disconnect()
        console.log('✅ 数据库连接已关闭')
    }
    process.exit(0)
})

process.on('SIGTERM', async () => {
    console.log('\n正在关闭服务器...')
    if (prisma) {
        await prisma.$disconnect()
        console.log('✅ 数据库连接已关闭')
    }
    process.exit(0)
})
