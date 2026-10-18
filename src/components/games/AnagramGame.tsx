import React, { useState, useEffect } from 'react';
import { WordItem } from '../../types/index.ts';
import { createAnagramRound, AnagramState } from '../../utils/gameLogic.ts';
import { ArrowLeft, Lightbulb, RotateCcw, FastForward, CheckCircle2 } from 'lucide-react';

interface AnagramGameProps {
  words: WordItem[];
  onBack: () => void;
  onShowToast: (message: string) => void;
}

export const AnagramGame: React.FC<AnagramGameProps> = ({
  words,
  onBack,
  onShowToast,
}) => {
  // Eligible words 3-10 characters
  const eligible = words.filter((w) => {
    const clean = w.word.trim().toUpperCase().replace(/[^A-Z]/g, '');
    return clean.length >= 3 && clean.length <= 10;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [round, setRound] = useState<AnagramState | null>(null);
  const [currentSlots, setCurrentSlots] = useState<(string | null)[]>([]);
  const [scrambled, setScrambled] = useState<{ id: number; char: string; used: boolean }[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const initRound = (index: number) => {
    if (eligible.length === 0) return;
    const item = eligible[index % eligible.length];
    const def =
      item.meanings[0]?.definition ||
      item.meanings[0]?.meaning ||
      `Definition of ${item.word}`;
    const newRound = createAnagramRound(item.word, def);
    setRound(newRound);
    setCurrentSlots(newRound.slots);
    setScrambled(newRound.scrambledLetters);
    setIsRevealed(false);
    setIsCorrect(false);
  };

  useEffect(() => {
    initRound(currentIndex);
  }, [currentIndex, words]);

  if (eligible.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--bg-primary)] p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-bold text-[var(--accent-blue)] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h2 className="font-bold text-base text-[var(--text-primary)]">
            Anagram Scramble
          </h2>
          <div className="w-10" />
        </div>
        <div className="text-center py-12 max-w-xs mx-auto space-y-3">
          <span className="text-4xl">🧩</span>
          <h3 className="font-bold text-lg text-[var(--text-primary)]">
            Not enough words to play
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Add new vocabulary words to solve anagram word scramble puzzles!
          </p>
        </div>
        <button
          onClick={onBack}
          className="w-full h-12 rounded-2xl bg-[var(--accent-blue)] text-white font-bold text-sm cursor-pointer"
        >
          Return
        </button>
      </div>
    );
  }

  // Tapping a scrambled letter
  const handleTapLetter = (letterItem: { id: number; char: string; used: boolean }) => {
    if (letterItem.used || isRevealed) return;

    // Find first empty slot
    const firstEmptyIndex = currentSlots.findIndex((s) => s === null);
    if (firstEmptyIndex === -1) return;

    const nextSlots = [...currentSlots];
    nextSlots[firstEmptyIndex] = letterItem.char;
    setCurrentSlots(nextSlots);

    setScrambled((prev) =>
      prev.map((item) => (item.id === letterItem.id ? { ...item, used: true } : item))
    );

    // Check if filled
    if (firstEmptyIndex === currentSlots.length - 1) {
      const formedWord = nextSlots.join('');
      if (formedWord === round?.word) {
        setIsRevealed(true);
        setIsCorrect(true);
        onShowToast(`Brilliant! Correct anagram: "${round?.word}" 🎉`);
      } else {
        onShowToast('Not quite, try another combination');
      }
    }
  };

  // Tapping an active slot to remove it
  const handleTapSlot = (slotIndex: number) => {
    if (isRevealed) return;
    const char = currentSlots[slotIndex];
    if (!char) return;

    // Unuse the letter in scrambled rack
    const matchedLetter = scrambled.find((s) => s.char === char && s.used);
    if (matchedLetter) {
      setScrambled((prev) =>
        prev.map((item) => (item.id === matchedLetter.id ? { ...item, used: false } : item))
      );
    }

    const nextSlots = [...currentSlots];
    nextSlots[slotIndex] = null;
    setCurrentSlots(nextSlots);
  };

  // Clear button
  const handleClear = () => {
    if (isRevealed) return;
    setCurrentSlots(Array(round?.word.length || 0).fill(null));
    setScrambled((prev) => prev.map((item) => ({ ...item, used: false })));
  };

  // Hint button (reveals first unrevealed letter in correct slot)
  const handleHint = () => {
    if (isRevealed || !round) return;

    const emptyIdx = currentSlots.findIndex(
      (slot, idx) => slot !== round.word[idx]
    );
    if (emptyIdx === -1) return;

    const correctChar = round.word[emptyIdx];
    const availableTile = scrambled.find((item) => item.char === correctChar && !item.used);

    if (availableTile) {
      const nextSlots = [...currentSlots];
      nextSlots[emptyIdx] = correctChar;
      setCurrentSlots(nextSlots);

      setScrambled((prev) =>
        prev.map((item) => (item.id === availableTile.id ? { ...item, used: true } : item))
      );

      // Check if full
      if (nextSlots.every((s) => s !== null) && nextSlots.join('') === round.word) {
        setIsRevealed(true);
        setIsCorrect(true);
        onShowToast(`Well done! Solved: "${round.word}" 💡`);
      }
    } else {
      // Re-place tiles to free up the needed character
      handleClear();
      onShowToast('Slots cleared to assist hint placement');
    }
  };

  // Skip button
  const handleSkip = () => {
    setIsRevealed(true);
    setIsCorrect(false);
  };

  const handleNextWord = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-primary)] flex flex-col justify-between overflow-hidden p-2 max-w-md mx-auto h-screen h-[100dvh] max-h-[100dvh]">
      {/* Top Bar */}
      <div className="flex items-center justify-between py-1 border-b border-[var(--border-color)] shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-bold text-[var(--accent-blue)] active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <h2 className="font-bold text-sm text-[var(--text-primary)]">
            Anagram Scramble
          </h2>
          <span className="text-[10px] text-[var(--text-muted)] font-medium">
            Word {currentIndex + 1} of {eligible.length}
          </span>
        </div>

        <div className="w-8" />
      </div>

      {/* Clue Definition Card */}
      <div className="py-1 shrink-0">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-2.5 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-[var(--accent-blue)] block">
            💡 Definition Clue:
          </span>
          <p className="text-xs font-medium text-[var(--text-primary)] italic leading-tight text-left bg-[var(--bg-card-subtle)] p-2 rounded-xl border border-[var(--border-color)]/60 line-clamp-3">
            {round?.definition}
          </p>
          <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-0.5">
            <span>Word Length: {round?.word.length} letters</span>
            <span className="font-semibold text-[var(--text-secondary)]">
              {eligible[currentIndex % eligible.length]?.category}
            </span>
          </div>
        </div>
      </div>

      {/* Slots Section */}
      <div className="py-1 shrink-0 flex flex-col items-center">
        <span className="text-[11px] font-bold text-[var(--text-muted)] mb-1">
          Arrange letters in correct order:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-1 max-w-full">
          {currentSlots.map((char, index) => (
            <button
              key={index}
              onClick={() => handleTapSlot(index)}
              className={`w-8 h-9 rounded-xl border-2 flex items-center justify-center font-mono font-black text-sm transition-all select-none active:scale-95 cursor-pointer ${
                char
                  ? 'border-[var(--accent-blue)] bg-[var(--accent-blue-light)] text-[var(--accent-blue)] shadow-2xs'
                  : 'border-dashed border-[var(--border-color)] bg-[var(--bg-card)] text-transparent'
              }`}
            >
              {char || '_'}
            </button>
          ))}
        </div>
      </div>

      {/* Scrambled Letters Rack */}
      <div className="py-1 shrink-0 flex flex-col items-center">
        <div className="flex flex-wrap items-center justify-center gap-1 max-w-xs">
          {scrambled.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTapLetter(item)}
              disabled={item.used || isRevealed}
              className={`w-8 h-9 rounded-xl font-mono font-black text-sm flex items-center justify-center transition-all select-none active:scale-90 shadow-2xs cursor-pointer ${
                item.used
                  ? 'opacity-20 border border-[var(--border-color)] bg-transparent text-transparent cursor-not-allowed'
                  : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-blue)] hover:bg-[var(--accent-blue-light)]'
              }`}
            >
              {item.char}
            </button>
          ))}
        </div>
      </div>

      {/* Revealed State with Spelling */}
      {isRevealed && (
        <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl shrink-0 space-y-1 animate-fade-in text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {isCorrect ? 'Splendid! Correct Answer!' : 'Word Revealed'}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-base font-mono font-black text-[var(--accent-blue)] tracking-widest block">
              {round?.spellingDisplay}
            </span>
            <span className="text-xs font-bold text-[var(--text-primary)]">
              {round?.word}
            </span>
          </div>

          <button
            onClick={handleNextWord}
            className="w-full h-8 rounded-lg bg-[var(--accent-blue)] text-white text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
          >
            Next Word →
          </button>
        </div>
      )}

      {/* Buttons: Clear, Hint, Skip */}
      {!isRevealed && (
        <div className="grid grid-cols-3 gap-1.5 shrink-0 pt-1 border-t border-[var(--border-color)]">
          {/* Clear */}
          <button
            onClick={handleClear}
            className="h-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] font-bold text-xs flex items-center justify-center gap-1 text-[var(--text-secondary)] active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>

          {/* Hint */}
          <button
            onClick={handleHint}
            className="h-8 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-200 font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
          >
            <Lightbulb className="w-3 h-3 text-amber-600" />
            <span>Hint</span>
          </button>

          {/* Skip */}
          <button
            onClick={handleSkip}
            className="h-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] font-bold text-xs flex items-center justify-center gap-1 text-[var(--text-muted)] active:scale-95 transition-all cursor-pointer"
          >
            <FastForward className="w-3 h-3" />
            <span>Skip</span>
          </button>
        </div>
      )}
    </div>
  );
};
