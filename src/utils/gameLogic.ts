export const SCRABBLE_LETTER_POINTS: Record<string, number> = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8,
  K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1,
  U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10,
};

export function getLetterPoint(letter: string): number {
  const upper = letter.toUpperCase();
  return SCRABBLE_LETTER_POINTS[upper] || 1;
}

export function calculateScrabbleScore(word: string): { baseScore: number; bonus: number; totalScore: number } {
  const cleanWord = word.trim().toUpperCase().replace(/[^A-Z]/g, '');
  let baseScore = 0;
  for (const char of cleanWord) {
    baseScore += getLetterPoint(char);
  }
  const bonus = cleanWord.length >= 6 ? 50 : 0;
  return {
    baseScore,
    bonus,
    totalScore: baseScore + bonus,
  };
}

export interface WordSearchPlacement {
  word: string;
  clueAr: string;
  startR: number;
  startC: number;
  endR: number;
  endC: number;
  found: boolean;
}

export interface WordSearchResult {
  grid: string[][];
  words: WordSearchPlacement[];
}

export function generateWordSearch(
  wordList: { word: string; clueAr: string }[],
  size = 7
): WordSearchResult {
  // Select up to 4 words with 3-7 characters
  const eligible = wordList
    .map(w => ({
      word: w.word.toUpperCase().replace(/[^A-Z]/g, ''),
      clueAr: w.clueAr,
    }))
    .filter(w => w.word.length >= 3 && w.word.length <= size)
    .slice(0, 4);

  // Initialize empty grid
  const grid: string[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => '')
  );

  const directions = [
    { dr: 0, dc: 1 },  // Horizontal right
    { dr: 1, dc: 0 },  // Vertical down
    { dr: 1, dc: 1 },  // Diagonal down-right
  ];

  const placements: WordSearchPlacement[] = [];

  for (const item of eligible) {
    const len = item.word.length;
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      attempts++;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const maxR = dir.dr === 0 ? size : size - len;
      const maxC = dir.dc === 0 ? size : size - len;

      if (maxR <= 0 || maxC <= 0) continue;

      const startR = Math.floor(Math.random() * maxR);
      const startC = Math.floor(Math.random() * maxC);

      // Check if word can fit without conflict
      let canFit = true;
      for (let i = 0; i < len; i++) {
        const r = startR + i * dir.dr;
        const c = startC + i * dir.dc;
        const existing = grid[r][c];
        if (existing !== '' && existing !== item.word[i]) {
          canFit = false;
          break;
        }
      }

      if (canFit) {
        for (let i = 0; i < len; i++) {
          const r = startR + i * dir.dr;
          const c = startC + i * dir.dc;
          grid[r][c] = item.word[i];
        }
        placements.push({
          word: item.word,
          clueAr: item.clueAr,
          startR,
          startC,
          endR: startR + (len - 1) * dir.dr,
          endC: startC + (len - 1) * dir.dc,
          found: false,
        });
        placed = true;
      }
    }
  }

  // Fill empty cells with random letters
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return { grid, words: placements };
}

export function getLineCells(
  start: { r: number; c: number },
  current: { r: number; c: number }
): { r: number; c: number }[] {
  const dr = current.r - start.r;
  const dc = current.c - start.c;
  const distR = Math.abs(dr);
  const distC = Math.abs(dc);

  // Must be straight line: horizontal, vertical, or 45-degree diagonal
  if (!(dr === 0 || dc === 0 || distR === distC)) {
    return [start];
  }

  const stepR = dr === 0 ? 0 : dr / distR;
  const stepC = dc === 0 ? 0 : dc / distC;
  const steps = Math.max(distR, distC);

  const cells: { r: number; c: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    cells.push({
      r: start.r + i * stepR,
      c: start.c + i * stepC,
    });
  }
  return cells;
}

export function checkPathSelection(
  selectedCells: { r: number; c: number }[],
  grid: string[][],
  placements: WordSearchPlacement[]
): WordSearchPlacement | null {
  if (selectedCells.length < 2) return null;

  let formedWord = '';
  for (const cell of selectedCells) {
    if (grid[cell.r] && grid[cell.r][cell.c]) {
      formedWord += grid[cell.r][cell.c];
    }
  }

  const reversed = formedWord.split('').reverse().join('');

  for (const p of placements) {
    if (!p.found && (p.word === formedWord || p.word === reversed)) {
      return p;
    }
  }

  return null;
}

export interface AnagramState {
  word: string;
  definition: string;
  scrambledLetters: { id: number; char: string; used: boolean }[];
  slots: (string | null)[];
  spellingDisplay: string;
}

export function createAnagramRound(word: string, definition: string): AnagramState {
  const cleanWord = word.toUpperCase().replace(/[^A-Z]/g, '');
  const letters = cleanWord.split('');

  // Scramble letters ensuring it's not identical to original (if length > 2)
  let scrambled = [...letters];
  let tries = 0;
  while (tries < 10 && scrambled.join('') === cleanWord && cleanWord.length > 2) {
    scrambled.sort(() => Math.random() - 0.5);
    tries++;
  }

  // Mask the word in the definition with blanks
  const regex = new RegExp(`\\b${word}\\b`, 'gi');
  const maskedDef = definition.replace(regex, '______');

  return {
    word: cleanWord,
    definition: maskedDef,
    scrambledLetters: scrambled.map((char, index) => ({
      id: index,
      char,
      used: false,
    })),
    slots: Array.from({ length: cleanWord.length }, () => null),
    spellingDisplay: cleanWord.split('').join(' - '),
  };
}

export interface CrosswordCell {
  letter: string;
  number?: number;
  isBlock: boolean;
  userLetter: string;
}

export interface CrosswordClue {
  num: number;
  clueAr: string;
  word: string;
  direction: 'across' | 'down';
  r: number;
  c: number;
}

export interface CrosswordBoard {
  size: number;
  grid: CrosswordCell[][];
  cluesAcross: CrosswordClue[];
  cluesDown: CrosswordClue[];
}

export function generateCrossword(
  wordsWithClues: { word: string; clueAr: string }[]
): CrosswordBoard {
  const size = 8;
  const grid: CrosswordCell[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      letter: '',
      isBlock: true,
      userLetter: '',
    }))
  );

  const cluesAcross: CrosswordClue[] = [];
  const cluesDown: CrosswordClue[] = [];

  const eligible = wordsWithClues
    .map(w => ({
      word: w.word.toUpperCase().replace(/[^A-Z]/g, ''),
      clueAr: w.clueAr,
    }))
    .filter(w => w.word.length >= 3 && w.word.length <= 7)
    .slice(0, 6);

  if (eligible.length === 0) {
    return { size, grid, cluesAcross, cluesDown };
  }

  let clueNum = 1;

  // Strategic compact layout for 4-6 words:
  // Place word 0 across at row 1
  // Place word 1 down intersecting word 0
  // Place word 2 across intersecting word 1
  // Place word 3 down intersecting word 2 or 0
  // Place remaining words in available parallel slots
  const placedWords: {
    word: string;
    clueAr: string;
    row: number;
    col: number;
    direction: 'across' | 'down';
    num: number;
  }[] = [];

  // Helper to place
  const tryPlace = (
    w: { word: string; clueAr: string },
    r: number,
    c: number,
    dir: 'across' | 'down'
  ): boolean => {
    const len = w.word.length;
    if (dir === 'across') {
      if (r < 0 || r >= size || c < 0 || c + len > size) return false;
      for (let i = 0; i < len; i++) {
        const cell = grid[r][c + i];
        if (!cell.isBlock && cell.letter !== w.word[i]) return false;
      }
      for (let i = 0; i < len; i++) {
        grid[r][c + i].letter = w.word[i];
        grid[r][c + i].isBlock = false;
      }
    } else {
      if (c < 0 || c >= size || r < 0 || r + len > size) return false;
      for (let i = 0; i < len; i++) {
        const cell = grid[r + i][c];
        if (!cell.isBlock && cell.letter !== w.word[i]) return false;
      }
      for (let i = 0; i < len; i++) {
        grid[r + i][c].letter = w.word[i];
        grid[r + i][c].isBlock = false;
      }
    }
    const num = clueNum++;
    grid[r][c].number = num;
    placedWords.push({ ...w, row: r, col: c, direction: dir, num });
    if (dir === 'across') {
      cluesAcross.push({ num, clueAr: w.clueAr, word: w.word, direction: 'across', r, c });
    } else {
      cluesDown.push({ num, clueAr: w.clueAr, word: w.word, direction: 'down', r, c });
    }
    return true;
  };

  // 1. Place first word horizontally
  const w0 = eligible[0];
  const startCol0 = Math.max(0, Math.floor((size - w0.word.length) / 2));
  tryPlace(w0, 1, startCol0, 'across');

  // Try placing subsequent words with intersections
  for (let idx = 1; idx < eligible.length; idx++) {
    const current = eligible[idx];
    let placed = false;

    // Try intersecting with an already placed word
    for (const prev of placedWords) {
      if (placed) break;
      const targetDir: 'across' | 'down' = prev.direction === 'across' ? 'down' : 'across';

      for (let i = 0; i < prev.word.length; i++) {
        if (placed) break;
        const prevChar = prev.word[i];

        for (let j = 0; j < current.word.length; j++) {
          if (current.word[j] === prevChar) {
            const r = prev.direction === 'across' ? prev.row - j : prev.row + i;
            const c = prev.direction === 'across' ? prev.col + i : prev.col - j;
            if (tryPlace(current, r, c, targetDir)) {
              placed = true;
              break;
            }
          }
        }
      }
    }

    // If no intersection was found, place in a parallel row/column with space
    if (!placed) {
      const dir: 'across' | 'down' = idx % 2 === 0 ? 'across' : 'down';
      for (let r = 0; r < size && !placed; r += 2) {
        for (let c = 0; c < size && !placed; c++) {
          if (tryPlace(current, r, c, dir)) {
            placed = true;
          }
        }
      }
    }
  }

  return { size, grid, cluesAcross, cluesDown };
}

export function getNextCrosswordCell(
  current: { r: number; c: number },
  direction: 'across' | 'down',
  grid: { isBlock: boolean }[][],
  size: number
): { r: number; c: number; nextDir: 'across' | 'down' } | null {
  if (direction === 'across') {
    // Continue horizontally in the current word
    if (current.c + 1 < size && !grid[current.r][current.c + 1].isBlock) {
      return { r: current.r, c: current.c + 1, nextDir: 'across' };
    }
    // Reached end of current across word, search forward for next playable cell
    for (let r = current.r; r < size; r++) {
      const startC = r === current.r ? current.c + 1 : 0;
      for (let c = startC; c < size; c++) {
        if (!grid[r][c].isBlock) {
          return { r, c, nextDir: 'across' };
        }
      }
    }
  } else {
    // Continue vertically in the current word
    if (current.r + 1 < size && !grid[current.r + 1][current.c].isBlock) {
      return { r: current.r + 1, c: current.c, nextDir: 'down' };
    }
    // Reached end of current down word, search forward for next playable cell
    for (let c = current.c; c < size; c++) {
      const startR = c === current.c ? current.r + 1 : 0;
      for (let r = startR; r < size; r++) {
        if (!grid[r][c].isBlock) {
          return { r, c, nextDir: 'down' };
        }
      }
    }
  }
  return null;
}

export function getPrevCrosswordCell(
  current: { r: number; c: number },
  direction: 'across' | 'down',
  grid: { isBlock: boolean }[][],
  size: number
): { r: number; c: number } | null {
  if (direction === 'across') {
    if (current.c - 1 >= 0 && !grid[current.r][current.c - 1].isBlock) {
      return { r: current.r, c: current.c - 1 };
    }
  } else {
    if (current.r - 1 >= 0 && !grid[current.r - 1][current.c].isBlock) {
      return { r: current.r - 1, c: current.c };
    }
  }
  return null;
}

