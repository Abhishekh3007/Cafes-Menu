@echo off
echo Fixing Next.js permission issues...
taskkill /F /IM node.exe /T >nul 2>&1
if exist ".next" rmdir /S /Q ".next" >nul 2>&1
if exist "tsconfig.tsbuildinfo" del "tsconfig.tsbuildinfo" >nul 2>&1
echo Starting development server...
npm run dev
