@echo off
REM Railway 免费部署脚本 (Windows)
REM 使用方法: railway-deploy.bat

echo ==========================================
echo    Railway 免费部署脚本
echo ==========================================
echo.

REM 检查 Railway CLI
railway --version >nul 2>&1
if errorlevel 1 (
    echo [错误] Railway CLI 未安装
    echo.
    echo 请先安装 Railway CLI:
    echo   在 PowerShell 中运行:
    echo   irm https://railway.app/install.ps1 ^| iex
    echo.
    pause
    exit /b 1
)

echo [成功] Railway CLI 已安装
echo.

REM 检查是否已登录
railway whoami >nul 2>&1
if errorlevel 1 (
    echo [警告] 未登录 Railway
    echo 正在打开登录页面...
    railway login
)

echo [成功] 已登录 Railway
echo.

REM 询问部署选项
echo 请选择部署方式:
echo   1) 部署后端
echo   2) 部署前端
echo   3) 部署全部
echo.
set /p choice="请输入选项 (1-3): "

if "%choice%"=="1" (
    echo.
    echo [步骤] 部署后端...
    cd backend
    railway up
    cd ..
    echo.
    echo [成功] 后端部署完成！
    goto :end
)

if "%choice%"=="2" (
    echo.
    echo [步骤] 部署前端...
    cd frontend
    railway up
    cd ..
    echo.
    echo [成功] 前端部署完成！
    goto :end
)

if "%choice%"=="3" (
    echo.
    echo [步骤] 部署后端...
    cd backend
    railway up
    cd ..
    
    echo.
    echo [步骤] 部署前端...
    cd frontend
    railway up
    cd ..
    
    echo.
    echo [成功] 全部部署完成！
    goto :end
)

echo [错误] 无效选项
exit /b 1

:end
echo.
echo ==========================================
echo    部署完成！
echo ==========================================
echo.
echo 查看服务状态:
echo   railway status
echo.
echo 查看日志:
echo   railway logs
echo.
echo 在 Railway 控制台查看:
echo   https://railway.app/dashboard
echo.

pause

