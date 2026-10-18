import React, { useState } from 'react';
import { X, Moon, Sun, Trash2, Download, AlertTriangle, Volume2 } from 'lucide-react';
import { WordItem } from '../types/index.ts';
import { testAmericanVoice } from '../utils/speech.ts';

interface ProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  words: WordItem[];
  currentTheme: 'light' | 'dark';
  onToggleTheme: () => void;
  onDeleteAllWords: () => void;
  onShowToast: (message: string) => void;
}

export const ProfileSheet: React.FC<ProfileSheetProps> = ({
  isOpen,
  onClose,
  words,
  currentTheme,
  onToggleTheme,
  onDeleteAllWords,
  onShowToast,
}) => {
  const [deleteStep, setDeleteStep] = useState<0 | 1>(0);

  if (!isOpen) return null;

  const totalWords = words.length;
  const learnedCount = words.filter((w) => w.isLearned).length;
  const importantCount = words.filter((w) => w.isImportant).length;

  const handleDeleteAll = () => {
    if (deleteStep === 0) {
      setDeleteStep(1);
    } else {
      onDeleteAllWords();
      setDeleteStep(0);
      onShowToast('All saved words deleted successfully');
      onClose();
    }
  };

  const handleExportData = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(words, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `vmemora_words_export_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      onShowToast('Vocabulary backup exported successfully 📥');
    } catch (e) {
      onShowToast('An error occurred while exporting vocabulary');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-md bg-[var(--bg-card)] rounded-t-3xl border-t border-[var(--border-color)] shadow-2xl p-5 animate-slide-up space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)]/70 pb-3">
          <div className="w-12 h-1.5 rounded-full bg-[var(--border-color)] mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
          <div className="flex items-center gap-2">
            <span className="text-2xl">👤</span>
            <div>
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                Profile & Settings
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] font-medium">
                Vmemora Vocabulary Studio
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setDeleteStep(0);
              onClose();
            }}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Summary Card */}
        <div className="bg-[var(--bg-card-subtle)] border border-[var(--border-color)] rounded-2xl p-4 grid grid-cols-2 gap-3 text-center">
          <div>
            <span className="text-2xl font-black text-[var(--text-primary)] font-mono block">
              {totalWords}
            </span>
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              Total Words
            </span>
          </div>
          <div className="border-l border-[var(--border-color)]">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono block">
              {learnedCount}
            </span>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              Mastered
            </span>
          </div>
        </div>

        {/* Settings options */}
        <div className="space-y-2.5">
          {/* Theme toggle row */}
          <div className="p-3.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {currentTheme === 'light' ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-400" />
              )}
              <span className="text-sm font-bold text-[var(--text-primary)]">
                Theme (Light / Dark)
              </span>
            </div>
            <button
              onClick={onToggleTheme}
              className="px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card-subtle)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--accent-blue)] active:scale-95 transition-all cursor-pointer"
            >
              {currentTheme === 'light' ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
            </button>
          </div>

          {/* Voice Pronunciation Card */}
          <div className="p-3.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-5 h-5 text-[var(--accent-purple)]" />
                <div>
                  <span className="text-sm font-bold text-[var(--text-primary)] block">
                    Pronunciation Voice
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    Natural American English (en-US 🇺🇸)
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  testAmericanVoice((url) => onShowToast('Audio link: ' + url));
                  onShowToast('Playing American English voice test 🇺🇸');
                }}
                className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Test Voice 🔊</span>
              </button>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] bg-[var(--bg-card-subtle)] p-2 rounded-xl border border-[var(--border-color)]">
              ✨ Natural American English accent with clear phonetic articulation across all flashcards, words, and word games.
            </p>
          </div>

          {/* Export words */}
          <button
            onClick={handleExportData}
            className="w-full p-3.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] flex items-center justify-between text-sm font-bold text-[var(--text-primary)] active:scale-98 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Download className="w-5 h-5 text-[var(--accent-blue)]" />
              <span>Export Vocabulary Backup (JSON)</span>
            </div>
            <span className="text-xs text-[var(--text-muted)] font-mono">📥</span>
          </button>

          {/* Delete All Words */}
          <div className="pt-2">
            <button
              onClick={handleDeleteAll}
              className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-sm font-bold active:scale-98 transition-all cursor-pointer ${
                deleteStep === 1
                  ? 'bg-rose-600 text-white border-rose-600 animate-pulse shadow-md'
                  : 'bg-rose-50/70 border-rose-200 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {deleteStep === 1 ? (
                  <AlertTriangle className="w-5 h-5 text-white" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
                <span>
                  {deleteStep === 1
                    ? 'Are you certain? Tap again to confirm deletion'
                    : 'Clear All Saved Vocabulary'}
                </span>
              </div>
              <span className="text-xs">
                {deleteStep === 1 ? 'Confirm Delete' : '2 Taps'}
              </span>
            </button>
            {deleteStep === 1 && (
              <button
                onClick={() => setDeleteStep(0)}
                className="w-full text-center text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] mt-1.5 py-1 cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
