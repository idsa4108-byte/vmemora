import React, { useState } from 'react';
import { Volume2, RotateCw, Heart, CheckCircle2, RefreshCcw } from 'lucide-react';
import { WordItem } from '../types/index.ts';
import { speakWord } from '../utils/speech.ts';

interface ReviewTabProps {
  words: WordItem[];
  onToggleLearned: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onShowToast: (message: string, actionUrl?: string) => void;
}

export const ReviewTab: React.FC<ReviewTabProps> = ({
  words,
  onToggleLearned,
  onToggleImportant,
  onShowToast,
}) => {
  // Only review not-yet-learned words
  const unlearnedWords = words.filter((w) => !w.isLearned);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentWord = unlearnedWords[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePlayAudio = (e: React.MouseEvent, text: string, langName: string) => {
    e.stopPropagation();
    speakWord(text, langName, (url) => {
      onShowToast('Audio playback unsupported, click here to open in Google Translate', url);
    });
  };

  const nextCard = () => {
    setIsFlipped(false);
    if (currentIndex + 1 < unlearnedWords.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleMarkHard = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentWord) return;
    onToggleImportant(currentWord.id);
    onShowToast(`Added "${currentWord.word}" to Important Words ❤️`);
    nextCard();
  };

  const handleMarkLearned = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentWord) return;
    onToggleLearned(currentWord.id);
    onShowToast(`Well done! Marked "${currentWord.word}" as Mastered ✅`);
    nextCard();
  };

  const restartReview = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
  };

  if (unlearnedWords.length === 0 || isCompleted) {
    return (
      <div className="px-4 py-12 text-center max-w-md mx-auto space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center text-4xl shadow-md shadow-emerald-500/20">
          🎉
        </div>
        <h3 className="text-xl font-bold text-[var(--text-primary)]">
          {unlearnedWords.length === 0
            ? 'Outstanding! You have mastered all words!'
            : 'Well done! You finished this review session!'}
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">
          {unlearnedWords.length === 0
            ? 'Every word in your vocabulary list is mastered. Add new words to continue expanding your lexicon.'
            : 'Keep reviewing regularly to strengthen long-term memory retention.'}
        </p>

        <div className="pt-2">
          <button
            onClick={restartReview}
            className="px-6 py-3 rounded-2xl bg-[var(--accent-blue)] text-white font-bold text-sm inline-flex items-center gap-2 shadow-md shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Restart Review</span>
          </button>
        </div>
      </div>
    );
  }

  const primaryMeaning = currentWord.meanings[0];
  const primaryExample = primaryMeaning?.examples?.[0];

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between p-3 max-w-md mx-auto overflow-hidden">
      {/* Progress Counter & Bar */}
      <div className="shrink-0 mb-1">
        <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)] mb-1">
          <span>Spaced Flashcard Review</span>
          <span className="font-mono bg-[var(--accent-blue-light)] text-[var(--accent-blue)] px-2 py-0.2 rounded-full text-[10px]">
            {currentIndex + 1} / {unlearnedWords.length}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[var(--border-color)] overflow-hidden">
          <div
            className="h-full bg-[var(--accent-blue)] transition-all duration-300 rounded-full"
            style={{
              width: `${((currentIndex + 1) / unlearnedWords.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* 3D Flippable Flashcard */}
      <div
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        aria-label="Flip flashcard to check definition"
        className="flex-1 min-h-0 my-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-3.5 shadow-xs flex flex-col justify-between cursor-pointer select-none transition-all hover:shadow-sm relative group overflow-hidden"
      >
        {/* Flip Hint Badge */}
        <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] font-bold shrink-0">
          <span className="flex items-center gap-1 text-[var(--accent-blue)]">
            <RotateCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
            <span>Tap to flip</span>
          </span>
          <span className="font-mono text-[9px]">
            {isFlipped ? 'Back (Definition)' : 'Front (Word)'}
          </span>
        </div>

        {/* Card Content based on Flip state */}
        {!isFlipped ? (
          /* FRONT SIDE */
          <div className="py-2 flex flex-col items-center justify-center text-center space-y-2 flex-1 min-h-0">
            <span className="text-4xl p-2 bg-[var(--bg-card-subtle)] rounded-2xl shadow-xs">
              {currentWord.emoji || '📖'}
            </span>

            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1.5">
                <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-wide">
                  {currentWord.word}
                </h3>
                <button
                  type="button"
                  onClick={(e) =>
                    handlePlayAudio(e, currentWord.word, currentWord.language || 'English')
                  }
                  aria-label="Listen to pronunciation"
                  className="w-7 h-7 rounded-full bg-[var(--accent-blue-light)] text-[var(--accent-blue)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xs cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {currentWord.phonetic && (
                <p className="text-xs font-mono text-[var(--text-muted)]">
                  {currentWord.phonetic}
                </p>
              )}
            </div>

            <p className="text-[10px] text-[var(--text-muted)] font-medium pt-1">
              Tap the card to reveal the definition and example sentence
            </p>
          </div>
        ) : (
          /* BACK SIDE */
          <div className="py-1 space-y-1.5 animate-fade-in text-left flex-1 min-h-0 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--border-color)]/70 pb-1">
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[var(--accent-blue-light)] text-[var(--accent-blue)]">
                {primaryMeaning?.partOfSpeechEn || primaryMeaning?.partOfSpeech || 'Definition'}
              </span>
              <span className="font-bold text-sm text-[var(--text-primary)]">
                {currentWord.word}
              </span>
            </div>

            {/* Meaning & Definition */}
            <div className="bg-[var(--bg-card-subtle)] p-2 rounded-xl border border-[var(--border-color)]/60">
              <span className="text-[10px] font-bold text-[var(--text-muted)] block">
                Meaning:
              </span>
              <h4 className="text-sm font-bold text-[var(--text-primary)]">
                {primaryMeaning?.meaning || primaryMeaning?.definition || primaryMeaning?.meaningAr}
              </h4>
            </div>

            {/* Detailed Definition */}
            {primaryMeaning?.definition && primaryMeaning.definition !== primaryMeaning.meaning && (
              <p className="text-[11px] text-[var(--text-secondary)] italic bg-[var(--bg-card-subtle)]/70 p-1.5 rounded-lg border border-[var(--border-color)]/40 leading-tight">
                💡 {primaryMeaning.definition}
              </p>
            )}

            {/* One Example */}
            {primaryExample && (
              <div className="bg-[var(--bg-card-subtle)] p-1.5 rounded-lg border border-[var(--border-color)]/40 text-[11px] space-y-0.5">
                <p className="font-medium text-[var(--text-primary)]">
                  {primaryExample.example}
                </p>
                {(primaryExample.translation || primaryExample.translationAr) && (
                  <p className="text-[var(--text-secondary)] font-semibold text-[10px]">
                    {primaryExample.translation || primaryExample.translationAr}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Card Footer */}
        <div className="text-center pt-1 border-t border-[var(--border-color)]/40 shrink-0">
          <span className="text-[10px] text-[var(--text-muted)]">
            How well do you remember this word?
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1 shrink-0">
        {/* Needs Review */}
        <button
          onClick={handleMarkHard}
          className="h-10 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs cursor-pointer"
        >
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>Needs Review</span>
        </button>

        {/* Mastered */}
        <button
          onClick={handleMarkLearned}
          className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Mastered</span>
        </button>
      </div>
    </div>
  );
};
