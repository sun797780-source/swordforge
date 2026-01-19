#!/bin/bash

# 铸剑乾坤 - Docker 部署脚本
# 使用方法: ./deploy.sh

set -e

echo "=========================================="
echo "   铸剑乾坤 - Docker 部署脚本"
echo "=========================================="
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: 未安装 Docker"
    echo "   请先安装 Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker compose &> /dev/null; then
    echo "❌ 错误: 未安装 Docker Compose"
    echo "   请先安装 Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

# 检查 .env 文件是否存在
if [ ! -f .env ]; then
    echo "⚠️  未找到 .env 文件"
    echo "   正在从 .env.example 创建..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ 已创建 .env 文件，请编辑配置后再运行此脚本"
        exit 1
    else
        echo "❌ 错误: 未找到 .env.example 文件"
        exit 1
    fi
fi

echo "📋 检查配置..."
echo ""

# 读取关键配置
if [ -f .env ]; then
    source .env
    echo "   前端端口: ${FRONTEND_PORT:-3000}"
    echo "   后端端口: ${BACKEND_PORT:-3001}"
    echo "   API 地址: ${VITE_API_BASE_URL:-未配置}"
    echo ""
fi

# 询问是否继续
read -p "是否继续部署? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "已取消部署"
    exit 0
fi

echo ""
echo "🔨 开始构建和部署..."
echo ""

# 停止现有容器
echo "1. 停止现有容器..."
docker compose down || true

# 构建镜像
echo "2. 构建 Docker 镜像..."
docker compose build --no-cache

# 启动服务
echo "3. 启动服务..."
docker compose up -d

# 等待服务启动
echo "4. 等待服务启动..."
sleep 5

# 初始化数据库
echo "5. 初始化数据库..."
docker compose exec -T backend npx prisma generate || echo "⚠️  Prisma Client 生成失败，请手动运行"
docker compose exec -T backend npx prisma migrate deploy || echo "⚠️  数据库迁移失败，请手动运行"

# 检查服务状态
echo ""
echo "6. 检查服务状态..."
docker compose ps

echo ""
echo "=========================================="
echo "   ✅ 部署完成！"
echo "=========================================="
echo ""
echo "📊 服务信息:"
echo "   前端: http://localhost:${FRONTEND_PORT:-3000}"
echo "   后端: http://localhost:${BACKEND_PORT:-3001}"
echo ""
echo "📝 查看日志:"
echo "   docker compose logs -f"
echo ""
echo "🛑 停止服务:"
echo "   docker compose down"
echo ""
echo "🔄 重启服务:"
echo "   docker compose restart"
echo ""

