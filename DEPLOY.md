# 铸剑乾坤 - 部署指南

本文档将指导您如何将铸剑乾坤项目部署到服务器上。

## 📋 目录

- [部署方式](#部署方式)
- [前置要求](#前置要求)
- [Docker 部署（推荐）](#docker-部署推荐)
- [传统部署](#传统部署)
- [环境变量配置](#环境变量配置)
- [域名和 HTTPS 配置](#域名和-https-配置)
- [常见问题](#常见问题)

## 部署方式

本项目支持两种部署方式：

1. **Docker 部署（推荐）**：使用 Docker 和 Docker Compose，简单快速
2. **传统部署**：直接在服务器上安装 Node.js 和依赖

## 前置要求

### Docker 部署要求

- Docker 20.10+
- Docker Compose 2.0+
- 至少 2GB 可用内存
- 至少 10GB 可用磁盘空间

### 传统部署要求

- Node.js 20+
- npm 或 yarn
- 至少 2GB 可用内存
- 至少 5GB 可用磁盘空间

## Docker 部署（推荐）

### 1. 准备服务器

确保服务器已安装 Docker 和 Docker Compose：

```bash
# 检查 Docker 版本
docker --version
docker compose version
```

如果没有安装，请参考 [Docker 官方文档](https://docs.docker.com/get-docker/) 进行安装。

### 2. 上传项目文件

将项目文件上传到服务器，可以使用以下方式：

```bash
# 使用 git
git clone <your-repo-url>
cd <project-directory>

# 或使用 scp
scp -r ./project user@server:/path/to/project
```

### 3. 配置环境变量

复制环境变量模板并修改配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，修改以下关键配置：

```env
# 前端配置
FRONTEND_PORT=3000
VITE_API_BASE_URL=http://your-domain.com/api
VITE_SOCKET_URL=http://your-domain.com

# 后端配置
BACKEND_PORT=3001
CORS_ORIGIN=http://your-domain.com,https://your-domain.com

# 安全配置（务必修改！）
JWT_SECRET=your_strong_random_secret_here
ADMIN_PASSWORD=your_strong_password_here

# AI 配置
AI_API_KEY=your_ai_api_key_here
```

### 4. 构建和启动

```bash
# 构建并启动所有服务
docker compose up -d

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f
```

### 5. 初始化数据库

```bash
# 进入后端容器
docker compose exec backend sh

# 运行数据库迁移
npx prisma migrate deploy

# 生成 Prisma Client
npx prisma generate

# 退出容器
exit
```

### 6. 验证部署

访问 `http://your-server-ip:3000` 或配置的域名，应该能看到应用界面。

默认管理员账号：
- 用户名：`admin`
- 密码：`.env` 文件中配置的 `ADMIN_PASSWORD`

## 传统部署

### 1. 安装 Node.js

```bash
# 使用 nvm 安装 Node.js 20
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### 2. 安装项目依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 3. 配置环境变量

在 `backend` 目录下创建 `.env` 文件：

```bash
cd backend
cp env-template.txt .env
# 编辑 .env 文件
```

### 4. 初始化数据库

```bash
cd backend

# 运行数据库迁移
npx prisma migrate deploy

# 生成 Prisma Client
npx prisma generate
```

### 5. 构建前端

```bash
cd frontend

# 设置环境变量
export VITE_API_BASE_URL=http://your-domain.com/api
export VITE_SOCKET_URL=http://your-domain.com

# 构建生产版本
npm run build
```

### 6. 启动服务

#### 方式一：使用 PM2（推荐）

```bash
# 安装 PM2
npm install -g pm2

# 启动后端
cd backend
pm2 start src/index.js --name swordforge-backend

# 启动前端（使用 serve 或 nginx）
cd frontend
npm install -g serve
pm2 serve dist 3000 --name swordforge-frontend

# 查看状态
pm2 status

# 设置开机自启
pm2 startup
pm2 save
```

#### 方式二：使用 systemd

创建后端服务文件 `/etc/systemd/system/swordforge-backend.service`：

```ini
[Unit]
Description=SwordForge Backend
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/project/backend
Environment=NODE_ENV=production
Environment=PORT=3001
ExecStart=/usr/bin/node src/index.js
Restart=always

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
sudo systemctl enable swordforge-backend
sudo systemctl start swordforge-backend
sudo systemctl status swordforge-backend
```

### 7. 配置 Nginx（可选）

创建 Nginx 配置文件 `/etc/nginx/sites-available/swordforge`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/project/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.io 代理
    location /socket.io {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/swordforge /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 环境变量配置

### 必需的环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `JWT_SECRET` | JWT 密钥（生产环境必须修改） | `your_strong_random_secret` |
| `ADMIN_PASSWORD` | 管理员密码（生产环境必须修改） | `your_strong_password` |
| `CORS_ORIGIN` | 允许的前端域名 | `https://your-domain.com` |
| `VITE_API_BASE_URL` | 前端 API 地址 | `https://your-domain.com/api` |
| `VITE_SOCKET_URL` | Socket.io 地址 | `https://your-domain.com` |

### 可选的环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `FRONTEND_PORT` | 前端端口 | `3000` |
| `BACKEND_PORT` | 后端端口 | `3001` |
| `AI_PROVIDER` | AI 服务提供商 | `zhipu` |
| `AI_API_KEY` | AI API Key | - |
| `SMTP_HOST` | SMTP 服务器 | - |
| `SMTP_USER` | 邮箱地址 | - |
| `SMTP_PASS` | 邮箱授权码 | - |

## 域名和 HTTPS 配置

### 使用 Let's Encrypt 配置 HTTPS

```bash
# 安装 Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

### 更新 Nginx 配置支持 HTTPS

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # ... 其他配置
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## 常见问题

### 1. 前端无法连接后端

**问题**：前端显示"无法连接到后端服务"

**解决方案**：
- 检查后端服务是否正常运行
- 检查 `CORS_ORIGIN` 配置是否正确
- 检查防火墙是否开放了后端端口
- 检查 `VITE_API_BASE_URL` 配置是否正确

### 2. Socket.io 连接失败

**问题**：WebSocket 连接失败

**解决方案**：
- 检查 `VITE_SOCKET_URL` 配置
- 确保 Nginx 正确配置了 Socket.io 代理
- 检查防火墙设置

### 3. 数据库迁移失败

**问题**：Prisma 迁移失败

**解决方案**：
```bash
# 重置数据库（注意：会删除所有数据）
npx prisma migrate reset

# 或手动迁移
npx prisma migrate deploy
```

### 4. 内存不足

**问题**：服务启动失败或运行缓慢

**解决方案**：
- 增加服务器内存
- 使用 Docker 时限制容器内存使用
- 优化 Node.js 内存设置

### 5. 端口被占用

**问题**：端口 3000 或 3001 已被占用

**解决方案**：
```bash
# 查找占用端口的进程
sudo lsof -i :3000
sudo lsof -i :3001

# 修改 .env 文件中的端口配置
```

## 维护和更新

### 更新代码

```bash
# Docker 方式
git pull
docker compose build
docker compose up -d

# 传统方式
git pull
cd backend && npm install
cd ../frontend && npm install && npm run build
pm2 restart all
```

### 备份数据库

```bash
# SQLite 数据库备份
cp backend/prisma/swordforge.db backend/prisma/swordforge.db.backup

# 定期备份（添加到 crontab）
0 2 * * * cp /path/to/backend/prisma/swordforge.db /path/to/backup/swordforge-$(date +\%Y\%m\%d).db
```

### 查看日志

```bash
# Docker 方式
docker compose logs -f backend
docker compose logs -f frontend

# PM2 方式
pm2 logs swordforge-backend
pm2 logs swordforge-frontend
```

## 安全建议

1. **修改默认密码**：部署后立即修改管理员密码
2. **使用强 JWT 密钥**：生成至少 32 字符的随机字符串
3. **配置 HTTPS**：生产环境必须使用 HTTPS
4. **限制 CORS**：只允许信任的域名
5. **定期更新**：保持依赖包和系统更新
6. **防火墙配置**：只开放必要的端口
7. **数据库备份**：定期备份数据库

## 技术支持

如遇到问题，请：

1. 查看日志文件
2. 检查环境变量配置
3. 参考本文档的常见问题部分
4. 提交 Issue 到项目仓库

---

祝部署顺利！🎉

