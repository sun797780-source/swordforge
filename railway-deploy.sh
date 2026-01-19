#!/bin/bash

# Railway 免费部署脚本
# 使用方法: ./railway-deploy.sh

set -e

echo "=========================================="
echo "   Railway 免费部署脚本"
echo "=========================================="
echo ""

# 检查 Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI 未安装"
    echo ""
    echo "请先安装 Railway CLI:"
    echo ""
    echo "  Windows (PowerShell):"
    echo "    irm https://railway.app/install.ps1 | iex"
    echo ""
    echo "  Mac/Linux:"
    echo "    curl -fsSL https://railway.app/install.sh | sh"
    echo ""
    exit 1
fi

echo "✅ Railway CLI 已安装"
echo ""

# 检查是否已登录
if ! railway whoami &> /dev/null; then
    echo "⚠️  未登录 Railway"
    echo "   正在打开登录页面..."
    railway login
fi

echo "✅ 已登录 Railway"
echo ""

# 询问部署选项
echo "请选择部署方式:"
echo "  1) 部署后端"
echo "  2) 部署前端"
echo "  3) 部署全部"
echo ""
read -p "请输入选项 (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📦 部署后端..."
        cd backend
        railway up
        cd ..
        echo ""
        echo "✅ 后端部署完成！"
        ;;
    2)
        echo ""
        echo "📦 部署前端..."
        cd frontend
        railway up
        cd ..
        echo ""
        echo "✅ 前端部署完成！"
        ;;
    3)
        echo ""
        echo "📦 部署后端..."
        cd backend
        railway up
        cd ..
        
        echo ""
        echo "📦 部署前端..."
        cd frontend
        railway up
        cd ..
        
        echo ""
        echo "✅ 全部部署完成！"
        ;;
    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo "   部署完成！"
echo "=========================================="
echo ""
echo "📊 查看服务状态:"
echo "   railway status"
echo ""
echo "📝 查看日志:"
echo "   railway logs"
echo ""
echo "🌐 在 Railway 控制台查看:"
echo "   https://railway.app/dashboard"
echo ""

