const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const config = require('../src/config')

const prisma = new PrismaClient()

async function main() {
    // 创建权限
    const permissions = [
        { code: 'USER_READ', name: '查看用户', description: '查看用户列表与详情' },
        { code: 'USER_WRITE', name: '管理用户', description: '创建/编辑/停用用户' },
        { code: 'PROJECT_READ', name: '查看项目', description: '查看项目数据' },
        { code: 'PROJECT_WRITE', name: '管理项目', description: '创建/编辑项目' },
        { code: 'ANNOTATION_WRITE', name: '管理标注', description: '新增/编辑标注' },
        { code: 'GJB_RUN', name: '运行合规检查', description: '执行GJB检查' },
        { code: 'SYNC_RUN', name: '云同步', description: '执行同步任务' },
        { code: 'AUDIT_READ', name: '查看审计日志', description: '查看系统审计记录' }
    ]

    for (const perm of permissions) {
        await prisma.permission.upsert({
            where: { code: perm.code },
            update: perm,
            create: perm
        })
    }

    // 创建超级管理员
    const adminUsername = config.admin.username
    const adminPassword = config.admin.password

    const existingAdmin = await prisma.user.findUnique({
        where: { username: adminUsername }
    })

    if (!existingAdmin) {
        const hashed = await bcrypt.hash(adminPassword, 10)
        await prisma.user.create({
            data: {
                username: adminUsername,
                password: hashed,
                name: config.admin.name,
                role: 'SUPER_ADMIN',
                isActive: true
            }
        })
        console.log('✅ 已创建超级管理员账号:', adminUsername)
    } else {
        console.log('ℹ️ 超级管理员已存在，跳过创建')
    }

    // 绑定权限到角色（简化：超级管理员绑定所有权限）
    const allPerms = await prisma.permission.findMany()
    for (const perm of allPerms) {
        await prisma.rolePermission.upsert({
            where: {
                role_permission: {
                    role: 'SUPER_ADMIN',
                    permissionId: perm.id
                }
            },
            update: {},
            create: {
                role: 'SUPER_ADMIN',
                permissionId: perm.id
            }
        })
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

