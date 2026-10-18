import React, { useState } from 'react';
import { Volume2, Check, X, BookmarkCheck } from 'lucide-react';
import { WordItem, CategoryId, CATEGORIES } from '../types/index.ts';
import { speakWord } from '../utils/speech.ts';

interface AddWordSheetProps {
  data: Partial<WordItem> | null;
  onSave: (wordItem: WordItem) => void;
  onClose: () => void;
  targetLangName: string;
  onShowToast: (message: string, actionUrl?: string) => void;
}

export const AddWordSheet: React.FC<AddWordSheetProps> = ({
  data,
  onSave,
  onClose,
  targetLangName,
  onShowToast,
}) => {
  if (!data) return null;

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(
    data.category || 'Study'
  );

  const handlePlayAudio = (text: string) => {
    speakWord(text, targetLangName, (url) => {
      onShowToast('Audio playback unsupported, click here to translate', url);
    });
  };

  const handleSaveWord = () => {
    const newWord: WordItem = {
      id: `word-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      word: data.word || '',
      phonetic: data.phonetic || '',
      emoji: data.emoji || '📖',
      category: selectedCategory,
      meanings: data.meanings || [],
      isLearned: false,
      isImportant: false,
      createdAt: Date.now(),
      language: targetLangName,
    };
    onSave(newWord);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-xl max-h-[85vh] bg-[var(--bg-card)] rounded-t-3xl border-t border-[var(--border-color)] shadow-2xl flex flex-col animate-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle & Top close */}
        <div className="p-4 pb-2 border-b border-[var(--border-color)]/60 flex items-center justify-between">
          <div className="w-12 h-1.5 rounded-full bg-[var(--border-color)] mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
          <span className="text-xs font-bold text-[var(--accent-blue)] bg-[var(--accent-blue-light)] px-2.5 py-1 rounded-full">
            Analyzed by AI Assistant ✨
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Main Word Header Card */}
          <div className="bg-[var(--bg-card-subtle)] border border-[var(--border-color)] rounded-3xl p-4 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-4xl p-2 bg-[var(--bg-card)] rounded-2xl shadow-xs">
                {data.emoji || '📖'}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-wide">
                    {data.word}
                  </h2>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(data.word || '')}
                    aria-label="Listen to word"
                    className="w-8 h-8 rounded-full bg-[var(--accent-blue)] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm shadow-blue-500/30 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                {data.phonetic && (
                  <span className="text-xs font-mono text-[var(--text-muted)] mt-1 block">
                    {data.phonetic}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Category Selector Chips */}
          <div>
            <label className="text-xs font-bold text-[var(--text-secondary)] mb-2 block">
              Suggested Category (tap to switch):
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--accent-blue)] text-white border-[var(--accent-blue)] shadow-xs'
                        : 'bg-[var(--bg-card-subtle)] text-[var(--text-primary)] border-[var(--border-color)] hover:border-slate-400'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.labelEn}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Meanings & Examples List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[var(--text-muted)]">
              Meanings & Usage ({data.meanings?.length || 0}):
            </h3>

            {data.meanings?.map((meaning, idx) => (
              <div
                key={idx}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 shadow-xs space-y-3"
              >
                {/* Part of Speech & Meaning */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--accent-blue-light)] text-[var(--accent-blue)]">
                    {meaning.partOfSpeechEn || meaning.partOfSpeech}
                  </span>
                  <span className="text-sm font-bold text-[var(--text-primary)]">
                    {meaning.meaning || meaning.meaningAr || meaning.definition}
                  </span>
                </div>

                {/* Definition */}
                {meaning.definition && (
                  <p className="text-xs text-[var(--text-secondary)] italic bg-[var(--bg-card-subtle)] p-2.5 rounded-xl leading-relaxed border border-[var(--border-color)]/60">
                    📖 {meaning.definition}
                  </p>
                )}

                {/* Example Sentences */}
                {meaning.examples && meaning.examples.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold text-[var(--text-muted)] block">
                      Context Examples:
                    </span>
                    {meaning.examples.map((ex, exIdx) => (
                      <div
                        key={exIdx}
                        className="bg-[var(--bg-card-subtle)] border border-[var(--border-color)]/60 rounded-xl p-3 text-xs space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-[var(--text-primary)] flex-1 leading-relaxed">
                            {ex.example}
                          </p>
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(ex.example)}
                            aria-label="Listen to example"
                            className="w-6 h-6 rounded-full bg-[var(--accent-blue-light)] text-[var(--accent-blue)] flex items-center justify-center shrink-0 hover:scale-110 active:scale-95 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
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
        </div>

        {/* Action Button: Save Word */}
        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card)]">
          <button
            type="button"
            onClick={handleSaveWord}
            className="w-full h-12 rounded-2xl bg-[var(--accent-blue)] hover:bg-[var(--accent-blue-hover)] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-98 transition-all cursor-pointer"
          >
            <BookmarkCheck className="w-5 h-5" />
            <span>Save Word to Vmemora</span>
          </button>
        </div>
      </div>
    </div>
  );
};
