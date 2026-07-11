#!/bin/sh
set -e

cd /app

if [ ! -d node_modules ] \
   || [ ! -f node_modules/.install-complete ] \
   || [ package.json -nt node_modules/.install-complete ]; then
  echo "[entrypoint] Installation des dependances npm..."
  npm install --legacy-peer-deps --include=dev
  touch node_modules/.install-complete
else
  echo "[entrypoint] Dependances a jour, installation ignoree."
fi

echo "[entrypoint] Demarrage d'Expo sur le port 6000..."
exec npx expo start --web --port 6000

