# 免费部署指南 - Railway（推荐）

Railway 提供 $5/月的免费额度，非常适合部署本项目！

## 🎯 为什么选择 Railway？

- ✅ **完全免费**：$5/月免费额度，足够小型项目使用
- ✅ **自动 HTTPS**：自动配置 SSL 证书
- ✅ **支持 Docker**：完美支持我们的 docker-compose
- ✅ **自动部署**：连接 GitHub 后自动部署
- ✅ **简单易用**：几分钟即可完成部署

---

## 📋 部署步骤

### 第一步：注册 Railway 账号

1. 访问 https://railway.app
2. 点击 "Start a New Project"
3. 使用 GitHub 账号登录（推荐）或邮箱注册

### 第二步：创建新项目

1. 登录后，点击 "New Project"
2. 选择 "Deploy from GitHub repo"（如果代码在 GitHub）
   - 或选择 "Empty Project"（如果代码在本地）

### 第三步：部署后端服务

#### 方式 A：从 GitHub 部署（推荐）

1. 如果项目在 GitHub：
   - 选择你的仓库
   - Railway 会自动检测 Docker
   - 选择 `backend` 目录作为根目录

2. 配置环境变量：
   在 Railway 项目设置中添加以下环境变量：

   ```env
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=file:./prisma/swordforge.db
   JWT_SECRET=your_strong_random_secret_here
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_strong_password_here
   CORS_ORIGIN=https://your-frontend-domain.railway.app
   AI_PROVIDER=zhipu
   AI_API_KEY=your_ai_api_key_here
   ```

3. 添加启动命令：
   - 在 Railway 设置中，添加启动命令：
   ```
   npx prisma generate && npx prisma migrate deploy && npm start
   ```

#### 方式 B：使用 Railway CLI（本地部署）

1. 安装 Railway CLI：
   ```bash
   # Windows (PowerShell)
   irm https://railway.app/install.ps1 | iex
   
   # Mac/Linux
   curl -fsSL https://railway.app/install.sh | sh
   ```

2. 登录 Railway：
   ```bash
   railway login
   ```

3. 初始化项目：
   ```bash
   cd backend
   railway init
   ```

4. 部署：
   ```bash
   railway up
   ```

### 第四步：部署前端服务

1. 在 Railway 中创建新服务：
   - 点击 "New Service"
   - 选择 "GitHub Repo" 或 "Empty Service"

2. 配置前端：
   - 根目录选择 `frontend`
   - Railway 会自动检测 Docker

3. 配置环境变量：
   ```env
   VITE_API_BASE_URL=https://your-backend-service.railway.app/api
   VITE_SOCKET_URL=https://your-backend-service.railway.app
   ```

4. 构建配置：
   - Railway 会自动运行 `npm run build`
   - 使用 nginx 服务静态文件

### 第五步：获取访问地址

1. 部署完成后，Railway 会提供：
   - 后端地址：`https://your-backend-service.railway.app`
   - 前端地址：`https://your-frontend-service.railway.app`

2. 更新 CORS 配置：
   - 在后端环境变量中，更新 `CORS_ORIGIN` 为前端地址

---

## 🔧 详细配置说明

### 后端环境变量（必需）

```env
# 基础配置
NODE_ENV=production
PORT=3001

# 数据库（Railway 会自动处理）
DATABASE_URL=file:./prisma/swordforge.db

# 安全配置（务必修改！）
JWT_SECRET=生成一个32位以上的随机字符串
ADMIN_USERNAME=admin
ADMIN_PASSWORD=设置一个强密码

# CORS（设置为前端地址）
CORS_ORIGIN=https://your-frontend.railway.app

# AI 配置（可选）
AI_PROVIDER=zhipu
AI_API_KEY=你的AI密钥
```

### 前端环境变量（必需）

```env
# API 地址（使用后端 Railway 地址）
VITE_API_BASE_URL=https://your-backend.railway.app/api
VITE_SOCKET_URL=https://your-backend.railway.app
```

---

## 🚀 快速部署脚本

### 使用 Railway CLI 一键部署

创建 `railway-deploy.sh`：

```bash
#!/bin/bash

echo "🚀 开始部署到 Railway..."

# 检查 Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI 未安装"
    echo "安装命令："
    echo "  Windows: irm https://railway.app/install.ps1 | iex"
    echo "  Mac/Linux: curl -fsSL https://railway.app/install.sh | sh"
    exit 1
fi

# 部署后端
echo "📦 部署后端..."
cd backend
railway up
cd ..

# 部署前端
echo "📦 部署前端..."
cd frontend
railway up
cd ..

echo "✅ 部署完成！"
echo "查看服务：https://railway.app/dashboard"
```

---

## 📝 Railway 配置文件

### 创建 `railway.json`（后端）

在 `backend` 目录创建 `railway.json`：

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "npx prisma generate && npx prisma migrate deploy && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 创建 `railway.json`（前端）

在 `frontend` 目录创建 `railway.json`：

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 🔍 常见问题

### 1. 如何查看日志？

在 Railway 控制台：
- 点击服务
- 查看 "Deployments" 标签
- 点击部署记录查看日志

### 2. 如何更新代码？

如果连接了 GitHub：
- 推送代码到 GitHub
- Railway 会自动检测并重新部署

手动部署：
```bash
railway up
```

### 3. 数据库数据会丢失吗？

Railway 的免费套餐：
- 数据会持久化
- 但如果删除服务，数据会丢失
- 建议定期备份数据库

### 4. 如何备份数据库？

```bash
# 在 Railway 控制台打开服务终端
railway run --service backend sh

# 备份数据库
cp prisma/swordforge.db prisma/swordforge.db.backup
```

### 5. 免费额度用完了怎么办？

- Railway 会暂停服务
- 可以升级到付费套餐（$5/月起）
- 或迁移到其他免费服务

---

## 🎯 替代方案：Render

如果 Railway 不可用，可以使用 Render：

### Render 部署步骤

1. 注册账号：https://render.com
2. 创建新 Web Service
3. 连接 GitHub 仓库
4. 配置：
   - Build Command: `cd backend && npm install && npx prisma generate`
   - Start Command: `cd backend && npm start`
5. 添加环境变量（同 Railway）

---

## 📊 免费额度对比

| 服务 | 免费额度 | 限制 |
|------|---------|------|
| Railway | $5/月 | 足够小型项目 |
| Render | 有限制 | 服务可能休眠 |
| Fly.io | 3个共享实例 | 适合测试 |

---

## ✅ 部署检查清单

- [ ] 注册 Railway 账号
- [ ] 创建后端服务并配置环境变量
- [ ] 创建前端服务并配置环境变量
- [ ] 更新 CORS 配置
- [ ] 测试访问应用
- [ ] 配置自定义域名（可选）

---

## 🎉 完成！

部署完成后，你可以：
- 访问前端地址使用应用
- 在 Railway 控制台查看服务状态
- 查看日志和监控信息

**默认管理员账号：**
- 用户名：`admin`
- 密码：你在环境变量中设置的 `ADMIN_PASSWORD`

---

## 🔗 相关链接

- [Railway 官网](https://railway.app)
- [Railway 文档](https://docs.railway.app)
- [快速开始指南](./QUICK_START.md)
- [详细部署文档](./DEPLOY.md)

---

**需要帮助？** 查看 Railway 文档或提交 Issue！

