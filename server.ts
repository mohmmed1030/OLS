import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json({ limit: '30mb' }));

  // Endpoint: Generate Flashcards with Google Gemini API
  app.post('/api/generate-cards', async (req, res) => {
    try {
      const { apiKey, textContent, pdfBase64, cardCount, questionType = 'standard' } = req.body;
      const keyToUse = apiKey?.trim() || process.env.GEMINI_API_KEY;

      if (!keyToUse) {
        return res.status(400).json({
          error: 'Missing Gemini API Key. Please provide an API key in Settings or configure GEMINI_API_KEY in environment variables.',
        });
      }

      // Input bounds and security validation
      if (textContent && typeof textContent === 'string' && textContent.length > 150000) {
        return res.status(400).json({
          error: 'Text input exceeds maximum allowed length of 150,000 characters.',
        });
      }

      if (pdfBase64 && (typeof pdfBase64 !== 'string' || pdfBase64.length > 35 * 1024 * 1024)) {
        return res.status(400).json({
          error: 'PDF document payload is too large or invalid.',
        });
      }

      const count = Math.min(100, Math.max(1, parseInt(cardCount, 10) || 10));

      const ai = new GoogleGenAI({
        apiKey: keyToUse,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const parts: any[] = [];

      if (pdfBase64) {
        parts.push({
          inlineData: {
            mimeType: 'application/pdf',
            data: pdfBase64,
          },
        });
      }

      // Single concise prompt sent in one consolidated API request to conserve daily quota
      const promptInstruction = questionType === 'multiple_choice'
        ? `Generate exactly ${count} multiple-choice questions with answers based on the provided material in a single consolidated response.
For each question:
1. "front": Clear question or case prompt.
2. "options": Array of exactly 4 choices (["A) ...", "B) ...", "C) ...", "D) ..."]).
3. "correctAnswerIndex": Integer (0, 1, 2, or 3) indicating the correct choice.
4. "back": The correct choice followed by an explanatory rationale.
5. "questionType": "multiple_choice"
6. "tags": Array of 2-3 topic tags.`
        : `Generate exactly ${count} flashcards based on the provided document/notes in a single consolidated response.
For each card:
1. "front": Clear question, concept prompt, or term.
2. "back": Concise, accurate explanation or breakdown.
3. "questionType": "standard"
4. "tags": Array of 2-3 topic tags.`;

      if (textContent && typeof textContent === 'string' && textContent.trim()) {
        parts.push({
          text: `Source Material:\n\n${textContent.trim()}\n\n${promptInstruction}`,
        });
      } else {
        parts.push({ text: promptInstruction });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            description: 'Array of generated flashcards',
            items: {
              type: Type.OBJECT,
              properties: {
                front: {
                  type: Type.STRING,
                  description: 'The front question or concept of the card',
                },
                back: {
                  type: Type.STRING,
                  description: 'The back answer or explanation of the card',
                },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '4 multiple choice options',
                },
                correctAnswerIndex: {
                  type: Type.INTEGER,
                  description: 'Index 0-3 of the correct option',
                },
                questionType: {
                  type: Type.STRING,
                  description: 'standard or multiple_choice',
                },
                tags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Relevant topic tags',
                },
              },
            },
          },
        },
      });

      const rawJson = response.text || '[]';
      const cards = JSON.parse(rawJson);

      return res.json({
        success: true,
        count: cards.length,
        cards,
      });
    } catch (error: any) {
      console.error('Server Gemini Generation Error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to generate flashcards from Gemini API',
      });
    }
  });

  // Mount Vite development middlewares in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OMEGA Server listening on port ${PORT}`);
  });
}

startServer();
