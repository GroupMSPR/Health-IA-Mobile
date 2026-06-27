FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 6000

CMD ["npx", "expo", "start", "--port", "6000", "--tunnel"]
