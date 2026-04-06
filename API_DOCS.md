# 📡 Palm Insight AI - API Documentation

Complete API reference for the Palm Insight AI backend service.

## Base URL

```
Development: http://localhost:8000
Production: https://your-backend-url.com
```

## Authentication

Currently, the API does not require authentication. For production use, implement API keys or OAuth.

---

## Endpoints

### 1. Health Check

#### GET `/`

Check if the API is running.

**Response:**
```json
{
  "status": "healthy",
  "service": "Palm Insight AI",
  "version": "1.0.0"
}
```

**Status Codes:**
- `200 OK` - API is running

---

#### GET `/health`

Detailed health check of all services.

**Response:**
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

**Status Codes:**
- `200 OK` - All services healthy

---

### 2. Palm Analysis

#### POST `/analyze`

Analyze palm from uploaded image file (multipart/form-data).

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (image file)

**Example using curl:**
```bash
curl -X POST http://localhost:8000/analyze \
  -F "file=@palm.jpg"
```

**Example using JavaScript (fetch):**
```javascript
const formData = new FormData();
formData.append('file', imageFile);

fetch('http://localhost:8000/analyze', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Analysis complete",
  "data": {
    "features": {
      "palm_ratio": 0.4234,
      "finger_spread": 0.0892,
      "stability_score": 0.7654,
      "landmark_variance": 0.1234,
      "palm_width": 0.2345,
      "palm_height": 0.5543,
      "finger_lengths": {
        "thumb": 0.1234,
        "index": 0.2345,
        "middle": 0.2789,
        "ring": 0.2345,
        "pinky": 0.1876
      },
      "thumb_angle": 45.6789,
      "mount_depths": {
        "venus": 0.0123,
        "jupiter": 0.0234,
        "saturn": 0.0345,
        "apollo": 0.0234,
        "mercury": 0.0123
      }
    },
    "insights": {
      "archetype": "The Analytical Protector",
      "personality_insights": [
        "You process information through a logical framework while maintaining deep emotional awareness",
        "Your decision-making balances careful analysis with intuitive understanding",
        "You create stability for others while adapting to new information rapidly",
        "You communicate complex ideas with clarity and emotional intelligence"
      ],
      "emotional_state": "Currently navigating a period of significant emotional growth with increased self-awareness",
      "life_phase": "Transition period where analytical skills are being integrated with deeper emotional wisdom",
      "shock_line": "You've been hesitating on a decision because you can see all possible outcomes - pick the one that excites you, not the one that feels safest."
    },
    "detection_confidence": "high"
  }
}
```

**Response (No Hand Detected):**
```json
{
  "success": false,
  "message": "No hand detected in image. Please ensure your palm is clearly visible and well-lit.",
  "data": null
}
```

**Status Codes:**
- `200 OK` - Analysis completed
- `400 Bad Request` - Invalid image format
- `500 Internal Server Error` - Server error

---

#### POST `/analyze_mobile`

Analyze palm from base64 encoded image (JSON).

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body: JSON object with `image` field

**Example using curl:**
```bash
curl -X POST http://localhost:8000/analyze_mobile \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."
  }'
```

**Example using JavaScript (fetch):**
```javascript
const base64Image = 'data:image/jpeg;base64,/9j/4AAQSkZJRg...';

fetch('http://localhost:8000/analyze_mobile', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ image: base64Image })
})
.then(response => response.json())
.then(data => console.log(data));
```

**Response:** Same as `/analyze` endpoint

**Status Codes:**
- `200 OK` - Analysis completed
- `400 Bad Request` - Invalid image data
- `500 Internal Server Error` - Server error

---

## Data Models

### Features Object

```typescript
{
  palm_ratio: number,        // Width/height ratio (0-1)
  finger_spread: number,     // Variance in finger lengths
  stability_score: number,   // Landmark consistency (0-1)
  landmark_variance: number, // Spatial distribution
  palm_width: number,        // Normalized width
  palm_height: number,       // Normalized height
  finger_lengths: {
    thumb: number,
    index: number,
    middle: number,
    ring: number,
    pinky: number
  },
  thumb_angle: number,       // Degrees
  mount_depths: {
    venus: number,
    jupiter: number,
    saturn: number,
    apollo: number,
    mercury: number
  }
}
```

### Insights Object

```typescript
{
  archetype: string,              // Personality archetype
  personality_insights: string[], // Array of insights
  emotional_state: string,       // Current emotional baseline
  life_phase: string,            // Current developmental phase
  shock_line: string             // Memorable insight
}
```

### Analysis Response

```typescript
{
  success: boolean,
  message: string,
  data: {
    features: FeaturesObject,
    insights: InsightsObject,
    detection_confidence: string
  }
}
```

---

## Image Requirements

### Supported Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)

### Recommended Specifications
- **Resolution**: 1280x720 or higher
- **Lighting**: Bright, even illumination
- **Composition**: Hand centered, fingers spread
- **Background**: Contrasting (light or dark)
- **File Size**: Under 5MB

### Camera Positioning Tips
1. Ensure entire hand is visible
2. Keep palm flat, fingers slightly spread
3. Avoid shadows on hand
4. Use steady hand or stable surface
5. Maintain consistent distance (30-50cm)

---

## Error Handling

### Common Errors

#### Invalid Image Format
```json
{
  "success": false,
  "message": "Invalid image format"
}
```
**Solution:** Ensure image is JPEG or PNG format

#### No Hand Detected
```json
{
  "success": false,
  "message": "No hand detected in image. Please ensure your palm is clearly visible and well-lit."
}
```
**Solution:** Improve image quality, reposition hand

#### Analysis Failed
```json
{
  "success": false,
  "message": "Analysis failed: [error details]"
}
```
**Solution:** Check server logs, verify API configuration

#### OpenAI API Error
```json
{
  "success": false,
  "message": "Analysis failed: OpenAI API error"
}
```
**Solution:** Verify API key, check credits, ensure network connectivity

---

## Rate Limiting

Currently, no rate limiting is implemented. For production use, implement rate limiting:

- **Recommended**: 10 requests per minute per IP
- **Enterprise**: Custom rate limits based on needs

---

## CORS Configuration

The API is configured to accept requests from any origin (`allow_origins=["*"]`).

For production, update the CORS configuration in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  // Specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Performance Metrics

### Average Response Times

- Hand Detection: 100-300ms
- Feature Extraction: 50-100ms
- AI Generation: 2-5 seconds
- **Total**: 2.5-6 seconds

### Optimization Tips

1. **Image Compression**: Compress images before upload
2. **Caching**: Cache results for repeated images
3. **Async Processing**: Use background workers for AI generation
4. **CDN**: Serve static assets via CDN
5. **Load Balancing**: Distribute load across multiple instances

---

## Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:8000/

# Analyze image
curl -X POST http://localhost:8000/analyze \
  -F "file=@test-palm.jpg"
```

### Using Postman

1. Create new POST request
2. URL: `http://localhost:8000/analyze`
3. Body type: form-data
4. Key: `file`, Type: File
5. Select image file
6. Send request

### Using Python

```python
import requests

# Health check
response = requests.get('http://localhost:8000/')
print(response.json())

# Analyze image
with open('palm.jpg', 'rb') as f:
    files = {'file': f}
    response = requests.post('http://localhost:8000/analyze', files=files)
    print(response.json())
```

### Using JavaScript (Browser)

```javascript
// Analyze image
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('http://localhost:8000/analyze', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log(data.data.insights);
  } else {
    console.error(data.message);
  }
});
```

---

## Production Considerations

### Security

1. **Add Authentication**: Implement API keys or OAuth
2. **Rate Limiting**: Prevent abuse
3. **Input Validation**: Validate all inputs
4. **HTTPS**: Use TLS in production
5. **Sanitization**: Sanitize file uploads

### Monitoring

1. **Logging**: Implement structured logging
2. **Metrics**: Track response times, error rates
3. **Alerts**: Set up error alerting
4. **Health Checks**: Monitor service health

### Scaling

1. **Load Balancing**: Use multiple instances
2. **Caching**: Implement Redis cache
3. **CDN**: Serve via CloudFlare/AWS CloudFront
4. **Database**: Add PostgreSQL for results storage
5. **Queue**: Use Celery/Redis for async processing

---

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Hand detection with MediaPipe
- Feature extraction with OpenCV
- AI-powered insights with GPT-4o-mini
- Web and mobile endpoints

---

## Support

For issues or questions:
- GitHub Issues: [Create issue]
- Email: support@palminsight.ai
- Documentation: [Full docs]

---

**Generated for Palm Insight AI v1.0.0**
