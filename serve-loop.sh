#!/bin/bash
# KINREL Mirror - Auto-restart production server
cd /home/z/my-project
export DATABASE_URL="file:./db/custom.db"

while true; do
  echo "[$(date +%T)] Starting KINREL Mirror..." 
  node ./node_modules/.bin/next start -p 3000 2>&1
  echo "[$(date +%T)] Server exited, restarting in 3s..."
  sleep 3
done
