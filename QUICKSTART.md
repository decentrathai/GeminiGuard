# VeniceGuard - Quick Start Guide

**Time to launch:** ~10 minutes

---

## Step 1: Get Venice AI API Key (5 min)

### Option A: Use Existing Account
If you already have a Venice AI account:

1. Go to https://venice.ai/
2. Log in
3. Click your profile icon (top right)
4. Select "API" or "Developer Settings"
5. Click "Create API Key"
6. Copy the key (starts with `vn_...` or similar)

### Option B: Create New Account
If you need to create an account:

1. Go to https://venice.ai/
2. Click "Sign Up"
3. Use email: (your email) or continue with Google/GitHub
4. Complete verification
5. Navigate to API settings (profile → API)
6. Generate new API key
7. Copy the key

### Option C: Free Credits
Venice AI offers:
- **Pro subscription:** $10 in free credits (one-time)
- **Pay-as-you-go:** Fund account in USD
- **DIEM tokens:** Stake for daily compute allocation

For testing, free tier should be sufficient.

---

## Step 2: Configure Environment (1 min)

```bash
cd /home/moltbot/clawd/hackathons/open-agents

# Copy example env file
cp .env.example .env

# Edit .env and add your API key
nano .env
# or
vim .env
# or
code .env
```

**Add this to `.env`:**
```env
VENICE_API_KEY=your_venice_api_key_here
PORT=3000
NODE_ENV=development
```

Save and exit.

---

## Step 3: Install Dependencies (if not done)

```bash
npm install
```

Already done? Skip to Step 4.

---

## Step 4: Start Server (30 seconds)

```bash
npm start
```

**Expected output:**
```
╔═══════════════════════════════════════════════════════════╗
║                    VeniceGuard Server                     ║
║          Privacy-Preserving Multimodal AI Agent           ║
╚═══════════════════════════════════════════════════════════╝

🚀 Server running on port 3000
🔐 Privacy mode: ZERO-RETENTION
🎯 Venice AI endpoints active:
   • Vision: qwen3-vl-235b-a22b
   • Chat: zai-org-glm-4.7, venice-uncensored
   • Audio: TTS-1

📊 Endpoints:
   POST /api/analyze (multimodal)
   POST /api/analyze-text (text-only)
   GET  /api/health
   GET  /api/models

🏆 Built for Open Agents Hackathon 2026
👤 Team: decentrathai (Alex Tolmach)
```

---

## Step 5: Test in Browser (2 min)

1. Open browser: http://localhost:3000
2. You should see the VeniceGuard interface
3. Click the upload area or drag-and-drop an image
4. (Optional) Enable "Generate voice response" checkbox
5. Click "Analyze Document"
6. View results (analysis + summary + optional audio)

### Test Images
Use any image, or try these examples:
- Prescription image
- Invoice/receipt
- Screenshot of text
- Photo with objects/people

---

## Step 6: Test API Directly (1 min)

### Health Check
```bash
curl http://localhost:3000/api/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "service": "VeniceGuard",
  "privacy": "zero-retention",
  "capabilities": ["vision", "text", "audio"],
  "timestamp": "2026-02-22T09:00:00.000Z"
}
```

### Multimodal Analysis
```bash
curl -X POST http://localhost:3000/api/analyze \
  -F "file=@/path/to/image.jpg" \
  -F "returnVoice=false" \
  -F "prompt=Describe this image in detail"
```

### Text Analysis
```bash
curl -X POST http://localhost:3000/api/analyze-text \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Patient presents with fever and cough. Temperature: 38.5°C. Prescribed: Amoxicillin 500mg, 3x daily for 7 days.",
    "returnVoice": false
  }'
```

---

## Troubleshooting

### Error: "VENICE_API_KEY not found"
- Check `.env` file exists in project root
- Verify syntax: `VENICE_API_KEY=xxx` (no quotes, no spaces around =)
- Restart server after editing `.env`

### Error: "Invalid API key"
- Verify key is correct (check Venice AI dashboard)
- Ensure key is active (not expired/revoked)
- Try generating a new key

### Error: "File too large"
- Default limit: 10MB
- To increase: Edit `server.js`, find `limits: { fileSize: 10 * 1024 * 1024 }`
- Change to `20 * 1024 * 1024` for 20MB

### Error: "Vision model failed"
- Check Venice AI service status
- Verify image format (jpg, png, webp supported)
- Try smaller image (under 5MB)

### Server won't start
- Check port 3000 isn't in use: `lsof -i :3000`
- Try different port: `PORT=3001 npm start`
- Check Node.js version: `node -v` (need 18+)

### No audio in response
- Ensure "Generate voice response" is checked
- Check browser supports HTML5 audio
- Verify Venice TTS model is available

---

## What to Test

### ✅ Core Functionality
- [ ] Upload image successfully
- [ ] Vision analysis returns results
- [ ] Summary is generated
- [ ] Privacy logging shows "in-memory only"
- [ ] Results display correctly

### ✅ Voice Response
- [ ] Enable voice checkbox
- [ ] Audio player appears in results
- [ ] Audio plays correctly
- [ ] Voice is clear and understandable

### ✅ Privacy Features
- [ ] Check server logs show "PRIVACY: Zero-retention mode"
- [ ] Verify no files saved to disk
- [ ] Confirm no database created
- [ ] Multiple uploads don't accumulate data

### ✅ Error Handling
- [ ] Upload without file shows error
- [ ] Invalid API key shows clear error
- [ ] Network errors handled gracefully

---

## Next: Create Demo Assets

Once testing is successful:

1. **Screenshots** - Capture 5-10 images:
   - Landing page
   - Upload interface
   - Analysis results
   - Voice player
   - Server logs

2. **Demo Video** - Record 3-minute demo:
   - Follow script in DEVPOST_SUBMISSION.md
   - Show live upload and analysis
   - Demonstrate voice response
   - Highlight privacy features

3. **Devpost Submission** - Use content from:
   - DEVPOST_SUBMISSION.md (all form content ready)
   - GitHub: https://github.com/decentrathai/veniceguard
   - Video: (YouTube/Vimeo link)
   - Screenshots: (upload to Devpost)

---

## Quick Commands Reference

```bash
# Start server
npm start

# Start with auto-reload (development)
npm run dev

# Health check
curl http://localhost:3000/api/health

# Get available models
curl http://localhost:3000/api/models

# Analyze image
curl -X POST http://localhost:3000/api/analyze \
  -F "file=@image.jpg" \
  -F "returnVoice=true"

# Analyze text
curl -X POST http://localhost:3000/api/analyze-text \
  -H "Content-Type: application/json" \
  -d '{"text":"Your text here","returnVoice":false}'
```

---

## Support

- **Documentation:** See SETUP.md for detailed guides
- **Devpost Guide:** See DEVPOST_SUBMISSION.md
- **Venice AI Docs:** https://docs.venice.ai/
- **GitHub:** https://github.com/decentrathai/veniceguard

---

**You're ready to go!** 🚀

Get your Venice API key, test the app, create demo assets, and submit to Devpost.

Deadline: February 25, 2026
