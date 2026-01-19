# 快速将代码推送到 GitHub

## 🚀 超简单 3 步

### 第 1 步：在 GitHub 创建仓库

1. 访问：https://github.com
2. 点击右上角 "+" → "New repository"
3. 填写仓库名称（如：``swordforge）
4. 选择 Public（公开）或 Private（私有）
5. **不要**勾选 "Initialize this repository with a README"
6. 点击 "Create repository"

### 第 2 步：在本地初始化 Git

打开项目目录，在终端运行：

```bash
# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit"
```

### 第 3 步：推送到 GitHub

GitHub 会显示命令，复制并运行：

```bash
# 添加远程仓库（替换成你的仓库地址）
git remote add origin https://github.com/你的用户名/swordforge.git

# 推送到 GitHub
git branch -M main

```

## ✅ 完成！

现在你的代码已经在 GitHub 上了，可以回到 Railway 选择 "GitHub仓库" 部署了！

---

## 💡 如果遇到问题

### 问题：没有安装 Git？

**Windows:**
- 下载：https://git-scm.com/download/win
- 安装后重启终端

**Mac:**
```bash
xcode-select --install
```

**Linux:**
```bash
sudo apt-get install git
```

### 问题：GitHub 要求登录？

1. 在浏览器登录 GitHub
2. 或使用 GitHub Desktop（图形界面，更简单）
   - 下载：https://desktop.github.com

### 问题：不想公开代码？

- 选择 Private 仓库（免费用户也可以创建私有仓库）

---

## 🎯 更简单的方式：使用 GitHub Desktop

1. 下载安装：https://desktop.github.com
2. 登录 GitHub 账号
3. 点击 "File" → "Add Local Repository"
4. 选择你的项目文件夹
5. 点击 "Publish repository"
6. 完成！

---

## 📝 完整命令（复制粘贴）

```bash
# 1. 初始化 Git
git init

# 2. 添加所有文件
git add .

# 3. 提交
git commit -m "Initial commit"

# 4. 添加远程仓库（替换成你的地址）
git remote add origin https://github.com/你的用户名/仓库名.git

# 5. 推送
git branch -M main
git push -u origin main
```

---

**完成后，回到 Railway 选择 "GitHub仓库" 即可！**

