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

trap 'echo "[entrypoint] Arret demande."; exit 0' TERM INT

CLEAR_FLAG="--clear"
while true; do
  echo "[entrypoint] Demarrage d'Expo (tunnel) sur le port 6000..."
  npx expo start --port 6000 --tunnel $CLEAR_FLAG || true
  CLEAR_FLAG=""
  echo "[entrypoint] Expo s'est arrete (echec tunnel ?). Nouvelle tentative dans 3s..."
  sleep 3
done

