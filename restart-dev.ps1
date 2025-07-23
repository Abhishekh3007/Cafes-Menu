#!/bin/bash
# Clear Next.js cache and restart development server

echo "Stopping all Node.js processes..."
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

echo "Clearing Next.js cache..."
if (Test-Path .next) { 
  Remove-Item -Recurse -Force .next 
  Write-Host "Removed .next directory"
}

if (Test-Path node_modules/.cache) {
  Remove-Item -Recurse -Force node_modules/.cache
  Write-Host "Removed node_modules cache"
}

echo "Starting fresh development server..."
Start-Sleep -Seconds 2
npm run dev
