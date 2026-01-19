# 🆓 免费部署 - 5分钟快速开始

使用 Railway 免费部署，完全免费，无需信用卡！

## ⚡ 超简单 3 步部署

### 第 1 步：注册 Railway（1分钟）

1. 访问：https://railway.app
2. 点击 "Start a New Project"
3. 使用 **GitHub 账号登录**（最简单）

### 第 2 步：部署后端（2分钟）

1. 点击 "New Project" → "Deploy from GitHub repo"
2. 选择你的项目仓库
3. 在设置中：
   - **Root Directory**: 选择 `backend`
   - **添加环境变量**（点击 Variables 标签）：
     ```
     NODE_ENV=production
     PORT=3001
     JWT_SECRET=随便写一个长字符串
     ADMIN_USERNAME=admin
     ADMIN_PASSWORD=你的密码
     CORS_ORIGIN=https://你的前端地址.railway.app
     ```
4. Railway 会自动部署！

### 第 3 步：部署前端（2分钟）

1. 在同一个项目中，点击 "New Service"
2. 选择 "Deploy from GitHub repo"
3. 选择同一个仓库
4. 在设置中：
   - **Root Directory**: 选择 `frontend`
   - **添加环境变量**：
     ```
     VITE_API_BASE_URL=https://你的后端地址.railway.app/api
     VITE_SOCKET_URL=https://你的后端地址.railway.app
     ```
5. 部署完成后，更新后端的 `CORS_ORIGIN` 为前端地址

## 🎉 完成！

访问 Railway 给你的前端地址，就可以使用应用了！

**默认管理员：**
- 用户名：`admin`
- 密码：你设置的 `ADMIN_PASSWORD`

---

## 📝 详细步骤（图文版）

### 1. 注册和登录

```
访问 https://railway.app
↓
点击 "Start a New Project"
↓
选择 "Login with GitHub"（推荐）
↓
授权 Railway 访问 GitHub
```

### 2. 部署后端

```
点击 "New Project"
↓
选择 "Deploy from GitHub repo"
↓
选择你的仓库
↓
在 Settings → Root Directory 选择 "backend"
↓
在 Variables 添加环境变量（见上方）
↓
等待部署完成（约 2-3 分钟）
↓
复制后端地址（如：https://xxx.railway.app）
```

### 3. 部署前端

```
在同一个项目中，点击 "+ New"
↓
选择 "GitHub Repo"
↓
选择同一个仓库
↓
在 Settings → Root Directory 选择 "frontend"
↓
在 Variables 添加环境变量：
  VITE_API_BASE_URL = https://你的后端地址/api
  VITE_SOCKET_URL = https://你的后端地址
↓
等待部署完成
↓
复制前端地址
```

### 4. 更新 CORS 配置

```
回到后端服务
↓
在 Variables 中更新：
  CORS_ORIGIN = https://你的前端地址.railway.app
↓
服务会自动重启
```

---

## 🔧 环境变量说明

### 后端必需的环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `NODE_ENV` | 环境 | `production` |
| `PORT` | 端口 | `3001` |
| `JWT_SECRET` | JWT密钥 | `随便写一个长字符串` |
| `ADMIN_USERNAME` | 管理员用户名 | `admin` |
| `ADMIN_PASSWORD` | 管理员密码 | `你的密码` |
| `CORS_ORIGIN` | 允许的前端地址 | `https://xxx.railway.app` |

### 前端必需的环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `VITE_API_BASE_URL` | API地址 | `https://后端地址.railway.app/api` |
| `VITE_SOCKET_URL` | Socket地址 | `https://后端地址.railway.app` |

---

## ❓ 常见问题

### Q: 代码不在 GitHub 怎么办？

**A:** 两种方式：
1. 将代码推送到 GitHub（推荐）
2. 使用 Railway CLI 从本地部署（查看 [DEPLOY_FREE.md](./DEPLOY_FREE.md)）

### Q: 部署失败怎么办？

**A:** 
1. 检查日志：在 Railway 控制台查看部署日志
2. 检查环境变量：确保所有必需变量都已设置
3. 检查 Root Directory：确保选择了正确的目录（backend/frontend）

### Q: 如何查看服务地址？

**A:** 
- 在 Railway 控制台，点击服务
- 在 "Settings" → "Networking" 可以看到地址
- 或点击 "Generate Domain" 生成自定义域名

### Q: 免费额度用完了怎么办？

**A:** 
- Railway 会暂停服务
- 可以升级到付费套餐（$5/月起）
- 或迁移到其他免费服务（Render、Fly.io）

### Q: 数据库数据会丢失吗？

**A:** 
- Railway 的免费套餐数据会持久化
- 但如果删除服务，数据会丢失
- 建议定期备份

---

## 🎯 一键部署脚本（可选）

如果你安装了 Railway CLI，可以使用脚本：

**Windows:**
```cmd
railway-deploy.bat
```

**Mac/Linux:**
```bash
chmod +x railway-deploy.sh
./railway-deploy.sh
```

---

## 📚 更多帮助

- **详细文档：** [DEPLOY_FREE.md](./DEPLOY_FREE.md)
- **Railway 官方文档：** https://docs.railway.app
- **Railway 控制台：** https://railway.app/dashboard

---

## ✅ 部署检查清单

- [ ] 注册 Railway 账号
- [ ] 部署后端服务
- [ ] 配置后端环境变量
- [ ] 部署前端服务
- [ ] 配置前端环境变量
- [ ] 更新 CORS 配置
- [ ] 测试访问应用
- [ ] 登录管理员账号测试

---

**遇到问题？** 查看 [DEPLOY_FREE.md](./DEPLOY_FREE.md) 获取详细帮助！

