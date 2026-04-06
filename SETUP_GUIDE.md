# 🚀 Complete Setup Guide - Palm Insight AI

Follow this step-by-step guide to set up the complete Palm Insight AI system on your local machine.

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Prerequisites Installation](#prerequisites-installation)
3. [Backend Setup](#backend-setup)
4. [Web Application Setup](#web-application-setup)
5. [Mobile Application Setup](#mobile-application-setup)
6. [Running the Complete System](#running-the-complete-system)
7. [Testing Your Setup](#testing-your-setup)
8. [Common Issues & Solutions](#common-issues--solutions)

---

## System Requirements

### Minimum Requirements
- **OS**: macOS, Linux, or Windows 10+
- **RAM**: 8GB (16GB recommended)
- **Storage**: 2GB free space
- **Camera**: Required for web and mobile testing

### Software Requirements
- **Python**: 3.9 or higher
- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher
- **Git**: For cloning the repository

---

## Prerequisites Installation

### 1. Install Python 3.9+

**macOS (using Homebrew):**
```bash
brew install python@3.9
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install python3.9 python3.9-venv python3-pip
```

**Windows:**
- Download from [python.org](https://www.python.org/downloads/)
- Check "Add Python to PATH" during installation

**Verify installation:**
```bash
python3 --version
# or
python --version
```

### 2. Install Node.js 18+

**macOS (using Homebrew):**
```bash
brew install node
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Windows:**
- Download from [nodejs.org](https://nodejs.org/)

**Verify installation:**
```bash
node --version
npm --version
```

### 3. Install Git

**macOS (using Homebrew):**
```bash
brew install git
```

**Linux:**
```bash
sudo apt install git
```

**Windows:**
- Download from [git-scm.com](https://git-scm.com/)

**Verify installation:**
```bash
git --version
```

### 4. Get OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API keys section
4. Create a new API key
5. Save it securely (you'll need it for setup)

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd palm-insight-ai/backend
```

### Step 2: Create Virtual Environment

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

### Step 3: Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Expected output:** Installation of FastAPI, MediaPipe, OpenCV, OpenAI, etc.

### Step 4: Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file
nano .env  # or use your preferred editor
```

**Add your OpenAI API key:**
```env
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=8000
ENVIRONMENT=development
```

### Step 5: Test Backend

```bash
python main.py
```

**Expected output:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Test the health endpoint:**
Open new terminal and run:
```bash
curl http://localhost:8000/
```

**Expected response:**
```json
{"status":"healthy","service":"Palm Insight AI","version":"1.0.0"}
```

**Stop the server** with `Ctrl+C`

---

## Web Application Setup

### Step 1: Navigate to Web Directory

```bash
cd palm-insight-ai/web
```

### Step 2: Install Node Dependencies

```bash
npm install
```

**Expected output:** Installation of Next.js, React, Tailwind CSS, etc.

### Step 3: Configure Environment

```bash
# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

**Note:** If you deployed your backend to a cloud service, replace the URL with your backend URL.

### Step 4: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 5: Test Web Application

1. Open your browser
2. Navigate to [http://localhost:3000](http://localhost:3000)
3. You should see the Palm Insight AI interface
4. Grant camera permissions when prompted
5. Test the camera preview

**Stop the server** with `Ctrl+C`

---

## Mobile Application Setup

### Step 1: Install Expo CLI

```bash
npm install -g expo-cli
```

### Step 2: Navigate to Mobile Directory

```bash
cd palm-insight-ai/mobile
```

### Step 3: Install Dependencies

```bash
npm install
```

**Expected output:** Installation of Expo, React Native, expo-camera, etc.

### Step 4: Configure API URL

You need to edit the API service file to point to your backend.

**Option A: Local Development (requires your IP address)**

1. Find your local IP address:
   - **macOS/Linux**: `ifconfig | grep inet`
   - **Windows**: `ipconfig`

2. Edit `mobile/services/api.ts`:
```typescript
const API_URL = 'http://YOUR_LOCAL_IP:8000';
// Example: const API_URL = 'http://192.168.1.100:8000';
```

**Option B: Deployed Backend**
```typescript
const API_URL = 'https://your-backend.herokuapp.com';
```

### Step 5: Add App Assets (Optional but Recommended)

Create or add the following files to `mobile/assets/`:

- **icon.png** (1024x1024 pixels) - App icon
- **splash.png** (1284x2778 pixels) - Launch screen
- **adaptive-icon.png** (1024x1024 pixels) - Android adaptive icon
- **favicon.png** (48x48 pixels) - Web favicon

**For testing:** You can use placeholder images or skip this step.

### Step 6: Start Expo Development Server

```bash
npm start
```

**Expected output:**
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

### Step 7: Test Mobile App

**For Android:**
1. Install Expo Go from Play Store
2. Scan QR code from terminal
3. App opens in Expo Go

**For iOS:**
1. Install Expo Go from App Store
2. Scan QR code with Camera app
3. Tap "Open in Expo Go"

**For Web:**
- Press `w` in terminal to open in web browser

**Stop the server** with `Ctrl+C`

---

## Running the Complete System

### Option 1: All Components (Multiple Terminals)

**Terminal 1 - Backend:**
```bash
cd palm-insight-ai/backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

**Terminal 2 - Web App:**
```bash
cd palm-insight-ai/web
npm run dev
```

**Terminal 3 - Mobile App:**
```bash
cd palm-insight-ai/mobile
npm start
```

### Option 2: Web + Backend Only

1. Start backend (Terminal 1)
2. Start web app (Terminal 2)
3. Open browser to http://localhost:3000

### Option 3: Mobile + Backend Only

1. Start backend (Terminal 1)
2. Start mobile app (Terminal 2)
3. Open Expo Go on your phone

---

## Testing Your Setup

### Test 1: Backend Health Check

```bash
curl http://localhost:8000/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "services": {
    "api": "running",
    "detector": "initialized",
    "feature_engine": "ready",
    "ai_engine": "ready"
  }
}
```

### Test 2: Web App Camera Test

1. Open http://localhost:3000
2. Grant camera permissions
3. Verify camera preview is visible
4. Check corner frame guides are displayed

### Test 3: End-to-End Palm Analysis

**Web:**
1. Position your palm in camera frame
2. Click capture button
3. Wait for scan animation
4. View results

**Mobile:**
1. Open app in Expo Go
2. Position your palm in camera
3. Tap capture button
4. Wait for analysis
5. View results

### Test 4: API Direct Test

```bash
# Test with a sample image
curl -X POST http://localhost:8000/analyze \
  -F "file=@path/to/your/palm.jpg"
```

---

## Common Issues & Solutions

### Issue: "No module named 'mediapipe'"

**Solution:**
```bash
pip install --upgrade pip
pip install mediapipe
```

### Issue: "Camera not working" (Web)

**Solutions:**
1. Check browser permissions
2. Ensure you're using HTTPS or localhost
3. Try a different browser (Chrome recommended)
4. Check if another app is using the camera

### Issue: "Hand not detected"

**Solutions:**
1. Improve lighting (avoid backlighting)
2. Position palm flat, fingers spread
3. Ensure entire hand is in frame
4. Move camera closer/further from hand

### Issue: "OpenAI API error"

**Solutions:**
1. Verify API key is correct in .env file
2. Check you have API credits available
3. Ensure network connectivity
4. Check OpenAI service status

### Issue: "Mobile app can't connect to backend"

**Solutions:**
1. Ensure backend is running
2. Check your IP address is correct in api.ts
3. Verify your phone and computer are on same network
4. Check firewall settings
5. Try using your computer's IP address instead of localhost

### Issue: "Expo build fails"

**Solutions:**
```bash
# Clear cache
expo r -c

# Reinstall dependencies
rm -rf node_modules
npm install

# Update Expo CLI
npm install -g expo-cli@latest
```

### Issue: "Port already in use"

**Solution:**
```bash
# Find process using port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill the process or change port in .env
```

---

## Production Deployment

### Backend Deployment Options

**Render.com:**
1. Push code to GitHub
2. Go to Render.com
3. New → Web Service
4. Connect your repository
5. Set build command: `pip install -r requirements.txt`
6. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. Add environment variables

**Fly.io:**
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Deploy
cd backend
flyctl launch
```

### Web Deployment (Vercel)

1. Push code to GitHub
2. Go to Vercel.com
3. Import repository
4. Set root directory to `web`
5. Add `NEXT_PUBLIC_API_URL` environment variable
6. Deploy

### Mobile Deployment

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Build for Android:
```bash
cd mobile
eas build --platform android
```

3. Build for iOS:
```bash
eas build --platform ios
```

4. Submit to app stores

---

## Need Help?

- Check the main [README.md](README.md)
- Review API documentation at `/docs` endpoint
- Check GitHub issues
- Ensure all prerequisites are installed
- Try running each component individually

---

## Next Steps

Once your setup is complete:

1. ✅ Test with various palm images
2. ✅ Customize the AI prompts in `ai_engine.py`
3. ✅ Modify UI themes in CSS/styles
4. ✅ Add new features
5. ✅ Deploy to production
6. ✅ Share with others!

**Enjoy your Palm Insight AI system! 🚀**
