const path = require('path')
// 尝试加载dotenv，如果没有安装则忽略
try {
    require('dotenv').config()
} catch (e) {
    // dotenv未安装，使用默认配置
}

const config = {
    databaseUrl: process.env.DATABASE_URL || `file:${path.join(__dirname, '../prisma/swordforge.db')}`,
    jwtSecret: process.env.JWT_SECRET || 'swordforge_super_secret_change_me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    admin: {
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || '123456',
        name: process.env.ADMIN_NAME || '系统管理员'
    },
    ai: {
        provider: process.env.AI_PROVIDER || 'zhipu',
        apiKey: process.env.AI_API_KEY || '1285a50b545345489e00918181f4f703.JSOrs6T22vmT3rR5',
        baseUrl: process.env.AI_BASE_URL || ''
    }
}

module.exports = config

