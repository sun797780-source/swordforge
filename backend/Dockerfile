FROM node:20

WORKDIR /app

# 设置环境变量
ENV DATABASE_URL="file:/app/prisma/swordforge.db"
ENV NODE_ENV="production"

# 复制 package 文件
COPY package.json ./
COPY prisma ./prisma/

# 安装依赖
RUN npm install --include=dev

# 生成 Prisma Client（在构建时）
RUN npx prisma generate

# 复制源代码
COPY . .

# 初始化数据库（在构建时）
RUN npx prisma db push --accept-data-loss || echo "Database push failed, will retry at runtime"

# 启动命令 - 简化版
CMD ["node", "src/index.js"]




















