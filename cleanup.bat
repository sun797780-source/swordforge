@echo off
echo ==========================================
echo   Project Cleanup Tool
echo ==========================================
echo.

cd /d "%~dp0"

echo [Scanning] Looking for junk files...
echo.

REM ===== 1. Clean npm cache =====
echo [1/6] Cleaning npm cache...
if exist ".dev_tools\.npm-cache" (
    rmdir /s /q ".dev_tools\.npm-cache" 2>nul
    echo       [OK] Deleted .dev_tools\.npm-cache
) else (
    echo       [SKIP] Not found
)

REM ===== 2. Clean root node_modules =====
echo [2/6] Cleaning root node_modules...
if exist "node_modules" (
    rmdir /s /q "node_modules" 2>nul
    if not exist "node_modules" (
        echo       [OK] Deleted
    ) else (
        echo       [ERROR] Delete failed, may be in use
    )
) else (
    echo       [SKIP] Not found
)

REM ===== 3. Clean root package-lock.json =====
echo [3/6] Cleaning root package-lock.json...
if exist "package-lock.json" (
    del /f /q "package-lock.json" 2>nul
    echo       [OK] Deleted
) else (
    echo       [SKIP] Not found
)

REM ===== 4. Clean Prisma cache =====
echo [4/6] Cleaning Prisma cache...
if exist "backend\node_modules\.cache" (
    rmdir /s /q "backend\node_modules\.cache" 2>nul
    echo       [OK] Deleted backend\node_modules\.cache
) else (
    echo       [SKIP] Not found
)

REM ===== 5. Clean empty directories =====
echo [5/6] Cleaning empty directories...
if exist "docs" (
    rmdir "docs" 2>nul
    if not exist "docs" echo       [OK] Deleted docs
)
if exist "backend\src\routes" (
    rmdir "backend\src\routes" 2>nul
    if not exist "backend\src\routes" echo       [OK] Deleted backend\src\routes
)
if exist "backend\data" (
    rmdir "backend\data" 2>nul
    if not exist "backend\data" echo       [OK] Deleted backend\data
)
if exist "frontend\src\components\layout" (
    rmdir "frontend\src\components\layout" 2>nul
    if not exist "frontend\src\components\layout" echo       [OK] Deleted frontend\src\components\layout
)
if exist "frontend\src\components\Home" (
    rmdir "frontend\src\components\Home" 2>nul
    if not exist "frontend\src\components\Home" echo       [OK] Deleted frontend\src\components\Home
)

REM ===== 6. Clean build artifacts =====
echo [6/6] Cleaning build artifacts...
if exist "frontend\dist" (
    rmdir /s /q "frontend\dist" 2>nul
    echo       [OK] Deleted frontend\dist
) else (
    echo       [SKIP] frontend\dist not found
)
if exist "backend\dist" (
    rmdir /s /q "backend\dist" 2>nul
    echo       [OK] Deleted backend\dist
) else (
    echo       [SKIP] backend\dist not found
)

echo.
echo ==========================================
echo   Cleanup Complete!
echo ==========================================
echo.
echo [NOTE] .dev_tools\node-v20.11.0-win-x64 is Node.js runtime
echo        This folder (~100MB) is REQUIRED, do NOT delete
echo.
echo [NOTE] backend\node_modules and frontend\node_modules
echo        are project dependencies, delete only if you want
echo        to reinstall (run npm install after delete)
echo.
pause
