#!/usr/bin/env bash
set -euo pipefail

echo "Setup: starting local environment (Postgres via Docker, Prisma, seed, dev server)"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker not found. Install Docker: https://www.docker.com/get-started"
  exit 1
fi

echo "Starting Postgres container..."
docker compose up -d

echo "Waiting for database to be ready..."
for i in $(seq 1 60); do
  echo "Attempt $i/60"
  if npx prisma db pull >/dev/null 2>&1; then
    echo "Database is ready"
    break
  fi
  sleep 2
done

npx prisma db push
npx prisma generate
npm run seed
npm run dev
