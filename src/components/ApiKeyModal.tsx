import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Check, X, Shield, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/sound';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('omega_gemini_api_key') || '';
      setApiKey(saved);
      setIsSaved(Boolean(saved));
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    sound.playClick(650);
    const trimmed = apiKey.trim();
    if (trimmed) {
      localStorage.setItem('omega_gemini_api_key', trimmed);
      setIsSaved(true);
      if (onKeySaved) onKeySaved();
      onClose();
    } else {
      localStorage.removeItem('omega_gemini_api_key');
      setIsSaved(false);
    }
  };

  const handleClear = () => {
    sound.playDelete();
    localStorage.removeItem('omega_gemini_api_key');
    setApiKey('');
    setIsSaved(false);
    setTestResult(null);
  };

  const handleTestKey = async () => {
    const key = apiKey.trim();
    if (!key) {
      setTestResult({ success: false, message: 'Please enter an API key first.' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Respond with "OK"' }] }],
          }),
        }
      );

      if (res.ok) {
        sound.playRestore();
        setTestResult({ success: true, message: 'API Key verified successfully! Connection established.' });
        localStorage.setItem('omega_gemini_api_key', key);
        setIsSaved(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setTestResult({
          success: false,
          message: data?.error?.message || 'Invalid API Key. Please verify your key from Google AI Studio.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Network test failed. Check your connection or API key.',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-base text-white">
                Google Gemini API Settings
              </h3>
              <p className="text-xs text-slate-400">
                Encrypted locally in browser storage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-200 block">
            Gemini API Key
          </label>
          <div className="relative">
            <input
              type={isVisible ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Your key is stored securely on your local device and never shared.</span>
          </p>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
              testResult.success
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <span className="leading-relaxed">{testResult.message}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium hover:underline"
          >
            <span>Get a free Gemini API Key</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-2">
            {apiKey && (
              <button
                type="button"
                onClick={handleTestKey}
                disabled={testing}
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors active:scale-95 disabled:opacity-50"
              >
                {testing ? 'Verifying...' : 'Test Key'}
              </button>
            )}

            {isSaved && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
              >
                Remove
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold shadow-md shadow-indigo-600/30 transition-all"
            >
              Save API Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
