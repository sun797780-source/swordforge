FROM node:20

WORKDIR /app

# 复制 package 文件（不包括 package-lock.json，让它重新生成）
COPY package.json ./
COPY prisma ./prisma/

# 安装依赖（包括 devDependencies，因为需要 prisma CLI）
# 使用 --legacy-peer-deps 避免依赖冲突
RUN npm install --include=dev --legacy-peer-deps

# 生成 Prisma Client
RUN npx prisma generate

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 3001

# 启动
CMD ["npm", "start"]




















