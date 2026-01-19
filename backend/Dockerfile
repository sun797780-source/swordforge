FROM node:20

WORKDIR /app

# 复制 package 文件（不包括 package-lock.json，让它重新生成）
COPY package.json ./
COPY prisma ./prisma/

# 安装依赖（包括 devDependencies，因为需要 prisma CLI）
RUN npm install --include=dev

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 3001

# 启动时：生成 Prisma Client，初始化数据库，然后启动服务
CMD ["sh", "-c", "echo '=== Starting backend ===' && npx prisma generate && echo '=== Prisma generated ===' && npx prisma db push --accept-data-loss && echo '=== Database initialized ===' && node src/index.js"]




















