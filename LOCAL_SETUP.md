Local setup (quick)

1) Ensure Docker is installed on your machine.
   - Windows: install Docker Desktop from https://www.docker.com/get-started

2) From the project root run the cross-platform setup script:

PowerShell (Windows):

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/setup-local.ps1
```

Bash (macOS / Linux / Git Bash):

```bash
bash scripts/setup-local.sh
```

What the script does:
- Starts a local Postgres container (`postgres:15`) using `docker compose` (see `docker-compose.yml`).
- Waits for the DB to be reachable via Prisma.
- Applies the Prisma schema (`prisma db push`).
- Generates the Prisma client.
- Seeds the DB (`npm run seed`).
- Starts the Next.js dev server (`npm run dev`).

If you don't want Docker, update `.env.local` with your DB connection string and run these commands manually:

```bash
npx prisma db push
npx prisma generate
npm run seed
npm run dev
```

If you prefer I run the script for you, allow me to try — I'll attempt to start the services now.