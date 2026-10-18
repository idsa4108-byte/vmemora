import { WordItem } from '../types/index.ts';

const STORAGE_KEY = 'vmemora_saved_words_v2';
const THEME_KEY = 'vmemora_theme_v2';
const LANG_KEY = 'vmemora_target_lang_v2';

export const INITIAL_WORDS: WordItem[] = [
  {
    id: 'seed-resilience',
    word: 'resilience',
    phonetic: '/rɪˈzɪl.jəns/',
    emoji: '🌱',
    category: 'Emotions',
    isLearned: false,
    isImportant: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    language: 'English',
    meanings: [
      {
        partOfSpeech: 'noun',
        partOfSpeechEn: 'noun',
        meaning: 'The ability to recover quickly from difficulties',
        definition: 'The capacity to recover quickly from difficulties; mental toughness and adaptability.',
        examples: [
          {
            example: 'Courage and resilience help us overcome difficult obstacles.',
            translation: 'Courage and inner toughness help us triumph over adversity.',
          },
          {
            example: 'The team showed remarkable resilience during the competition.',
            translation: 'The team rebounded with determination and energy.',
          },
        ],
      },
    ],
  },
  {
    id: 'seed-serendipity',
    word: 'serendipity',
    phonetic: '/ˌser.ənˈdɪp.ə.ti/',
    emoji: '✨',
    category: 'Emotions',
    isLearned: true,
    isImportant: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    language: 'English',
    meanings: [
      {
        partOfSpeech: 'noun',
        partOfSpeechEn: 'noun',
        meaning: 'Finding valuable things unexpectedly by good fortune',
        definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
        examples: [
          {
            example: 'Finding this cozy neighborhood cafe was pure serendipity.',
            translation: 'Stumbling on this wonderful cafe was a delightful stroke of luck.',
          },
          {
            example: 'A stroke of serendipity led to an unexpected scientific discovery.',
            translation: 'A fortunate coincidence inspired the team’s breakthrough.',
          },
        ],
      },
    ],
  },
  {
    id: 'seed-adventure',
    word: 'adventure',
    phonetic: '/ədˈven.tʃər/',
    emoji: '✈️',
    category: 'Travel',
    isLearned: false,
    isImportant: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    language: 'English',
    meanings: [
      {
        partOfSpeech: 'noun',
        partOfSpeechEn: 'noun',
        meaning: 'An unusual and exciting journey or experience',
        definition: 'An exciting, daring, and typically exploratory experience or enterprise.',
        examples: [
          {
            example: 'Traveling across the rugged mountains was an unforgettable adventure.',
            translation: 'The mountain expedition provided thrills and lifelong memories.',
          },
          {
            example: 'She embarked on a grand adventure in a new foreign country.',
            translation: 'She began an exciting journey exploring unfamiliar territories.',
          },
        ],
      },
    ],
  },
  {
    id: 'seed-healthy',
    word: 'healthy',
    phonetic: '/ˈhel.θi/',
    emoji: '🩺',
    category: 'Health',
    isLearned: true,
    isImportant: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 18,
    language: 'English',
    meanings: [
      {
        partOfSpeech: 'adjective',
        partOfSpeechEn: 'adjective',
        meaning: 'Possessing good physical condition and well-being',
        definition: 'In good physical or mental condition; showing vitality and vigour.',
        examples: [
          {
            example: 'A balanced nutrition routine keeps you healthy and energetic.',
            translation: 'Good food choices foster stamina and radiant well-being.',
          },
          {
            example: 'Daily exercise contributes directly to a healthy lifestyle.',
            translation: 'Active movement strengthens long-term bodily health.',
          },
        ],
      },
    ],
  },
  {
    id: 'seed-coffee',
    word: 'coffee',
    phonetic: '/ˈkɒf.i/',
    emoji: '☕',
    category: 'Food',
    isLearned: false,
    isImportant: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    language: 'English',
    meanings: [
      {
        partOfSpeech: 'noun',
        partOfSpeechEn: 'noun',
        meaning: 'A brewed invigorating beverage from roasted beans',
        definition: 'A hot aromatic beverage brewed from roasted and ground coffee beans.',
        examples: [
          {
            example: 'I enjoy a freshly brewed cup of coffee every morning.',
            translation: 'Morning coffee provides a comforting and aromatic start to the day.',
          },
          {
            example: 'They gathered for warm coffee to brainstorm creative ideas.',
            translation: 'They shared warm drinks while generating innovative plans.',
          },
        ],
      },
    ],
  },
  {
    id: 'seed-book',
    word: 'book',
    phonetic: '/bʊk/',
    emoji: '📖',
    category: 'Study',
    isLearned: true,
    isImportant: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 10,
    language: 'English',
    meanings: [
      {
        partOfSpeech: 'noun',
        partOfSpeechEn: 'noun',
        meaning: 'A written or printed literary work of knowledge',
        definition: 'A written work or publication comprising pages with valuable insights or narratives.',
        examples: [
          {
            example: 'Reading an inspiring book expands your perspective on life.',
            translation: 'Thoughtful literature deepens your understanding of the world.',
          },
          {
            example: 'She borrowed an insightful book from the local library.',
            translation: 'She discovered a captivating volume full of wisdom.',
          },
        ],
      },
    ],
  },
  {
    id: 'seed-travel',
    word: 'travel',
    phonetic: '/ˈtræv.əl/',
    emoji: '✈️',
    category: 'Travel',
    isLearned: false,
    isImportant: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 8,
    language: 'English',
    meanings: [
      {
        partOfSpeech: 'verb',
        partOfSpeechEn: 'verb',
        meaning: 'To make a journey and explore distant places',
        definition: 'To journey across regions, discovering cultures and horizons.',
        examples: [
          {
            example: 'I love to travel and explore historical architectural wonders.',
            translation: 'Journeying abroad unveils remarkable civilizations and perspectives.',
          },
          {
            example: 'Travel broadens the mind and enriches empathy.',
            translation: 'Experiencing new environments cultivates profound personal growth.',
          },
        ],
      },
    ],
  },
  {
    id: 'seed-peace',
    word: 'peace',
    phonetic: '/piːs/',
    emoji: '🕊️',
    category: 'Emotions',
    isLearned: false,
    isImportant: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 7,
    language: 'English',
    meanings: [
      {
        partOfSpeech: 'noun',
        partOfSpeechEn: 'noun',
        meaning: 'Inner tranquility and freedom from disturbance',
        definition: 'A state of calmness, harmony, and freedom from hostility or stress.',
        examples: [
          {
            example: 'Mindful meditation brings deep serenity and peace of mind.',
            translation: 'Quiet contemplation cultivates inner stillness and balance.',
          },
          {
            example: 'Communities gathered in solidarity to celebrate enduring peace.',
            translation: 'Neighbors united to preserve peaceful coexistence.',
          },
        ],
      },
    ],
  },
  {
    id: 'seed-curiosity',
    word: 'curiosity',
    phonetic: '/ˌkjʊə.riˈɒs.ə.ti/',
    emoji: '📚',
    category: 'Study',
    isLearned: false,
    isImportant: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
    language: 'English',
    meanings: [
      {
        partOfSpeech: 'noun',
        partOfSpeechEn: 'noun',
        meaning: 'A strong intrinsic desire to learn or investigate',
        definition: 'An eager drive to explore, understand, and unravel the unknown.',
        examples: [
          {
            example: 'Intellectual curiosity is the catalyst for scientific invention.',
            translation: 'A questioning mindset drives progress and innovation.',
          },
          {
            example: 'Her curiosity about astronomy led her to observe distant galaxies.',
            translation: 'Her passion for discovery guided her scientific career.',
          },
        ],
      },
    ],
  },
  {
    id: 'seed-catalyst',
    word: 'catalyst',
    phonetic: '/ˈkæt.əl.ɪst/',
    emoji: '⚡',
    category: 'Technology',
    isLearned: false,
    isImportant: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 4,
    language: 'English',
    meanings: [
      {
        partOfSpeech: 'noun',
        partOfSpeechEn: 'noun',
        meaning: 'An agent that precipitates a rapid positive change',
        definition: 'A person, event, or substance that causes a rapid significant transition.',
        examples: [
          {
            example: 'The new software platform acted as a catalyst for creative collaboration.',
            translation: 'The digital system spurred immediate collective productivity.',
          },
        ],
      },
    ],
  },
  {
    id: 'seed-eloquent',
    word: 'eloquent',
    phonetic: '/ˈel.ə.kwənt/',
    emoji: '💡',
    category: 'Daily Life',
    isLearned: true,
    isImportant: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    language: 'English',
    meanings: [
      {
        partOfSpeech: 'adjective',
        partOfSpeechEn: 'adjective',
        meaning: 'Fluent and persuasive in speech or expression',
        definition: 'Clearly expressing ideas with grace, clarity, and persuasive power.',
        examples: [
          {
            example: 'Her eloquent speech captivated everyone in the auditorium.',
            translation: 'Her articulate delivery moved and inspired the listeners.',
          },
        ],
      },
    ],
  },
];

export function loadSavedWords(): WordItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check legacy key if user had previous data
      const legacyRaw = localStorage.getItem('qamoosi_saved_words_v1');
      if (legacyRaw) {
        try {
          const parsedLegacy = JSON.parse(legacyRaw);
          if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
            saveWords(parsedLegacy);
            return parsedLegacy;
          }
        } catch {
          // ignore
        }
      }
      saveWords(INITIAL_WORDS);
      return INITIAL_WORDS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_WORDS;
  } catch (e) {
    console.error('Error reading localStorage for words:', e);
    return INITIAL_WORDS;
  }
}

export function saveWords(words: WordItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  } catch (e) {
    console.error('Error saving words to localStorage:', e);
  }
}

export function loadTheme(): 'light' | 'dark' {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    return theme === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function saveTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.error('Error saving theme to localStorage:', e);
  }
}

export function loadTargetLanguage(): string {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (!saved || saved.toLowerCase() === 'french' || saved.toLowerCase() === 'fr') {
      localStorage.setItem(LANG_KEY, 'American English');
      return 'American English';
    }
    return saved;
  } catch {
    return 'American English';
  }
}

export function saveTargetLanguage(lang: string): void {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (e) {
    console.error('Error saving language to localStorage:', e);
  }
}
