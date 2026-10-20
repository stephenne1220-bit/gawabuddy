$ErrorActionPreference = "Stop"

Write-Host "Cleaning up old conflicting files..." -ForegroundColor Red
$toDelete = @("src/store", "src/components/Layout.tsx", "src/pages/Savings.tsx", "src/pages/Debts.tsx", "src/pages/Wishlist.tsx", "src/pages/Bills.tsx", "src/pages/Reports.tsx", "src/pages/Settings.tsx")
foreach ($f in $toDelete) { if (Test-Path $f) { Remove-Item $f -Recurse -Force; Write-Host "Deleted: $f" -ForegroundColor DarkGray } }

Write-Host "Creating new folders..." -ForegroundColor Cyan
$folders = @("src/lib", "src/context", "src/hooks", "src/components/routing", "src/components/app", "src/components/auth", "src/components/onboarding", "src/components/layout", "src/pages")
foreach ($f in $folders) { if (-not (Test-Path $f)) { New-Item -ItemType Directory -Path $f | Out-Null } }

function Write-File($path, $content) {
    $dir = Split-Path $path -Parent
    if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
    Set-Content -Path $path -Value $content -Encoding UTF8
}

Write-File "vite.config.ts" @'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
export default defineConfig({ plugins: [react(), tailwindcss()], resolve: { alias: { '@': path.resolve(__dirname, './src') } } })
