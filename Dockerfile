# Dockerfile — 洁雅股份官网
FROM node:22-slim

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
RUN npm ci --production=false

# 复制源代码
COPY . .

# 构建前端
RUN npm run build

# 创建数据目录（供持久卷挂载）
RUN mkdir -p /app/server/data

# 暴露端口
EXPOSE 3000

# 启动
CMD ["node", "server/prod.js"]
