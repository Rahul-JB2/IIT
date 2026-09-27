import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize GoogleGenAI SDK per skill guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API endpoint to generate 10 JEE practice questions for chapter milestone
app.post('/api/quiz/generate', async (req, res) => {
  const { subject, chapterName, milestoneKey } = req.body;

  const milestoneDescriptions: Record<string, string> = {
    theory: 'Fundamental theory, core derivations, and direct conceptual comprehension',
    conclusion1Page: 'High-yield formula application, common traps, and reaction shortcuts',
    mathongo: 'Fast-paced JEE Main level concept builders and speed-accuracy drill',
    moduleEx2: 'Challenging coaching module exercise-2 problems (JEE Main to Advanced level)',
    eklavya: 'High-difficulty multi-concept JEE Advanced problems requiring deep reasoning',
    prevPartTest: 'Past test series questions and speed-under-pressure revision',
  };

  const focusDesc = milestoneDescriptions[milestoneKey] || 'Comprehensive JEE Practice';

  const prompt = `You are a premier BSEB Super-50 JEE Master Faculty for ${subject}.
Generate exactly 10 distinct, high-yield Multiple Choice Questions (MCQs) for the chapter: "${chapterName}".
Active milestone target: ${milestoneKey} (${focusDesc}).

Requirements:
1. Difficulty calibrated to JEE Main & Advanced standards for this chapter.
2. Each question must have 4 clear, plausible options (A, B, C, D).
3. Provide the single correct option ('A', 'B', 'C', or 'D').
4. Provide a step-by-step explanatory solution including key formulas and mistake traps.
5. Return ONLY a valid JSON object matching the exact structure below, without markdown formatting or code blocks:

{
  "questions": [
    {
      "id": 1,
      "question": "Question text...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctAnswer": "A",
      "explanation": "Detailed step-by-step solution...",
      "difficulty": "Easy" | "Medium" | "Hard",
      "milestoneFocus": "${chapterName} • ${milestoneKey}"
    }
  ]
}`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({ questions: [] });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const responseText = response.text || '';
    // Strip markdown code fences if present
    const cleaned = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
      return res.json({ questions: parsed.questions });
    } else {
      return res.status(200).json({ questions: [] });
    }
  } catch (err) {
    console.warn('Gemini quiz generation encountered error, delegating to client fallback:', err);
    return res.status(200).json({ questions: [] });
  }
});

// Full-stack Vite mounting
async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JEE Super-50 full-stack server running on port ${PORT}`);
  });
}

startServer();
