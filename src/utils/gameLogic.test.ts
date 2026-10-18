import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateScrabbleScore,
  getLetterPoint,
  generateWordSearch,
  getLineCells,
  checkPathSelection,
  createAnagramRound,
  generateCrossword,
  getNextCrosswordCell,
  getPrevCrosswordCell,
} from './gameLogic.ts';

test('Crossword auto-advance: moves to next open cell in line or switches direction', () => {
  // 3x3 grid where (0,0) and (0,1) and (1,0) are open, (0,2) is block
  const grid = [
    [{ isBlock: false }, { isBlock: false }, { isBlock: true }],
    [{ isBlock: false }, { isBlock: true }, { isBlock: true }],
    [{ isBlock: true }, { isBlock: true }, { isBlock: true }],
  ];

  // Moving across from (0,0) -> next is (0,1)
  const nextAcross = getNextCrosswordCell({ r: 0, c: 0 }, 'across', grid, 3);
  assert.deepEqual(nextAcross, { r: 0, c: 1, nextDir: 'across' });

  // Moving down from (0,0) -> next is (1,0)
  const nextDown = getNextCrosswordCell({ r: 0, c: 0 }, 'down', grid, 3);
  assert.deepEqual(nextDown, { r: 1, c: 0, nextDir: 'down' });

  // Previous from (0,1) -> (0,0)
  const prev = getPrevCrosswordCell({ r: 0, c: 1 }, 'across', grid, 3);
  assert.deepEqual(prev, { r: 0, c: 0 });
});

test('Scrabble scoring: calculates base score and length bonus correctly', () => {
  const catScore = calculateScrabbleScore('CAT');
  assert.equal(catScore.baseScore, 5);
  assert.equal(catScore.bonus, 0);
  assert.equal(catScore.totalScore, 5);

  const coffeeScore = calculateScrabbleScore('COFFEE');
  assert.equal(coffeeScore.baseScore, 14);
  assert.equal(coffeeScore.bonus, 50);
  assert.equal(coffeeScore.totalScore, 64);

  assert.equal(getLetterPoint('Z'), 10);
  assert.equal(getLetterPoint('Q'), 10);
  assert.equal(getLetterPoint('A'), 1);
});

test('Word Search swipe line: getLineCells calculates all intermediate cells', () => {
  // Horizontal line (0,0) to (0,3) -> 4 cells
  const hCells = getLineCells({ r: 0, c: 0 }, { r: 0, c: 3 });
  assert.equal(hCells.length, 4);
  assert.deepEqual(hCells[0], { r: 0, c: 0 });
  assert.deepEqual(hCells[3], { r: 0, c: 3 });

  // Diagonal line (1,1) to (3,3) -> 3 cells
  const dCells = getLineCells({ r: 1, c: 1 }, { r: 3, c: 3 });
  assert.equal(dCells.length, 3);
  assert.deepEqual(dCells[1], { r: 2, c: 2 });
});

test('Word Search: creates a 7x7 grid and checks path selection', () => {
  const words = [
    { word: 'BOOK', clueAr: 'كتاب' },
    { word: 'TRAVEL', clueAr: 'سفر' },
    { word: 'COFFEE', clueAr: 'قهوة' },
    { word: 'HEALTH', clueAr: 'صحة' },
  ];

  const result = generateWordSearch(words, 7);
  assert.equal(result.grid.length, 7);
  assert.equal(result.grid[0].length, 7);
  assert.ok(result.words.length > 0, 'Should place at least one word');

  if (result.words.length > 0) {
    const firstPlaced = result.words[0];
    const path = getLineCells(
      { r: firstPlaced.startR, c: firstPlaced.startC },
      { r: firstPlaced.endR, c: firstPlaced.endC }
    );
    const match = checkPathSelection(path, result.grid, result.words);
    assert.ok(match !== null, 'Path selection should match word');
    assert.equal(match?.word, firstPlaced.word);
  }
});

test('Anagram: masks definition and prepares scrambled slots correctly', () => {
  const round = createAnagramRound('RESILIENCE', 'The ability to recover quickly resilience');
  assert.equal(round.word, 'RESILIENCE');
  assert.equal(round.slots.length, 10);
  assert.equal(round.scrambledLetters.length, 10);
  assert.ok(round.definition.includes('______'), 'Definition should mask target word');
  assert.equal(round.spellingDisplay, 'R - E - S - I - L - I - E - N - C - E');
});

test('Crossword: generates a compact board with clues and cells', () => {
  const words = [
    { word: 'STAR', clueAr: 'نجم' },
    { word: 'TREE', clueAr: 'شجرة' },
    { word: 'RAIN', clueAr: 'مطر' },
    { word: 'SUN', clueAr: 'شمس' },
  ];

  const board = generateCrossword(words);
  assert.equal(board.size, 8);
  assert.equal(board.grid.length, 8);
  assert.ok(board.cluesAcross.length > 0 || board.cluesDown.length > 0);
});
