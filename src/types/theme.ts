export type PaletteId = 'indigo' | 'gold' | 'black' | 'pink' | 'nature' | 'space';
export type ThemeMode = 'dark' | 'light';
export type BackgroundPatternId = 'bubbles' | 'stars' | 'atoms' | 'waves';

export interface PaletteDefinition {
  id: PaletteId;
  name: string;
  description: string;
  previewColors: {
    dark: string[];
    light: string[];
  };
}

export interface ThemeContextType {
  palette: PaletteId;
  mode: ThemeMode;
  backgroundPattern: BackgroundPatternId;
  animationEnabled: boolean;
  username: string;
  setPalette: (palette: PaletteId) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setBackgroundPattern: (pattern: BackgroundPatternId) => void;
  toggleAnimation: () => void;
  setAnimationEnabled: (enabled: boolean) => void;
  setUsername: (name: string) => void;
}

