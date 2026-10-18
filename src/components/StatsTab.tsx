import React from 'react';
import { Award, BookOpen, CheckCircle, Heart, TrendingUp } from 'lucide-react';
import { WordItem, CATEGORIES } from '../types/index.ts';

interface StatsTabProps {
  words: WordItem[];
}

export const StatsTab: React.FC<StatsTabProps> = ({ words }) => {
  const totalCount = words.length;
  const learnedCount = words.filter((w) => w.isLearned).length;
  const importantCount = words.filter((w) => w.isImportant).length;

  const masteryPercentage = totalCount > 0 ? Math.round((learnedCount / totalCount) * 100) : 0;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 max-w-lg mx-auto space-y-2 animate-fade-in">
      {/* 3 Main Stat Boxes */}
      <div className="grid grid-cols-3 gap-2">
        {/* Total Words */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-2.5 text-center shadow-xs">
          <div className="w-7 h-7 rounded-xl bg-[var(--accent-blue-light)] text-[var(--accent-blue)] mx-auto flex items-center justify-center mb-1 shadow-xs">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <span className="text-xl font-black text-[var(--text-primary)] block font-mono">
            {totalCount}
          </span>
          <span className="text-[10px] font-bold text-[var(--text-secondary)]">
            Total Words
          </span>
        </div>

        {/* Mastered */}
        <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-2.5 text-center shadow-xs">
          <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center mb-1 shadow-xs">
            <CheckCircle className="w-3.5 h-3.5" />
          </div>
          <span className="text-xl font-black text-emerald-700 dark:text-emerald-300 block font-mono">
            {learnedCount}
          </span>
          <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
            Mastered
          </span>
        </div>

        {/* Important */}
        <div className="bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-2xl p-2.5 text-center shadow-xs">
          <div className="w-7 h-7 rounded-xl bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 mx-auto flex items-center justify-center mb-1 shadow-xs">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          </div>
          <span className="text-xl font-black text-rose-700 dark:text-rose-300 block font-mono">
            {importantCount}
          </span>
          <span className="text-[10px] font-bold text-rose-800 dark:text-rose-300">
            Starred
          </span>
        </div>
      </div>

      {/* Overall Mastery Card */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--text-primary)]">
                Vocabulary Retention Rate
              </h4>
              <p className="text-[11px] text-[var(--text-muted)]">
                {learnedCount} of {totalCount} words mastered
              </p>
            </div>
          </div>
          <span className="text-xl font-black text-[var(--accent-blue)] font-mono">
            {masteryPercentage}%
          </span>
        </div>

        {/* Overall Progress Bar */}
        <div className="w-full h-3.5 rounded-full bg-[var(--border-color)] overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${masteryPercentage}%` }}
          />
        </div>
      </div>

      {/* Category Breakdown Progress Bars */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[var(--accent-blue)]" />
            <span>Progress by Category</span>
          </h4>
          <span className="text-xs text-[var(--text-muted)] font-bold">
            (Mastered / Total)
          </span>
        </div>

        <div className="space-y-3">
          {CATEGORIES.map((cat) => {
            const catWords = words.filter((w) => w.category === cat.id);
            const catTotal = catWords.length;
            const catLearned = catWords.filter((w) => w.isLearned).length;
            const catPercent = catTotal > 0 ? Math.round((catLearned / catTotal) * 100) : 0;

            return (
              <div key={cat.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-[var(--text-primary)]">
                    <span className="text-base">{cat.emoji}</span>
                    <span>{cat.labelEn}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-[var(--text-secondary)]">
                      {catLearned} / {catTotal}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-[var(--accent-blue)] w-8 text-left">
                      {catPercent}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-[var(--border-color)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-400"
                    style={{
                      width: `${catPercent}%`,
                      backgroundColor: cat.colorHex,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
