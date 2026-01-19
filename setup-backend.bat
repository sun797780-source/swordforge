@echo off
chcp 65001 >nul
echo ==========================================
echo    后端初始化（依赖 + Prisma）
echo ==========================================
echo.

cd /d "%~dp0backend"

echo 正在安装后端依赖...
call npm install
echo.

echo 正在生成 Prisma 客户端...
call npx prisma generate
echo.

echo 正在执行数据库迁移...
call npx prisma migrate dev --name init
echo.

echo 正在初始化数据（超级管理员）...
call npx prisma db seed
echo.

echo ✅ 后端初始化完成！
pause











