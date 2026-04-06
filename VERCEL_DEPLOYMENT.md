# 🚀 Vercel Deployment Guide

This guide will help you deploy Palm Insight AI to Vercel.

## Quick Deploy (Recommended)

### Option 1: Deploy from Vercel Dashboard (Easiest)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up or log in

2. **Import Repository**
   - Click "Add New" → "Project"
   - Select your GitHub repository: `BluShooz/Palmology`
   - Vercel will detect it's a Next.js project

3. **Configure Project**
   - Root directory: `web`
   - Framework preset: Next.js
   - Build command: `npm run build` (auto-detected)
   - Output directory: `.next` (auto-detected)

4. **Add Environment Variable**
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: Your backend URL (e.g., `https://your-backend.onrender.com`)
   - For now, you can use: `https://palm-insight-ai.vercel.app`

5. **Deploy**
   - Click "Deploy"
   - Wait ~2-3 minutes for deployment
   - Get your Vercel URL: `https://your-project.vercel.app`

### Option 2: Deploy with Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to web directory
cd /Users/jonsmith/palm-insight-ai/web

# Deploy to production
vercel --prod
```

---

## Backend Deployment

The web app needs a backend API. Deploy the backend first:

### Option 1: Render.com (Recommended - Free)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your repo: `BluShooz/Palmology`
   - Root directory: `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Add Environment Variables**
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `PORT`: `8000`
   - `PYTHON_VERSION`: `3.9.0`

4. **Deploy**
   - Click "Create Web Service"
   - Get your backend URL: `https://your-backend.onrender.com`

### Option 2: Railway.app

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `BluShooz/Palmology`
4. Set root directory to `backend`
5. Add environment variables
6. Deploy

---

## Update Vercel with Backend URL

After deploying your backend:

1. Go to your Vercel project dashboard
2. Go to "Settings" → "Environment Variables"
3. Update `NEXT_PUBLIC_API_URL` to your backend URL
4. Redeploy your Vercel app

---

## Deployed URLs

Once deployed, you'll have:

- **Frontend**: `https://palm-insight-ai.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

Update these in your GitHub repository's About section.

---

## Troubleshooting

### Build Failures

If build fails:
1. Check Build logs in Vercel dashboard
2. Ensure `web/package.json` has all dependencies
3. Verify `NEXT_PUBLIC_API_URL` is set

### API Connection Errors

If frontend can't connect to backend:
1. Ensure backend is deployed and running
2. Check CORS settings in backend (`main.py`)
3. Verify `NEXT_PUBLIC_API_URL` is correct
4. Check browser console for errors

### Environment Variables Not Working

If env vars aren't working:
1. Ensure they start with `NEXT_PUBLIC_` for frontend access
2. Redeploy after adding/changing env vars
3. Use vercel CLI: `vercel env pull`

---

## Custom Domain (Optional)

To use a custom domain:

1. Go to Vercel project → "Settings" → "Domains"
2. Add your domain (e.g., `palminsight.ai`)
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

---

## Monitoring

After deployment:

- **Vercel Dashboard**: Monitor uptime, analytics
- **Render Dashboard**: Monitor backend status
- **GitHub**: Update README with deployed URLs

---

## Update GitHub Repository

Once deployed, update your repo:

1. Go to repository settings
2. Add to About section:
   ```
   🚀 Live: https://palm-insight-ai.vercel.app
   🔧 Backend: https://your-backend.onrender.com
   ```
3. Update README.md with deployed URLs
4. Add website URL in repository settings

---

## Cost Breakdown

- **Vercel**: Free tier available (hobby)
- **Render**: Free tier available (with spin-up time)
- **OpenAI API**: Pay per usage (~$0.002/analysis)

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- GitHub Issues: Create issue in repository
