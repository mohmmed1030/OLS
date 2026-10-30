import React, { useState, useRef } from 'react';
import { useDecks } from '../context/DeckContext';
import { generateFlashcards, validateUploadedFile, GeneratedCard } from '../services/geminiService';
import { ApiKeyModal } from './ApiKeyModal';
import { sound } from '../utils/sound';
import { 
  Sparkles, 
  Upload, 
  FileText, 
  Layers, 
  Sliders, 
  AlertCircle, 
  CheckCircle2, 
  Key, 
  Plus, 
  RotateCw, 
  BookOpen, 
  FolderPlus,
  Trash2,
  FileCheck,
  Check
} from 'lucide-react';

export const AiGeneratorView: React.FC = () => {
  const { decks, folders, createDeck, addCard } = useDecks();

  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [textContent, setTextContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);

  const [cardCount, setCardCount] = useState<number>(10);
  const [questionType, setQuestionType] = useState<'standard' | 'multiple_choice'>('standard');
  const [targetDeckOption, setTargetDeckOption] = useState<'new' | string>('new');
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [targetFolderId, setTargetFolderId] = useState<string>('root');

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([]);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const hasApiKey =
    typeof window !== 'undefined' && Boolean(localStorage.getItem('omega_gemini_api_key'));

  // Handle file selection with strict validation
  const handleFileChange = (file: File) => {
    setErrorMessage(null);
    setSavedSuccess(false);

    const validation = validateUploadedFile(file);
    if (!validation.valid) {
      sound.playDelete();
      setErrorMessage(
        validation.errorMessage ||
          'Invalid file format. Please upload a valid PDF or text document to generate flashcards.'
      );
      setUploadedFile(null);
      setPdfBase64(null);
      return;
    }

    sound.playClick(600);
    setUploadedFile(file);

    // If PDF, convert to base64 for multimodal Gemini parsing
    if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = () => {
        const resultStr = reader.result as string;
        // Strip data:application/pdf;base64, header
        const base64 = resultStr.split(',')[1] || resultStr;
        setPdfBase64(base64);
      };
      reader.readAsDataURL(file);
    } else {
      // Plain text file
      const textReader = new FileReader();
      textReader.onload = () => {
        setTextContent(textReader.result as string);
        setPdfBase64(null);
      };
      textReader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleGenerate = async () => {
    setErrorMessage(null);
    setSavedSuccess(false);

    // Validate input existence
    if (inputMode === 'text' && !textContent.trim()) {
      sound.playDelete();
      setErrorMessage('Please enter or paste study text notes to generate flashcards.');
      return;
    }

    if (inputMode === 'file' && !uploadedFile && !textContent.trim() && !pdfBase64) {
      sound.playDelete();
      setErrorMessage(
        'Invalid file format. Please upload a valid PDF or text document to generate flashcards.'
      );
      return;
    }

    sound.playClick(720);
    setIsGenerating(true);

    try {
      const cards = await generateFlashcards({
        textContent: textContent.trim(),
        pdfBase64: pdfBase64 || undefined,
        cardCount,
        questionType,
      });

      sound.playRestore();
      setGeneratedCards(cards);

      // Auto-populate new deck title if blank
      if (!newDeckTitle.trim()) {
        const typeSuffix = questionType === 'multiple_choice' ? 'MCQ Test' : 'Flashcards';
        if (uploadedFile) {
          const cleanName = uploadedFile.name.replace(/\.[^/.]+$/, '');
          setNewDeckTitle(`${cleanName} (${typeSuffix})`);
        } else {
          setNewDeckTitle(`AI ${typeSuffix} (${new Date().toLocaleDateString()})`);
        }
      }
    } catch (err: any) {
      sound.playDelete();
      setErrorMessage(err.message || 'AI Generation failed. Please check your document and API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToDeck = () => {
    if (generatedCards.length === 0) return;
    sound.playClick(800);

    let deckId = targetDeckOption;

    if (targetDeckOption === 'new') {
      const title = newDeckTitle.trim() || 'AI Generated Deck';
      const folder = targetFolderId === 'root' ? null : targetFolderId;
      const created = createDeck(title, `Batch generated ${generatedCards.length} ${questionType === 'multiple_choice' ? 'multiple-choice' : 'flash'}cards using Gemini AI.`, folder, '#6366f1', 'ai');
      deckId = created.id;
    }

    // Add all cards into destination deck with options and questionType
    generatedCards.forEach((c) => {
      addCard(
        deckId, 
        c.front, 
        c.back, 
        c.tags, 
        c.options, 
        c.correctAnswerIndex, 
        c.questionType || questionType
      );
    });

    sound.playRestore();
    setSavedSuccess(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Knowledge Synthesizer</span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            Powered by Google Gemini.
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Autonomous multi-choice question & flashcard generation engine in a single consolidated request.
          </p>
        </div>

        {/* API Key Status / Configuration Trigger */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              sound.playClick(600);
              setIsApiKeyModalOpen(true);
            }}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${
              hasApiKey
                ? 'bg-slate-800 border-emerald-500/50 text-emerald-300 hover:bg-slate-700'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>{hasApiKey ? 'Gemini API Key: Configured' : 'Configure Gemini API Key'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Responsive Horizontal on Desktop, Vertical on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Input Controls & Settings) - 7 cols on Desktop */}
        <div className="lg:col-span-7 space-y-5">
          {/* Input Format Selector Tabs */}
          <div className="p-1 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => {
                sound.playClick(500);
                setInputMode('text');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 ${
                inputMode === 'text'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Paste Notes / Raw Text</span>
            </button>
            <button
              onClick={() => {
                sound.playClick(500);
                setInputMode('file');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 ${
                inputMode === 'file'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload PDF / Text Document</span>
            </button>
          </div>

          {/* Error Message Alert (Friendly, formatted as requested) */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/50 text-xs text-rose-200 flex items-start gap-3 animate-in fade-in duration-200 shadow-md">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-rose-100">Document Processing Error:</span>
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Mode 1: Raw Text Input */}
          {inputMode === 'text' && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Source Text & Knowledge Notes
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Paste book chapters, research papers, lecture notes, or markdown content here..."
                rows={9}
                className="w-full p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500/80 transition-colors font-sans leading-relaxed"
              />
              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>Supports natural language, formulas, code, and definitions.</span>
                <span className="font-mono-code">{textContent.length} characters</span>
              </div>
            </div>
          )}

          {/* Mode 2: PDF & File Upload with Dropzone */}
          {inputMode === 'file' && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                PDF or Text File Input
              </label>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="p-8 rounded-2xl bg-slate-900/40 border-2 border-dashed border-slate-700/80 hover:border-indigo-500 transition-colors text-center cursor-pointer space-y-3 group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  accept=".pdf,.txt,.md,.text"
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>

                <div>
                  <div className="text-sm font-semibold text-slate-200">
                    {uploadedFile ? uploadedFile.name : 'Click to upload or drag & drop document'}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Accepts valid PDF documents (.pdf) and text files (.txt, .md) up to 25MB
                  </p>
                </div>

                {uploadedFile && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono-code">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB · Ready for AI analysis
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Question Type Format Selector */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>Question Format Type</span>
              </span>
              <span className="text-[11px] font-mono-code px-2 py-0.5 rounded-full bg-indigo-950/70 text-indigo-300 border border-indigo-500/30">
                {questionType === 'multiple_choice' ? '4 Choices + Explanation' : 'Standard Q & A'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick(500);
                  setQuestionType('standard');
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-left flex flex-col gap-0.5 active:scale-98 ${
                  questionType === 'standard'
                    ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-xs'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span className="font-bold flex items-center gap-1.5 text-white">
                  📝 Standard Flashcards
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  High-yield conceptual prompt & explanatory answer
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick(500);
                  setQuestionType('multiple_choice');
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-left flex flex-col gap-0.5 active:scale-98 ${
                  questionType === 'multiple_choice'
                    ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-xs'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span className="font-bold flex items-center gap-1.5 text-white">
                  🔘 Multiple-Choice
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  4 distinct choices (A, B, C, D) + correct key
                </span>
              </button>
            </div>
          </div>

          {/* Card Count Selector (Up to 100 maximum, as requested) */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-white">
                  Card Batch Quantity (Max 100)
                </span>
              </div>
              <span className="font-mono-code font-bold text-sm text-indigo-400">
                {cardCount} Cards
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={100}
              value={cardCount}
              onChange={(e) => setCardCount(parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />

            {/* Quick Count Presets */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-slate-400">Presets:</span>
              {[5, 10, 20, 50, 100].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    sound.playClick(500);
                    setCardCount(num);
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono-code transition-colors ${
                    cardCount === num
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-600/30 disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>
                  Analyzing Document & Synthesizing {cardCount} {questionType === 'multiple_choice' ? 'Multiple-Choice Items' : 'Flashcards'}...
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  Generate {cardCount} {questionType === 'multiple_choice' ? 'Multiple-Choice Questions' : 'High-Yield Flashcards'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Right Column (Results Preview & Destination Deck Selection) - 5 cols on Desktop */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h3 className="font-semibold text-sm text-white">
                  Target Destination Deck
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-mono-code">
                {generatedCards.length} generated
              </span>
            </div>

            {/* Destination Selector */}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-medium">
                  Save Generated Cards Into:
                </label>
                <select
                  value={targetDeckOption}
                  onChange={(e) => setTargetDeckOption(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="new">✨ Create Brand New Deck</option>
                  {decks.map((d) => (
                    <option key={d.id} value={d.id}>
                      📚 {d.name} ({d.cards.length} cards)
                    </option>
                  ))}
                </select>
              </div>

              {targetDeckOption === 'new' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1 font-medium">New Deck Name</label>
                    <input
                      type="text"
                      value={newDeckTitle}
                      onChange={(e) => setNewDeckTitle(e.target.value)}
                      placeholder="e.g. Molecular Biology Core Concepts"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1 font-medium">Target Folder Location</label>
                    <select
                      value={targetFolderId}
                      onChange={(e) => setTargetFolderId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-indigo-500"
                    >
                      <option value="root">Root Library (Top Level)</option>
                      {folders.map((f) => (
                        <option key={f.id} value={f.id}>
                          📁 {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            {generatedCards.length > 0 && (
              <button
                onClick={handleSaveToDeck}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25"
              >
                <Check className="w-4 h-4" />
                <span>Save {generatedCards.length} Cards to Deck</span>
              </button>
            )}

            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Successfully saved to your library! Ready to study.</span>
              </div>
            )}
          </div>

          {/* Generated Cards Preview Stream */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Card Previews ({generatedCards.length})</span>
              {generatedCards.length > 0 && (
                <button
                  onClick={() => setGeneratedCards([])}
                  className="text-rose-400 hover:text-rose-300 lowercase text-[11px]"
                >
                  Clear previews
                </button>
              )}
            </div>

            {generatedCards.length === 0 ? (
              <div className="p-10 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-500 space-y-2">
                <BookOpen className="w-8 h-8 mx-auto text-slate-600" />
                <div>No cards generated yet.</div>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Provide notes or a PDF file on the left and click Generate to see interactive cards appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {generatedCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] text-indigo-400 font-mono-code">
                      <div className="flex items-center gap-1.5">
                        <span>Card #{idx + 1}</span>
                        {card.options && card.options.length > 0 && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30 text-[10px]">
                            MCQ
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {card.tags.map((t, i) => (
                          <span key={i} className="text-slate-500">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="font-semibold text-white leading-relaxed">
                      {card.front}
                    </div>

                    {card.options && card.options.length > 0 && (
                      <div className="grid grid-cols-1 gap-1.5 pt-1">
                        {card.options.map((opt, optIdx) => {
                          const isCorrect = card.correctAnswerIndex === optIdx;
                          return (
                            <div
                              key={optIdx}
                              className={`px-2.5 py-1.5 rounded-lg border text-[11px] flex items-center justify-between transition-colors ${
                                isCorrect
                                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200 font-semibold'
                                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                              }`}
                            >
                              <span>{opt}</span>
                              {isCorrect && (
                                <span className="text-[10px] uppercase font-bold text-emerald-400 shrink-0 ml-1">
                                  ✓ Correct Key
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="text-slate-300 pt-1.5 border-t border-slate-800/80 leading-relaxed text-[11px]">
                      <span className="font-semibold text-indigo-400">Explanation: </span>
                      {card.back}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </div>
  );
};
