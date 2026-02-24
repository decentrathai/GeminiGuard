# VeniceGuard Setup Guide

## Prerequisites

- Node.js 18+ installed
- Venice AI API key ([Get one here](https://venice.ai/))
- Git (for version control)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/decentrathai/veniceguard.git
cd veniceguard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy the example environment file and add your Venice AI API key:

```bash
cp .env.example .env
```

Edit `.env` and add your Venice API key:

```env
VENICE_API_KEY=your_venice_api_key_here
PORT=3000
NODE_ENV=development
```

### 4. Get Your Venice AI API Key

1. Go to [venice.ai](https://venice.ai/)
2. Sign up or log in
3. Navigate to API settings
4. Generate a new API key
5. Copy it to your `.env` file

## Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:3000`

## Using the Application

### Web Interface

1. Open `http://localhost:3000` in your browser
2. Upload an image or document (medical record, prescription, invoice, etc.)
3. Optionally customize the analysis prompt
4. Enable voice response if desired
5. Click "Analyze Document"
6. View results (text analysis + optional audio)

### API Endpoints

#### Multimodal Analysis (Image + Text + Voice)

```bash
curl -X POST http://localhost:3000/api/analyze \
  -F "file=@path/to/image.jpg" \
  -F "returnVoice=true" \
  -F "prompt=Extract medication names and dosages"
```

**Response:**
```json
{
  "analysis": "Detailed analysis text...",
  "summary": "Concise summary...",
  "audio": {
    "format": "mp3",
    "data": "data:audio/mp3;base64,..."
  },
  "privacy": {
    "dataRetention": "zero",
    "storageDuration": "ephemeral",
    "compliance": ["HIPAA-safe", "GDPR-compliant"]
  }
}
```

#### Text-Only Analysis

```bash
curl -X POST http://localhost:3000/api/analyze-text \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your sensitive text here",
    "returnVoice": true
  }'
```

#### Health Check

```bash
curl http://localhost:3000/api/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "VeniceGuard",
  "privacy": "zero-retention",
  "capabilities": ["vision", "text", "audio"],
  "timestamp": "2026-02-22T09:00:00.000Z"
}
```

#### Get Available Models

```bash
curl http://localhost:3000/api/models
```

**Response:**
```json
{
  "vision": "qwen3-vl-235b-a22b",
  "chat": ["zai-org-glm-4.7", "venice-uncensored", "qwen3-4b"],
  "audio": "tts-1",
  "provider": "Venice AI",
  "privacy": "zero-retention"
}
```

## Privacy Architecture

### How Zero-Retention Works

1. **Upload**: File uploaded to server via multipart form data
2. **In-Memory Processing**: File stored in RAM (multer memoryStorage), never touches disk
3. **Vision Analysis**: Base64-encoded image sent to Venice AI vision model
4. **Text Generation**: Analysis results processed by Venice chat model
5. **Voice Synthesis** (optional): TTS generated on-the-fly
6. **Response**: Results returned to client
7. **Cleanup**: File buffer garbage collected, no persistence

**Key Privacy Features:**
- ✅ No disk storage - all processing in-memory
- ✅ No database - zero data retention
- ✅ No logging of sensitive content
- ✅ Venice AI's zero-retention architecture
- ✅ HTTPS recommended for production

## Use Cases

### Medical Records
```bash
# Analyze prescription image
curl -X POST http://localhost:3000/api/analyze \
  -F "file=@prescription.jpg" \
  -F "prompt=Extract medication names, dosages, and frequency" \
  -F "returnVoice=true"
```

### Financial Documents
```bash
# Analyze invoice
curl -X POST http://localhost:3000/api/analyze \
  -F "file=@invoice.pdf" \
  -F "prompt=Extract invoice number, amount, and due date"
```

### Legal Contracts
```bash
# Analyze contract
curl -X POST http://localhost:3000/api/analyze \
  -F "file=@contract.jpg" \
  -F "prompt=Summarize key terms and obligations"
```

### Private Photos
```bash
# Analyze photo
curl -X POST http://localhost:3000/api/analyze \
  -F "file=@photo.jpg" \
  -F "prompt=Describe what you see in this image"
```

## Deployment

### Deploy to Production

1. **Set Environment Variables:**
   ```bash
   export VENICE_API_KEY=your_production_key
   export PORT=3000
   export NODE_ENV=production
   ```

2. **Use HTTPS:**
   - Deploy behind reverse proxy (nginx, Caddy)
   - Enable SSL/TLS for encrypted transmission
   - Venice API already uses HTTPS

3. **Process Manager:**
   ```bash
   # Using PM2
   npm install -g pm2
   pm2 start server.js --name veniceguard
   pm2 startup
   pm2 save
   ```

### Docker Deployment (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t veniceguard .
docker run -p 3000:3000 -e VENICE_API_KEY=your_key veniceguard
```

## Troubleshooting

### "VENICE_API_KEY not found"
- Ensure `.env` file exists in project root
- Check `.env` has correct syntax: `VENICE_API_KEY=xxx`
- Restart server after modifying `.env`

### "File too large"
- Default limit: 10MB
- Increase in `server.js`: `limits: { fileSize: 20 * 1024 * 1024 }`

### "Vision model error"
- Verify API key is valid
- Check Venice AI service status
- Ensure image format is supported (jpg, png, webp)

## Support

- **GitHub Issues:** https://github.com/decentrathai/veniceguard/issues
- **Venice AI Docs:** https://docs.venice.ai/
- **Hackathon:** Open Agents Hackathon 2026

## License

MIT License - See LICENSE file for details

---

**Built for Open Agents Hackathon 2026**  
Team: decentrathai (Alex Tolmach)
