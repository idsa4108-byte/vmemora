import React from 'react';
import { X, Check } from 'lucide-react';
import { CATEGORIES, WordItem, CategoryId } from '../types/index.ts';

interface CategoriesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  words: WordItem[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export const CategoriesSheet: React.FC<CategoriesSheetProps> = ({
  isOpen,
  onClose,
  words,
  selectedCategory,
  onSelectCategory,
}) => {
  if (!isOpen) return null;

  const counts = words.reduce<Record<string, number>>((acc, w) => {
    acc[w.category] = (acc[w.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-md bg-[var(--bg-card)] rounded-t-2xl border-t border-[var(--border-color)] shadow-2xl flex flex-col animate-slide-up overflow-hidden pb-1"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-2 border-b border-[var(--border-color)]/70 flex items-center justify-between">
          <div className="w-8 h-1 rounded-full bg-[var(--border-color)] mx-auto absolute left-1/2 -translate-x-1/2 top-1" />
          <h3 className="font-bold text-xs text-[var(--text-primary)]">
            Word Categories (10)
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-6 h-6 rounded-full bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-center transition-all"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Categories List in Compact 2-Column Grid */}
        <div className="p-2 overflow-hidden">
          {/* All Words item */}
          <button
            onClick={() => {
              onSelectCategory('all');
              onClose();
            }}
            className={`w-full p-1.5 mb-1.5 rounded-lg border flex items-center justify-between transition-all active:scale-98 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-blue-500/15 to-purple-500/15 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'bg-[var(--bg-card-subtle)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-slate-400'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-sm">📚</span>
              <div className="text-left">
                <span className="text-xs font-bold block">All Words</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                {words.length}
              </span>
              {selectedCategory === 'all' && (
                <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              )}
            </div>
          </button>

          {/* 10 Categories in 2 Columns */}
          <div className="grid grid-cols-2 gap-1">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = counts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onClose();
                  }}
                  className={`p-1 px-1.5 rounded-lg border flex items-center justify-between transition-all active:scale-98 ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-500/15 to-purple-500/15 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'bg-[var(--bg-card-subtle)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="text-xs shrink-0">{cat.emoji}</span>
                    <span className="text-[10px] font-bold truncate">{cat.labelEn}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[8px] px-1 py-0.2 rounded-full font-mono font-bold bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                      {count}
                    </span>
                    {isSelected && (
                      <Check className="w-2.5 h-2.5 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
