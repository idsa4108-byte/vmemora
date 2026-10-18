import React, { useState, useEffect } from 'react';
import { WordItem } from '../../types/index.ts';
import { getLetterPoint } from '../../utils/gameLogic.ts';
import { ArrowLeft, Shuffle, RotateCcw, Check, Trophy, Sparkles } from 'lucide-react';

interface ScrabbleGameProps {
  words: WordItem[];
  onBack: () => void;
  onShowToast: (message: string) => void;
}

export const ScrabbleGame: React.FC<ScrabbleGameProps> = ({
  words,
  onBack,
  onShowToast,
}) => {
  const eligible = words
    .filter((w) => {
      const clean = w.word.trim().toUpperCase().replace(/[^A-Z]/g, '');
      return clean.length >= 3 && clean.length <= 10;
    })
    .map((w) => ({
      word: w.word.trim().toUpperCase().replace(/[^A-Z]/g, ''),
      clueAr: w.meanings[0]?.meaning || w.meanings[0]?.definition || w.word,
    }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [targetWord, setTargetWord] = useState('');
  const [clueAr, setClueAr] = useState('');
  const [rack, setRack] = useState<{ id: number; char: string; point: number; used: boolean }[]>([]);
  const [boardSlots, setBoardSlots] = useState<{ id: number; char: string; point: number }[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [lastEarned, setLastEarned] = useState<{ base: number; bonus: number; total: number } | null>(null);

  const initRound = (index: number) => {
    if (eligible.length === 0) return;
    const item = eligible[index % eligible.length];
    setTargetWord(item.word);
    setClueAr(item.clueAr);
    setBoardSlots([]);
    setLastEarned(null);

    // Create rack containing target letters + 2-3 extra random distractor letters
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const targetLetters = item.word.split('');
    const extraCount = Math.min(3, 10 - targetLetters.length);
    for (let i = 0; i < extraCount; i++) {
      targetLetters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }

    // Shuffle rack letters
    targetLetters.sort(() => Math.random() - 0.5);

    setRack(
      targetLetters.map((char, id) => ({
        id,
        char,
        point: getLetterPoint(char),
        used: false,
      }))
    );
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
            Scrabble Points
          </h2>
          <div className="w-10" />
        </div>
        <div className="text-center py-12 max-w-xs mx-auto space-y-3">
          <span className="text-4xl">🔠</span>
          <h3 className="font-bold text-lg text-[var(--text-primary)]">
            Not enough words to play
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Add new words to build vocabulary from the rack and calculate points!
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

  // Tapping rack tile to put on board
  const handleSelectRackTile = (tile: { id: number; char: string; point: number; used: boolean }) => {
    if (tile.used || lastEarned) return;

    setBoardSlots((prev) => [...prev, { id: tile.id, char: tile.char, point: tile.point }]);
    setRack((prev) =>
      prev.map((item) => (item.id === tile.id ? { ...item, used: true } : item))
    );
  };

  // Tapping board tile to send back to rack
  const handleRemoveBoardTile = (index: number) => {
    if (lastEarned) return;
    const tile = boardSlots[index];
    if (!tile) return;

    setBoardSlots((prev) => prev.filter((_, i) => i !== index));
    setRack((prev) =>
      prev.map((item) => (item.id === tile.id ? { ...item, used: false } : item))
    );
  };

  // Clear board
  const handleClear = () => {
    if (lastEarned) return;
    setBoardSlots([]);
    setRack((prev) => prev.map((item) => ({ ...item, used: false })));
  };

  // Shuffle rack
  const handleShuffle = () => {
    if (lastEarned) return;
    setRack((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  // Submit word
  const handleSubmitWord = () => {
    if (lastEarned || boardSlots.length === 0) return;
    const constructedWord = boardSlots.map((s) => s.char).join('');

    if (constructedWord === targetWord) {
      // Calculate score
      const basePoints = boardSlots.reduce((acc, tile) => acc + tile.point, 0);
      const bonus = targetWord.length >= 6 ? 50 : 0;
      const roundTotal = basePoints + bonus;

      setTotalScore((prev) => prev + roundTotal);
      setLastEarned({ base: basePoints, bonus, total: roundTotal });
      onShowToast(`Splendid! Built "${targetWord}" (+${roundTotal} pts) 🎉`);
    } else {
      onShowToast(`"${constructedWord}" does not match target "${targetWord}". Try again!`);
    }
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
            Scrabble Points
          </h2>
          <span className="text-[10px] text-[var(--text-muted)] font-medium">
            Form words and tally letter point scores
          </span>
        </div>

        {/* Total Score Badge */}
        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-lg text-amber-800 dark:text-amber-200 font-mono font-bold text-xs">
          <Trophy className="w-3 h-3 text-amber-500" />
          <span>{totalScore}</span>
        </div>
      </div>

      {/* Clue Card */}
      <div className="py-1 shrink-0">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-2.5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--accent-blue)]">
              💡 Target Clue:
            </span>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded-full">
              +50 Bonus for 6+ letters
            </span>
          </div>
          <h3 className="text-sm font-bold text-[var(--text-primary)] leading-tight">
            {clueAr}
          </h3>
          <p className="text-[10px] text-[var(--text-muted)]">
            Word Length: {targetWord.length} letters
          </p>
        </div>
      </div>

      {/* Formed Word Board Slots */}
      <div className="py-1 shrink-0 flex flex-col items-center">
        <span className="text-[11px] font-bold text-[var(--text-muted)] mb-1">
          Formed word on board (tap to return to rack):
        </span>
        <div className="flex flex-wrap items-center justify-center gap-1 min-h-[44px] p-1.5 bg-[var(--bg-card-subtle)] border border-[var(--border-color)] rounded-xl w-full max-w-sm">
          {boardSlots.length === 0 ? (
            <span className="text-[11px] text-[var(--text-muted)] italic">
              Tap letters from the rack below to spell the word
            </span>
          ) : (
            boardSlots.map((slot, index) => (
              <button
                key={`${slot.id}-${index}`}
                onClick={() => handleRemoveBoardTile(index)}
                className="w-8 h-9 bg-amber-100 dark:bg-amber-900 border border-amber-300 dark:border-amber-700 rounded-lg flex flex-col items-center justify-between p-0.5 shadow-2xs active:scale-95 transition-all relative select-none cursor-pointer"
              >
                <span className="font-mono font-black text-amber-950 dark:text-amber-100 text-sm leading-none">
                  {slot.char}
                </span>
                <span className="text-[7px] font-bold text-amber-700 dark:text-amber-300 self-end leading-none">
                  {slot.point}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Letter Rack with Point Values */}
      <div className="py-1 shrink-0 flex flex-col items-center">
        <span className="text-[11px] font-bold text-[var(--text-muted)] mb-1">
          Letter Rack (with Scrabble point values):
        </span>
        <div className="flex flex-wrap items-center justify-center gap-1 p-1.5 bg-amber-950/10 dark:bg-amber-950/40 border border-amber-800/30 rounded-xl max-w-xs shadow-inner">
          {rack.map((tile) => (
            <button
              key={tile.id}
              onClick={() => handleSelectRackTile(tile)}
              disabled={tile.used || !!lastEarned}
              className={`w-8 h-9 rounded-lg flex flex-col items-center justify-between p-0.5 transition-all select-none active:scale-90 cursor-pointer ${
                tile.used
                  ? 'opacity-20 border border-transparent bg-transparent text-transparent cursor-not-allowed'
                  : 'bg-amber-50 dark:bg-amber-900/80 border border-amber-300 dark:border-amber-700 shadow-2xs hover:scale-105'
              }`}
            >
              <span className="font-mono font-black text-amber-950 dark:text-amber-100 text-sm leading-none">
                {tile.char}
              </span>
              <span className="text-[7px] font-bold text-amber-700 dark:text-amber-300 self-end leading-none">
                {tile.point}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Success banner if solved */}
      {lastEarned && (
        <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl shrink-0 space-y-1 animate-fade-in text-center">
          <div className="flex items-center justify-center gap-1.5 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>
              Awesome! Letters: {lastEarned.base} {lastEarned.bonus > 0 && `+ Length Bonus: ${lastEarned.bonus}`} = Total: {lastEarned.total} pts!
            </span>
          </div>

          <button
            onClick={handleNextWord}
            className="w-full h-8 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
          >
            Next Word →
          </button>
        </div>
      )}

      {/* Control Buttons: Clear, Shuffle, Submit */}
      {!lastEarned && (
        <div className="grid grid-cols-3 gap-1.5 shrink-0 pt-1 border-t border-[var(--border-color)]">
          {/* Clear */}
          <button
            onClick={handleClear}
            className="h-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] font-bold text-xs flex items-center justify-center gap-1 text-[var(--text-secondary)] active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>

          {/* Shuffle Rack */}
          <button
            onClick={handleShuffle}
            className="h-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] font-bold text-xs flex items-center justify-center gap-1 text-[var(--text-secondary)] active:scale-95 transition-all cursor-pointer"
          >
            <Shuffle className="w-3 h-3" />
            <span>Shuffle</span>
          </button>

          {/* Submit */}
          <button
            onClick={handleSubmitWord}
            disabled={boardSlots.length === 0}
            className="h-8 rounded-lg bg-[var(--accent-blue)] hover:bg-[var(--accent-blue-hover)] disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all cursor-pointer"
          >
            <Check className="w-3 h-3" />
            <span>Submit</span>
          </button>
        </div>
      )}
    </div>
  );
};
