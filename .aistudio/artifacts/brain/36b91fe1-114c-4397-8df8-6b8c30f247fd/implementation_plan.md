# Implementation Plan: OLS Brand Refresh, Theme Color Updates & Statistics Reset Engine

Implement visual header brand adjustments, shift the Preferences Menu directly adjacent to the OLS logo, update palette definitions (Royal Black with Red secondary, Indigo replaced with White & Gray), enforce clean zero-state statistics that only increment on live actions, and add a statistics Reset button with an "Are you sure?" confirmation modal.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during Phase 1:
> - **Preferences Menu Position**: Placed between the brand title and the navigation links (shifted close to the logo area).
> - **Reset Warning UI**: Dedicated modal dialog presenting the exact prompt "Are you sure?" with confirm/cancel buttons.
> - **White & Gray Theme Accent**: Soft cool silver and neutral gray for primary buttons and interactive highlights.

- **Confirmed Decision 1**: Brand area features bold "OLS" wordmark with "Omega Learning System" in clean small typography next to the atom logo.
- **Confirmed Decision 2**: Royal Black secondary highlight changes from white to vivid crimson red (`#ef4444` / `#dc2626`).
- **Confirmed Decision 3**: The previous Indigo Blue palette is replaced with a sleek White & Cool Gray theme.
- **Confirmed Decision 4**: Statistics start at strictly 0 and update only upon user actions (AI generation, manual deck/card creation, study session answers).

---

## 1. Overview & Core Concept

- **What It Delivers**:
  1. **Logo & Wordmark Refresh**: Prominent "OLS" lockup with "Omega Learning System" in a refined small font beside the elliptical-orbit atom nucleus.
  2. **Header Layout Adjustment**: Shifting the consolidated Preferences Menu from the far-right corner into the left brand cluster between the brand title and navigation links.
  3. **Theme & Palette Evolution**:
     - *Royal Black & Red*: Obsidian base with high-contrast crimson red secondary highlights.
     - *White & Gray*: Replaces Indigo with a sophisticated soft silver and neutral slate palette.
  4. **Action-Driven Analytics (Zero-State Engine)**: All metric counters (total correct, incorrect, cards produced, files generated, accuracy rate) initialize at zero and update only when real user actions occur.
  5. **Protected Statistics Reset Flow**: A prominent "Reset Statistics" button triggering a modal dialog with the warning prompt: "Are you sure?" before clearing data.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Header Exploration**:
   - The user sees the animated atom logo alongside the bold **OLS** badge and small "Omega Learning System" title.
   - Immediately next to the brand title sits the **Preferences** button, making theme, mode, and audio controls easily accessible without scanning to the far right.

2. **Theme Switching**:
   - Selecting **Royal Black**: Deep obsidian surfaces now feature sharp crimson red accents (`#ef4444`), and the animated background shines with diamond white and crimson red particles/waves.
   - Selecting **White & Gray**: Surfaces adopt cool silver-gray borders, soft slate text, and crisp monochrome highlights.

3. **Statistics & Reset Action**:
   - Opening the **Analytics & Scores** view displays all metrics at zero for fresh sessions.
   - Generating flashcards via AI or manual creation increments `totalCardsProduced` and file counters.
   - Studying decks and answering cards updates `totalCardsAnswered`, `totalCorrect`, and accuracy in real-time.
   - Clicking **Reset Statistics** presents a clean modal:
     - Header: "Reset Statistics"
     - Warning: **"Are you sure?"**
     - Description: "This will permanently reset all answered card counts, accuracy rates, and quiz score history back to zero."
     - Buttons: "Cancel" (preserves data) and "Yes, Reset Everything" (clears data, resets counters, shows feedback).

---

## 3. Key Product Decisions & Trade-Offs

- **Header Layout Composition**:
  - *Chosen Approach*: Group `[AtomLogo + OLS + Subtitle]` together with `ThemeControls` in a cohesive left brand group. The desktop nav links sit adjacent, while the right side remains uncluttered.
  - *Why*: Accommodates user request to shift preferences closer to the logo while preserving responsiveness on mobile.

- **Storage & State Reset Strategy**:
  - *Chosen Approach*: `DeckContext` maintains a `resetAllAnalytics()` method that resets `analytics` to clean zeroes and empties `testScores` in both React state and localStorage.
  - *Why*: Ensures total synchronicity between local UI state, localStorage persistence, and active card drill sessions.

---

## 4. Technical Architecture & Component Mapping

```
┌────────────────────────────────────────────────────────────────────────┐
│                               Header                                   │
│  ┌───────────────────────┐  ┌───────────────┐  ┌────────────────────┐  │
│  │ Atom Logo + OLS       │  │ Preferences   │  │ Navigation Links   │  │
│  │ (Omega Learning Sys)  │  │ (Theme Menu)  │  │ [Library][AI][Stats│  │
│  └───────────────────────┘  └───────────────┘  └────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                             Theme Context                              │
│  • Royal Black & Red (#ef4444)     • White & Gray (#64748b / #94a3b8)  │
│  • Canvas Shader Color Mapping     • Mode & Animation Sync             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                              DeckContext                               │
│  • Analytics State (Zero Default)   • TestScores Log (Empty Default)   │
│  • Real-Action Updaters             • resetAllAnalytics() Action       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       AnalyticsDashboardView                           │
│  • Zero-State Metrics Display       • Reset Button & Trigger           │
│  • "Are you sure?" Modal Dialog     • Score History View               │
└────────────────────────────────────────────────────────────────────────┘
```

### Component Implementation Details

1. **`src/components/Header.tsx`**:
   - Update brand block: `AtomLogo` + `span.font-black text-xl "OLS"` + `span.text-xs text-slate-400 "Omega Learning System"`.
   - Reposition `<ThemeControls />` immediately following the brand block.

2. **`src/data/themePalettes.ts` & `src/context/ThemeContext.tsx`**:
   - Update `black` palette: name "Royal Black & Crimson", secondary colors set to `#ef4444` (dark) and `#dc2626` (light).
   - Update `indigo` palette: replace with `gray` ("White & Cool Gray"), preview colors `['#090d16', '#1e293b', '#94a3b8']` (dark) and `['#f8fafc', '#ffffff', '#64748b']` (light). Primary tokens set to soft cool silver/gray.

3. **`src/components/AnimatedBackground.tsx`**:
   - Update `black` shader profile: combine diamond white with crimson red highlights for bubbles, stars, and ocean waves.
   - Update `indigo` shader profile to `gray`: silver, cool slate, and mist white.

4. **`src/context/DeckContext.tsx`**:
   - Initialize `analytics` strictly with zeros (`totalCorrect: 0`, `totalIncorrect: 0`, `improvementRate: 0`, `aiGeneratedFilesCount: 0`, `manualCreatedFilesCount: 0`, `totalCardsProduced: 0`, `totalCardsAnswered: 0`).
   - Initialize `testScores` to empty array `[]`.
   - Provide `resetAllAnalytics()` method.

5. **`src/components/AnalyticsDashboardView.tsx`**:
   - Add Reset button in header.
   - Implement "Are you sure?" confirmation dialog modal.
