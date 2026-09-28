import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '5mb' }));

  // Initialize Gemini SDK with User-Agent header per skill
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Distinct roles and specialized culinary system instructions
  const ROLE_INSTRUCTIONS: Record<string, string> = {
    culinary_advisor: `You are Chef Kwame, the master culinary advisor for Recipe Finder.
You possess world-class culinary knowledge with deep appreciation for global cuisines, Ghanaian and African gastronomy, flavor chemistry, cooking techniques, and step-by-step dish execution.
Always offer enthusiastic, helpful, and organized advice. Suggest ingredient pairings, plating tips, and troubleshooting when recipes don't go as planned.`,

    quick_chef: `You are Sous-Chef Express, a lightning-fast kitchen assistant for Recipe Finder.
Your role is to provide quick, concise, accurate solutions:
- Immediate ingredient substitutions (e.g. buttermilk swaps, egg replacements, starch alternatives)
- Fast unit and metric conversions (cups to grams, tbsp to ml, Fahrenheit to Celsius)
- Cooking times, oven temperatures, and instant pan fixes.
Keep responses brief, highly readable, and bulleted.`,

    meal_planner: `You are Master Gastronomist & Nutrition Planner for Recipe Finder.
You specialize in:
- Multi-course dinner planning and weekly family meal prep schedules
- Nutrition, macros, and dietary restrictions (vegan, keto, diabetic-friendly, allergen-safe, gluten-free)
- Consolidated grocery shopping lists and batch-cooking efficiency.
Deliver well-structured, comprehensive meal plans with actionable schedules.`,
  };

  // Multi-turn Gemini chat endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const {
        messages = [],
        message = '',
        role = 'culinary_advisor',
        taskType = 'general',
      } = req.body;

      if (!message && (!Array.isArray(messages) || messages.length === 0)) {
        return res.status(400).json({ error: 'Message text is required.' });
      }

      // Enforce model selection per requirements:
      // - gemini-3.1-pro-preview for particularly complex tasks
      // - gemini-3.5-flash for general tasks
      // - gemini-3.1-flash-lite for tasks that should happen fast
      let selectedModel = 'gemini-3.5-flash';
      if (taskType === 'fast' || role === 'quick_chef') {
        selectedModel = 'gemini-3.1-flash-lite';
      } else if (taskType === 'complex' || role === 'meal_planner') {
        selectedModel = 'gemini-3.1-pro-preview';
      } else {
        selectedModel = 'gemini-3.5-flash';
      }

      const systemInstruction = ROLE_INSTRUCTIONS[role] || ROLE_INSTRUCTIONS.culinary_advisor;

      // Construct conversation history
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(messages)) {
        for (const msg of messages) {
          if (msg && (msg.role === 'user' || msg.role === 'model')) {
            const textContent = msg.text || msg.content || '';
            if (textContent.trim()) {
              contents.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: textContent }],
              });
            }
          }
        }
      }

      if (message && message.trim()) {
        contents.push({
          role: 'user',
          parts: [{ text: message.trim() }],
        });
      }

      if (contents.length === 0) {
        return res.status(400).json({ error: 'No valid message content provided.' });
      }

      let responseText = '';
      let usedModel = selectedModel;

      try {
        const response = await ai.models.generateContent({
          model: selectedModel,
          contents,
          config: {
            systemInstruction,
          },
        });
        responseText = response.text || 'No response generated.';
      } catch (primaryErr: any) {
        const errMsg = primaryErr?.message || String(primaryErr);
        // If primary model experiences high demand (503) or rate limit, fall back to high-throughput flash-lite
        if (
          selectedModel !== 'gemini-3.1-flash-lite' &&
          (errMsg.includes('503') ||
            errMsg.includes('UNAVAILABLE') ||
            errMsg.includes('high demand') ||
            errMsg.includes('RESOURCE_EXHAUSTED'))
        ) {
          console.warn(`Model ${selectedModel} experienced temporary spike, falling back to gemini-3.1-flash-lite`);
          usedModel = 'gemini-3.1-flash-lite';
          const fallbackResponse = await ai.models.generateContent({
            model: usedModel,
            contents,
            config: {
              systemInstruction,
            },
          });
          responseText = fallbackResponse.text || 'No response generated.';
        } else {
          throw primaryErr;
        }
      }

      return res.json({
        text: responseText,
        model: usedModel,
        role,
      });
    } catch (err: any) {
      console.error('Gemini chat error:', err);
      const errorMessage = err?.message || 'Failed to generate culinary response.';
      return res.status(500).json({ error: errorMessage });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });

  // Development: Mount Vite SPA middleware
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Culinary server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
