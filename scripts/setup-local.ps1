Write-Host "Setup: starting local environment (Postgres via Docker, Prisma, seed, dev server)"

# Ensure we run from the project root (parent of the scripts folder)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Resolve-Path (Join-Path $scriptDir '..')
Set-Location $projectRoot

Write-Host "Working directory: $(Get-Location)"

# Check Docker
$docker = Get-Command docker -ErrorAction SilentlyContinue
if (-not $docker) {
  Write-Host "Docker is not installed or not in PATH. Please install Docker Desktop for Windows: https://www.docker.com/get-started" -ForegroundColor Yellow
  exit 1
}

# Start postgres via docker compose
Write-Host "Starting Postgres container..."
docker compose up -d

# Wait for DB to be ready
$maxAttempts = 60
$attempt = 0
while ($attempt -lt $maxAttempts) {
  Write-Host "Checking database connection (attempt $($attempt+1)/$maxAttempts)..."
  npx prisma db pull > $null 2>&1
  if ($LASTEXITCODE -eq 0) {
    Write-Host "Database is ready."
    break
  }
  Start-Sleep -Seconds 2
  $attempt++
}
if ($attempt -ge $maxAttempts) {
  Write-Host "Database did not become ready in time." -ForegroundColor Red
  exit 1
}

# Apply schema and generate client
Write-Host "Pushing Prisma schema..."
npx prisma db push

Write-Host "Generating Prisma client..."
npx prisma generate

# Seed
Write-Host "Seeding database..."
npm run seed

# Start dev server
Write-Host "Starting dev server..."
npm run dev
