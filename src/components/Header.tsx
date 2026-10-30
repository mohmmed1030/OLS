import React, { useState, useEffect } from 'react';
import { AtomLogo } from './AtomLogo';
import { ThemeControls } from './ThemeControls';
import { ApiKeyModal } from './ApiKeyModal';
import { sound } from '../utils/sound';
import { 
  FolderTree, 
  Sparkles, 
  BarChart3,
  Clock
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenRoadmap?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (tab: string) => {
    sound.playClick(580);
    onTabChange(tab);
  };

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 transition-colors w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Zone 1: Brand Wordmark with Atom Nucleus Logo & OLS Title + Shifted Preferences Menu */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            <div
              onClick={() => handleNavClick('library')}
              className="flex items-center gap-2.5 cursor-pointer select-none active:scale-98 transition-transform"
              title="OMEGA LEARNING SYSTEM (OLS)"
            >
              <AtomLogo size={36} interactive={true} />
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display font-black text-lg sm:text-xl tracking-tight text-white whitespace-nowrap leading-none">
                    OLS
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium text-slate-300 whitespace-nowrap leading-none">
                    Omega Learning System
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono-code mt-0.5">
                  <span className="text-emerald-400 font-semibold">v1.0</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-slate-500" />
                    <span>{currentTime || 'Syncing...'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Shifted Preferences Menu: Positioned directly adjacent to the OLS logo & brand area */}
            <div className="shrink-0 pl-1 sm:pl-2 border-l border-slate-800/80">
              <ThemeControls onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)} />
            </div>
          </div>

          {/* Zone 2: Desktop Horizontal Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-300">
            <button
              onClick={() => handleNavClick('library')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 cursor-pointer py-1 ${
                activeTab === 'library'
                  ? 'text-white border-b-2 border-indigo-500 pb-0.5 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Library & Decks</span>
            </button>

            <button
              onClick={() => handleNavClick('generator')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 cursor-pointer py-1 ${
                activeTab === 'generator'
                  ? 'text-white border-b-2 border-indigo-500 pb-0.5 font-semibold'
                  : 'text-indigo-300 hover:text-indigo-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Generator</span>
            </button>

            {/* Phase 5 Analytics Tab */}
            <button
              onClick={() => handleNavClick('analytics')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 cursor-pointer py-1 ${
                activeTab === 'analytics'
                  ? 'text-white border-b-2 border-indigo-500 pb-0.5 font-semibold'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Analytics & Scores</span>
            </button>
          </nav>

          {/* Zone 3: Creation Timestamp Indicator */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono-code text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800 shrink-0">
            <span className="text-slate-500">Created:</span>
            <span className="text-slate-300 font-medium">Oct 2026</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 font-bold">Online/Offline</span>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Balanced 3-way responsive navigation) */}
      <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 flex items-center justify-around py-2.5 px-3 shadow-2xl">
        <button
          onClick={() => handleNavClick('library')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
            activeTab === 'library' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Library</span>
        </button>

        <button
          onClick={() => handleNavClick('generator')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
            activeTab === 'generator' ? 'text-amber-400 font-bold' : 'text-indigo-300'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Gen</span>
        </button>

        <button
          onClick={() => handleNavClick('analytics')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
            activeTab === 'analytics' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics</span>
        </button>
      </nav>

      {/* API Key Settings Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </>
  );
};
