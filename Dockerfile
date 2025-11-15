FROM node:18-bullseye
RUN apt-get update && apt-get install -y \
  ca-certificates fonts-liberation libatk1.0-0 libatk-bridge2.0-0 libcups2 \
  libx11-6 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libasound2 \
  libpangocairo-1.0-0 libpango-1.0-0 libnss3 lsb-release wget \
  --no-install-recommends && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install --production
COPY . .
ENV PORT=3000
EXPOSE 3000
CMD ["npm","start"]
