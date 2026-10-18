import React, { useState, forwardRef } from 'react';
import { Edit3, Plus, Loader2 } from 'lucide-react';

interface InputCardProps {
  onAddWord: (word: string) => Promise<void>;
  isLoading: boolean;
  targetLangName: string;
}

export const InputCard = forwardRef<HTMLInputElement, InputCardProps>(
  ({ onAddWord, isLoading, targetLangName }, ref) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (!trimmed || isLoading) return;
      await onAddWord(trimmed);
      setInputValue('');
    };

    return (
      <div className="shrink-0 px-3 py-1">
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-1.5 shadow-[var(--shadow-sm)] flex items-center gap-1.5 transition-all focus-within:ring-2 focus-within:ring-[var(--accent-blue)] focus-within:border-transparent overflow-hidden"
        >
          {/* Pencil Icon */}
          <div className="w-8 h-8 rounded-xl bg-[var(--accent-blue-light)] flex items-center justify-center text-[var(--accent-blue)] shrink-0">
            <Edit3 className="w-4 h-4" />
          </div>

          {/* Word Input */}
          <input
            ref={ref}
            type="text"
            dir="ltr"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder={`Type a new word to analyze (${targetLangName})...`}
            aria-label="Type a new word"
            className="flex-1 min-w-0 bg-transparent border-0 outline-none px-2 text-xs sm:text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />

          {/* Blue + Add Button */}
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="h-8 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-1 shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Looking up...</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </form>
      </div>
    );
  }
);

InputCard.displayName = 'InputCard';
