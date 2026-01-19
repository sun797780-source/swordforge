@echo off
chcp 65001 >nul
title 配置智谱AI

echo.
echo ==========================================
echo    配置智谱AI API密钥
echo ==========================================
echo.

cd /d "%~dp0backend"

echo 正在创建 .env 配置文件...
(
echo # AI服务配置 - 智谱AI
echo AI_PROVIDER=zhipu
echo AI_API_KEY=1285a50b545345489e00918181f4f703.JSOrs6T22vmT3rR5
echo.
echo # JWT密钥
echo JWT_SECRET=swordforge_super_secret_change_me
echo.
echo # 管理员账号
echo ADMIN_USERNAME=admin
echo ADMIN_PASSWORD=123456
echo ADMIN_NAME=系统管理员
echo.
echo # 服务器端口
echo PORT=3001
) > .env

echo ✓ 配置文件已创建
echo.
echo ==========================================
echo    配置完成！
echo ==========================================
echo.
echo 智谱AI API密钥已配置
echo 请运行 start-backend.bat 启动后端服务
echo.
pause















