import React, { useState } from 'react';
import { WordItem } from '../types/index.ts';
import { WordSearchGame } from './games/WordSearchGame.tsx';
import { AnagramGame } from './games/AnagramGame.tsx';
import { CrosswordGame } from './games/CrosswordGame.tsx';
import { ScrabbleGame } from './games/ScrabbleGame.tsx';

interface PracticeTabProps {
  words: WordItem[];
  onShowToast: (message: string) => void;
  initialGame?: 'wordsearch' | 'anagram' | 'crossword' | 'scrabble' | null;
  onCloseGame?: () => void;
}

export const PracticeTab: React.FC<PracticeTabProps> = ({
  words,
  onShowToast,
  initialGame = null,
  onCloseGame,
}) => {
  const [activeGame, setActiveGame] = useState<
    'wordsearch' | 'anagram' | 'crossword' | 'scrabble' | null
  >(initialGame);

  const handleClose = () => {
    setActiveGame(null);
    if (onCloseGame) onCloseGame();
  };

  const gamesList = [
    {
      id: 'wordsearch' as const,
      title: 'Word Search',
      subtitle: 'Grid Letter Swipe',
      emoji: '🔍',
      desc: 'Find 4 hidden words in a 7×7 grid by swiping or sequential letter tapping',
      color: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-900',
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'anagram' as const,
      title: 'Anagram',
      subtitle: 'Letter Scramble',
      emoji: '🧩',
      desc: 'Unscramble letters to match the definition and master accurate spelling',
      color: 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-900',
      badgeColor: 'bg-amber-600 text-white',
    },
    {
      id: 'crossword' as const,
      title: 'Crossword',
      subtitle: 'Smart Autofill',
      emoji: '✏️',
      desc: 'Solve intersecting crossword puzzles with instant auto-advancing cursor',
      color: 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-900',
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      id: 'scrabble' as const,
      title: 'Scrabble Points',
      subtitle: 'Rack Builder',
      emoji: '🔠',
      desc: 'Build target words from the rack and calculate points with length bonuses',
      color: 'bg-purple-50 text-purple-900 border-purple-200 dark:bg-purple-950/40 dark:text-purple-200 dark:border-purple-900',
      badgeColor: 'bg-purple-600 text-white',
    },
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-start px-2.5 py-1.5 max-w-lg mx-auto space-y-1.5 overflow-hidden">
      {/* Compact Banner */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl py-1.5 px-2.5 shadow-2xs flex items-center justify-between shrink-0">
        <div>
          <h3 className="font-bold text-xs text-[var(--text-primary)]">
            Interactive Word Games 🎮
          </h3>
          <p className="text-[10px] text-[var(--text-secondary)]">
            Train memory and master English vocabulary with 4 puzzle modes
          </p>
        </div>
        <span className="text-[9px] font-bold font-mono px-2 py-0.2 rounded-full bg-gradient-to-r from-blue-500/15 to-purple-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
          {words.length} words
        </span>
      </div>

      {/* 2x2 Grid (Compact h-24 so it fits fully without scrolling) */}
      <div className="grid grid-cols-2 gap-1.5 shrink-0">
        {gamesList.map((game) => (
          <button
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            className={`border rounded-xl p-2 text-left flex flex-col justify-between h-24 shadow-2xs hover:shadow-xs active:scale-95 transition-all relative overflow-hidden group cursor-pointer ${game.color}`}
          >
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xl p-0.5 rounded-lg bg-white/70 dark:bg-black/30 shadow-2xs">
                  {game.emoji}
                </span>
                <span
                  className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full ${game.badgeColor}`}
                >
                  PLAY
                </span>
              </div>
              <h4 className="font-bold text-xs text-[var(--text-primary)] leading-tight">
                {game.title}
              </h4>
              <span className="text-[8px] text-[var(--text-muted)] font-sans block leading-none">
                {game.subtitle}
              </span>
            </div>

            <p className="text-[9px] text-[var(--text-secondary)] leading-tight line-clamp-1">
              {game.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Active Game Full-screen Overlay */}
      {activeGame === 'wordsearch' && (
        <WordSearchGame words={words} onBack={handleClose} onShowToast={onShowToast} />
      )}
      {activeGame === 'anagram' && (
        <AnagramGame words={words} onBack={handleClose} onShowToast={onShowToast} />
      )}
      {activeGame === 'crossword' && (
        <CrosswordGame words={words} onBack={handleClose} onShowToast={onShowToast} />
      )}
      {activeGame === 'scrabble' && (
        <ScrabbleGame words={words} onBack={handleClose} onShowToast={onShowToast} />
      )}
    </div>
  );
};
