# 📦 CREATE GITHUB REPOSITORY & PUSH

## Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. **Repository name**: `AIFS` (or any name you want)
3. **Description**: AI Film Studio
4. **Visibility**: Public or Private (your choice)
5. **DO NOT** check "Add a README file"
6. **DO NOT** check "Add .gitignore"
7. Click **"Create repository"**

## Step 2: Copy the Repository URL

After creating, you'll see a page with commands. Copy the URL that looks like:
```
https://github.com/YOUR_USERNAME/AIFS.git
```

## Step 3: Push Your Code

Open terminal in your project folder and run:

```bash
# Remove old remote
git remote remove origin

# Add new remote (replace with YOUR URL from Step 2)
git remote add origin https://github.com/YOUR_USERNAME/AIFS.git

# Push to GitHub
git push -u origin main
```

If it asks for authentication, follow the browser prompts.

## Step 4: Verify

Go to your GitHub repository URL. You should see all your files:
- ✅ app/
- ✅ components/
- ✅ public/
- ✅ package.json
- ✅ next.config.js
- ✅ All project files

## Step 5: Deploy to Vercel

Once your files are on GitHub:

1. Go to https://vercel.com/new
2. Import your repository
3. Add environment variables (see `VERCEL_ENV_VARIABLES.txt`)
4. Click Deploy

---

## 🆘 Alternative: Use GitHub Desktop

If command line isn't working:

1. Download GitHub Desktop: https://desktop.github.com/
2. Open GitHub Desktop
3. File → Add Local Repository
4. Select your project folder: `C:\Users\HP\Desktop\gemini\projects\AFIMMM`
5. Click "Publish repository"
6. Choose name and visibility
7. Click "Publish repository"

Done! Your code is now on GitHub.

---

## ✅ After Pushing

1. Refresh your GitHub repository page
2. You should see all files
3. Go to https://vercel.com/new
4. Import the repository
5. Add environment variables
6. Deploy!

---

**Start with Step 1 above!**
