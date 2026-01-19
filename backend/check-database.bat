@echo off
chcp 65001 >nul
echo ==========================================
echo   检查数据库状态
echo ==========================================
echo.

cd /d %~dp0

echo [1] 检查 Prisma 客户端...
if exist node_modules\@prisma\client (
    echo ✅ Prisma 客户端已安装
) else (
    echo ❌ Prisma 客户端未安装
    echo    请运行: npm install
    pause
    exit /b 1
)
echo.

echo [2] 检查数据库文件...
if exist prisma\swordforge.db (
    echo ✅ 数据库文件存在
    dir prisma\swordforge.db
) else (
    echo ⚠️  数据库文件不存在
    echo    请运行: npx prisma migrate dev
)
echo.

echo [3] 检查 Prisma schema...
if exist prisma\schema.prisma (
    echo ✅ Schema 文件存在
) else (
    echo ❌ Schema 文件不存在
)
echo.

echo [4] 尝试生成 Prisma 客户端...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Prisma 客户端生成失败
    pause
    exit /b 1
)
echo ✅ Prisma 客户端生成成功
echo.

echo [5] 检查数据库连接...
call npx prisma db push --accept-data-loss
if %errorlevel% neq 0 (
    echo ⚠️  数据库推送失败，可能需要运行迁移
    echo    请运行: npx prisma migrate dev
) else (
    echo ✅ 数据库状态正常
)
echo.

echo ==========================================
echo   检查完成
echo ==========================================
pause

