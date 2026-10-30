/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { DeckProvider } from './context/DeckContext';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Header } from './components/Header';
import { DeckManagerView } from './components/DeckManagerView';
import { AiGeneratorView } from './components/AiGeneratorView';
import { AnalyticsDashboardView } from './components/AnalyticsDashboardView';
import { UndoToastBanner } from './components/UndoToastBanner';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'library' | 'generator' | 'analytics'>('library');
  const { mode } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 relative w-full max-w-full overflow-x-hidden ${
        mode === 'dark' ? 'text-slate-100' : 'text-slate-800'
      }`}
      style={{
        backgroundColor: 'var(--bg-canvas, #090d16)',
      }}
    >
      {/* Dynamic Animated Canvas (Bubbles, Stars, Waves) with instant OFF toggle */}
      <AnimatedBackground />

      {/* Top Bar with Brand, Generation Badge, and Consolidated Sub-Menu */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as any)}
      />

      {/* Main Responsive Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 relative z-10 overflow-x-hidden">
        {activeTab === 'library' && <DeckManagerView />}
        {activeTab === 'generator' && <AiGeneratorView />}
        {activeTab === 'analytics' && <AnalyticsDashboardView />}
      </main>

      {/* Instant Undo Toast Notification on Deletion */}
      <UndoToastBanner />

      {/* Single Blue Watermark in Bottom Corner - ONLY ONCE across entire application */}
      <div
        className="fixed bottom-3 right-4 z-30 pointer-events-none select-none text-blue-500 font-mono text-xs font-semibold tracking-wide"
        title="Creator Watermark"
      >
        &quot;Mohmmed was here.&quot;
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DeckProvider>
        <AppContent />
      </DeckProvider>
    </ThemeProvider>
  );
}
