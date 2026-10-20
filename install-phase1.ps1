$ErrorActionPreference = "Stop"
Write-Host "Creating folders..." -ForegroundColor Cyan
$folders = @("public", "src", "src\lib", "src\types", "src\context", "src\hooks", "src\components", "src\components\ui", "src\components\onboarding", "src\components\layout", "src\components\dashboard", "src\pages")
foreach ($f in $folders) { if (-not (Test-Path $f)) { New-Item -ItemType Directory -Path $f | Out-Null } }

function Write-File($path, $content) {
    $dir = Split-Path $path -Parent
    if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
    Set-Content -Path $path -Value $content -Encoding UTF8
    Write-Host "Created: $path" -ForegroundColor Green
}

Write-File "vite.config.ts" @'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
