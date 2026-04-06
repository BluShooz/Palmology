# 📷 Camera Troubleshooting Guide

## Quick Camera Fix Checklist

### 1. **Browser Requirements** ✅
- Use Chrome, Firefox, Safari, or Edge
- Update to latest browser version
- **Required:** HTTPS or localhost (camera won't work on HTTP)

### 2. **Camera Permissions** 🔐

**Chrome/Edge:**
1. Click lock icon 🔒 in address bar
2. Find "Camera" → Set to "Allow"
3. Refresh page

**Firefox:**
1. Click lock icon 🔒 in address bar
2. Find "Permissions" → "Camera" → Set to "Allow"
3. Refresh page

**Safari:**
1. Safari → Settings → Websites
2. Camera → Find website → Allow
3. Refresh page

### 3. **Local Development** 💻

```bash
# Navigate to web directory
cd /Users/jonsmith/palm-insight-ai/web

# Install dependencies
npm install

# Start development server
npm run dev
```

Then open: `http://localhost:3000`

**Important:** Use `localhost:3000` NOT `127.0.0.1:3000`

### 4. **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| **"Camera access denied"** | Allow permissions in browser settings |
| **"No camera found"** | Check if camera is connected and working |
| **"Camera already in use"** | Close other apps using camera (Zoom, Teams, etc.) |
| **Black screen** | Wait for video to load (2-3 seconds) |
| **"NotSupportedError"** | Use HTTPS or localhost, update browser |
| **Stuttering video** | Close other tabs, check internet connection |

### 5. **Testing Camera**

**Test 1: Browser Camera Test**
```javascript
// Open browser console (F12) and run:
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => console.log('Camera works!', stream))
  .catch(err => console.error('Camera failed:', err))
```

**Test 2: Check Camera Availability**
```javascript
// List all cameras
navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    const cameras = devices.filter(d => d.kind === 'videoinput')
    console.log('Available cameras:', cameras)
  })
```

### 6. **Deployed Version Issues**

If camera doesn't work on Vercel deployment:

1. **Check HTTPS:**
   - Vercel automatically provides HTTPS
   - Make sure you're using `https://` not `http://`

2. **Clear Browser Cache:**
   - Chrome: Ctrl+Shift+Delete (Cmd+Shift+Delete Mac)
   - Clear "Site data" for your Vercel URL

3. **Try Different Browser:**
   - Test in Chrome, Firefox, Safari
   - Some browsers have stricter camera policies

4. **Check Console for Errors:**
   - Press F12 → Console tab
   - Look for red error messages
   - Share errors if you need help

### 7. **Mobile Camera Issues**

**iOS Safari:**
1. Settings → Safari → Camera → Allow
2. Close all Safari tabs
3. Reopen your site
4. Tap "Allow" when prompted

**Android Chrome:**
1. Chrome menu → Settings → Site Settings → Camera
2. Allow for your site
3. Refresh page

### 8. **Still Not Working?**

**Quick Reset:**
```bash
# Kill any running processes
pkill -f "next-dev"

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Start fresh
npm run dev
```

**Deployed Version:**
- Pull latest code: `git pull`
- Clear browser cache
- Try incognito/private mode
- Check browser console for errors

### 9. **Debug Mode**

Enable debug logging in browser console:

```javascript
// In browser console (F12)
localStorage.setItem('debug', 'true')
location.reload()
```

### 10. **Get Help**

If camera still doesn't work:

1. **Collect Info:**
   - Browser name and version
   - Operating system
   - Error message (if any)
   - Console errors (F12 → Console)

2. **Test URLs:**
   - Local: `http://localhost:3000`
   - Deployed: Your Vercel URL

3. **Create Issue:**
   - Go to [github.com/BluShooz/Palmology/issues](https://github.com/BluShooz/Palmology/issues)
   - Include collected info
   - Share console errors

---

## ✅ Camera Working? Test It!

1. **Allow permissions** when prompted
2. **Wait 2-3 seconds** for video to load
3. **Check for mirror effect** (you should see yourself)
4. **Try capture button** (should flash/scan)

**Expected behavior:**
- Video appears within 3 seconds
- Shows mirror image (like a mirror)
- Corner guides visible
- Center focus box visible
- Capture button works

---

**Camera fixed and pushed to GitHub! 🎉**
