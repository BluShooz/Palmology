# 🚀 DEPLOY TO VERCEL RIGHT NOW

## **Step 1: Go to Vercel**

1. **Visit:** [vercel.com](https://vercel.com)
2. **Sign up/Login** with GitHub (same account as the repo)

## **Step 2: Import Your Repository**

1. Click **"Add New..."** → **"Project"**
2. Click **"Import"** on your repository: **`BluShooz/Palmology`**
3. Or click **"Continue"** to import from GitHub

## **Step 3: Configure Project**

**Important Settings:**
- **Framework Preset:** Next.js (should auto-detect)
- **Root Directory:** `web`
- **Build Command:** `npm run build` (auto-filled)
- **Output Directory:** `.next` (auto-filled)

**Environment Variables:**
Click **"Environment Variables"** → **"Add New"**
- Key: `NEXT_PUBLIC_API_URL`
- Value: `https://palm-insight-api.onrender.com` (we'll deploy backend next)

## **Step 4: Deploy**

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Get your URL: `https://palm-insight-ai.vercel.app` (or similar)

## **Step 5: Update GitHub Repository**

1. Go to your repo: [github.com/BluShooz/Palmology](https://github.com/BluShooz/Palmology)
2. Click **Settings** (⚙️ icon)
3. Scroll to **"Website"** field
4. Paste your Vercel URL: `https://palm-insight-ai.vercel.app`
5. Click **"Save"**

6. Scroll to **"About"** section
7. Add:
   ```
   🚀 Live: https://palm-insight-ai.vercel.app
   ```

## **Step 6: Deploy Backend (for full functionality)**

**Render.com:**
1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect repo: `BluShooz/Palmology`
4. Root directory: `backend`
5. Build Command: `pip install -r requirements.txt`
6. Start Command: `python simple_main.py` (use simplified version)
7. Add Environment Variable:
   - Key: `OPENAI_API_KEY`
   - Value: Your OpenAI API key
8. Deploy → Get backend URL

**Then update Vercel environment variable:**
- Go to your Vercel project
- Settings → Environment Variables
- Update `NEXT_PUBLIC_API_URL` to your backend URL
- Redeploy

---

## **QUICK DEPLOY (Skip Backend for Now)**

If you want to test the frontend first without backend:

1. **Deploy to Vercel** (steps above)
2. **It will work** but show "Failed to connect" when capturing
3. **Full functionality** requires backend deployment

---

## **Your Live Link Will Be:**

**Frontend:** `https://palm-insight-ai.vercel.app` (or similar)
**Backend:** `https://palm-insight-api.onrender.com` (after Render deployment)

---

**🚀 START WITH VERCEL DEPLOY NOW!**

It takes 3 minutes and you'll have a working live link for your GitHub repo!
