import React, { useState } from 'react';
import { Volume2, MoreVertical, Heart, CheckCircle2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { WordItem, CATEGORIES } from '../types/index.ts';
import { speakWord } from '../utils/speech.ts';

interface WordsTabProps {
  words: WordItem[];
  selectedFilter: string;
  onToggleLearned: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onDeleteWord: (id: string) => void;
  onShowToast: (message: string, actionUrl?: string) => void;
}

export const WordsTab: React.FC<WordsTabProps> = ({
  words,
  selectedFilter,
  onToggleLearned,
  onToggleImportant,
  onDeleteWord,
  onShowToast,
}) => {
  const [expandedWordIds, setExpandedWordIds] = useState<Set<string>>(new Set());
  const [activeMenuWord, setActiveMenuWord] = useState<WordItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter words
  const filteredWords = words.filter((w) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'important') return w.isImportant;
    return w.category === selectedFilter;
  });

  const toggleExpand = (id: string) => {
    setExpandedWordIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handlePlayAudio = (e: React.MouseEvent, text: string, langName: string) => {
    e.stopPropagation();
    speakWord(text, langName, (url) => {
      onShowToast('Audio playback unsupported, click here to open Google Translate', url);
    });
  };

  const handleDeleteClick = (wordId: string) => {
    if (deleteConfirmId === wordId) {
      onDeleteWord(wordId);
      setDeleteConfirmId(null);
      setActiveMenuWord(null);
      onShowToast('Word deleted successfully');
    } else {
      setDeleteConfirmId(wordId);
    }
  };

  const getPosBadgeColor = (pos: string) => {
    const lower = pos.toLowerCase();
    if (lower.includes('noun') || pos.includes('اسم')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
    }
    if (lower.includes('verb') || pos.includes('فعل')) {
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200';
    }
    if (lower.includes('adj') || pos.includes('صفة')) {
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200';
    }
    if (lower.includes('adv') || pos.includes('ظرف')) {
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200';
    }
    return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
  };

  if (filteredWords.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <div className="w-16 h-16 rounded-3xl bg-[var(--accent-blue-light)] text-[var(--accent-blue)] mx-auto flex items-center justify-center text-3xl mb-3 shadow-inner">
          ✨
        </div>
        <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
          No words found here yet
        </h3>
        <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
          Type a word in the search box above and tap "+ Add" to look it up, pronounce it, and save it immediately!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-3 py-1 space-y-1.5">
      {filteredWords.map((item) => {
        const isExpanded = expandedWordIds.has(item.id);
        const primaryMeaning = item.meanings[0];
        const categoryMeta = CATEGORIES.find((c) => c.id === item.category);

        // Compute row background styling
        let rowClass = 'bg-[var(--bg-card)] border-[var(--border-color)]';
        if (item.isLearned) {
          rowClass = 'bg-[var(--learned-bg)] border-[var(--learned-border)]';
        } else if (item.isImportant) {
          rowClass = 'bg-[var(--important-bg)] border-[var(--important-border)]';
        }

        const meaningDisplay =
          primaryMeaning?.meaning || primaryMeaning?.definition || primaryMeaning?.meaningAr || '';

        return (
          <div
            key={item.id}
            className={`border rounded-2xl transition-all shadow-xs overflow-hidden ${rowClass}`}
          >
            {/* Word Main Row */}
            <div
              onClick={() => toggleExpand(item.id)}
              className="p-2 sm:p-2.5 flex items-center justify-between gap-2 cursor-pointer select-none"
            >
              {/* Left Side: Checkbox, Word, Speaker, Phonetic, POS, English meaning */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {/* Learned Checkbox */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLearned(item.id);
                  }}
                  aria-label={item.isLearned ? 'Mark as unlearned' : 'Mark as learned'}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                    item.isLearned
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                      : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-emerald-400'
                  }`}
                >
                  {item.isLearned && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                {/* Word Information */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-sm sm:text-base text-[var(--text-primary)] tracking-wide">
                      {item.word}
                    </span>

                    {/* Pronunciation Audio Button */}
                    <button
                      type="button"
                      onClick={(e) => handlePlayAudio(e, item.word, item.language || 'English')}
                      aria-label={`Listen to pronunciation of ${item.word}`}
                      className="w-6 h-6 rounded-full bg-[var(--accent-blue-light)] text-[var(--accent-blue)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shrink-0 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>

                    {/* IPA Phonetic */}
                    {item.phonetic && (
                      <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-card-subtle)] px-1 py-0.2 rounded">
                        {item.phonetic}
                      </span>
                    )}

                    {/* Part of Speech Badge */}
                    {primaryMeaning && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${getPosBadgeColor(
                          primaryMeaning.partOfSpeechEn || primaryMeaning.partOfSpeech
                        )}`}
                      >
                        {primaryMeaning.partOfSpeechEn || primaryMeaning.partOfSpeech}
                      </span>
                    )}
                  </div>

                  {/* Primary Meaning Summary */}
                  {meaningDisplay && (
                    <p className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5 truncate">
                      {meaningDisplay}
                    </p>
                  )}
                </div>
              </div>

              {/* Right side: Category Emoji, Expand Chevron, Menu Button */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Important Heart Indicator */}
                {item.isImportant && (
                  <span className="text-rose-500 text-xs">❤️</span>
                )}

                {/* Rounded square with emoji */}
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-base shadow-xs"
                  style={{
                    backgroundColor: categoryMeta ? categoryMeta.pastelBg : '#e2e8f0',
                  }}
                  title={categoryMeta?.labelEn}
                >
                  {item.emoji || categoryMeta?.emoji || '📖'}
                </div>

                {/* Expand Chevron */}
                <div className="text-[var(--text-muted)] hidden sm:block">
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Vertical 3 dots Menu Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirmId(null);
                    setActiveMenuWord(item);
                  }}
                  aria-label="Word options"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-blue-light)] active:scale-90 transition-all cursor-pointer"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Expanded Meanings & Examples */}
            {isExpanded && (
              <div className="px-4 pb-4 pt-1 border-t border-[var(--border-color)]/60 bg-[var(--bg-card-subtle)]/40 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)] pt-1">
                  <span>Meanings & Examples ({item.meanings.length}):</span>
                  {categoryMeta && (
                    <span className="flex items-center gap-1 font-semibold text-[var(--text-secondary)]">
                      <span>Category:</span>
                      <span>{categoryMeta.emoji}</span>
                      <span>{categoryMeta.labelEn}</span>
                    </span>
                  )}
                </div>

                {item.meanings.map((meaning, mIdx) => (
                  <div
                    key={mIdx}
                    className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-3 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${getPosBadgeColor(
                            meaning.partOfSpeechEn || meaning.partOfSpeech
                          )}`}
                        >
                          {meaning.partOfSpeechEn || meaning.partOfSpeech}
                        </span>
                        <span className="font-bold text-sm text-[var(--text-primary)]">
                          {meaning.meaning || meaning.meaningAr || meaning.definition}
                        </span>
                      </div>
                    </div>

                    {/* Simple Definition */}
                    {meaning.definition && (
                      <p className="text-xs font-medium text-[var(--text-secondary)] italic bg-[var(--bg-card-subtle)] p-2 rounded-xl">
                        💡 {meaning.definition}
                      </p>
                    )}

                    {/* Example Sentences */}
                    {meaning.examples && meaning.examples.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <span className="text-[11px] font-bold text-[var(--text-muted)] block">
                          Practical Examples:
                        </span>
                        {meaning.examples.map((ex, exIdx) => (
                          <div
                            key={exIdx}
                            className="bg-[var(--bg-card-subtle)] border border-[var(--border-color)]/50 rounded-xl p-2.5 text-xs space-y-1"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-[var(--text-primary)] flex-1 leading-relaxed">
                                {ex.example}
                              </p>
                              <button
                                type="button"
                                onClick={(e) =>
                                  handlePlayAudio(e, ex.example, item.language || 'English')
                                }
                                aria-label="Listen to sentence"
                                className="w-6 h-6 rounded-full bg-[var(--accent-blue-light)] text-[var(--accent-blue)] flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                            </div>
                            {(ex.translation || ex.translationAr) && (
                              <p className="text-[var(--text-secondary)] font-semibold text-[11px] leading-relaxed">
                                {ex.translation || ex.translationAr}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Word Options Bottom Sheet */}
      {activeMenuWord && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs animate-fade-in">
          <div
            className="w-full max-w-md bg-[var(--bg-card)] rounded-t-3xl border-t border-[var(--border-color)] p-5 shadow-2xl animate-slide-up space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 rounded-full bg-[var(--border-color)] mx-auto mb-2" />

            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeMenuWord.emoji || '📖'}</span>
                <div>
                  <h4 className="font-bold text-lg text-[var(--text-primary)]">
                    {activeMenuWord.word}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] font-medium">
                    {activeMenuWord.meanings[0]?.meaning || activeMenuWord.meanings[0]?.definition}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveMenuWord(null);
                  setDeleteConfirmId(null);
                }}
                className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Menu Actions */}
            <div className="space-y-2">
              {/* Toggle Important */}
              <button
                onClick={() => {
                  onToggleImportant(activeMenuWord.id);
                  setActiveMenuWord(null);
                }}
                className="w-full py-3 px-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card-subtle)] hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-between text-sm font-bold text-[var(--text-primary)] active:scale-98 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Heart
                    className={`w-5 h-5 ${
                      activeMenuWord.isImportant
                        ? 'fill-rose-500 text-rose-500'
                        : 'text-[var(--text-muted)]'
                    }`}
                  />
                  <span>
                    {activeMenuWord.isImportant
                      ? 'Remove from Important'
                      : 'Mark as Important Word'}
                  </span>
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {activeMenuWord.isImportant ? 'Starred ❤️' : 'Standard'}
                </span>
              </button>

              {/* Toggle Learned */}
              <button
                onClick={() => {
                  onToggleLearned(activeMenuWord.id);
                  setActiveMenuWord(null);
                }}
                className="w-full py-3 px-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card-subtle)] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center justify-between text-sm font-bold text-[var(--text-primary)] active:scale-98 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2
                    className={`w-5 h-5 ${
                      activeMenuWord.isLearned
                        ? 'text-emerald-600 fill-emerald-100 dark:fill-emerald-950'
                        : 'text-[var(--text-muted)]'
                    }`}
                  />
                  <span>
                    {activeMenuWord.isLearned
                      ? 'Mark as Unlearned'
                      : 'Mark as Mastered Word'}
                  </span>
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {activeMenuWord.isLearned ? 'Mastered ✅' : 'Studying'}
                </span>
              </button>

              {/* Delete Word with 2-tap confirmation */}
              <button
                onClick={() => handleDeleteClick(activeMenuWord.id)}
                className={`w-full py-3 px-4 rounded-2xl border flex items-center justify-between text-sm font-bold active:scale-98 transition-all cursor-pointer ${
                  deleteConfirmId === activeMenuWord.id
                    ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                    : 'border-rose-200 bg-rose-50/70 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  <span>
                    {deleteConfirmId === activeMenuWord.id
                      ? 'Are you sure? Tap again to delete permanently'
                      : 'Delete Word'}
                  </span>
                </span>
                <span className="text-xs">
                  {deleteConfirmId === activeMenuWord.id ? 'Confirm' : '2 Taps'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
