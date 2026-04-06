# 🚀 Deploy Palm Insight AI to Vercel - Quick Guide

## Step 1: Deploy Backend (Required First)

### Go to Render.com
1. Visit [render.com](https://render.com)
2. Sign up/login with GitHub
3. Click **"New +"** → **"Web Service"**
4. Click **"Connect"** on your `BluShooz/Palmology` repo

### Configure Backend Service
- **Name:** `palm-insight-api`
- **Root Directory:** `backend`
- **Environment:** `Python 3`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Add Environment Variable
- Click **"Advanced"** → **"Add Environment Variable"**
- Key: `OPENAI_API_KEY`
- Value: `sk-your-actual-openai-api-key-here`

### Deploy
- Click **"Create Web Service"**
- Wait ~5-10 minutes for deployment
- Copy your backend URL (e.g., `https://palm-insight-api.onrender.com`)

---

## Step 2: Deploy Frontend to Vercel

### Option A: Vercel Dashboard (Recommended - 2 minutes)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/login with GitHub

2. **Import Repository**
   - Click **"Add New..."** → **"Project"**
   - Find and select `BluShooz/Palmology`
   - Click **"Import"**

3. **Configure Project**
   - **Name:** `palm-insight-ai`
   - **Framework Preset:** `Next.js` (auto-detected)
   - **Root Directory:** `web`
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)

4. **Add Environment Variable**
   - Click **"Environment Variables"**
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://palm-insight-api.onrender.com` (your backend URL from Step 1)
   - Click **"Save"**

5. **Deploy**
   - Click **"Deploy"**
   - Wait ~2-3 minutes
   - Get your Vercel URL: `https://palm-insight-ai.vercel.app`

### Option B: Vercel CLI (Requires Login)

```bash
# Navigate to web directory
cd /Users/jonsmith/palm-insight-ai/web

# Login to Vercel (opens browser)
vercel login

# Deploy to production
vercel --prod
```

---

## Step 3: Update GitHub Repository

### Add URLs to Repository About Section

1. **Go to your repo:**
   - https://github.com/BluShooz/Palmology

2. **Edit About section:**
   - Click the ⚙️ icon (top right)
   - In the "About" section, add:
     ```
     🚀 Live: https://palm-insight-ai.vercel.app
     🔧 API: https://palm-insight-api.onrender.com
     ```

3. **Add website URL:**
   - Go to **Settings** → **General**
   - Scroll to "Website" field
   - Paste: `https://palm-insight-ai.vercel.app`
   - Click **Save**

---

## 🎯 Your Deployment URLs

After deployment, you'll have:

- **Frontend:** `https://palm-insight-ai.vercel.app`
- **Backend API:** `https://palm-insight-api.onrender.com`

### Test Your Deployment

1. **Test Backend Health:**
   ```bash
   curl https://palm-insight-api.onrender.com/
   ```

2. **Test Frontend:**
   - Open `https://palm-insight-ai.vercel.app` in browser
   - Allow camera permissions
   - Test palm capture and analysis

---

## 🔧 Troubleshooting

### Frontend Shows "Failed to Connect"

**Problem:** Frontend can't reach backend

**Solution:**
1. Verify backend is deployed and running
2. Check `NEXT_PUBLIC_API_URL` in Vercel settings
3. Ensure CORS is enabled in backend (`main.py`)
4. Check Vercel deployment logs

### Build Fails on Vercel

**Problem:** Build fails during deployment

**Solution:**
1. Check Vercel build logs
2. Ensure `web/package.json` has all dependencies
3. Verify root directory is set to `web`
4. Try clearing build cache and redeploy

### Backend Deployment Fails

**Problem:** Render deployment fails

**Solution:**
1. Check Render build logs
2. Verify `OPENAI_API_KEY` is set correctly
3. Ensure all dependencies in `requirements.txt`
4. Check Python version compatibility

---

## 💡 Tips

- **Free Tier Limits:**
  - Vercel: Unlimited deployments, 100GB bandwidth/month
  - Render: Free tier spins down after 15min inactivity (cold start ~30s)

- **Monitor Performance:**
  - Vercel Dashboard → Analytics
  - Render Dashboard → Metrics

- **Update URLs:**
  - Always update `NEXT_PUBLIC_API_URL` when backend changes
  - Redeploy frontend after updating env vars

---

## 📞 Need Help?

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Render Docs:** [render.com/docs](https://render.com/docs)
- **GitHub Issues:** Create issue in repository

---

**Ready to deploy! Start with Step 1 above. 🚀**
