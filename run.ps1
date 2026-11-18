# Maison Noir — 1-Click Launch Script for Windows PowerShell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "Maison Noir — Haute Specialty Roastery"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "☕ MAISON NOIR — HAUTE SPECIALTY ROASTERY & SANCTUARY" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check Node.js
try {
    $nodeVer = node -v
    Write-Host "[✓] Node.js detected: $nodeVer" -ForegroundColor Green
} catch {
    Write-Host "[✗] ERROR: Node.js is not found in PATH." -ForegroundColor Red
    Write-Host "    Please download and install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit..."
    exit 1
}

# 2. Check npm
try {
    $npmVer = npm -v
    Write-Host "[✓] npm detected: v$npmVer" -ForegroundColor Green
} catch {
    Write-Host "[✗] ERROR: npm is not found in PATH." -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}

# 3. Setup .env from .env.example if missing
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "[✓] Initialized .env from .env.example (pre-configured with local fallbacks)" -ForegroundColor Green
    }
}

# 4. Check dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host ""
    Write-Host "[INFO] First time launch detected. Installing dependencies via npm install..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[✗] ERROR: npm install failed." -ForegroundColor Red
        Read-Host "Press Enter to exit..."
        exit 1
    }
    Write-Host "[✓] Dependencies installed successfully." -ForegroundColor Green
}

# 5. Launch Development Server
Write-Host ""
Write-Host "[INFO] Launching Maison Noir Luxury Web Platform..." -ForegroundColor Yellow
Write-Host "[INFO] Navigate to: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
npm run dev
