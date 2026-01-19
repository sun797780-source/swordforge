@echo off
chcp 65001 >nul
echo ==========================================
echo   铸剑乾坤 - 数据库初始化脚本
echo ==========================================
echo.

cd /d %~dp0

echo [0/4] 检查 Node.js 版本...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未检测到 Node.js，请先安装 Node.js 12 或更高版本
    echo    下载地址: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ 当前 Node.js 版本: %NODE_VERSION%
echo ⚠️  建议使用 Node.js 14+ 以获得更好的性能
echo.

echo [1/4] 清理旧的依赖...
if exist node_modules (
    echo 正在删除 node_modules...
    rmdir /s /q node_modules 2>nul
)
if exist package-lock.json (
    del /f /q package-lock.json 2>nul
)
echo.

echo [1/4] 正在安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败！
    pause
    exit /b 1
)
echo ✅ 依赖安装完成
echo.

echo [2/4] 正在生成 Prisma 客户端...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Prisma 客户端生成失败！
    pause
    exit /b 1
)
echo ✅ Prisma 客户端生成完成
echo.

echo [3/4] 正在运行数据库迁移...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo ❌ 数据库迁移失败！
    pause
    exit /b 1
)
echo ✅ 数据库迁移完成
echo.

echo [4/4] 检查数据库状态...
call npx prisma db push
if %errorlevel% neq 0 (
    echo ⚠️  数据库推送失败，但可能已经是最新状态
) else (
    echo ✅ 数据库状态已同步
)
echo.

echo ==========================================
echo   ✅ 数据库初始化完成！
echo ==========================================
echo.
echo 现在可以启动后端服务了：
echo   npm run dev
echo.
pause

