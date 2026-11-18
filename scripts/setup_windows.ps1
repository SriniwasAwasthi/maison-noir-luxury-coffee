# Maison Noir — Windows Automated Setup & Verification Script
# Ensures that any user downloading the ZIP archive has a flawless, 1-click bootstrap experience.

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "☕ MAISON NOIR — AUTOMATED WINDOWS SETUP" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verify Node.js is installed
Write-Host "[1/4] Checking Node.js environment..." -ForegroundColor White
try {
    $nodeVersion = node -v
    Write-Host "  ✓ Found Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ ERROR: Node.js is not found in PATH." -ForegroundColor Red
    Write-Host "    Please install Node.js (v18.0.0 or higher) from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# 2. Verify npm is installed
try {
    $npmVersion = npm -v
    Write-Host "  ✓ Found npm: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ ERROR: npm is not found in PATH." -ForegroundColor Red
    exit 1
}

# 3. Setup .env from .env.example if missing
Write-Host ""
Write-Host "[2/4] Initializing environment configuration..." -ForegroundColor White
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "  ✓ Created .env from .env.example (pre-configured with local fallbacks)" -ForegroundColor Green
    } else {
        New-Item ".env" -ItemType File -Force | Out-Null
        Write-Host "  ✓ Initialized default .env" -ForegroundColor Green
    }
} else {
    Write-Host "  ✓ Existing .env preserved" -ForegroundColor Green
}

# 4. Install Node Dependencies
Write-Host ""
Write-Host "[3/4] Installing dependencies via npm install..." -ForegroundColor White
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ ERROR: npm install failed." -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ All packages installed successfully!" -ForegroundColor Green

# 5. Run production build verification
Write-Host ""
Write-Host "[4/4] Verifying production build compilation..." -ForegroundColor White
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ ERROR: Production build failed." -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ Production build verified (tsc -b & vite build) with zero errors!" -ForegroundColor Green

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🎉 MAISON NOIR IS READY FOR SERVICE!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "To launch the development server and explore the experience:" -ForegroundColor Yellow
Write-Host "  Double-click run.bat OR execute: npm run dev" -ForegroundColor White
Write-Host "  Local URL: http://localhost:5173/ (or active port shown in console)" -ForegroundColor Cyan
Write-Host ""
