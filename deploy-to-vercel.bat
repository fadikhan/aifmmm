@echo off
REM AURA Studio - Vercel Deployment Script (Windows)
REM This script prepares and deploys your project to Vercel

echo.
echo ================================
echo AURA Studio - Vercel Deployment
echo ================================
echo.

REM Check if git is initialized
if not exist ".git" (
  echo Initializing Git repository...
  git init
  git add .
  git commit -m "Initial commit - Ready for Vercel"
  echo Git initialized
  echo.
)

REM Check if .env.local exists
if exist ".env.local" (
  echo WARNING: .env.local file detected!
  echo This file contains sensitive keys and should NOT be committed.
  echo.
  set /p remove="Do you want to remove it from git tracking? (y/n): "
  if /i "%remove%"=="y" (
    git rm --cached .env.local 2>nul
    echo .env.local removed from git tracking
  )
  echo.
)

REM Run build test
echo Testing production build...
call npm run build

if errorlevel 1 (
  echo Build failed! Please fix errors before deploying.
  pause
  exit /b 1
)

echo.
echo Build successful!
echo.

REM Check if vercel CLI is installed
where vercel >nul 2>nul
if errorlevel 1 (
  echo Vercel CLI not found. Installing...
  call npm install -g vercel
)

echo.
echo Deployment Options:
echo 1. Deploy via Vercel Dashboard (Recommended)
echo 2. Deploy via Vercel CLI
echo.
set /p option="Choose option (1 or 2): "

if "%option%"=="1" (
  echo.
  echo Steps to deploy via Dashboard:
  echo 1. Push your code to GitHub
  echo 2. Go to https://vercel.com/new
  echo 3. Import your repository
  echo 4. Add environment variables (see VERCEL_READY.md)
  echo 5. Click Deploy
  echo.
  set /p push="Push to GitHub now? (y/n): "
  if /i "%push%"=="y" (
    set /p remote_url="Enter remote URL (e.g., https://github.com/user/repo.git): "
    git remote add origin "%remote_url%" 2>nul || git remote set-url origin "%remote_url%"
    git branch -M main
    git push -u origin main
    echo Pushed to GitHub!
  )
) else if "%option%"=="2" (
  echo.
  echo Deploying with Vercel CLI...
  call vercel
  echo.
  echo Don't forget to add environment variables:
  echo vercel env add NEXT_PUBLIC_SUPABASE_URL
  echo vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
  echo vercel env add SUPABASE_SERVICE_ROLE_KEY
  echo vercel env add GOOGLE_AI_API_KEY
  echo.
  set /p prod="Deploy to production? (y/n): "
  if /i "%prod%"=="y" (
    call vercel --prod
  )
)

echo.
echo Deployment process complete!
echo See VERCEL_READY.md for post-deployment checklist
echo.
pause
