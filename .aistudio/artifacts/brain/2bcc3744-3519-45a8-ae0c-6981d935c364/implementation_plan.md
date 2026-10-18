# Vmemora - Brand Identity, English Localization & Voice System

Transform the application into **Vmemora**, featuring a modern blue and purple monogram logo, full English localization across all interfaces, vocabulary packs, and games, and a crystal-clear American English voice audio engine.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following key decisions have been aligned based on user preferences and will govern the build upon approval:

- **Confirmed Decision 1 (Logo & Branding)**: Modern abstract monogram combining a sleek "V" with flowing memory waves rendered in an electric royal blue and vivid violet-purple gradient palette.
- **Confirmed Decision 2 (Language Unification)**: Fully English interface across all views (Vocabulary Explorer, Daily Review Flashcards, Practice Games, Progress Stats, Category Sheet, and metadata) with English word entries and English definitions.
- **Confirmed Decision 3 (Voice Engine)**: Natural American English (`en-US`) voice synthesizer with optimal speech rate (0.95x) and pronunciation clarity across word cards, practice games, and definitions.

---

### 1. Overview & Core Concept

- **What It Does**: Vmemora is an interactive vocabulary acquisition and cognitive memory retention platform. Users explore rich English vocabulary cards with phonetic guides, parts of speech, and illustrative sentences; practice through four mobile-optimized games (Word Search, Letter Scramble / Anagrams, Crossword Puzzles, and Word Builder / Scrabble); and test recall with spaced-repetition flashcards.
- **Target Audience / Persona**: Language learners, students, and professionals seeking an intuitive, distraction-free English vocabulary mastery system tailored for handheld mobile devices and desktop screens alike.
- **Key Value**: Frictionless, scroll-free mobile-first gameplay combined with authentic American English pronunciation, empowering rapid vocabulary expansion and retention.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Brand Immersion*: User opens Vmemora to find the vibrant blue/purple memory-wave logo, a clean top bar with dark/light mode toggle, and category navigation.
  2. *Explore & Pronounce*: User views vocabulary items, taps the speaker button to hear instant, natural American English pronunciation, or adds custom words.
  3. *Zero-Scroll Games*: User launches any of the four games (Crossword, Word Search, Anagram, Scrabble) and experiences responsive letter inputs, auto-advancing cursors, and sequential drag highlights that fit entirely in the viewport.
  4. *Spaced Repetition Review*: Flip interactive flashcards with audio reinforcement and track mastery metrics.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Modern cognitive-tech aesthetic. Clean, crisp surfaces with subtle neural and wave accents; anti-slop typography and zero-pill discipline.
  - *Color Palette & Mood*:
    - Neutral Canvas (60%): Soft pearl off-white (`#F8FAFC`) in light mode; deep slate navy (`#0B0F19`) in dark mode.
    - Structural Surfaces (30%): Pure white (`#FFFFFF`) / dark slate card surfaces (`#131B2E`) with subtle hairline borders (`#E2E8F0` / `#1E293B`).
    - Accent Budget (10%): Electric Blue (`#3B82F6` / `#2563EB`) and Royal Purple (`#8B5CF6` / `#7C3AED`) gradients for active states, CTA buttons, and brand emblems.
  - *Typography & Hierarchy*:
    - Display / Headings: `Plus Jakarta Sans` / `Inter`, semibold to bold (20px–28px) with balanced line wraps.
    - Body Prose: Neutral high-legibility sans-serif (14px–15px, 1.5 line height).
    - Monospace & Metrics: `tabular-nums` for timers, puzzle indices, and score counters.
  - *Component Styling & Layout*:
    - Strict 44px+ touch targets on all interactive tiles and buttons.
    - Unboxed metadata (e.g. `Noun · Travel · 4 Examples`) separated by clean middots rather than clunky pill enclosures.
    - 15% sticky cap adherence for unobstructed viewports on mobile devices.

- **Interactive Feedback & Motion**:
  - Smooth compositor transforms ($\le 200\text{ms}$) on button taps and card flips.
  - Immediate audio chime on correct game submissions and verbal pronunciation when tapping any word speaker button.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: High-Fidelity SVG Monogram + Asset Generation**
  - *Chosen Approach*: Implement a crisp, responsive SVG vector component for the Vmemora logo (ensuring zero blur at any scale and dynamic theme styling) alongside an AI-generated high-resolution logo artwork asset for hero and splash displays.
  - *Why*: SVG guarantees instant rendering without network latency or pixelation on retina screens, while the generated asset provides rich branding depth.
- **Decision 2: Comprehensive English Vocabulary Architecture**
  - *Chosen Approach*: Replace all legacy Arabic category headers, game instructions, empty states, and mock vocabulary entries with rich, engaging English words (e.g., *Resilience*, *Serendipity*, *Ephemeral*, *Lucid*, *Eloquent*, *Catalyst*, *Ingenuity*), while providing intuitive English definitions and contextual example sentences.
  - *Why*: Matches the user's explicit mandate for English as the primary language across all features.
- **Decision 3: Dedicated American English Web Speech Synthesis Engine**
  - *Chosen Approach*: Standardize `speakWord()` to query and lock into the highest-fidelity `en-US` natural voice available on the host platform (e.g., Google US English, Samantha, Natural US) with fallback to standard `en-US`, keeping rate at 0.95x for clear educational articulation.
  - *Why*: Eliminates accidental language mismatches and delivers consistent, audible voice quality across mobile and desktop browsers.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                              Vmemora App                               │
├────────────────────────────────────────────────────────────────────────┤
│  Top Navigation: Vmemora Logo (Blue/Purple) · Theme Toggle · Category  │
├────────────────────────────────────────────────────────────────────────┤
│  Segmented Navigation Tabs:                                            │
│    [ Vocabulary ]      [ Practice Games ]      [ Review ]    [ Stats ] │
├────────────────────────────────────────────────────────────────────────┤
│  Active Screen Container (Viewport-Constrained, No Mobile Scroll):     │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Practice Tab:                                                   │  │
│  │   ├─ Word Search (Drag & Sequential Letter Selection)            │  │
│  │   ├─ Crossword Puzzle (Instant Cursor Auto-Advance)              │  │
│  │   ├─ Anagram Scramble (Keyboard & Tile Swap Engine)              │  │
│  │   └─ Scrabble Builder (Letter Rack & Word Validation)            │  │
│  └──────────────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────────┤
│  Core Utilities & State Stores:                                        │
│   ├─ storage.ts: English Vocabulary Seed Data & Local Persistence       │
│   ├─ speech.ts: American English Natural Web Speech API Synthesizer    │
│   └─ gameLogic.ts: Word Grid Generators & Crossword Direction Solvers  │
└────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & Entities**:
  - `WordItem`: ID, English word, phonetic guide, category identifier, part of speech, English definition, and contextual example sentences.
  - `CategoryInfo`: Identifier, English label, color tokens, and theme styles.
  - `GameSession`: High scores, completed words, and current puzzle state.
- **Component & State Flow**:
  - *Header*: Renders the new `VmemoraLogo` component with blue-to-purple gradient monogram, category drawer trigger, and theme switcher.
  - *App State*: Active tab, category filter, search query, and word inventory stored in reactive state and synchronized to `localStorage`.
  - *Audio Integration*: Every word card, puzzle hint, and flashcard triggers `speakWord(term, 'en-US')` on interaction.
