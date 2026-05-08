#!/usr/bin/env bash
set -euo pipefail

echo "Setup (no Docker): applying Prisma schema, generating client, seeding, and starting dev server"

# Change to project root (parent of scripts folder)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

echo "Working directory: $(pwd)"

npx prisma db push
npx prisma generate
npm run seed
npm run dev
