import React, { useState, useEffect, useRef } from 'react';
import { WordItem } from '../../types/index.ts';
import {
  generateWordSearch,
  getLineCells,
  checkPathSelection,
  WordSearchResult,
} from '../../utils/gameLogic.ts';
import { ArrowLeft, RefreshCw, CheckCircle, Trophy } from 'lucide-react';

interface WordSearchGameProps {
  words: WordItem[];
  onBack: () => void;
  onShowToast: (message: string) => void;
}

export const WordSearchGame: React.FC<WordSearchGameProps> = ({
  words,
  onBack,
  onShowToast,
}) => {
  const [board, setBoard] = useState<WordSearchResult | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<{ r: number; c: number }[]>([]);
  const [startCell, setStartCell] = useState<{ r: number; c: number } | null>(null);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [score, setScore] = useState(0);

  const gridRef = useRef<HTMLDivElement>(null);

  // Eligible words: 3 to 7 characters
  const eligible = words
    .filter((w) => {
      const clean = w.word.trim().toUpperCase().replace(/[^A-Z]/g, '');
      return clean.length >= 3 && clean.length <= 7;
    })
    .map((w) => ({
      word: w.word.trim().toUpperCase().replace(/[^A-Z]/g, ''),
      clueAr: w.meanings[0]?.meaning || w.meanings[0]?.definition || w.word,
    }));

  const initGame = () => {
    if (eligible.length < 3) return;
    const res = generateWordSearch(eligible, 7);
    setBoard(res);
    setFoundWords([]);
    setSelectedCells([]);
    setStartCell(null);
    setIsPointerDown(false);
    setHasMoved(false);
  };

  useEffect(() => {
    initGame();
  }, [words]);

  // Global pointer up listener
  useEffect(() => {
    const handleGlobalUp = () => {
      if (isPointerDown) {
        handlePointerUp();
      }
    };
    window.addEventListener('pointerup', handleGlobalUp);
    window.addEventListener('touchend', handleGlobalUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalUp);
      window.removeEventListener('touchend', handleGlobalUp);
    };
  }, [isPointerDown, hasMoved, selectedCells, board, foundWords, startCell]);

  if (eligible.length < 3) {
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
            Word Search
          </h2>
          <div className="w-10" />
        </div>
        <div className="text-center py-12 max-w-xs mx-auto space-y-3">
          <span className="text-4xl">🔍</span>
          <h3 className="font-bold text-lg text-[var(--text-primary)]">
            At least 3 words needed
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Add words with 3 to 7 letters to generate an interactive word search puzzle!
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

  const checkAndSubmitWord = (cellsToCheck: { r: number; c: number }[]) => {
    if (!board || cellsToCheck.length === 0) return false;
    const matched = checkPathSelection(cellsToCheck, board.grid, board.words);

    if (matched) {
      const wordStr = matched.word;
      if (!foundWords.includes(wordStr)) {
        setFoundWords((prev) => [...prev, wordStr]);
        const points = wordStr.length * 10;
        setScore((s) => s + points);
        onShowToast(`Great! Found "${wordStr}" (+${points} pts) 🎉`);
        setSelectedCells([]);
        setStartCell(null);
        return true;
      }
    }
    return false;
  };

  const handlePointerDown = (r: number, c: number, e: React.PointerEvent) => {
    e.preventDefault();
    setIsPointerDown(true);
    setHasMoved(false);

    setSelectedCells((prev) => {
      if (prev.length === 0) {
        setStartCell({ r, c });
        return [{ r, c }];
      }

      // Check if tapping last cell (deselect)
      const last = prev[prev.length - 1];
      if (last.r === r && last.c === c) {
        const next = prev.slice(0, -1);
        if (next.length === 0) setStartCell(null);
        return next;
      }

      // Check if already in selection
      const existsIndex = prev.findIndex((cell) => cell.r === r && cell.c === c);
      if (existsIndex !== -1) {
        return prev.slice(0, existsIndex + 1);
      }

      // If tapping next adjacent cell in same direction
      const dr = r - last.r;
      const dc = c - last.c;
      const isAdjacent = Math.abs(dr) <= 1 && Math.abs(dc) <= 1 && !(dr === 0 && dc === 0);

      if (isAdjacent) {
        if (prev.length >= 2) {
          const prevDr = last.r - prev[prev.length - 2].r;
          const prevDc = last.c - prev[prev.length - 2].c;
          if (dr === prevDr && dc === prevDc) {
            const next = [...prev, { r, c }];
            setTimeout(() => checkAndSubmitWord(next), 0);
            return next;
          }
        } else {
          const next = [...prev, { r, c }];
          setTimeout(() => checkAndSubmitWord(next), 0);
          return next;
        }
      }

      // Start new selection if not contiguous
      setStartCell({ r, c });
      return [{ r, c }];
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown || !startCell || !gridRef.current) return;
    setHasMoved(true);

    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cellWidth = rect.width / 7;
    const cellHeight = rect.height / 7;

    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);

    if (row >= 0 && row < 7 && col >= 0 && col < 7) {
      const line = getLineCells(startCell, { r: row, c: col });
      setSelectedCells(line);
    }
  };

  const handlePointerUp = () => {
    if (!isPointerDown) return;
    setIsPointerDown(false);

    if (hasMoved && selectedCells.length > 1) {
      const matched = checkAndSubmitWord(selectedCells);
      if (!matched) {
        setTimeout(() => {
          setSelectedCells([]);
          setStartCell(null);
        }, 300);
      }
    } else if (!hasMoved && selectedCells.length > 0) {
      checkAndSubmitWord(selectedCells);
    }
  };

  const isCellSelected = (r: number, c: number) => {
    return selectedCells.some((cell) => cell.r === r && cell.c === c);
  };

  const isCellInFoundWord = (r: number, c: number) => {
    if (!board) return false;
    return board.words.some((pw) => {
      if (!foundWords.includes(pw.word)) return false;
      const line = getLineCells({ r: pw.startR, c: pw.startC }, { r: pw.endR, c: pw.endC });
      return line.some((cell) => cell.r === r && cell.c === c);
    });
  };

  const isAllFound = board && foundWords.length === board.words.length;

  const currentFormedWord = selectedCells
    .map((cell) => board?.grid[cell.r]?.[cell.c] || '')
    .join('');

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
            Word Search
          </h2>
          <span className="text-[10px] text-[var(--text-muted)] font-medium">
            Found {foundWords.length} of {board?.words.length || 0}
          </span>
        </div>

        <button
          onClick={initGame}
          className="w-7 h-7 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] active:scale-95 cursor-pointer"
          title="New puzzle"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Target Words Bar */}
      <div className="py-1 shrink-0">
        <div className="flex flex-wrap items-center justify-center gap-1">
          {board?.words.map((item) => {
            const isFound = foundWords.includes(item.word);
            return (
              <span
                key={item.word}
                className={`text-[10px] px-2 py-0.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
                  isFound
                    ? 'bg-emerald-100 text-emerald-800 line-through dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                    : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] shadow-2xs'
                }`}
              >
                {isFound && <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />}
                <span>{item.word}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Real-time word swiping preview banner */}
      <div className="h-7 flex items-center justify-center shrink-0">
        {currentFormedWord ? (
          <div className="flex items-center gap-1 bg-[var(--accent-blue)] text-white px-3 py-0.5 rounded-full shadow-sm font-mono font-black text-xs tracking-widest animate-scale-up">
            <span>{currentFormedWord.split('').join(' ')}</span>
            <span className="text-[9px] opacity-80 font-sans">({currentFormedWord.length} letters)</span>
          </div>
        ) : (
          <span className="text-[10px] text-[var(--text-muted)] font-medium">
            Tap letters in sequence or swipe across the grid
          </span>
        )}
      </div>

      {/* 7x7 Grid */}
      <div className="flex-1 flex items-center justify-center py-0.5 min-h-0">
        {board && (
          <div
            ref={gridRef}
            onPointerMove={handlePointerMove}
            className="grid grid-cols-7 gap-0.5 p-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xs w-full max-w-[240px] aspect-square touch-none select-none"
            style={{ touchAction: 'none' }}
          >
            {board.grid.map((row, r) =>
              row.map((letter, c) => {
                const selected = isCellSelected(r, c);
                const isFound = isCellInFoundWord(r, c);

                let cellBg = 'bg-[var(--bg-card-subtle)] text-[var(--text-primary)] border border-transparent';
                if (selected) {
                  cellBg =
                    'bg-[var(--accent-blue)] text-white shadow-xs ring-2 ring-blue-300 scale-105 font-black z-10';
                } else if (isFound) {
                  cellBg =
                    'bg-emerald-500 text-white font-black shadow-2xs dark:bg-emerald-600';
                }

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    data-r={r}
                    data-c={c}
                    onPointerDown={(e) => handlePointerDown(r, c, e)}
                    className={`rounded-md flex items-center justify-center font-mono font-black text-xs transition-all select-none active:scale-95 cursor-pointer ${cellBg}`}
                  >
                    {letter}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Footer / Status */}
      <div className="shrink-0 pt-1 text-center">
        {isAllFound ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Brilliant! Found all words (+{score} pts)</span>
            </div>
            <button
              onClick={initGame}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-xs active:scale-95 cursor-pointer"
            >
              Next Grid
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs px-2 text-[var(--text-secondary)] font-bold">
            <span>Score: {score}</span>
            <span className="text-[10px] text-[var(--text-muted)]">
              {selectedCells.length > 0
                ? `${selectedCells.length} letters selected`
                : 'Swipe or tap letters in order'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
