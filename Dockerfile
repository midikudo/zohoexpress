```Dockerfile
FROM node:20-slim
ENV TZ=Asia/Bangkok
WORKDIR /app
COPY package.json ./
RUN npm i --only=production \
&& apt-get update && apt-get install -y \
chromium \
&& rm -rf /var/lib/apt/lists/*
COPY . .
# Puppeteer needs chromium path in slim images; adjust if necessary
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
EXPOSE 8080
CMD ["node", "src/server.js"]