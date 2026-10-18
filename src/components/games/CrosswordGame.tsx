import React, { useState, useEffect, useRef } from 'react';
import { WordItem } from '../../types/index.ts';
import {
  generateCrossword,
  CrosswordBoard,
  getNextCrosswordCell,
  getPrevCrosswordCell,
} from '../../utils/gameLogic.ts';
import { ArrowLeft, RefreshCw, Check, Eye } from 'lucide-react';

interface CrosswordGameProps {
  words: WordItem[];
  onBack: () => void;
  onShowToast: (message: string) => void;
}

export const CrosswordGame: React.FC<CrosswordGameProps> = ({
  words,
  onBack,
  onShowToast,
}) => {
  const eligible = words
    .filter((w) => {
      const clean = w.word.trim().toUpperCase().replace(/[^A-Z]/g, '');
      return clean.length >= 3 && clean.length <= 7;
    })
    .map((w) => ({
      word: w.word.trim().toUpperCase().replace(/[^A-Z]/g, ''),
      clueAr: w.meanings[0]?.meaning || w.meanings[0]?.definition || w.word,
    }));

  const [board, setBoard] = useState<CrosswordBoard | null>(null);
  const [userInputs, setUserInputs] = useState<string[][]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [checkStatus, setCheckStatus] = useState<'none' | 'correct' | 'has_errors'>('none');
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [typingDirection, setTypingDirection] = useState<'across' | 'down'>('across');

  const inputsRef = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const initGame = () => {
    if (eligible.length < 3) return;
    const shuffled = [...eligible].sort(() => Math.random() - 0.5);
    const newBoard = generateCrossword(shuffled);
    setBoard(newBoard);
    setUserInputs(
      Array.from({ length: newBoard.size }, () =>
        Array.from({ length: newBoard.size }, () => '')
      )
    );
    setIsRevealed(false);
    setCheckStatus('none');
    setSelectedCell(null);
    setTypingDirection('across');
  };

  useEffect(() => {
    initGame();
  }, [words]);

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
            Crossword Puzzle
          </h2>
          <div className="w-10" />
        </div>
        <div className="text-center py-12 max-w-xs mx-auto space-y-3">
          <span className="text-4xl">✏️</span>
          <h3 className="font-bold text-lg text-[var(--text-primary)]">
            At least 3 words needed
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Add words with 3 to 7 letters to build an intersecting crossword puzzle!
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

  const focusCell = (r: number, c: number) => {
    setSelectedCell({ r, c });
    const targetInput = inputsRef.current[`${r}-${c}`];
    if (targetInput) {
      targetInput.focus();
      targetInput.select();
    }
  };

  const advanceToNext = (r: number, c: number, currentDir: 'across' | 'down') => {
    if (!board) return;
    const next = getNextCrosswordCell({ r, c }, currentDir, board.grid, board.size);
    if (next) {
      if (next.nextDir !== typingDirection) {
        setTypingDirection(next.nextDir);
      }
      focusCell(next.r, next.c);
    }
  };

  const handleCellChange = (r: number, c: number, val: string) => {
    if (isRevealed || !board) return;
    const cleanChar = val.slice(-1).toUpperCase().replace(/[^A-Z]/g, '');
    const nextInputs = userInputs.map((rowArr) => [...rowArr]);
    nextInputs[r][c] = cleanChar;
    setUserInputs(nextInputs);
    setCheckStatus('none');

    // Immediate cursor jump to next cell on character input
    if (cleanChar) {
      advanceToNext(r, c, typingDirection);
    }
  };

  const handleKeyDown = (r: number, c: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!board) return;

    if (e.key === 'Backspace') {
      const currentVal = userInputs[r][c];
      if (!currentVal) {
        e.preventDefault();
        const prev = getPrevCrosswordCell({ r, c }, typingDirection, board.grid, board.size);
        if (prev) {
          focusCell(prev.r, prev.c);
          const nextInputs = userInputs.map((rowArr) => [...rowArr]);
          nextInputs[prev.r][prev.c] = '';
          setUserInputs(nextInputs);
        }
      }
      return;
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setTypingDirection('across');
      advanceToNext(r, c, 'across');
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setTypingDirection('across');
      const prev = getPrevCrosswordCell({ r, c }, 'across', board.grid, board.size);
      if (prev) focusCell(prev.r, prev.c);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setTypingDirection('down');
      advanceToNext(r, c, 'down');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setTypingDirection('down');
      const prev = getPrevCrosswordCell({ r, c }, 'down', board.grid, board.size);
      if (prev) focusCell(prev.r, prev.c);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      setTypingDirection((prev) => (prev === 'across' ? 'down' : 'across'));
    }
  };

  const handleSelectClue = (wordStr: string, dir: 'across' | 'down') => {
    if (!board) return;
    setTypingDirection(dir);
    const cluesList = dir === 'across' ? board.cluesAcross : board.cluesDown;
    const foundClue = cluesList.find((c) => c.word === wordStr);
    if (foundClue) {
      focusCell(foundClue.r, foundClue.c);
    }
  };

  const handleCheck = () => {
    if (!board) return;
    let allCorrect = true;
    let hasMistake = false;

    for (let r = 0; r < board.size; r++) {
      for (let c = 0; c < board.size; c++) {
        const cell = board.grid[r][c];
        if (!cell.isBlock) {
          const u = userInputs[r][c];
          if (u !== cell.letter) {
            allCorrect = false;
            if (u !== '') hasMistake = true;
          }
        }
      }
    }

    if (allCorrect) {
      setCheckStatus('correct');
      onShowToast('Brilliant! Crossword completed with 100% accuracy 🎉');
    } else {
      setCheckStatus('has_errors');
      onShowToast(hasMistake ? 'Some letters need correction' : 'Please fill all remaining cells');
    }
  };

  const handleReveal = () => {
    if (!board) return;
    const revealedInputs = board.grid.map((row) =>
      row.map((cell) => (cell.isBlock ? '' : cell.letter))
    );
    setUserInputs(revealedInputs);
    setIsRevealed(true);
    setCheckStatus('correct');
    onShowToast('Crossword solution revealed');
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
            Crossword Puzzle
          </h2>
          <span className="text-[10px] text-[var(--accent-blue)] font-bold">
            Auto-advancing cursor on input ✍️
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

      {/* Crossword Grid */}
      <div className="flex-1 flex items-center justify-center py-0.5 min-h-0">
        {board && (
          <div
            className="grid gap-0.5 p-1 bg-slate-900 rounded-xl shadow-xs w-full max-w-[240px] aspect-square"
            style={{
              gridTemplateColumns: `repeat(${board.size}, minmax(0, 1fr))`,
            }}
          >
            {board.grid.map((row, r) =>
              row.map((cell, c) => {
                if (cell.isBlock) {
                  return (
                    <div
                      key={`${r}-${c}`}
                      className="bg-slate-950 rounded-xs"
                    />
                  );
                }

                const userInput = userInputs[r]?.[c] || '';
                const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                let cellStyle = 'bg-white text-slate-900 border-slate-300';

                if (checkStatus !== 'none' && userInput) {
                  if (userInput === cell.letter) {
                    cellStyle = 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';
                  } else {
                    cellStyle = 'bg-rose-100 text-rose-900 border-rose-400 font-bold';
                  }
                } else if (isSelected) {
                  cellStyle = 'bg-blue-50 text-blue-900 border-blue-500 ring-2 ring-blue-400';
                }

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => focusCell(r, c)}
                    className={`relative rounded-xs border flex items-center justify-center transition-all ${cellStyle}`}
                  >
                    {cell.number && (
                      <span className="absolute top-0.5 left-0.5 text-[8px] font-mono leading-none font-bold text-slate-500 pointer-events-none select-none">
                        {cell.number}
                      </span>
                    )}

                    <input
                      ref={(el) => {
                        inputsRef.current[`${r}-${c}`] = el;
                      }}
                      type="text"
                      inputMode="text"
                      autoCapitalize="characters"
                      value={userInput}
                      onChange={(e) => handleCellChange(r, c, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(r, c, e)}
                      onFocus={() => setSelectedCell({ r, c })}
                      disabled={isRevealed}
                      className="w-full h-full text-center font-mono font-black text-sm bg-transparent border-0 outline-none p-0 cursor-pointer uppercase select-all"
                    />
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Clues Box: Across and Down */}
      <div className="shrink-0 max-h-[105px] overflow-y-auto bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-1.5 shadow-2xs">
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Across Column */}
          <div className="space-y-0.5">
            <span className="font-bold text-[var(--accent-blue)] block border-b border-[var(--border-color)]/60 pb-0.2">
              Across ({typingDirection === 'across' ? 'Active' : ''}):
            </span>
            {board?.cluesAcross.map((clue) => (
              <button
                key={clue.num}
                type="button"
                onClick={() => handleSelectClue(clue.word, 'across')}
                className="w-full text-left flex items-start gap-1 leading-tight text-[10px] p-0.5 rounded-md hover:bg-[var(--accent-blue-light)] transition-all cursor-pointer truncate"
              >
                <span className="font-mono font-bold text-[var(--accent-blue)] shrink-0">
                  {clue.num}.
                </span>
                <span className="text-[var(--text-primary)] font-medium truncate">
                  {clue.clueAr}
                </span>
              </button>
            ))}
          </div>

          {/* Down Column */}
          <div className="space-y-0.5 border-l border-[var(--border-color)]/60 pl-1.5">
            <span className="font-bold text-emerald-600 block border-b border-[var(--border-color)]/60 pb-0.2">
              Down ({typingDirection === 'down' ? 'Active' : ''}):
            </span>
            {board?.cluesDown.map((clue) => (
              <button
                key={clue.num}
                type="button"
                onClick={() => handleSelectClue(clue.word, 'down')}
                className="w-full text-left flex items-start gap-1 leading-tight text-[10px] p-0.5 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all cursor-pointer truncate"
              >
                <span className="font-mono font-bold text-emerald-600 shrink-0">
                  {clue.num}.
                </span>
                <span className="text-[var(--text-primary)] font-medium truncate">
                  {clue.clueAr}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons: Check, Reveal, New grid */}
      <div className="grid grid-cols-3 gap-1.5 shrink-0 pt-1 border-t border-[var(--border-color)]">
        {/* Check */}
        <button
          onClick={handleCheck}
          className="h-8 rounded-lg bg-[var(--accent-blue)] hover:bg-[var(--accent-blue-hover)] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all cursor-pointer"
        >
          <Check className="w-3 h-3" />
          <span>Check</span>
        </button>

        {/* Reveal */}
        <button
          onClick={handleReveal}
          className="h-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] font-bold text-xs flex items-center justify-center gap-1 text-[var(--text-secondary)] active:scale-95 transition-all cursor-pointer"
        >
          <Eye className="w-3 h-3" />
          <span>Reveal</span>
        </button>

        {/* New grid */}
        <button
          onClick={initGame}
          className="h-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] font-bold text-xs flex items-center justify-center gap-1 text-[var(--text-muted)] active:scale-95 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>New Grid</span>
        </button>
      </div>
    </div>
  );
};
