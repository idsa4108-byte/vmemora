import React from 'react';
import { BookOpen, Gamepad2, Layers, BarChart3 } from 'lucide-react';

export type TabType = 'words' | 'practice' | 'review' | 'stats';

interface SegmentedTabsProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  reviewCount: number;
}

export const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  activeTab,
  onChangeTab,
  reviewCount,
}) => {
  const tabs = [
    { id: 'words' as TabType, label: 'Words', icon: BookOpen },
    { id: 'practice' as TabType, label: 'Practice', icon: Gamepad2 },
    { id: 'review' as TabType, label: 'Review', icon: Layers, badge: reviewCount },
    { id: 'stats' as TabType, label: 'Stats', icon: BarChart3 },
  ];

  return (
    <div className="shrink-0 px-3 py-1">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-1 shadow-xs flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex-1 py-1.5 px-1 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all relative ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
              {typeof tab.badge === 'number' && tab.badge > 0 && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                    isActive
                      ? 'bg-white/30 text-white'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
