/**
 * Gemini AI Generation Service for OMEGA LEARNING SYSTEM
 * Robust text and PDF parsing to generate high-yield flashcard decks.
 */

export interface GeneratedCard {
  front: string;
  back: string;
  options?: string[]; // 4 choices e.g. ["A) ...", "B) ...", "C) ...", "D) ..."]
  correctAnswerIndex?: number; // 0, 1, 2, or 3
  questionType?: 'standard' | 'multiple_choice';
  tags: string[];
}

export interface GenerationParams {
  apiKey?: string;
  textContent?: string;
  pdfBase64?: string; // base64 encoded PDF
  cardCount: number; // 1 to 100
  questionType?: 'standard' | 'multiple_choice';
}

export interface ValidationResult {
  valid: boolean;
  errorMessage?: string;
}

/**
 * Validates uploaded file format strictly.
 * Allows only valid PDF or text documents (.pdf, .txt, .md, .text).
 */
export function validateUploadedFile(file: File): ValidationResult {
  const validExtensions = ['.pdf', '.txt', '.md', '.text'];
  const validMimeTypes = [
    'application/pdf',
    'text/plain',
    'text/markdown',
    'text/x-markdown',
  ];

  const name = file.name.toLowerCase();
  const hasValidExt = validExtensions.some((ext) => name.endsWith(ext));
  const hasValidMime = validMimeTypes.includes(file.type) || file.type.startsWith('text/');

  if (!hasValidExt && !hasValidMime) {
    return {
      valid: false,
      errorMessage:
        'Invalid file format. Please upload a valid PDF or text document to generate flashcards.',
    };
  }

  // Max 25MB file size limit for stability
  if (file.size > 25 * 1024 * 1024) {
    return {
      valid: false,
      errorMessage: 'File size exceeds 25MB limit. Please upload a smaller document.',
    };
  }

  return { valid: true };
}

/**
 * Generates flashcards using Google Gemini API.
 */
export async function generateFlashcards(
  params: GenerationParams
): Promise<GeneratedCard[]> {
  const { apiKey, textContent, pdfBase64, cardCount, questionType = 'standard' } = params;

  // Retrieve key from parameter, local storage, or environment fallback
  const effectiveKey =
    apiKey?.trim() ||
    (typeof window !== 'undefined' ? localStorage.getItem('omega_gemini_api_key') : '') ||
    '';

  const count = Math.min(100, Math.max(1, cardCount || 10));

  // Try server endpoint first
  try {
    const res = await fetch('/api/generate-cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: effectiveKey,
        textContent,
        pdfBase64,
        cardCount: count,
        questionType,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.cards) && data.cards.length > 0) {
        return data.cards;
      }
    }
  } catch {
    // If backend endpoint is offline, fallback to direct Gemini API call below
  }

  // Direct client fallback to Google Gemini API
  if (!effectiveKey) {
    throw new Error(
      'Google Gemini API Key is required. Please add your API key in Settings to generate flashcards.'
    );
  }

  const promptText = questionType === 'multiple_choice'
    ? `Generate exactly ${count} multiple-choice questions with answers based on the provided material in a single consolidated response.
For each question:
1. "front": Clear question or case prompt.
2. "options": Array of exactly 4 choices (["A) ...", "B) ...", "C) ...", "D) ..."]).
3. "correctAnswerIndex": Integer (0, 1, 2, or 3) indicating the correct choice.
4. "back": The correct choice followed by an educational explanation.
5. "questionType": "multiple_choice"
6. "tags": Array of 2-3 topic tags.

Output strictly valid JSON array of objects with structure:
[
  {
    "front": "What is the primary role of...",
    "options": ["A) Choice One", "B) Choice Two", "C) Choice Three", "D) Choice Four"],
    "correctAnswerIndex": 1,
    "back": "B) Choice Two. Explanation of the concept...",
    "questionType": "multiple_choice",
    "tags": ["Topic", "Subject"]
  }
]`
    : `Generate exactly ${count} flashcards based on the provided material in a single consolidated response.
For each card:
1. "front": Clear question, concept prompt, or term.
2. "back": Crisp, accurate answer and explanation.
3. "questionType": "standard"
4. "tags": Array of 2-3 topic tags.

Output strictly valid JSON array of objects with the structure:
[
  {
    "front": "Question / Prompt",
    "back": "Answer / Explanation",
    "questionType": "standard",
    "tags": ["Topic", "Subject"]
  }
]`;

  const contents: any[] = [];
  const parts: any[] = [];

  if (pdfBase64) {
    parts.push({
      inlineData: {
        mimeType: 'application/pdf',
        data: pdfBase64,
      },
    });
  }

  if (textContent?.trim()) {
    parts.push({
      text: `Source Content to extract cards from:\n\n${textContent.trim()}\n\n${promptText}`,
    });
  } else {
    parts.push({
      text: promptText,
    });
  }

  contents.push({ parts });

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${effectiveKey}`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents,
      generationConfig: {
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData?.error?.message ||
      `Gemini API error (Status ${response.status}). Please check your API key and quotas.`;
    throw new Error(message);
  }

  const result = await response.json();
  const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('No flashcards were generated by the AI model. Please try again with more detailed content.');
  }

  try {
    const parsed = JSON.parse(rawText);
    const cardArray = Array.isArray(parsed) ? parsed : parsed.cards || [];
    return cardArray.map((c: any) => ({
      front: String(c.front || c.question || 'Concept Prompt').trim(),
      back: String(c.back || c.answer || 'Explanation').trim(),
      options: Array.isArray(c.options) && c.options.length > 0 ? c.options.map(String) : undefined,
      correctAnswerIndex: typeof c.correctAnswerIndex === 'number' ? c.correctAnswerIndex : undefined,
      questionType: c.questionType || (Array.isArray(c.options) && c.options.length > 0 ? 'multiple_choice' : 'standard'),
      tags: Array.isArray(c.tags) ? c.tags.map(String) : ['AI-Generated'],
    }));
  } catch {
    throw new Error('Failed to parse generated flashcards. Please try again.');
  }
}
