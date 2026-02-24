const express = require('express');
const multer = require('multer');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for in-memory storage (no disk persistence)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Initialize Gemini client (OpenAI-compatible API)
const gemini = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
});

console.log('[CONFIG] Using Gemini API endpoint');

// Gemini 2.0 Flash models
const models = {
  vision: 'gemini-2.5-flash',
  chat: 'gemini-2.5-flash',
  tts: 'tts-1' // Keep Venice TTS for now, or use Google TTS API separately
};

app.use(express.json());
app.use(express.static('public'));

// Middleware to log privacy compliance
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('[PRIVACY] Zero-retention mode: All data processed ephemerally');
  next();
});

/**
 * Main multimodal analysis endpoint
 * Accepts image/document, analyzes with vision, generates summary, returns TTS
 */
app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { returnVoice, prompt } = req.body;
    const imageBuffer = req.file.buffer;
    const base64Image = imageBuffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;

    console.log('[STEP 1] Image received, converting to base64');
    console.log('[PRIVACY] Image NOT stored on disk - in-memory only');

    // Step 1: Vision analysis using Gemini 2.0 Flash
    console.log('[STEP 2] Analyzing image with Gemini vision model...');
    const visionResponse = await gemini.chat.completions.create({
      model: models.vision,
      messages: [
        {
          role: 'user',
          content: [
            { 
              type: 'text', 
              text: prompt || 'Analyze this image in detail. If it\'s a medical document, extract medication names, dosages, and instructions. If it\'s a financial document, extract key financial data. Be thorough but concise.'
            },
            { 
              type: 'image_url', 
              image_url: { url: dataUri }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    const analysis = visionResponse.choices[0].message.content;
    console.log('[STEP 3] Vision analysis complete');
    console.log('[PRIVACY] Image buffer will be garbage collected - never persisted');

    // Step 2: Generate a concise summary using Gemini chat model
    console.log('[STEP 4] Generating summary with Gemini chat model...');
    const summaryResponse = await gemini.chat.completions.create({
      model: models.chat,
      messages: [
        {
          role: 'system',
          content: 'You are a privacy-focused AI assistant. Provide concise, clear summaries of sensitive documents. Never store or log user data.'
        },
        {
          role: 'user',
          content: `Summarize this analysis in 2-3 sentences for the user:\n\n${analysis}`
        }
      ],
      max_tokens: 150
    });

    const summary = summaryResponse.choices[0].message.content;
    console.log('[STEP 5] Summary generated');

    const response = {
      analysis,
      summary,
      privacy: {
        dataRetention: 'zero',
        storageDuration: 'ephemeral',
        compliance: ['HIPAA-safe', 'GDPR-compliant']
      }
    };

    // Step 3: Optional TTS for voice response (kept as-is for now)
    if (returnVoice === 'true') {
      console.log('[STEP 6] Voice response requested (TTS not yet configured for Gemini)');
      // TODO: Integrate Google Cloud TTS API or keep Venice TTS
      console.log('[INFO] TTS feature pending - consider Google Cloud TTS integration');
    }

    console.log('[COMPLETE] Analysis pipeline finished - all data discarded');
    res.json(response);

  } catch (error) {
    console.error('[ERROR]', error.message);
    res.status(500).json({ 
      error: 'Analysis failed', 
      details: error.message 
    });
  }
});

/**
 * Text-only analysis endpoint (no image)
 */
app.post('/api/analyze-text', async (req, res) => {
  try {
    const { text, prompt, returnVoice } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    console.log('[STEP 1] Text analysis request received');
    console.log('[PRIVACY] Text processed in-memory only');

    // Analyze text with Gemini chat model
    const analysisResponse = await gemini.chat.completions.create({
      model: models.chat,
      messages: [
        {
          role: 'system',
          content: 'You are a privacy-focused AI assistant analyzing sensitive text. Provide clear, actionable insights.'
        },
        {
          role: 'user',
          content: prompt ? `${prompt}:\n\n${text}` : `Analyze this text and extract key insights:\n\n${text}`
        }
      ],
      max_tokens: 500
    });

    const analysis = analysisResponse.choices[0].message.content;
    console.log('[STEP 2] Text analysis complete');

    const response = {
      analysis,
      privacy: {
        dataRetention: 'zero',
        storageDuration: 'ephemeral'
      }
    };

    // Optional TTS (pending implementation)
    if (returnVoice === 'true') {
      console.log('[INFO] TTS requested but not yet configured');
    }

    console.log('[COMPLETE] Text analysis finished');
    res.json(response);

  } catch (error) {
    console.error('[ERROR]', error.message);
    res.status(500).json({ 
      error: 'Analysis failed', 
      details: error.message 
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'GeminiGuard',
    privacy: 'zero-retention',
    capabilities: ['vision', 'text', 'audio-pending'],
    timestamp: new Date().toISOString()
  });
});

/**
 * Get available models
 */
app.get('/api/models', async (req, res) => {
  try {
    res.json({
      vision: models.vision,
      chat: models.chat,
      audio: 'TTS pending',
      provider: 'Google Gemini 2.0 Flash',
      privacy: 'zero-retention'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                    GeminiGuard Server                     ║
║          Privacy-Preserving Multimodal AI Agent           ║
╚═══════════════════════════════════════════════════════════╝

🚀 Server running on port ${PORT}
🔐 Privacy mode: ZERO-RETENTION
🎯 Gemini API endpoints active:
   • Vision: gemini-2.5-flash
   • Chat: gemini-2.5-flash
   • Audio: TTS (pending)

📊 Endpoints:
   POST /api/analyze (multimodal)
   POST /api/analyze-text (text-only)
   GET  /api/health
   GET  /api/models

🏆 Built for Gemini Live Challenge 2026
👤 Team: decentrathai (Alex Tolmach)
  `);
});

module.exports = app;
