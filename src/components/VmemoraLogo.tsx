import React from 'react';

interface VmemoraLogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
}

export const VmemoraLogo: React.FC<VmemoraLogoProps> = ({
  className = '',
  size = 32,
  showWordmark = false,
}) => {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-md transition-transform hover:scale-105"
      >
        <defs>
          {/* Blue to Purple Core Gradient */}
          <linearGradient id="vmemora-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="35%" stopColor="#3B82F6" />
            <stop offset="70%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>

          {/* Secondary Shading Gradient */}
          <linearGradient id="vmemora-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          {/* Accent Glow */}
          <linearGradient id="vmemora-glow" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0.8" />
          </linearGradient>

          {/* Background Squircle Gradient */}
          <linearGradient id="vmemora-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E1B4B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <filter id="v-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#4F46E5" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Squircle Icon Container */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="24"
          fill="url(#vmemora-bg)"
          stroke="url(#vmemora-grad-1)"
          strokeWidth="2.5"
        />

        {/* Stylized 'V' Left Stem - Flowing ribbon */}
        <path
          d="M26 28 C26 28 34 26 40 36 L50 68 L40 76 L22 42 C18 34 22 28 26 28 Z"
          fill="url(#vmemora-grad-1)"
          filter="url(#v-shadow)"
        />

        {/* Stylized 'V' Right Stem - Memory Loop & Neural Apex */}
        <path
          d="M74 28 C74 28 66 26 60 36 L50 68 L58 74 L78 40 C82 32 78 28 74 28 Z"
          fill="url(#vmemora-grad-2)"
          filter="url(#v-shadow)"
        />

        {/* Central Interlocking V Crest */}
        <path
          d="M37 38 L50 68 L63 38 C67 30 59 26 53 32 L50 36 L47 32 C41 26 33 30 37 38 Z"
          fill="url(#vmemora-grad-1)"
        />

        {/* Memory Sparkle Synapses in Electric Cyan and Neon Pink */}
        <circle cx="50" cy="24" r="4.5" fill="#38BDF8" className="animate-pulse" />
        <circle cx="28" cy="26" r="3" fill="#60A5FA" />
        <circle cx="72" cy="26" r="3" fill="#C084FC" />
        <circle cx="50" cy="72" r="3.5" fill="#A855F7" />

        {/* Sleek Inner Core Highlight */}
        <path
          d="M44 46 L50 60 L56 46"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.85"
        />
      </svg>

      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent font-sans">
              Vmemora
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-gradient-to-r from-blue-500/15 to-purple-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              AI Vocab
            </span>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] font-medium leading-none">
            Learn · Practice · Remember
          </span>
        </div>
      )}
    </div>
  );
};
