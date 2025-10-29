#!/bin/bash

# AURA Studio - Vercel Deployment Script
# This script prepares and deploys your project to Vercel

echo "🚀 AURA Studio - Vercel Deployment"
echo "=================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
  echo "📦 Initializing Git repository..."
  git init
  git add .
  git commit -m "Initial commit - Ready for Vercel"
  echo "✅ Git initialized"
  echo ""
fi

# Check if .env.local exists
if [ -f ".env.local" ]; then
  echo "⚠️  WARNING: .env.local file detected!"
  echo "This file contains sensitive keys and should NOT be committed."
  echo ""
  read -p "Do you want to remove it from git tracking? (y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git rm --cached .env.local 2>/dev/null || true
    echo "✅ .env.local removed from git tracking"
  fi
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

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "📦 Vercel CLI not found. Installing..."
  npm install -g vercel
fi

echo ""
echo "🎯 Deployment Options:"
echo "1. Deploy via Vercel Dashboard (Recommended)"
echo "2. Deploy via Vercel CLI"
echo ""
read -p "Choose option (1 or 2): " -n 1 -r
echo ""

if [[ $REPLY == "1" ]]; then
  echo ""
  echo "📋 Steps to deploy via Dashboard:"
  echo "1. Push your code to GitHub"
  echo "2. Go to https://vercel.com/new"
  echo "3. Import your repository"
  echo "4. Add environment variables (see VERCEL_READY.md)"
  echo "5. Click Deploy"
  echo ""
  read -p "Push to GitHub now? (y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter remote URL (e.g., https://github.com/user/repo.git): " remote_url
    git remote add origin "$remote_url" 2>/dev/null || git remote set-url origin "$remote_url"
    git branch -M main
    git push -u origin main
    echo "✅ Pushed to GitHub!"
  fi
elif [[ $REPLY == "2" ]]; then
  echo ""
  echo "🚀 Deploying with Vercel CLI..."
  vercel
  echo ""
  echo "⚠️  Don't forget to add environment variables:"
  echo "vercel env add NEXT_PUBLIC_SUPABASE_URL"
  echo "vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY"
  echo "vercel env add SUPABASE_SERVICE_ROLE_KEY"
  echo "vercel env add GOOGLE_AI_API_KEY"
  echo ""
  read -p "Deploy to production? (y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    vercel --prod
  fi
fi

echo ""
echo "✅ Deployment process complete!"
echo "📖 See VERCEL_READY.md for post-deployment checklist"
