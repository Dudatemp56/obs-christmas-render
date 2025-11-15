FROM node:18-slim

# Install Chromium + all required libraries for Puppeteer
RUN apt-get update && apt-get install -y \
  chromium \
  chromium-driver \
  libx11-6 \
  libx11-xcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libnss3 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libpangocairo-1.0-0 \
  libpango-1.0-0 \
  libcairo2 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  wget \
  --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Puppeteer will use system Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 10000

CMD ["node", "server.js"]
