FROM node:20-slim

WORKDIR /app

# 安装必要的系统依赖
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# 复制 package 文件
COPY package*.json ./
COPY prisma ./prisma/

# 安装依赖
RUN npm install

# 生成 Prisma Client
RUN npx prisma generate

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 3001

# 启动
CMD ["npm", "start"]




















