@echo off
echo Killing all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Removing .next directory...
if exist .next rmdir /s /q .next 2>nul

echo Starting development server...
npm run dev
