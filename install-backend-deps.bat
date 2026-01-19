@echo off
chcp 65001 >nul
title 安装后端依赖

echo.
echo ==========================================
echo    安装后端依赖
echo ==========================================
echo.

cd /d "%~dp0backend"

echo 正在安装所有依赖...
call npm install

echo.
echo ==========================================
echo    安装完成！
echo ==========================================
echo.
pause











