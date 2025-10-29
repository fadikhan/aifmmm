#!/bin/bash

# AURA Studio - Netlify Deployment Script

echo "🚀 AURA Studio - Netlify Deployment"
echo "===================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
  echo "📦 Initializing Git repository..."
  git init
  git add .
  git commit -m "Initial commit - Ready for Netlify"
  echo "✅ Git initialized"
  echo ""
fi

# Run build test
echo "🔨 Testing production build..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed! Please fix errors before deploying."
  exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null; then
  echo "📦 Netlify CLI not found. Installing..."
  npm install -g netlify-cli
fi

echo ""
echo "🎯 Deployment Options:"
echo "1. Deploy via Netlify Dashboard (Recommended)"
echo "2. Deploy via Netlify CLI"
echo ""
read -p "Choose option (1 or 2): " -n 1 -r
echo ""

if [[ $REPLY == "1" ]]; then
  echo ""
  echo "📋 Steps to deploy via Dashboard:"
  echo "1. Push your code to GitHub"
  echo "2. Go to https://app.netlify.com/"
  echo "3. Click 'Add new site' → 'Import an existing project'"
  echo "4. Choose GitHub and select your repository"
  echo "5. Add environment variables (see NETLIFY_ENV_VARIABLES.txt)"
  echo "6. Click 'Deploy site'"
  echo ""
  read -p "Push to GitHub now? (y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter remote URL (e.g., https://github.com/user/repo.git): " remote_url
    git remote add origin "$remote_url" 2>/dev/null || git remote set-url origin "$remote_url"
    git branch -M main
    git add .
    git commit -m "Ready for Netlify deployment" 2>/dev/null || echo "Already committed"
    git push -u origin main
    echo ""
    echo "✅ Pushed to GitHub!"
    echo "Now go to https://app.netlify.com/ to complete deployment"
  fi
elif [[ $REPLY == "2" ]]; then
  echo ""
  echo "🚀 Deploying with Netlify CLI..."
  netlify login
  echo ""
  netlify init
  echo ""
  echo "🔑 Adding environment variables..."
  netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://ekjjgsiilbljlxebkazx.supabase.co"
  netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrampnc2lpbGJsamx4ZWJrYXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NjE0NzksImV4cCI6MjA3NzEzNzQ3OX0.Qa3TwXImvm7_WophxjYk-FQ0chUFcZPA09CVQwD9R6g"
  netlify env:set SUPABASE_SERVICE_ROLE_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrampnc2lpbGJsamx4ZWJrYXp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTU2MTQ3OSwiZXhwIjoyMDc3MTM3NDc5fQ.c-rqnF-sm2qzVPilkoYeBIDqkGZnjrhcKIvm_z3gEPM"
  netlify env:set GOOGLE_AI_API_KEY "AIzaSyBuRqtWO7xxBEpYeefVacQlWK9iR5fgl4o"
  netlify env:set SUPABASE_BUCKET_ASSETS "aura-assets"
  netlify env:set NODE_ENV "production"
  echo ""
  echo "🚀 Deploying to production..."
  netlify deploy --prod
fi

echo ""
echo "✅ Deployment process complete!"
echo "📖 See DEPLOY_TO_NETLIFY.md for more information"
