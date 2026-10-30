export type MasteryStatus = 'new' | 'learning' | 'mastered';

export type QuestionType = 'standard' | 'multiple_choice';

export interface Flashcard {
  id: string;
  front: string; // Question or concept
  back: string;  // Answer or explanation
  options?: string[]; // 4 multiple choice options e.g. ["A) ...", "B) ...", "C) ...", "D) ..."]
  correctAnswerIndex?: number; // 0, 1, 2, or 3
  questionType?: QuestionType;
  tags: string[];
  mastery: MasteryStatus;
  incorrectCount?: number;
  correctCount?: number;
  lastReviewResult?: 'correct' | 'incorrect';
  weakPoint?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  folderId: string | null; // null represents root/unorganized
  color: string;
  icon?: string;
  cards: Flashcard[];
  source?: 'ai' | 'manual'; // Track whether file was AI generated or manually created
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  parentFolderId: string | null; // null represents top-level folder (supports arbitrary nesting!)
  color: string;
  icon?: string;
  createdAt: number;
  updatedAt: number;
}

export type TrashItemType = 'folder' | 'deck' | 'card';

export interface TrashItem {
  id: string;
  title: string;
  type: TrashItemType;
  deletedAt: number;
  data: Folder | Deck | { card: Flashcard; deckId: string };
}

export interface TestScoreRecord {
  id: string;
  deckId: string;
  deckName: string;
  scoreOutOfTen: number; // e.g. 9.0 out of 10
  correctCount: number;
  incorrectCount: number;
  totalCards: number;
  timestamp: number;
  mode: 'standard' | 'weak_points' | 'quick_test' | 'multi_source_test';
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface AnalyticsSummary {
  totalErrors: number;
  totalCorrect: number;
  totalCardsAnswered: number;
  improvementRate: number; // percentage, e.g. +28.4%
  aiGeneratedFilesCount: number;
  manualCreatedFilesCount: number;
  totalCardsProduced: number;
}

