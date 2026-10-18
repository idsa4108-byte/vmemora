import React, { useState, useEffect, useRef } from 'react';
import { WordItem, CategoryId } from './types/index.ts';
import {
  loadSavedWords,
  saveWords,
  loadTheme,
  saveTheme,
  loadTargetLanguage,
  saveTargetLanguage,
} from './utils/storage.ts';
import { Header } from './components/Header.tsx';
import { CategoryTiles } from './components/CategoryTiles.tsx';
import { InputCard } from './components/InputCard.tsx';
import { SegmentedTabs, TabType } from './components/SegmentedTabs.tsx';
import { WordsTab } from './components/WordsTab.tsx';
import { PracticeTab } from './components/PracticeTab.tsx';
import { ReviewTab } from './components/ReviewTab.tsx';
import { StatsTab } from './components/StatsTab.tsx';
import { BottomNavBar } from './components/BottomNavBar.tsx';
import { AddWordSheet } from './components/AddWordSheet.tsx';
import { CategoriesSheet } from './components/CategoriesSheet.tsx';
import { ProfileSheet } from './components/ProfileSheet.tsx';
import { ExternalLink, X } from 'lucide-react';

export default function App() {
  const [words, setWords] = useState<WordItem[]>(() => loadSavedWords());
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(() => loadTheme());
  const [targetLang, setTargetLang] = useState<string>(() => loadTargetLanguage());

  const [activeTab, setActiveTab] = useState<TabType>('words');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const [isAddingWord, setIsAddingWord] = useState(false);
  const [analyzedWordData, setAnalyzedWordData] = useState<Partial<WordItem> | null>(null);

  const [isCategoriesSheetOpen, setIsCategoriesSheetOpen] = useState(false);
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);
  const [openedGame, setOpenedGame] = useState<'wordsearch' | 'anagram' | 'crossword' | 'scrabble' | null>(null);

  const [toast, setToast] = useState<{ message: string; actionUrl?: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync theme with DOM documentElement
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    saveTheme(currentTheme);
  }, [currentTheme]);

  // Sync words with localStorage
  useEffect(() => {
    saveWords(words);
  }, [words]);

  // Sync language with localStorage
  useEffect(() => {
    saveTargetLanguage(targetLang);
  }, [targetLang]);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message: string, actionUrl?: string) => {
    setToast({ message, actionUrl });
  };

  const handleToggleTheme = () => {
    setCurrentTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Add word lookup handler
  const handleLookupWord = async (newWord: string) => {
    setIsAddingWord(true);
    try {
      const response = await fetch('/api/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: newWord, sourceLang: targetLang }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch word details from server');
      }

      const data = await response.json();
      setAnalyzedWordData(data);
    } catch (err: any) {
      console.error('Word lookup error:', err);
      // Fallback object so user can still add word immediately
      setAnalyzedWordData({
        word: newWord,
        phonetic: `/${newWord.toLowerCase()}/`,
        emoji: '📖',
        category: 'Study',
        meanings: [
          {
            partOfSpeech: 'noun',
            partOfSpeechEn: 'noun',
            meaning: `Definition of "${newWord}".`,
            definition: `Meaning and usage of the word "${newWord}".`,
            examples: [
              {
                example: `I am learning the word "${newWord}".`,
                translation: `Practicing using "${newWord}" in a daily context.`,
              },
              {
                example: `Can you define "${newWord}"?`,
                translation: `Exploring the precise meaning of "${newWord}".`,
              },
            ],
          },
        ],
      });
      showToast('Prepared word for quick addition ✨');
    } finally {
      setIsAddingWord(false);
    }
  };

  const handleSaveWordItem = (newWordItem: WordItem) => {
    // Avoid exact duplicate
    const exists = words.some(
      (w) => w.word.toLowerCase() === newWordItem.word.toLowerCase()
    );
    if (exists) {
      showToast(`The word "${newWordItem.word}" is already in your vocabulary list!`);
      setAnalyzedWordData(null);
      return;
    }

    setWords((prev) => [newWordItem, ...prev]);
    setAnalyzedWordData(null);
    setActiveTab('words');
    showToast(`Saved word "${newWordItem.word}" successfully ✨`);
  };

  const handleToggleLearned = (id: string) => {
    setWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isLearned: !w.isLearned } : w))
    );
  };

  const handleToggleImportant = (id: string) => {
    setWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isImportant: !w.isImportant } : w))
    );
  };

  const handleDeleteWord = (id: string) => {
    setWords((prev) => prev.filter((w) => w.id !== id));
  };

  const handleDeleteAllWords = () => {
    setWords([]);
  };

  const handleFocusInput = () => {
    setActiveTab('words');
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const unlearnedCount = words.filter((w) => !w.isLearned).length;

  return (
    <div className="h-screen h-[100dvh] max-h-[100dvh] bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col font-sans overflow-hidden">
      {/* 1. Header */}
      <Header
        currentTheme={currentTheme}
        onToggleTheme={handleToggleTheme}
        onOpenCategories={() => setIsCategoriesSheetOpen(true)}
        targetLang={targetLang}
        onChangeTargetLang={(lang) => {
          setTargetLang(lang);
          showToast(`Changed target language to ${lang}`);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-h-0 max-w-2xl w-full mx-auto flex flex-col overflow-hidden">
        {/* 2. Horizontally scrolling Category Tiles */}
        <CategoryTiles
          words={words}
          selectedFilter={selectedFilter}
          onSelectFilter={(f) => {
            setSelectedFilter(f);
            setActiveTab('words');
          }}
          onOpenGames={() => {
            setActiveTab('practice');
          }}
        />

        {/* 3. Input Card */}
        <InputCard
          ref={inputRef}
          onAddWord={handleLookupWord}
          isLoading={isAddingWord}
          targetLangName={targetLang}
        />

        {/* 4. Segmented Tabs */}
        <SegmentedTabs
          activeTab={activeTab}
          onChangeTab={(t) => setActiveTab(t)}
          reviewCount={unlearnedCount}
        />

        {/* Active Tab View */}
        {activeTab === 'words' && (
          <WordsTab
            words={words}
            selectedFilter={selectedFilter}
            onToggleLearned={handleToggleLearned}
            onToggleImportant={handleToggleImportant}
            onDeleteWord={handleDeleteWord}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeTab
            words={words}
            onShowToast={showToast}
            initialGame={openedGame}
            onCloseGame={() => setOpenedGame(null)}
          />
        )}

        {activeTab === 'review' && (
          <ReviewTab
            words={words}
            onToggleLearned={handleToggleLearned}
            onToggleImportant={handleToggleImportant}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'stats' && <StatsTab words={words} />}
      </main>

      {/* 5. Docked Bottom Navigation Bar */}
      <BottomNavBar
        currentTab={
          isProfileSheetOpen
            ? 'profile'
            : isCategoriesSheetOpen
            ? 'categories'
            : activeTab === 'practice'
            ? 'games'
            : 'home'
        }
        onNavigateHome={() => {
          setIsCategoriesSheetOpen(false);
          setIsProfileSheetOpen(false);
          setActiveTab('words');
          setSelectedFilter('all');
        }}
        onOpenCategories={() => setIsCategoriesSheetOpen(true)}
        onPlusClick={handleFocusInput}
        onOpenGames={() => {
          setIsCategoriesSheetOpen(false);
          setIsProfileSheetOpen(false);
          setActiveTab('practice');
        }}
        onOpenProfile={() => setIsProfileSheetOpen(true)}
      />

      {/* Add Word Analysis Bottom Sheet */}
      {analyzedWordData && (
        <AddWordSheet
          data={analyzedWordData}
          onSave={handleSaveWordItem}
          onClose={() => setAnalyzedWordData(null)}
          targetLangName={targetLang}
          onShowToast={showToast}
        />
      )}

      {/* Categories Full Sheet */}
      <CategoriesSheet
        isOpen={isCategoriesSheetOpen}
        onClose={() => setIsCategoriesSheetOpen(false)}
        words={words}
        selectedCategory={selectedFilter}
        onSelectCategory={(id) => {
          setSelectedFilter(id);
          setActiveTab('words');
        }}
      />

      {/* Profile & Settings Sheet */}
      <ProfileSheet
        isOpen={isProfileSheetOpen}
        onClose={() => setIsProfileSheetOpen(false)}
        words={words}
        currentTheme={currentTheme}
        onToggleTheme={handleToggleTheme}
        onDeleteAllWords={handleDeleteAllWords}
        onShowToast={showToast}
      />

      {/* Interactive Toast Notification (No alerts) */}
      {toast && (
        <div className="fixed bottom-20 left-4 right-4 z-50 flex justify-center pointer-events-none animate-slide-up">
          <div className="pointer-events-auto max-w-sm w-full bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs font-bold border border-white/10">
            <span className="flex-1">{toast.message}</span>
            {toast.actionUrl && (
              <a
                href={toast.actionUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-1 shrink-0 hover:bg-blue-500"
              >
                <span>Open Translation</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white dark:hover:text-black shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
