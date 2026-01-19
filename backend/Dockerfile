FROM node:20

WORKDIR /app

# 复制 package 文件
COPY package*.json ./
COPY prisma ./prisma/

# 安装依赖（包括 devDependencies，因为需要 prisma CLI）
RUN npm install --include=dev

# 生成 Prisma Client
RUN npx prisma generate --schema=./prisma/schema.prisma

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 3001

# 启动
CMD ["npm", "start"]




















