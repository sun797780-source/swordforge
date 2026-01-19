@echo off
chcp 65001 >nul
echo ==========================================
echo    安装前端依赖
echo ==========================================
echo.

echo 正在清理npm缓存...
call npm cache clean --force

cd /d "%~dp0frontend"

echo.
echo 正在安装 socket.io-client...
call npm install socket.io-client --prefer-online

echo.
echo 安装完成！
pause
