@echo off
REM AURA Studio - Netlify Deployment Script (Windows)

echo.
echo ================================
echo AURA Studio - Netlify Deployment
echo ================================
echo.

REM Check if git is initialized
if not exist ".git" (
  echo Initializing Git repository...
  git init
  git add .
  git commit -m "Initial commit - Ready for Netlify"
  echo Git initialized
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

REM Check if netlify CLI is installed
where netlify >nul 2>nul
if errorlevel 1 (
  echo Netlify CLI not found. Installing...
  call npm install -g netlify-cli
)

echo.
echo Deployment Options:
echo 1. Deploy via Netlify Dashboard (Recommended)
echo 2. Deploy via Netlify CLI
echo.
set /p option="Choose option (1 or 2): "

if "%option%"=="1" (
  echo.
  echo Steps to deploy via Dashboard:
  echo 1. Push your code to GitHub
  echo 2. Go to https://app.netlify.com/
  echo 3. Click "Add new site" - "Import an existing project"
  echo 4. Choose GitHub and select your repository
  echo 5. Add environment variables (see NETLIFY_ENV_VARIABLES.txt)
  echo 6. Click "Deploy site"
  echo.
  set /p push="Push to GitHub now? (y/n): "
  if /i "%push%"=="y" (
    set /p remote_url="Enter remote URL (e.g., https://github.com/user/repo.git): "
    git remote add origin "%remote_url%" 2>nul || git remote set-url origin "%remote_url%"
    git branch -M main
    git add .
    git commit -m "Ready for Netlify deployment" 2>nul || echo Already committed
    git push -u origin main
    echo.
    echo Pushed to GitHub!
    echo Now go to https://app.netlify.com/ to complete deployment
  )
) else if "%option%"=="2" (
  echo.
  echo Deploying with Netlify CLI...
  call netlify login
  echo.
  call netlify init
  echo.
  echo Adding environment variables...
  call netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://ekjjgsiilbljlxebkazx.supabase.co"
  call netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrampnc2lpbGJsamx4ZWJrYXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NjE0NzksImV4cCI6MjA3NzEzNzQ3OX0.Qa3TwXImvm7_WophxjYk-FQ0chUFcZPA09CVQwD9R6g"
  call netlify env:set SUPABASE_SERVICE_ROLE_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrampnc2lpbGJsamx4ZWJrYXp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTU2MTQ3OSwiZXhwIjoyMDc3MTM3NDc5fQ.c-rqnF-sm2qzVPilkoYeBIDqkGZnjrhcKIvm_z3gEPM"
  call netlify env:set GOOGLE_AI_API_KEY "AIzaSyBuRqtWO7xxBEpYeefVacQlWK9iR5fgl4o"
  call netlify env:set SUPABASE_BUCKET_ASSETS "aura-assets"
  call netlify env:set NODE_ENV "production"
  echo.
  echo Deploying to production...
  call netlify deploy --prod
)

echo.
echo Deployment process complete!
echo See DEPLOY_TO_NETLIFY.md for more information
echo.
pause
