
'use server'

import { adaptPuzzle, type AdaptPuzzleInput } from '@/ai/flows/puzzle-adaptation';
import type { Tile } from '@/types';
import { getHintCount, incrementHintCount } from '@/services/hintService';

const HINT_LIMIT = 25;

function formatPuzzleState(tiles: Tile[], gridSize: number): string {
    const grid: (number | string)[][] = Array(gridSize).fill(0).map(() => Array(gridSize).fill('.'));
    tiles.forEach(tile => {
        if (tile.row < gridSize && tile.col < gridSize) {
            grid[tile.row][tile.col] = tile.value;
        }
    });
    return grid.map(row => row.join('\t')).join('\n');
}

export async function getAdaptedPuzzle(tiles: Tile[], gridSize: number, score: number) {
  const currentHintCount = await getHintCount();

  if (currentHintCount >= HINT_LIMIT) {
    return { 
      success: false, 
      error: `The daily global AI hint limit of ${HINT_LIMIT} has been reached.`,
      hintsLeft: 0,
    };
  }

  const highestTile = Math.max(0, ...tiles.map(t => t.value));
  const playerSkillLevel = Math.max(1, Math.floor(Math.log2(highestTile)));

  const input: AdaptPuzzleInput = {
    playerSkillLevel,
    currentPuzzleState: formatPuzzleState(tiles, gridSize),
    gameMode: `Classic ${gridSize}x${gridSize}`,
  };

  try {
    const result = await adaptPuzzle(input);
    await incrementHintCount();
    return { success: true, data: result, hintsLeft: HINT_LIMIT - (currentHintCount + 1) };
  } catch (error) {
    console.error('Error adapting puzzle:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { 
      success: false, 
      error: `Failed to get a hint. ${errorMessage}`,
      hintsLeft: HINT_LIMIT - currentHintCount
    };
  }
}

export async function getHintsLeft() {
    const currentHintCount = await getHintCount();
    return HINT_LIMIT - currentHintCount;
}
