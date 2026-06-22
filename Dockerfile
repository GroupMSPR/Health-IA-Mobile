FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

ENV CI=1

EXPOSE 8081

CMD ["npx", "expo", "start", "--web"]
