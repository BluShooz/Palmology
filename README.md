# 🧠 Palm Insight AI

A production-ready AI-powered biometric analysis system that scans palm images and generates psychologically grounded personality insights.

## ✨ Features

- **Real-time Palm Detection**: MediaPipe-powered hand detection with 21 landmark points
- **Biometric Feature Extraction**: OpenCV-based analysis of palm geometry
- **AI-Powered Insights**: GPT-4o-mini generates deep personality readings
- **Dual Platform Support**: Web (Next.js) and Mobile (React Native Expo)
- **Stunning UI**: Dark futuristic design with neon scan animations
- **Production Ready**: Fully modular architecture with error handling

## 🏗️ Architecture

```
Frontend (Web/Mobile)
    ↓
Backend API (FastAPI)
    ↓
Computer Vision Pipeline
    ↓ MediaPipe → OpenCV → Feature Extraction
    ↓
AI Engine (GPT-4o-mini)
    ↓
JSON Response → UI Display
```

## 📁 Project Structure

```
palm-insight-ai/
├── backend/                 # Python FastAPI backend
│   ├── main.py             # API endpoints
│   ├── palm_detector.py    # MediaPipe hand detection
│   ├── feature_engine.py   # OpenCV feature extraction
│   ├── ai_engine.py        # GPT integration
│   └── requirements.txt
├── web/                    # Next.js web application
│   ├── app/               # App router pages
│   ├── components/        # React components
│   └── package.json
└── mobile/                # React Native Expo app
    ├── app/              # Screens & layout
    ├── components/       # React Native components
    └── package.json
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- OpenAI API key
- Expo (for mobile)

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Configure environment:**
```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

5. **Start the server:**
```bash
python main.py
# Server runs on http://localhost:8000
```

### Web App Setup

1. **Navigate to web directory:**
```bash
cd web
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

4. **Start development server:**
```bash
npm run dev
# Open http://localhost:3000
```

### Mobile App Setup

1. **Navigate to mobile directory:**
```bash
cd mobile
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure API URL:**
```bash
# Edit mobile/services/api.ts
# Set API_URL to your backend URL (e.g., http://YOUR_IP:8000)
```

4. **Add app assets:**
```
Add to mobile/assets/:
- icon.png (1024x1024)
- splash.png (1284x2778)
- adaptive-icon.png (1024x1024)
- favicon.png (48x48)
```

5. **Run on device:**
```bash
# Start Expo development server
npm start

# Scan QR code with Expo Go app (iOS/Android)
# Or press 'a' for Android emulator, 'i' for iOS simulator
```

## 🔧 Configuration

### Backend (.env)
```env
OPENAI_API_KEY=sk-your-key-here
PORT=8000
ENVIRONMENT=development
```

### Web (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Mobile (services/api.ts)
```typescript
const API_URL = 'http://YOUR_BACKEND_IP:8000';
```

## 📡 API Endpoints

### POST /analyze
Analyze palm from uploaded image file.

**Request:**
```bash
curl -X POST http://localhost:8000/analyze \
  -F "file=@palm.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "Analysis complete",
  "data": {
    "features": {...},
    "insights": {
      "archetype": "The Analytical Protector",
      "personality_insights": [...],
      "emotional_state": "...",
      "life_phase": "...",
      "shock_line": "..."
    }
  }
}
```

### POST /analyze_mobile
Analyze palm from base64 encoded image.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,..."
}
```

## 🧪 Testing

### Test Backend API
```bash
# Health check
curl http://localhost:8000/

# Test with image
curl -X POST http://localhost:8000/analyze \
  -F "file=@test-palm.jpg"
```

### Test Web App
1. Open http://localhost:3000
2. Allow camera access
3. Position palm in frame
4. Click capture button
5. View results

### Test Mobile App
1. Run `npm start` in mobile directory
2. Scan QR code with Expo Go
3. Grant camera permission
4. Capture palm image
5. View analysis results

## 🚢 Deployment

### Backend (Render/Fly.io)
1. Push code to GitHub
2. Connect repository to Render/Fly.io
3. Set environment variables
4. Deploy

### Web (Vercel)
1. Push code to GitHub
2. Import project to Vercel
3. Set `NEXT_PUBLIC_API_URL` environment variable
4. Deploy

### Mobile (App Store/Play Store)
1. Build standalone app with EAS Build:
```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```
2. Submit to app stores

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| OPENAI_API_KEY | OpenAI API key | Yes |
| PORT | Backend port | No (default: 8000) |
| NEXT_PUBLIC_API_URL | Backend URL for web | Yes |
| API_URL | Backend URL for mobile | Yes |

## 📊 Biometric Features Extracted

- **Palm Ratio**: Width-to-height ratio
- **Finger Spread**: Variance in finger extensions
- **Hand Stability**: Consistency of landmark positions
- **Landmark Variance**: Spatial distribution analysis
- **Finger Lengths**: Relative finger proportions
- **Thumb Angle**: Thumb positioning
- **Mount Depths**: Palm area distributions

## 🧠 AI Personality Model

The system uses GPT-4o-mini with specialized prompting to:
- Generate personality archetypes
- Analyze behavioral patterns
- Assess emotional states
- Interpret life phases
- Create psychologically piercing insights

## 🎨 UI Features

### Web
- Responsive camera capture
- Neon scan line animation
- Corner frame guides
- Real-time analysis
- Animated result cards
- Share functionality

### Mobile
- Full-screen camera
- Animated scan overlay
- Touch-optimized UI
- Native sharing
- Offline-capable (with caching)

## 🔐 Privacy & Ethics

- Images are processed and not stored
- No personal data is retained
- Results are for entertainment and self-reflection
- Clear disclaimer in UI
- GDPR-compliant architecture

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 🐛 Troubleshooting

### Camera not working
- Check browser permissions
- Ensure HTTPS (or localhost)
- Try different browser

### Hand not detected
- Improve lighting
- Position palm clearly
- Ensure all fingers visible
- Try different angle

### API errors
- Verify backend is running
- Check API key is valid
- Confirm API URL is correct
- Check browser console for errors

### Mobile build issues
- Clear Expo cache: `expo r -c`
- Update dependencies
- Check Expo Go version compatibility

## 📞 Support

For issues and questions:
- GitHub Issues: [Create issue]
- Documentation: See /docs folder

## 🎯 Future Enhancements

- [ ] Hand dominance detection
- [ ] Multiple hand comparison
- [ ] History tracking
- [ ] Export results as PDF
- [ ] Social media sharing
- [ ] Dark/light theme toggle
- [ ] Multiple language support

---

Built with ❤️ using MediaPipe, OpenCV, FastAPI, Next.js, and React Native
