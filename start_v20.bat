@echo off
REM 切换到 UTF-8 编码以支持中文显示
chcp 65001 >nul
setlocal

echo ========================================
echo 铸剑乾坤 - 极速启动模式 (Node v20 + 兼容修正版)
echo ========================================

REM 1. 设置局部 Node.js 路径
set "NODE_HOME=%~dp0.dev_tools\node-v20.11.0-win-x64"
set "PATH=%NODE_HOME%;%PATH%"
set "NPM_EXEC=%NODE_HOME%\npm.cmd"

REM 2. 验证版本
echo [环境检查]
echo Node路径: %NODE_HOME%
echo Node版本: 
call node -v
echo.

REM 3. 设置局部缓存路径
set "npm_config_cache=%~dp0.dev_tools\.npm-cache"
echo [配置]
echo 正在使用隔离的缓存目录: %npm_config_cache%
echo.

REM 4. 安装前端依赖 (加入 --legacy-peer-deps 解决 React 版本冲突)
echo [1/2] 开始安装/更新前端依赖...
echo 提示: 已启用兼容模式处理 react-split-pane 冲突...
cd frontend
if %errorlevel% neq 0 (
    echo.
    echo [错误] 无法进入 frontend 目录！
    pause
    exit /b 1
)

call "%NPM_EXEC%" install --registry=https://registry.npmmirror.com --legacy-peer-deps --loglevel info
if %errorlevel% neq 0 (
    echo.
    echo [错误] 依赖安装失败！
    echo 请检查上面的错误日志。
    pause
    exit /b 1
)
cd ..

echo.
echo [2/2] 正在启动系统...
echo ----------------------------------------
echo 前端访问地址: http://localhost:3000
echo 后端服务地址: http://localhost:3001
echo ----------------------------------------
echo.

REM 并行启动脚本
start "铸剑乾坤-后端" cmd /k "chcp 65001 >nul && set PATH=%NODE_HOME%;%PATH% && cd backend && node src/index.js"
timeout /t 3 /nobreak >nul
start "铸剑乾坤-前端" cmd /k "chcp 65001 >nul && set PATH=%NODE_HOME%;%PATH% && cd frontend && npm run dev"

echo 服务启动指令已发送！
echo 现在您可以最小化此窗口 (请勿关闭)。
pause
