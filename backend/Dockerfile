FROM node:20

WORKDIR /app

# 设置数据库路径环境变量
ENV DATABASE_URL="file:/app/prisma/swordforge.db"

# 复制 package 文件
COPY package.json ./
COPY prisma ./prisma/

# 安装依赖
RUN npm install --include=dev

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["sh", "-c", "npx prisma generate && npx prisma db push --accept-data-loss && node src/index.js"]




















