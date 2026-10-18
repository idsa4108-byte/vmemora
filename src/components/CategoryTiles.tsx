import React from 'react';
import { CATEGORIES, CategoryId, WordItem } from '../types/index.ts';

interface CategoryTilesProps {
  words: WordItem[];
  selectedFilter: string; // 'all' | 'important' | CategoryId
  onSelectFilter: (filter: string) => void;
  onOpenGames: () => void;
}

export const CategoryTiles: React.FC<CategoryTilesProps> = ({
  words,
  selectedFilter,
  onSelectFilter,
  onOpenGames,
}) => {
  // Compute counts
  const totalCount = words.length;
  const importantCount = words.filter((w) => w.isImportant).length;

  // Categories in use
  const categoryCounts = words.reduce<Record<string, number>>((acc, w) => {
    acc[w.category] = (acc[w.category] || 0) + 1;
    return acc;
  }, {});

  const categoriesInUse = CATEGORIES.filter((c) => (categoryCounts[c.id] || 0) > 0);

  return (
    <div className="shrink-0 w-full max-w-full overflow-x-auto no-scrollbar py-1 px-3">
      <div className="flex items-center gap-1.5 w-max">
        {/* All Words Tile */}
        <button
          onClick={() => onSelectFilter('all')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-all active:scale-95 shadow-xs text-xs font-semibold ${
            selectedFilter === 'all'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-sm ring-1 ring-blue-300'
              : 'bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-color)] hover:border-[var(--accent-blue)]'
          }`}
        >
          <span className="text-sm">📚</span>
          <span>All Words</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              selectedFilter === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-[var(--bg-card-subtle)] text-[var(--text-secondary)]'
            }`}
          >
            {totalCount}
          </span>
        </button>

        {/* Categories In Use Tiles */}
        {categoriesInUse.map((cat) => {
          const count = categoryCounts[cat.id] || 0;
          const isSelected = selectedFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectFilter(cat.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-all active:scale-95 shadow-xs text-xs font-semibold ${
                isSelected
                  ? 'border-transparent shadow-sm ring-1 ring-blue-400'
                  : 'border-[var(--border-color)] hover:border-slate-400'
              }`}
              style={{
                backgroundColor: isSelected ? cat.colorHex : undefined,
                color: isSelected ? '#ffffff' : undefined,
              }}
            >
              {!isSelected && (
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.colorHex }}
                />
              )}
              <span className="text-sm">{cat.emoji}</span>
              <span className={isSelected ? 'text-white' : 'text-[var(--text-primary)]'}>
                {cat.labelEn}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected
                    ? 'bg-white/25 text-white'
                    : 'bg-[var(--bg-card-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}

        {/* Important Words Tile (Red) */}
        <button
          onClick={() => onSelectFilter('important')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-all active:scale-95 shadow-xs text-xs font-semibold ${
            selectedFilter === 'important'
              ? 'bg-rose-600 text-white border-rose-600 shadow-sm ring-1 ring-rose-300'
              : 'bg-rose-50 text-rose-800 border-rose-200 hover:border-rose-400 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-800'
          }`}
        >
          <span className="text-sm">❤️</span>
          <span>Important</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              selectedFilter === 'important'
                ? 'bg-white/25 text-white'
                : 'bg-rose-200/60 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
            }`}
          >
            {importantCount}
          </span>
        </button>

        {/* Games Tile (Purple) */}
        <button
          onClick={onOpenGames}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-purple-200 bg-purple-50 text-purple-800 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-200 dark:border-purple-800 transition-all active:scale-95 shadow-xs text-xs font-semibold"
        >
          <span className="text-sm">🎮</span>
          <span>Games</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-purple-200/70 text-purple-900 dark:bg-purple-900 dark:text-purple-100">
            4
          </span>
        </button>
      </div>
    </div>
  );
};
