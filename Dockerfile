FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps --include=dev && touch node_modules/.install-complete

COPY . .

# Entrypoint hors de /app pour ne pas être masqué par le bind mount du volume.
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 6000

ENTRYPOINT ["docker-entrypoint.sh"]
