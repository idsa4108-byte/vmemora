import React, { useState, useRef, useEffect } from 'react';
import { Menu, Sun, Moon, ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../types/index.ts';
import { VmemoraLogo } from './VmemoraLogo.tsx';

interface HeaderProps {
  currentTheme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenCategories: () => void;
  targetLang: string;
  onChangeTargetLang: (lang: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTheme,
  onToggleTheme,
  onOpenCategories,
  targetLang,
  onChangeTargetLang,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLang =
    SUPPORTED_LANGUAGES.find((l) => l.nameEn.toLowerCase() === targetLang.toLowerCase()) ||
    SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="shrink-0 bg-[var(--bg-card)] border-b border-[var(--border-color)] px-3 py-1.5 shadow-[var(--shadow-sm)] transition-colors">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
        {/* Hamburger Menu & Vmemora Brand with Blue & Purple Logo */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCategories}
            aria-label="Open categories menu"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent-blue-light)] hover:text-[var(--accent-blue)] active:scale-95 transition-all shrink-0"
          >
            <Menu className="w-4 h-4" />
          </button>

          <VmemoraLogo size={32} showWordmark={true} />
        </div>

        {/* Theme Toggle & Language Dropdown */}
        <div className="flex items-center gap-1.5">
          {/* Target Language Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="h-8 px-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card-subtle)] hover:bg-[var(--accent-blue-light)] text-[var(--text-primary)] text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
              aria-label="Change learning language"
              aria-expanded={langDropdownOpen}
            >
              <span className="text-sm">{selectedLang.flag}</span>
              <span className="text-[11px] font-bold">{selectedLang.nameEn}</span>
              <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-1 w-44 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-[var(--shadow-lg)] py-1.5 z-50 animate-fade-in">
                <div className="px-2.5 py-1 text-[10px] font-bold text-[var(--text-muted)] border-b border-[var(--border-color)] mb-1 uppercase tracking-wider">
                  Pronunciation Accent
                </div>
                {SUPPORTED_LANGUAGES.map((lang: SupportedLanguage) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onChangeTargetLang(lang.nameEn);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full px-2.5 py-1.5 text-left text-xs font-semibold flex items-center justify-between hover:bg-[var(--accent-blue-light)] transition-colors ${
                      lang.nameEn.toLowerCase() === targetLang.toLowerCase()
                        ? 'text-[var(--accent-blue)] font-bold bg-[var(--accent-blue-light)]'
                        : 'text-[var(--text-primary)]'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="text-sm">{lang.flag}</span>
                      <span>{lang.nameEn}</span>
                    </span>
                    <span className="text-[9px] text-[var(--text-muted)] font-mono">
                      {lang.code.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label={currentTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            className="w-8 h-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] hover:text-[var(--accent-blue)] hover:bg-[var(--accent-blue-light)] flex items-center justify-center transition-all active:scale-95 shadow-xs"
          >
            {currentTheme === 'light' ? (
              <Moon className="w-3.5 h-3.5 text-slate-700" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
