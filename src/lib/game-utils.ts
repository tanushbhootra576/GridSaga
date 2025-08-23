


import type { Tile } from '@/types';

type GetIdFn = () => number;

function getRandomEmptyCell(tiles: Tile[], size: number): { row: number; col: number } | null {
  const emptyCells: { row: number; col: number }[] = [];
  const occupied = new Set(tiles.map(t => `${t.row},${t.col}`));

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!occupied.has(`${row},${col}`)) {
        emptyCells.push({ row, col });
      }
    }
  }

  if (emptyCells.length === 0) {
    return null;
  }
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

export function generateInitialTiles(size: number, getId: GetIdFn): Tile[] {
  const tiles: Tile[] = [];
  const pos1 = getRandomEmptyCell(tiles, size)!;
  tiles.push({
    id: getId(),
    value: 2,
    row: pos1.row,
    col: pos1.col,
    isNew: true,
  });

  const pos2 = getRandomEmptyCell(tiles, size)!;
  tiles.push({
    id: getId(),
    value: 2,
    row: pos2.row,
    col: pos2.col,
    isNew: true,
  });

  return tiles;
}

export function addRandomTile(tiles: Tile[], size: number, getId: GetIdFn): Tile[] {
  const emptyCell = getRandomEmptyCell(tiles, size);
  if (!emptyCell) {
    return tiles;
  }

  const newTileValue = Math.random() < 0.9 ? 2 : 4;
  return [
    ...tiles,
    {
      id: getId(),
      value: newTileValue,
      row: emptyCell.row,
      col: emptyCell.col,
      isNew: true,
    },
  ];
}

export function moveTiles(
  direction: 'up' | 'down' | 'left' | 'right',
  tiles: Tile[],
  size: number,
  getId: GetIdFn
) {
  const vector = {
    up: { row: -1, col: 0 },
    down: { row: 1, col: 0 },
    left: { row: 0, col: -1 },
    right: { row: 0, col: 1 },
  }[direction];

  let moved = false;
  let scoreIncrease = 0;
  
  const tileGrid: (Tile | null)[][] = Array(size).fill(null).map(() => Array(size).fill(null));
  tiles.forEach(tile => {
    tileGrid[tile.row][tile.col] = tile;
  });

  const newTiles: Tile[] = [];
  const mergedIds = new Set<number>();

  const traversals = {
    up: { rows: Array.from({ length: size }, (_, i) => i), cols: Array.from({ length: size }, (_, i) => i) },
    down: { rows: Array.from({ length: size }, (_, i) => size - 1 - i), cols: Array.from({ length: size }, (_, i) => i) },
    left: { rows: Array.from({ length: size }, (_, i) => i), cols: Array.from({ length: size }, (_, i) => i) },
    right: { rows: Array.from({ length: size }, (_, i) => i), cols: Array.from({ length: size }, (_, i) => size - 1 - i) },
  };

  const traverse = traversals[direction];

  traverse.rows.forEach(row => {
    traverse.cols.forEach(col => {
      const currentTile = tileGrid[row][col];
      if (!currentTile) return;

      let lastPos = { row, col };
      let nextPos = { row: row + vector.row, col: col + vector.col };
      
      while (
        nextPos.row >= 0 && nextPos.row < size &&
        nextPos.col >= 0 && nextPos.col < size &&
        !tileGrid[nextPos.row][nextPos.col]
      ) {
        lastPos = nextPos;
        nextPos = { row: lastPos.row + vector.row, col: lastPos.col + vector.col };
      }

      if (lastPos.row !== currentTile.row || lastPos.col !== currentTile.col) {
        moved = true;
      }
      
      const newTile: Tile = { ...currentTile, row: lastPos.row, col: lastPos.col };
      tileGrid[currentTile.row][currentTile.col] = null;

      const otherTile = (nextPos.row >= 0 && nextPos.row < size && nextPos.col >= 0 && nextPos.col < size)
        ? tileGrid[nextPos.row][nextPos.col]
        : null;

      if (otherTile && otherTile.value === newTile.value && !mergedIds.has(otherTile.id)) {
        moved = true;
        const mergedValue = newTile.value * 2;
        scoreIncrease += mergedValue;

        const mergedTile: Tile = {
          id: getId(),
          value: mergedValue,
          row: otherTile.row,
          col: otherTile.col,
          isMerged: true,
        };
        mergedIds.add(mergedTile.id);

        tileGrid[otherTile.row][otherTile.col] = mergedTile;
      } else {
        tileGrid[newTile.row][newTile.col] = newTile;
      }
    });
  });

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (tileGrid[r][c]) {
        newTiles.push(tileGrid[r][c]!);
      }
    }
  }

  return { newTiles, moved, scoreIncrease };
}


export function checkGameOver(tiles: Tile[], size: number): boolean {
  if (tiles.length < size * size) {
    return false;
  }

  const tileGrid: (Tile | null)[][] = Array(size).fill(null).map(() => Array(size).fill(null));
  tiles.forEach(tile => {
    tileGrid[tile.row][tile.col] = tile;
  });

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const tile = tileGrid[row][col];
      if (!tile) continue;
      
      // Check right
      if (col < size - 1) {
        const rightTile = tileGrid[row][col + 1];
        if (rightTile && rightTile.value === tile.value) return false;
      }

      // Check down
      if (row < size - 1) {
        const downTile = tileGrid[row + 1][col];
        if (downTile && downTile.value === tile.value) return false;
      }
    }
  }

  return true;
}
