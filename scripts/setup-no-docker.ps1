Write-Host "Setup (no Docker): applying Prisma schema, generating client, seeding, and starting dev server"

# Ensure we run from the project root (parent of the scripts folder)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Resolve-Path (Join-Path $scriptDir '..')
Set-Location $projectRoot

Write-Host "Working directory: $(Get-Location)"

# Push schema
Write-Host "Pushing Prisma schema..."
npx prisma db push

# Generate client
Write-Host "Generating Prisma client..."
npx prisma generate

# Seed
Write-Host "Seeding database..."
npm run seed

# Start dev server
Write-Host "Starting dev server..."
npm run dev
