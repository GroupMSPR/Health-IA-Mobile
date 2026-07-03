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

# ---------------------------------------------------------------------------
# Mode de démarrage configurable via EXPO_START_MODE :
#   tunnel    → ngrok (appareil physique distant ; nécessite un accès internet
#               fiable vers les serveurs ngrok/Expo)
#   lan       → réseau local / émulateur. Pour un émulateur Android, définir
#               REACT_NATIVE_PACKAGER_HOSTNAME=10.0.2.2 (alias de l'hôte vu par
#               l'émulateur) pour que Metro s'annonce sur une adresse joignable.
#   localhost → accès uniquement depuis la machine hôte.
#
# En mode tunnel, si ngrok échoue EXPO_TUNNEL_MAX_RETRIES fois de suite, on
# bascule automatiquement en LAN au lieu de boucler indéfiniment sur l'échec.
# ---------------------------------------------------------------------------
MODE="${EXPO_START_MODE:-tunnel}"
MAX_TUNNEL_RETRIES="${EXPO_TUNNEL_MAX_RETRIES:-3}"
RETRY_DELAY="${EXPO_RETRY_DELAY:-8}"
CLEAR_FLAG="--clear"
tunnel_failures=0

while true; do
  case "$MODE" in
    tunnel)    MODE_FLAG="--tunnel" ;;
    lan)       MODE_FLAG="--lan" ;;
    localhost) MODE_FLAG="--localhost" ;;
    *) echo "[entrypoint] EXPO_START_MODE invalide: '$MODE' (attendu: tunnel|lan|localhost)"; exit 1 ;;
  esac

  echo "[entrypoint] Demarrage d'Expo (mode=$MODE) sur le port 6000..."
  npx expo start --port 6000 $MODE_FLAG $CLEAR_FLAG || true
  CLEAR_FLAG=""

  if [ "$MODE" = "tunnel" ]; then
    tunnel_failures=$((tunnel_failures + 1))
    if [ "$tunnel_failures" -ge "$MAX_TUNNEL_RETRIES" ]; then
      echo "[entrypoint] Tunnel en echec apres ${tunnel_failures} essais -> bascule automatique en mode LAN."
      MODE="lan"
      continue
    fi
  fi

  echo "[entrypoint] Expo s'est arrete. Nouvelle tentative dans ${RETRY_DELAY}s..."
  sleep "$RETRY_DELAY"
done

