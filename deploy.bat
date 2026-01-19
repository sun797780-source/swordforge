@echo off
REM 铸剑乾坤 - Windows Docker 部署脚本
REM 使用方法: deploy.bat

echo ==========================================
echo    铸剑乾坤 - Docker 部署脚本
echo ==========================================
echo.

REM 检查 Docker 是否安装
docker --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未安装 Docker
    echo 请先安装 Docker Desktop: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM 检查 Docker Compose 是否安装
docker compose version >nul 2>&1
if errorlevel 1 (
    echo [错误] Docker Compose 不可用
    echo 请确保 Docker Desktop 已正确安装
    pause
    exit /b 1
)

REM 检查 .env 文件是否存在
if not exist .env (
    echo [警告] 未找到 .env 文件
    if exist .env.example (
        echo 正在从 .env.example 创建...
        copy .env.example .env >nul
        echo [成功] 已创建 .env 文件，请编辑配置后再运行此脚本
        pause
        exit /b 1
    ) else (
        echo [错误] 未找到 .env.example 文件
        pause
        exit /b 1
    )
)

echo [信息] 检查配置...
echo.

echo [步骤 1] 停止现有容器...
docker compose down

echo.
echo [步骤 2] 构建 Docker 镜像...
docker compose build --no-cache
if errorlevel 1 (
    echo [错误] 构建失败
    pause
    exit /b 1
)

echo.
echo [步骤 3] 启动服务...
docker compose up -d
if errorlevel 1 (
    echo [错误] 启动失败
    pause
    exit /b 1
)

echo.
echo [步骤 4] 等待服务启动...
timeout /t 5 /nobreak >nul

echo.
echo [步骤 5] 初始化数据库...
docker compose exec -T backend npx prisma generate
docker compose exec -T backend npx prisma migrate deploy

echo.
echo [步骤 6] 检查服务状态...
docker compose ps

echo.
echo ==========================================
echo    [成功] 部署完成！
echo ==========================================
echo.
echo 服务信息:
echo   前端: http://localhost:3000
echo   后端: http://localhost:3001
echo.
echo 查看日志:
echo   docker compose logs -f
echo.
echo 停止服务:
echo   docker compose down
echo.
echo 重启服务:
echo   docker compose restart
echo.

pause

