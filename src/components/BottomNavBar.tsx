import React from 'react';
import { Home, FolderTree, Plus, Gamepad2, User } from 'lucide-react';

interface BottomNavBarProps {
  currentTab: 'home' | 'categories' | 'games' | 'profile';
  onNavigateHome: () => void;
  onOpenCategories: () => void;
  onPlusClick: () => void;
  onOpenGames: () => void;
  onOpenProfile: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onNavigateHome,
  onOpenCategories,
  onPlusClick,
  onOpenGames,
  onOpenProfile,
}) => {
  return (
    <nav
      aria-label="Bottom Navigation"
      className="shrink-0 z-40 bg-[var(--bg-card)] border-t border-[var(--border-color)] px-3 py-1 shadow-[var(--shadow-md)]"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 4px)' }}
    >
      <div className="max-w-md mx-auto flex items-center justify-between relative">
        {/* Home */}
        <button
          onClick={onNavigateHome}
          className={`flex-1 py-0.5 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
            currentTab === 'home'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Categories */}
        <button
          onClick={onOpenCategories}
          className={`flex-1 py-0.5 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
            currentTab === 'categories'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span className="text-[10px]">Categories</span>
        </button>

        {/* Raised Center Circular "+" Button */}
        <div className="flex-1 flex justify-center -mt-4">
          <button
            onClick={onPlusClick}
            aria-label="Add new word"
            className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/30 ring-3 ring-[var(--bg-card)] active:scale-90 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Games */}
        <button
          onClick={onOpenGames}
          className={`flex-1 py-0.5 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
            currentTab === 'games'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span className="text-[10px]">Games</span>
        </button>

        {/* Profile */}
        <button
          onClick={onOpenProfile}
          className={`flex-1 py-0.5 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
            currentTab === 'profile'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-[10px]">Profile</span>
        </button>
      </div>
    </nav>
  );
};
