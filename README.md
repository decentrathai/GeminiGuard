# PrivacyGuard Live Agent 🛡️

**Real-Time Conversational Privacy Agent for the Gemini Live Agent Challenge**

PrivacyGuard is a zero-retention privacy agent that combines real-time voice conversation, document analysis, and computer vision - all without storing any user data.

## 🏆 Built for Gemini Live Agent Challenge 2026

**Category:** Live Agents - Real-time audio/vision interaction  
**Team:** decentrathai (Alex Tolmach)  
**Prize Pool:** $80,000  
**Deadline:** March 16, 2026

---

## 🎯 Key Features

### 1. **Real-Time Voice Conversation** 🎤
- Talk to the AI agent using your voice (Web Speech API)
- AI responds with both text and speech synthesis
- Continuous conversation with context retention during session
- Zero audio storage - all processing in-memory

### 2. **Live Document Analysis** 📄
- Upload sensitive documents during live conversation
- Ask questions about uploaded images in real-time
- Vision + voice + text multimodal interaction
- Images discarded immediately after analysis

### 3. **Traditional Upload & Analyze** 📁
- Upload financial documents, contracts, legal files
- Get detailed analysis + concise summary
- Custom prompts supported
- Zero disk storage - purely in-memory processing

### 4. **Text-Only Analysis** 📝
- Paste sensitive text for instant analysis
- Extract key insights from contracts, legal documents, financial data
- No storage, no retention

---

## 🔐 Privacy Architecture

### Zero Data Retention
- **No disk storage:** All files processed in RAM using `multer.memoryStorage()`
- **Immediate disposal:** Image buffers garbage-collected after processing
- **No logging:** User data never written to logs or databases
- **Ephemeral sessions:** WebSocket conversations cleared on disconnect

### Compliance
- ✅ GDPR-compliant
- ✅ Enterprise-grade security
- ✅ In-memory-only processing
- ✅ Real-time data destruction

---

## 🚀 Technology Stack

### Backend
- **Node.js + Express:** HTTP server
- **WebSocket (ws):** Real-time bidirectional communication
- **Google GenAI SDK:** Official `@google/generative-ai` package
- **Multer:** In-memory file handling

### AI Models (Google Gemini)
- **Vision:** `gemini-2.0-flash-exp` - For image/document analysis
- **Chat:** `gemini-2.0-flash-exp` - For text conversation
- **Live:** `gemini-2.0-flash-exp` - For real-time streaming

### Frontend
- **Vanilla JavaScript:** No frameworks, pure web standards
- **Web Speech API:** Browser-native voice recognition
- **Speech Synthesis API:** Text-to-speech responses
- **WebSocket Client:** Real-time communication with backend

### Hackathon Requirements ✅
- ✅ Uses Gemini model (gemini-2.0-flash-exp)
- ✅ Uses Google GenAI SDK (`@google/generative-ai`)
- 🔜 Google Cloud service (planned: Cloud Run)
- 🔜 Hosted on Google Cloud (deployment Phase 2)

---

## 📦 Installation

### Prerequisites
- Node.js 18+ (tested on v24.13.0)
- Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/privacyguard-live.git
cd privacyguard-live
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create `.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=development
```

4. **Run the server**
```bash
npm start
```

5. **Open in browser**
```
http://localhost:3001
```

---

## 🎮 Usage Guide

### Live Voice Session

1. **Start Session**
   - Click "🎤 Live Voice" tab
   - Click "Start Live Session" button
   - WebSocket connection established

2. **Upload Image (Optional)**
   - Click "📷 Upload Image"
   - Select a document/photo
   - Image loaded into session memory

3. **Talk to the Agent**
   - Click the microphone button (🎤)
   - Speak your question or request
   - AI responds with text + voice
   - Continue conversation naturally

4. **Or Type Messages**
   - Use the text input as an alternative to voice
   - Press Enter or click "Send Message"

5. **End Session**
   - Click "End Session" button
   - All data immediately cleared from memory

### Upload & Analyze

1. Click "📁 Upload & Analyze" tab
2. Upload an image/document
3. (Optional) Add custom prompt
4. Click "Analyze Document"
5. View detailed analysis + summary

### Text-Only Analysis

1. Click "📝 Text Only" tab
2. Paste sensitive text
3. Click "Analyze Text"
4. View analysis results

---

## 🏗️ Architecture

### Request Flow (Upload & Analyze)

```
User Upload → Multer (in-memory) → Gemini Vision API → Analysis
                                         ↓
                                  Gemini Chat API → Summary
                                         ↓
                                  JSON Response → Frontend
                                         ↓
                                  Buffer GC (data destroyed)
```

### WebSocket Flow (Live Voice)

```
Browser → WebSocket → Server
   ↓                      ↓
Voice Input          Process with
   ↓                 Gemini Live API
Speech API               ↓
   ↓                 Generate Response
Transcript               ↓
   ↓                 Send via WebSocket
Display                  ↓
   ↓                 Speech Synthesis
Hear Response            ↓
                     Memory cleared
```

### Privacy Flow

```
Data Received → RAM Only → Processed → Response Generated → RAM Cleared
      ↓              ↓           ↓             ↓                ↓
  NO DISK      NO DATABASE   NO LOGS    NO STORAGE      GC'd immediately
```

---

## 📊 API Endpoints

### HTTP Endpoints

#### `POST /api/analyze`
Multimodal document analysis with vision

**Request:**
```bash
curl -X POST http://localhost:3001/api/analyze \
  -F "file=@document.jpg" \
  -F "prompt=Extract key financial data"
```

**Response:**
```json
{
  "analysis": "Detailed analysis text...",
  "summary": "Brief summary...",
  "privacy": {
    "dataRetention": "zero",
    "storageDuration": "ephemeral",
    "compliance": ["Enterprise-grade", "GDPR-compliant"],
    "processingMode": "in-memory-only"
  }
}
```

#### `POST /api/analyze-text`
Text-only analysis

**Request:**
```bash
curl -X POST http://localhost:3001/api/analyze-text \
  -H "Content-Type: application/json" \
  -d '{"text": "Analyze this contract clause..."}'
```

#### `GET /api/health`
Health check

**Response:**
```json
{
  "status": "healthy",
  "service": "PrivacyGuard Live Agent",
  "privacy": "zero-retention",
  "capabilities": ["vision", "text", "live-voice", "real-time-streaming"],
  "sdk": "Google GenAI SDK (native)"
}
```

#### `GET /api/models`
Get model info

**Response:**
```json
{
  "vision": "gemini-2.0-flash-exp",
  "chat": "gemini-2.0-flash-exp",
  "live": "gemini-2.0-flash-exp",
  "provider": "Google Gemini 2.0 Flash",
  "sdk": "@google/generative-ai"
}
```

### WebSocket Protocol

**Connect:** `ws://localhost:3001/`

**Message Types:**

1. **Start Session**
```json
{ "type": "start_session" }
```

2. **Upload Image**
```json
{
  "type": "upload_image",
  "imageData": "base64_encoded_image",
  "mimeType": "image/jpeg"
}
```

3. **Send Text Message**
```json
{
  "type": "text_message",
  "text": "What's in this document?"
}
```

4. **End Session**
```json
{ "type": "end_session" }
```

**Server Responses:**

- `session_started`: Session initialized
- `image_received`: Image loaded into memory
- `response`: AI response (text)
- `session_ended`: Session closed, data cleared
- `error`: Error message

---

## 🧪 Testing

### Manual Testing

1. **Live Voice Test**
   - Start live session
   - Upload a contract/invoice
   - Ask "What are the key terms?"
   - Verify voice recognition + response
   - End session
   - Verify data cleared (check memory)

2. **Upload Test**
   - Upload financial document
   - Check analysis quality
   - Verify no disk writes (`ls -la /tmp/`)

3. **Text Analysis Test**
   - Paste contract clause
   - Verify analysis
   - Check no data retention

### Privacy Verification

```bash
# Check no files written to disk
ls -la /tmp/ | grep -i gemini
ls -la . | grep -i upload

# Monitor memory usage during session
node --max-old-space-size=512 server.js
# Verify memory returns to baseline after sessions
```

---

## 🚀 Phase 2: Google Cloud Deployment (Upcoming)

### Planned Stack
- **Cloud Run:** Serverless container hosting
- **Cloud Storage:** Temporary staging (with TTL policies)
- **Cloud Logging:** Privacy-safe logging (no PII)
- **Cloud IAM:** Secure API key management

### Architecture Diagram (Planned)
```
User → Cloud Load Balancer → Cloud Run → Gemini API
                                  ↓
                           Cloud Monitoring
                                  ↓
                           Privacy Audit Logs
```

---

## 📝 Development Notes

### Models Used
- Primary: `gemini-2.0-flash-exp` (fast, efficient)
- Alternative: `gemini-2.5-pro` (available if needed)

### Why Native SDK?
- Previous version used OpenAI compatibility layer
- **Now:** Official `@google/generative-ai` SDK
- **Benefits:** 
  - Full Gemini feature support
  - Better performance
  - Native multimodal handling
  - Real-time streaming capabilities

### Browser Compatibility
- **Voice Input:** Chrome, Edge (Web Speech API)
- **Voice Output:** All modern browsers (Speech Synthesis API)
- **WebSocket:** All modern browsers

---

## 🛡️ Privacy Guarantees

### What We DON'T Do
- ❌ Store files on disk
- ❌ Log user data
- ❌ Persist conversation history
- ❌ Use data for training
- ❌ Share data with third parties
- ❌ Keep analytics on sensitive content

### What We DO
- ✅ Process everything in RAM
- ✅ Discard data immediately after response
- ✅ Use HTTPS/WSS in production
- ✅ Clear WebSocket sessions on disconnect
- ✅ Garbage collect all buffers
- ✅ Log only system events (no user data)

---

## 📄 License

MIT License

---

## 👤 Author

**Alex Tolmach** (decentrathai)  
Building privacy-first AI tools for the Gemini Live Agent Challenge

---

## 🔗 Links

- [Gemini AI Studio](https://aistudio.google.com/)
- [Google GenAI SDK](https://github.com/google/generative-ai-js)
- [Gemini Live Agent Challenge](https://googledevai.devpost.com/)
- [Project Repository](https://github.com/your-username/privacyguard-live)

---

## 🐛 Known Issues

- Voice recognition requires Chrome/Edge (Web Speech API limitation)
- Large images (>5MB) may take longer to process
- WebSocket reconnection not yet implemented (refresh to reconnect)

---

## 🎯 Roadmap

- [x] Phase 1: Core functionality with Google GenAI SDK
- [x] Real-time voice conversation
- [x] Zero-retention architecture
- [ ] Phase 2: Google Cloud deployment
- [ ] Architecture diagram
- [ ] Demo video
- [ ] Performance optimization
- [ ] WebSocket reconnection logic
- [ ] Support for more document types (PDF, Word)

---

**Built with ❤️ for the Gemini Live Agent Challenge 2026**
