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

# 启动时生成 Prisma Client 并启动服务
CMD ["sh", "-c", "npx prisma generate && npm start"]




















