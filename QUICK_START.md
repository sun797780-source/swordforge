# 快速开始 - 部署到服务器

## 💡 关于服务器

**好消息：** 不一定需要购买服务器！

- ✅ **免费选项：** Railway、Render、Fly.io 等提供免费额度
- ✅ **本地测试：** 可以用自己的电脑作为服务器
- ✅ **付费选项：** 阿里云、腾讯云等，¥24/月起

**详细服务器选择指南：** 查看 [SERVER_GUIDE.md](./SERVER_GUIDE.md)

---

## 🚀 最简单的部署方式（Docker）

### 1. 准备服务器

**选项 A：使用云服务器（推荐）**
- 阿里云轻量服务器：¥24/月（国内用户推荐）
- Railway：免费额度（国外用户推荐）
- DigitalOcean：$6/月起

**选项 B：使用本地电脑**
- 适合测试和学习
- 需要配置公网 IP 或内网穿透

确保服务器已安装：
- Docker 20.10+
- Docker Compose 2.0+

```bash
# 检查是否已安装
docker --version
docker compose version
```

### 2. 上传项目

```bash
# 方式一：使用 git
git clone <your-repo-url>
cd <project-directory>

# 方式二：使用 scp（Windows 使用 WinSCP 或 FileZilla）
scp -r ./project user@server:/path/to/project
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp env.example.txt .env

# 编辑 .env 文件（使用 nano 或 vim）
nano .env
```

**必须修改的配置：**

```env
# 修改为你的域名或服务器 IP
VITE_API_BASE_URL=http://your-server-ip:3001/api
VITE_SOCKET_URL=http://your-server-ip:3001

# 修改为你的域名（如果有）
CORS_ORIGIN=http://your-server-ip:3000,http://your-domain.com

# 修改为强密码（重要！）
JWT_SECRET=your_strong_random_secret_here
ADMIN_PASSWORD=your_strong_password_here

# 配置 AI API Key（如果需要 AI 功能）
AI_API_KEY=your_ai_api_key_here
```

### 4. 一键部署

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Windows:**
```cmd
deploy.bat
```

**或手动执行:**
```bash
# 构建并启动
docker compose up -d

# 初始化数据库
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npx prisma generate
```

### 5. 访问应用

打开浏览器访问：
- 前端：`http://your-server-ip:3000`
- 后端 API：`http://your-server-ip:3001`

默认管理员账号：
- 用户名：`admin`
- 密码：`.env` 文件中配置的 `ADMIN_PASSWORD`

## 📝 常用命令

```bash
# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f

# 停止服务
docker compose down

# 重启服务
docker compose restart

# 更新代码后重新部署
git pull
docker compose build
docker compose up -d
```

## 🔧 配置域名和 HTTPS（可选）

### 1. 配置域名解析

在域名服务商处添加 A 记录，指向服务器 IP。

### 2. 安装 Nginx

```bash
sudo apt-get update
sudo apt-get install nginx
```

### 3. 配置 Nginx

创建配置文件 `/etc/nginx/sites-available/swordforge`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /socket.io {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/swordforge /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. 配置 HTTPS（Let's Encrypt）

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## ⚠️ 常见问题

### 端口被占用

```bash
# 查找占用端口的进程
sudo lsof -i :3000
sudo lsof -i :3001

# 修改 .env 文件中的端口配置
```

### 前端无法连接后端

1. 检查后端服务是否运行：`docker compose ps`
2. 检查 CORS 配置：确保 `.env` 中的 `CORS_ORIGIN` 包含前端地址
3. 检查防火墙：确保端口已开放

### 数据库错误

```bash
# 重新初始化数据库
docker compose exec backend npx prisma migrate reset
docker compose exec backend npx prisma migrate deploy
```

## 📚 更多信息

详细部署文档请查看 [DEPLOY.md](./DEPLOY.md)

---

**需要帮助？** 查看日志：`docker compose logs -f`

